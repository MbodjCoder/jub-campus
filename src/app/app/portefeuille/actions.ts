"use server";

// Actions du portefeuille talent : demande et annulation de retrait.

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { demanderRetrait, annulerRetrait } from "@/domaine/portefeuille";
import { journaliser } from "@/domaine/audit";

const LIBELLES_ERREUR: Record<string, string> = {
  MONTANT_INVALIDE: "Montant invalide.",
  SOUS_LE_MINIMUM: "Le retrait minimum est de 1 000 FCFA.",
  SOLDE_INSUFFISANT: "Solde insuffisant.",
  TELEPHONE_INVALIDE: "Numéro de téléphone mobile sénégalais invalide.",
  PORTEFEUILLE_INTROUVABLE: "Aucun portefeuille trouvé.",
};

const schemaRetrait = z.object({
  montantFcfa: z.coerce.number().int().positive(),
  methode: z.enum(["WAVE", "ORANGE_MONEY"]),
  numeroTelephone: z.string().min(9).max(20),
});

export async function soumettreRetrait(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { succes: false as const, message: "Session expirée." };

  const etudiant = await prisma.etudiant.findUnique({
    where: { utilisateurId: session.user.id },
    select: { id: true },
  });
  if (!etudiant) return { succes: false as const, message: "Profil étudiant introuvable." };

  const parsed = schemaRetrait.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { succes: false as const, message: "Formulaire invalide." };

  const r = await demanderRetrait(
    etudiant.id,
    parsed.data.montantFcfa,
    parsed.data.methode,
    parsed.data.numeroTelephone,
  );
  if (!r.succes) {
    return { succes: false as const, message: LIBELLES_ERREUR[r.raison] ?? "Erreur." };
  }

  await journaliser({
    acteurId: session.user.id,
    action: "RETRAIT_DEMANDE",
    ressourceType: "Retrait",
    ressourceId: r.retraitId,
    metadonnees: { montantFcfa: parsed.data.montantFcfa, methode: parsed.data.methode },
  });

  revalidatePath("/app/portefeuille");
  return { succes: true as const };
}

export async function annulerMonRetrait(retraitId: string) {
  const session = await auth();
  if (!session?.user?.id) return { succes: false as const };

  // Le talent ne peut annuler que ses propres retraits non finalisés.
  const retrait = await prisma.retrait.findUnique({
    where: { id: retraitId },
    select: { statut: true, etudiant: { select: { utilisateurId: true } } },
  });
  if (!retrait || retrait.etudiant.utilisateurId !== session.user.id) {
    return { succes: false as const };
  }
  if (retrait.statut !== "DEMANDE") {
    return { succes: false as const, message: "Ce retrait est déjà en cours de traitement." };
  }

  const ok = await annulerRetrait(retraitId, "Annulé par le talent");
  if (ok) {
    await journaliser({
      acteurId: session.user.id,
      action: "RETRAIT_ANNULE",
      ressourceType: "Retrait",
      ressourceId: retraitId,
    });
    revalidatePath("/app/portefeuille");
  }
  return { succes: ok };
}
