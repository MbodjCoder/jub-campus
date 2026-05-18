// Upload de la photo de profil étudiant.
// Reçoit une image en multipart/form-data, la stocke et met à jour
// etudiant.avatarUrl.

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stockerFichier } from "@/lib/stockage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TAILLE_MAX_OCTETS = 5 * 1024 * 1024; // 5 Mo
const TYPES_IMAGE = new Set(["image/png", "image/jpeg", "image/webp"]);

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const formData = await req.formData();
  const fichier = formData.get("fichier");
  if (!(fichier instanceof File)) {
    return Response.json({ erreur: "Image manquante" }, { status: 400 });
  }
  if (fichier.size === 0) {
    return Response.json({ erreur: "Image vide" }, { status: 400 });
  }
  if (fichier.size > TAILLE_MAX_OCTETS) {
    return Response.json({ erreur: "Image trop volumineuse (max 5 Mo)." }, { status: 413 });
  }
  if (!TYPES_IMAGE.has(fichier.type)) {
    return Response.json({ erreur: "Format non autorisé (PNG, JPG, WEBP)." }, { status: 400 });
  }

  try {
    const r = await stockerFichier(fichier, "avatars");
    // Photo commune à tous les rôles : Utilisateur.imageUrl.
    await prisma.utilisateur.update({
      where: { id: session.user.id },
      data: { imageUrl: r.url },
    });
    // Synchronise l'avatar dédié de l'étudiant s'il en a un
    // (updateMany ne lève pas si l'utilisateur n'est pas étudiant).
    await prisma.etudiant.updateMany({
      where: { utilisateurId: session.user.id },
      data: { avatarUrl: r.url },
    });
    return Response.json({ succes: true, url: r.url });
  } catch (e) {
    return Response.json(
      { erreur: (e as Error).message ?? "Erreur de stockage" },
      { status: 400 },
    );
  }
}
