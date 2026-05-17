"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { creerNotification } from "@/domaine/notifications";
import { limiterDebit } from "@/lib/rate-limit";

const schemaCandidature = z.object({
  projetId: z.string().cuid(),
  lettre: z.string().min(200, "Lettre trop courte (200 caractères minimum).").max(1500),
});

interface Resultat {
  succes: boolean;
  message?: string;
}

export async function soumettreCandidature(formData: FormData): Promise<Resultat> {
  const session = await auth();
  if (!session?.user?.id) {
    return { succes: false, message: "Connecte-toi pour postuler." };
  }

  // Anti-spam : 15 candidatures / heure par utilisateur.
  const limite = limiterDebit(`candidature:${session.user.id}`, 15, 3_600_000);
  if (!limite.autorise) {
    return { succes: false, message: "Trop de candidatures envoyées. Réessaie plus tard." };
  }

  const parsed = schemaCandidature.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { succes: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  const etudiant = await prisma.etudiant.findUnique({
    where: { utilisateurId: session.user.id },
    select: { id: true, prenom: true, nom: true },
  });
  if (!etudiant) return { succes: false, message: "Seuls les étudiants peuvent postuler." };

  const projet = await prisma.projet.findUnique({
    where: { id: parsed.data.projetId },
    select: {
      id: true, titre: true, slug: true, publieParId: true,
      statut: true, placesMax: true,
      equipe: { select: { membres: { select: { etudiantId: true } } } },
    },
  });
  if (!projet) return { succes: false, message: "Projet introuvable." };

  if (!["PUBLIE", "CANDIDATURES_OUVERTES", "EQUIPE_EN_CONSTITUTION"].includes(projet.statut)) {
    return { succes: false, message: "Les candidatures ne sont pas ouvertes sur ce projet." };
  }

  const placesRestantes = projet.placesMax - (projet.equipe?.membres.length ?? 0);
  if (placesRestantes <= 0) return { succes: false, message: "Plus de place disponible." };

  // Doublon ?
  const existante = await prisma.candidature.findUnique({
    where: { projetId_etudiantId: { projetId: projet.id, etudiantId: etudiant.id } },
    select: { id: true },
  });
  if (existante) return { succes: false, message: "Tu as déjà postulé sur ce projet." };

  await prisma.candidature.create({
    data: {
      projetId: projet.id,
      etudiantId: etudiant.id,
      lettre: parsed.data.lettre,
      statut: "EN_ATTENTE",
    },
  });

  // Notifier le publisher
  await creerNotification({
    destinataireId: projet.publieParId,
    type: "CANDIDATURE_RECUE",
    titre: "Nouvelle candidature reçue",
    contenu: `${etudiant.prenom} ${etudiant.nom} a postulé sur « ${projet.titre} ».`,
    lien: "/entreprise/candidatures",
  });

  await prisma.journalAudit.create({
    data: {
      acteurId: session.user.id,
      action: "CANDIDATURE.SOUMISE",
      ressourceType: "Candidature",
      ressourceId: projet.id,
      metadonnees: { projetSlug: projet.slug },
    },
  });

  revalidatePath(`/projets/${projet.slug}`);
  revalidatePath("/app/mes-projets");
  revalidatePath("/entreprise/candidatures");

  return { succes: true };
}
