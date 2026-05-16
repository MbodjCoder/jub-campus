// Détail d'un job — données réelles + composant maquette client.

import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { imageProjet } from "@/lib/medias";
import { chargerEtudiantMatching, scoreMatch } from "@/lib/matching-courant";
import { DetailJob } from "@/composants/maquette/detail-job";

export const dynamic = "force-dynamic";

export default async function PageDetailJob({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const projet = await prisma.projet.findUnique({
    where: { slug },
    include: {
      entreprise: { select: { raisonSociale: true } },
      mentorPrincipal: { select: { prenom: true, nom: true, titreOuPoste: true, estVerifie: true } },
      competencesRequises: { include: { competence: { select: { nom: true } } } },
      equipe: { include: { membres: { select: { etudiantId: true } } } },
    },
  });
  if (!projet) notFound();

  const session = await auth();
  let candidatureStatut: string | null = null;
  let estEtudiant = false;
  if (session?.user?.id) {
    const etudiant = await prisma.etudiant.findUnique({
      where: { utilisateurId: session.user.id },
      select: { id: true },
    });
    if (etudiant) {
      estEtudiant = true;
      const c = await prisma.candidature.findUnique({
        where: { projetId_etudiantId: { projetId: projet.id, etudiantId: etudiant.id } },
        select: { statut: true },
      });
      candidatureStatut = c?.statut ?? null;
    }
  }

  const etudiantMatch = await chargerEtudiantMatching(session?.user?.id);
  const matchScore = scoreMatch(etudiantMatch, {
    niveau: projet.niveau,
    categorie: projet.categorie,
    competencesRequises: projet.competencesRequises,
  });

  return (
    <DetailJob
      projet={{
        id: projet.id,
        slug: projet.slug,
        titre: projet.titre,
        resume: projet.resume,
        description: projet.description,
        image: imageProjet(projet),
        organisation: projet.entreprise?.raisonSociale ?? "JUB Campus",
        modeRemuneration: projet.modeRemuneration,
        montant: projet.montantFcfa,
        duree: projet.dureeJours,
        placesPrises: projet.equipe?.membres.length ?? 0,
        placesMax: projet.placesMax,
        matchScore,
        competences: projet.competencesRequises.map((c) => c.competence.nom),
        mentor: projet.mentorPrincipal
          ? {
              nom: `${projet.mentorPrincipal.prenom} ${projet.mentorPrincipal.nom}`,
              titre: projet.mentorPrincipal.titreOuPoste,
              verifie: projet.mentorPrincipal.estVerifie,
            }
          : null,
      }}
      candidatureStatut={candidatureStatut}
      estEtudiant={estEtudiant}
      estConnecte={Boolean(session?.user?.id)}
    />
  );
}
