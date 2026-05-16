// Endpoint d'upload pour les livrables.
// Reçoit un File en multipart/form-data, le stocke et renvoie l'URL
// d'accès + métadonnées.

import { auth } from "@/auth";
import { stockerFichier } from "@/lib/stockage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TAILLE_MAX_OCTETS = 25 * 1024 * 1024; // 25 Mo

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const formData = await req.formData();
  const fichier = formData.get("fichier");
  if (!(fichier instanceof File)) {
    return Response.json({ erreur: "Fichier manquant" }, { status: 400 });
  }
  if (fichier.size === 0) {
    return Response.json({ erreur: "Fichier vide" }, { status: 400 });
  }
  if (fichier.size > TAILLE_MAX_OCTETS) {
    return Response.json(
      { erreur: `Fichier trop volumineux (max 25 Mo).` },
      { status: 413 },
    );
  }

  try {
    const r = await stockerFichier(fichier, "livrables");
    return Response.json({
      succes: true,
      url: r.url,
      typeMime: r.typeMime,
      tailleOctets: r.tailleOctets,
      nomOriginal: fichier.name,
    });
  } catch (e) {
    return Response.json(
      { erreur: (e as Error).message ?? "Erreur de stockage" },
      { status: 400 },
    );
  }
}
