// Mon portfolio — données réelles + composant maquette client.

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MonPortfolio } from "@/composants/maquette/portfolio";

export const metadata = { title: "Mon portfolio" };
export const dynamic = "force-dynamic";

export default async function PageMonPortfolio() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const etudiant = await prisma.etudiant.findUnique({
    where: { utilisateurId: session.user.id },
    select: {
      prenom: true, nom: true, slug: true, scoreJub: true, avatarUrl: true,
      universite: { select: { nom: true } },
      competences: {
        orderBy: { niveau: "desc" },
        take: 6,
        select: { niveau: true, niveauValide: true, competence: { select: { nom: true } } },
      },
      certificats: {
        orderBy: { emisLe: "desc" },
        select: {
          numeroPublic: true, scoreFinal: true, organisationNom: true,
          projet: { select: { titre: true } },
        },
      },
    },
  });

  if (!etudiant) {
    return (
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px" }}>
        <div className="carte" style={{ padding: 32, textAlign: "center" }}>Profil étudiant introuvable.</div>
      </main>
    );
  }

  const note =
    etudiant.certificats.length > 0
      ? (etudiant.certificats.reduce((s, c) => s + c.scoreFinal, 0) / etudiant.certificats.length)
          .toFixed(1)
          .replace(".", ",")
      : "—";

  return (
    <MonPortfolio
      data={{
        prenom: etudiant.prenom,
        nom: etudiant.nom,
        slug: etudiant.slug,
        scoreJub: etudiant.scoreJub,
        avatarUrl: etudiant.avatarUrl,
        universite: etudiant.universite.nom,
        note,
        competences: etudiant.competences.map((c) => ({
          nom: c.competence.nom,
          niveau: c.niveau,
          valide: c.niveauValide != null && c.niveauValide > 0,
        })),
        jobs: etudiant.certificats.map((c) => ({
          numeroPublic: c.numeroPublic,
          titre: c.projet.titre,
          organisation: c.organisationNom ?? "JUB Campus",
          score: c.scoreFinal,
        })),
      }}
    />
  );
}
