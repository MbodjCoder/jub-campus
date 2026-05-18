"use server";

import { headers } from "next/headers";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  creerJeton,
  empreinteJeton,
  identifiantJeton,
} from "@/domaine/jetons";
import { envoyerEmail, emailReset } from "@/lib/email";
import { limiterDebit } from "@/lib/rate-limit";
import { env } from "@/lib/env";

export interface ResultatReset {
  succes: boolean;
  message?: string;
}

const URL_BASE = env.URL_PUBLIQUE ?? "http://localhost:3000";
const schemaDemande = z.object({ email: z.string().email() });

export async function demanderReset(formData: FormData): Promise<ResultatReset> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnu";
  if (!limiterDebit(`reset:${ip}`, 5, 3_600_000).autorise) {
    return { succes: false, message: "Trop de demandes. Réessaie plus tard." };
  }

  const parsed = schemaDemande.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { succes: false, message: "Email invalide." };
  const email = parsed.data.email.toLowerCase().trim();

  const utilisateur = await prisma.utilisateur.findUnique({
    where: { email },
    select: { nomComplet: true, motDePasseHash: true },
  });

  // Réponse uniforme pour éviter l'énumération de comptes.
  if (utilisateur?.motDePasseHash) {
    const jeton = await creerJeton("reset", email);
    const url = `${URL_BASE}/reinitialiser?email=${encodeURIComponent(email)}&jeton=${jeton}`;
    const envoi = await envoyerEmail(
      emailReset({
        destinataire: email,
        prenom: utilisateur.nomComplet?.split(" ")[0] ?? "",
        url,
      }),
    );

    // Aucun jeton actif ne doit subsister si l'email n'est pas réellement parti.
    if (!envoi.succes || envoi.modeLog) {
      await prisma.jetonVerification.deleteMany({
        where: { identifiant: identifiantJeton("reset", email) },
      });
    }
  }

  return { succes: true };
}

const schemaReset = z.object({
  email: z.string().email(),
  jeton: z.string().min(10),
  motDePasse: z.string().min(8, "Mot de passe : 8 caractères minimum."),
  motDePasseConfirme: z.string().min(8, "Confirme le mot de passe."),
}).refine((d) => d.motDePasse === d.motDePasseConfirme, {
  path: ["motDePasseConfirme"],
  message: "Les deux mots de passe ne correspondent pas.",
});

export async function reinitialiserMotDePasse(formData: FormData): Promise<ResultatReset> {
  const parsed = schemaReset.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { succes: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  const email = parsed.data.email.toLowerCase().trim();
  const empreinte = empreinteJeton(parsed.data.jeton);
  const hash = await bcryptjs.hash(parsed.data.motDePasse, 12);

  const resultat = await prisma.$transaction(async (tx) => {
    const entree = await tx.jetonVerification.findUnique({ where: { jeton: empreinte } });
    if (
      !entree ||
      entree.identifiant !== identifiantJeton("reset", email) ||
      entree.expireLe.getTime() <= Date.now()
    ) {
      if (entree) await tx.jetonVerification.delete({ where: { jeton: empreinte } });
      return "JETON_INVALIDE" as const;
    }

    const utilisateur = await tx.utilisateur.findUnique({
      where: { email },
      select: { id: true },
    });
    if (!utilisateur) return "COMPTE_ABSENT" as const;

    await tx.utilisateur.update({
      where: { id: utilisateur.id },
      data: { motDePasseHash: hash },
    });
    await tx.jetonVerification.delete({ where: { jeton: empreinte } });
    await tx.journalAudit.create({
      data: {
        acteurId: utilisateur.id,
        action: "COMPTE.MOT_DE_PASSE_REINITIALISE",
        ressourceType: "Utilisateur",
        ressourceId: utilisateur.id,
      },
    });
    return "OK" as const;
  });

  if (resultat === "JETON_INVALIDE") {
    return { succes: false, message: "Lien expiré ou invalide. Refais une demande." };
  }
  if (resultat === "COMPTE_ABSENT") {
    return { succes: false, message: "Compte introuvable." };
  }
  return { succes: true };
}
