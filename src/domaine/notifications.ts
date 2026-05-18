// Domaine notifications : helper de création + utilitaires.
// Importable depuis les server actions métier pour notifier les
// utilisateurs des événements clés.

import "server-only";
import { prisma } from "@/lib/prisma";
import { envoyerEmail, emailNotification } from "@/lib/email";
import { env } from "@/lib/env";
import type { TypeNotification } from "@/generated/prisma/client";

const URL_BASE = env.URL_PUBLIQUE ?? "http://localhost:3000";

export interface ParametresNotification {
  destinataireId: string;
  type: TypeNotification;
  titre: string;
  contenu: string;
  lien?: string | null;
}

// Crée une notification in-app + double par email (best-effort).
// Ne bloque ni ne lève jamais : la notification reste nice-to-have.
export async function creerNotification(p: ParametresNotification): Promise<void> {
  try {
    await prisma.notification.create({
      data: {
        destinataireId: p.destinataireId,
        type: p.type,
        titre: p.titre,
        contenu: p.contenu,
        lien: p.lien ?? null,
      },
    });
  } catch {
    return; // si l'insert échoue, on n'envoie pas non plus l'email
  }

  // Email best-effort — n'interrompt jamais le flux métier appelant.
  try {
    const u = await prisma.utilisateur.findUnique({
      where: { id: p.destinataireId },
      select: { email: true, nomComplet: true },
    });
    if (u?.email) {
      await envoyerEmail(
        emailNotification({
          destinataire: u.email,
          prenom: u.nomComplet?.split(" ")[0] ?? "",
          titre: p.titre,
          contenu: p.contenu,
          url: p.lien ? `${URL_BASE}${p.lien}` : URL_BASE,
        }),
      );
    }
  } catch {
    // email best-effort
  }
}

// Compte les notifications non lues d'un utilisateur.
export async function compterNonLues(utilisateurId: string): Promise<number> {
  return prisma.notification.count({
    where: { destinataireId: utilisateurId, lue: false },
  });
}

// Récupère les n notifications les plus récentes (lues et non lues).
export async function obtenirRecentes(utilisateurId: string, n = 10) {
  return prisma.notification.findMany({
    where: { destinataireId: utilisateurId },
    orderBy: { creeLe: "desc" },
    take: n,
  });
}
