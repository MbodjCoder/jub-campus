// Jetons à usage unique : vérification d'email + réinitialisation de mot
// de passe. S'appuie sur le modèle Prisma JetonVerification.

import "server-only";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";

// Préfixes d'identifiant pour distinguer les usages.
const PREFIXE = {
  email: "verif-email:",
  reset: "reset-mdp:",
} as const;

type Usage = keyof typeof PREFIXE;

// Durées de validité.
const DUREE_MS: Record<Usage, number> = {
  email: 24 * 3600_000, // 24 h
  reset: 1 * 3600_000, //  1 h
};

function identifiant(usage: Usage, email: string): string {
  return PREFIXE[usage] + email.toLowerCase();
}

// Crée un jeton (révoque les précédents du même usage pour cet email).
export async function creerJeton(usage: Usage, email: string): Promise<string> {
  const id = identifiant(usage, email);
  const jeton = randomBytes(32).toString("hex");
  await prisma.jetonVerification.deleteMany({ where: { identifiant: id } });
  await prisma.jetonVerification.create({
    data: { identifiant: id, jeton, expireLe: new Date(Date.now() + DUREE_MS[usage]) },
  });
  return jeton;
}

// Valide un jeton et le consomme (usage unique). Retourne l'email si OK.
export async function consommerJeton(usage: Usage, email: string, jeton: string): Promise<boolean> {
  const id = identifiant(usage, email);
  const entree = await prisma.jetonVerification.findUnique({ where: { jeton } });
  if (!entree || entree.identifiant !== id) return false;
  // Consommation systématique, même si expiré (nettoyage).
  await prisma.jetonVerification.delete({ where: { jeton } }).catch(() => undefined);
  return entree.expireLe.getTime() > Date.now();
}
