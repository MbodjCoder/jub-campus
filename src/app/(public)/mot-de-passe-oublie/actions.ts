"use server";

import { headers } from "next/headers";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { creerJeton, consommerJeton } from "@/domaine/jetons";
import { envoyerEmail, emailReset } from "@/lib/email";
import { limiterDebit } from "@/lib/rate-limit";

export interface ResultatReset {
  succes: boolean;
  message?: string;
}

const URL_BASE = process.env.URL_PUBLIQUE ?? "http://localhost:3000";

// ── Demande de réinitialisation ──────────────────────────────────
const schemaDemande = z.object({ email: z.string().email() });

export async function demanderReset(formData: FormData): Promise<ResultatReset> {
  // Anti-abus : 5 demandes / heure par IP.
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnu";
  if (!limiterDebit(`reset:${ip}`, 5, 3_600_000).autorise) {
    return { succes: false, message: "Trop de demandes. Réessaie plus tard." };
  }

  const parsed = schemaDemande.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { succes: false, message: "Email invalide." };
  const email = parsed.data.email.toLowerCase().trim();

  const u = await prisma.utilisateur.findUnique({
    where: { email },
    select: { nomComplet: true, motDePasseHash: true },
  });

  // Envoi uniquement si le compte existe ET utilise un mot de passe.
  // Réponse identique dans tous les cas (pas d'énumération de comptes).
  if (u?.motDePasseHash) {
    const jeton = await creerJeton("reset", email);
    const url = `${URL_BASE}/reinitialiser?email=${encodeURIComponent(email)}&jeton=${jeton}`;
    await envoyerEmail(
      emailReset({ destinataire: email, prenom: u.nomComplet?.split(" ")[0] ?? "", url }),
    );
  }
  return { succes: true };
}

// ── Réinitialisation effective ───────────────────────────────────
const schemaReset = z.object({
  email: z.string().email(),
  jeton: z.string().min(10),
  motDePasse: z.string().min(8, "Mot de passe : 8 caractères minimum."),
});

export async function reinitialiserMotDePasse(formData: FormData): Promise<ResultatReset> {
  const parsed = schemaReset.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { succes: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }
  const { email, jeton, motDePasse } = parsed.data;

  const valide = await consommerJeton("reset", email.toLowerCase().trim(), jeton);
  if (!valide) {
    return { succes: false, message: "Lien expiré ou invalide. Refais une demande." };
  }

  const hash = await bcryptjs.hash(motDePasse, 12);
  const r = await prisma.utilisateur.updateMany({
    where: { email: email.toLowerCase().trim() },
    data: { motDePasseHash: hash },
  });
  if (r.count === 0) return { succes: false, message: "Compte introuvable." };

  return { succes: true };
}
