// Jetons à usage unique : vérification d'email + réinitialisation de mot
// de passe. Les jetons sont hashés au repos : la base ne contient jamais
// la valeur brute transmise à l'utilisateur.

import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

const PREFIXE = {
  email: "verif-email:",
  reset: "reset-mdp:",
} as const;

type Usage = keyof typeof PREFIXE;

const DUREE_MS: Record<Usage, number> = {
  email: 24 * 3600_000,
  reset: 1 * 3600_000,
};

function identifiant(usage: Usage, email: string): string {
  return PREFIXE[usage] + email.toLowerCase();
}

function empreinte(jeton: string): string {
  return createHash("sha256")
    .update(`${jeton}:${env.AUTH_SECRET}`)
    .digest("hex");
}

export function identifiantJeton(usage: Usage, email: string): string {
  return identifiant(usage, email);
}

export function empreinteJeton(jeton: string): string {
  return empreinte(jeton);
}

export async function creerJeton(usage: Usage, email: string): Promise<string> {
  const id = identifiant(usage, email);
  const jetonBrut = randomBytes(32).toString("hex");
  await prisma.jetonVerification.deleteMany({ where: { identifiant: id } });
  await prisma.jetonVerification.create({
    data: {
      identifiant: id,
      jeton: empreinte(jetonBrut),
      expireLe: new Date(Date.now() + DUREE_MS[usage]),
    },
  });
  return jetonBrut;
}

export async function consommerJeton(
  usage: Usage,
  email: string,
  jetonBrut: string,
): Promise<boolean> {
  const id = identifiant(usage, email);
  const jeton = empreinte(jetonBrut);
  const entree = await prisma.jetonVerification.findUnique({ where: { jeton } });
  if (!entree || entree.identifiant !== id) return false;
  await prisma.jetonVerification.delete({ where: { jeton } }).catch(() => undefined);
  return entree.expireLe.getTime() > Date.now();
}
