// Accès aux fichiers privés (livrables, certificats).
// Exige une session, puis redirige vers une URL signée temporaire
// Supabase. Les fichiers ne sont jamais servis directement : le bucket
// privé n'est accessible que par ce point de contrôle.
//
// Les modules de stockage sont importés dynamiquement dans le handler
// pour rester hors du graphe évalué au build.

import { auth } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Dossiers privés autorisés — barrière contre un chemin arbitraire.
const DOSSIERS_AUTORISES = new Set(["livrables", "certificats"]);

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ dossier: string; fichier: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Non authentifié", { status: 401 });
  }

  const { dossier, fichier } = await params;
  if (!DOSSIERS_AUTORISES.has(dossier)) {
    return new Response("Chemin invalide", { status: 400 });
  }
  // Aucun segment ne doit contenir de traversée ni de séparateur.
  if ([dossier, fichier].some((s) => s.includes("..") || s.includes("/") || s.includes("\\"))) {
    return new Response("Chemin invalide", { status: 400 });
  }

  const { SUPABASE_ACTIF } = await import("@/lib/supabase");
  if (!SUPABASE_ACTIF) {
    return new Response("Stockage privé non configuré", { status: 503 });
  }

  try {
    const { urlSigneeFichier } = await import("@/lib/stockage");
    const url = await urlSigneeFichier(`${dossier}/${fichier}`);
    return Response.redirect(url, 307);
  } catch {
    return new Response("Fichier introuvable", { status: 404 });
  }
}
