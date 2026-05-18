// Accès aux fichiers privés (livrables, certificats).
// La session seule ne suffit pas : chaque fichier est rattaché à une
// ressource métier dont on vérifie l'autorisation avant de signer l'URL.

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  chargerContexteAccesProjet,
  estAdmin,
  utilisateurPeutAccederProjet,
} from "@/domaine/acces-projet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  if ([dossier, fichier].some((s) => s.includes("..") || s.includes("/") || s.includes("\\"))) {
    return new Response("Chemin invalide", { status: 400 });
  }

  const { SUPABASE_ACTIF } = await import("@/lib/supabase");
  if (!SUPABASE_ACTIF) {
    return new Response("Stockage privé non configuré", { status: 503 });
  }

  const cheminApi = `/api/fichiers/${dossier}/${fichier}`;
  const contexte = await chargerContexteAccesProjet(session.user.id);
  if (!contexte) return new Response("Accès refusé", { status: 403 });

  if (dossier === "livrables") {
    const livrable = await prisma.livrable.findFirst({
      where: { fichierUrl: cheminApi },
      select: {
        projet: {
          select: {
            publieParId: true,
            entrepriseId: true,
            mentorPrincipalId: true,
            equipe: { select: { membres: { select: { etudiantId: true } } } },
          },
        },
      },
    });
    if (!livrable || !utilisateurPeutAccederProjet(livrable.projet, contexte)) {
      return new Response("Accès refusé", { status: 403 });
    }
  }

  if (dossier === "certificats") {
    const certificat = await prisma.certificat.findFirst({
      where: { pdfUrl: cheminApi },
      select: {
        etudiant: { select: { utilisateurId: true } },
      },
    });
    if (
      !certificat ||
      (!estAdmin(contexte.role) && certificat.etudiant.utilisateurId !== session.user.id)
    ) {
      return new Response("Accès refusé", { status: 403 });
    }
  }

  try {
    const { urlSigneeFichier } = await import("@/lib/stockage");
    const url = await urlSigneeFichier(`${dossier}/${fichier}`);
    return Response.redirect(url, 307);
  } catch {
    return new Response("Fichier introuvable", { status: 404 });
  }
}
