// Domaine notifications : helper de création + utilitaires.
// Importable depuis les server actions métier pour notifier les
// utilisateurs des événements clés.

import "server-only";
import { prisma } from "@/lib/prisma";
import type { TypeNotification } from "@/generated/prisma/client";

export interface ParametresNotification {
  destinataireId: string;
  type: TypeNotification;
  titre: string;
  contenu: string;
  lien?: string | null;
}

// Crée une notification. Best-effort : capture les erreurs pour ne
// jamais bloquer le flux métier qui l'appelle.
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
    // ignoré : la notification est nice-to-have
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
