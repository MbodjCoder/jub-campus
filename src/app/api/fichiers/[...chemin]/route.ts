// Accès aux fichiers privés (livrables, certificats).
// Exige une session, puis redirige vers une URL signée temporaire
// Supabase. Les fichiers ne sont jamais servis directement : le bucket
// privé n'est accessible que par ce point de contrôle.

import { auth } from "@/auth";
import { SUPABASE_ACTIF } from "@/lib/supabase";
import { urlSigneeFichier } from "@/lib/stockage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Dossiers privés autorisés — barrière contre un chemin arbitraire.
const DOSSIERS_AUTORISES = new Set(["livrables", "certificats"]);

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ chemin: string[] }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Non authentifié", { status: 401 });
  }

  const { chemin } = await params;
  // Attendu : ["{dossier}", "{nom}"] — exactement deux segments.
  if (chemin.length !== 2 || !DOSSIERS_AUTORISES.has(chemin[0])) {
    return new Response("Chemin invalide", { status: 400 });
  }
  // Aucun segment ne doit contenir de traversée ni de séparateur.
  if (chemin.some((s) => s.includes("..") || s.includes("/") || s.includes("\\"))) {
    return new Response("Chemin invalide", { status: 400 });
  }

  if (!SUPABASE_ACTIF) {
    return new Response("Stockage privé non configuré", { status: 503 });
  }

  try {
    const url = await urlSigneeFichier(chemin.join("/"));
    return Response.redirect(url, 307);
  } catch {
    return new Response("Fichier introuvable", { status: 404 });
  }
}
