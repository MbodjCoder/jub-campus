// Route de génération du portfolio étudiant en PDF.
// Runtime Node obligatoire (@react-pdf/renderer).

import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { LIBELLES_NIVEAU_ETUDE } from "@/lib/constantes";
import { DocumentPortfolio } from "@/composants/portfolio/document-pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Non authentifié", { status: 401 });
  }

  const etudiant = await prisma.etudiant.findUnique({
    where: { utilisateurId: session.user.id },
    select: {
      prenom: true, nom: true, niveau: true, scoreJub: true,
      universite: { select: { nom: true } },
      competences: {
        orderBy: { niveau: "desc" },
        select: { niveau: true, niveauValide: true, competence: { select: { nom: true } } },
      },
      certificats: {
        orderBy: { emisLe: "desc" },
        select: { scoreFinal: true, organisationNom: true, projet: { select: { titre: true } } },
      },
    },
  });

  if (!etudiant) {
    return new Response("Profil étudiant introuvable", { status: 404 });
  }

  const note =
    etudiant.certificats.length > 0
      ? (etudiant.certificats.reduce((s, c) => s + c.scoreFinal, 0) / etudiant.certificats.length)
          .toFixed(1)
          .replace(".", ",")
      : "—";

  const buffer = await renderToBuffer(
    <DocumentPortfolio
      d={{
        prenom: etudiant.prenom,
        nom: etudiant.nom,
        universite: etudiant.universite.nom,
        niveau: LIBELLES_NIVEAU_ETUDE[etudiant.niveau],
        scoreJub: etudiant.scoreJub,
        note,
        competences: etudiant.competences.map((c) => ({
          nom: c.competence.nom,
          niveau: c.niveau,
          valide: c.niveauValide != null && c.niveauValide > 0,
        })),
        jobs: etudiant.certificats.map((c) => ({
          titre: c.projet.titre,
          organisation: c.organisationNom ?? "JUB Campus",
          score: c.scoreFinal,
        })),
        emisLe: new Date(),
      }}
    />,
  );

  const nomFichier = `portfolio-${etudiant.prenom}-${etudiant.nom}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  return new Response(new Uint8Array(buffer), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${nomFichier}.pdf"`,
      "cache-control": "private, no-store",
    },
  });
}
