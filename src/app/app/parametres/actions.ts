"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";

export interface ResultatParametre {
  succes: boolean;
  message?: string;
}

// Active/désactive la visibilité publique du portfolio.
export async function definirVisibilitePortfolio(estPublic: boolean): Promise<ResultatParametre> {
  const session = await auth();
  if (!session?.user?.id) return { succes: false, message: "Non authentifié." };

  const r = await prisma.etudiant.updateMany({
    where: { utilisateurId: session.user.id },
    data: { estPublic },
  });
  if (r.count === 0) return { succes: false, message: "Profil étudiant introuvable." };

  revalidatePath("/app/parametres");
  revalidatePath("/app/profil");
  return { succes: true };
}

// Supprime définitivement le compte de l'utilisateur connecté.
// Les profils/relations sont supprimés en cascade (onDelete: Cascade).
export async function supprimerMonCompte(): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  // Audit sans acteurId (l'utilisateur va être supprimé) — l'entrée survit.
  await prisma.journalAudit.create({
    data: {
      action: "COMPTE.SUPPRIME",
      ressourceType: "Utilisateur",
      ressourceId: session.user.id,
      metadonnees: { email: session.user.email ?? null },
    },
  });
  await prisma.utilisateur.delete({ where: { id: session.user.id } });

  await signOut({ redirect: false });
  redirect("/");
}
