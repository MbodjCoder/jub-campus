// Image de profil — lue en base (source de vérité).
//
// On NE lit PAS l'image depuis le JWT de session : le jeton ne se
// rafraîchit pas après un changement de photo, la barre du haut
// resterait sur l'ancienne image. La base, elle, est à jour
// immédiatement et router.refresh() propage la nouvelle photo partout.

import { prisma } from "@/lib/prisma";

export async function imageProfil(utilisateurId: string): Promise<string | null> {
  const u = await prisma.utilisateur.findUnique({
    where: { id: utilisateurId },
    select: { imageUrl: true },
  });
  return u?.imageUrl ?? null;
}
