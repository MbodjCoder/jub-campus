// Détail d'un job — données réelles + composant maquette client.

import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { imageProjet } from "@/lib/medias";
import { chargerEtudiantMatching, scoreMatch } from "@/lib/matching-courant";
import { DetailJob } from "@/composants/maquette/detail-job";
import {
  chargerContexteAccesProjet,
  projetEstVisiblePourUniversite,
  projetEstVisiblePubliquement,
  utilisateurPeutAccederProjet,
} from "@/domaine/acces-projet";

export const dynamic = "force-dynamic";

export default async function PageDetailJob({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const projet = await prisma.projet.findUnique({
    where: { slug },
    include: {
      entreprise: { select: { raisonSociale: true, utilisateurId: true } },
      mentorPrincipal: {
        select: {
          prenom: true,
          nom: true,
          titreOuPoste: true,
          estVerifie: true,
          utilisateurId: true,
        },
      },
      competencesRequises: { include: { competence: { select: { nom: true } } } },
      equipe: { include: { membres: { select: { etudiantId: true } } } },
      partenaires: {
        select: {
          entreprise: { select: { raisonSociale: true } },
          typeContribution: true,
        },
      },
    },
  });
  if (!projet) notFound();

  const session = await auth();
  const contexte = session?.user?.id
    ? await chargerContexteAccesProjet(session.user.id)
    : null;

  let candidatureStatut: string | null = null;
  if (contexte?.etudiantId) {
    const candidature = await prisma.candidature.findUnique({
      where: {
        projetId_etudiantId: {
          projetId: projet.id,
          etudiantId: contexte.etudiantId,
        },
      },
      select: { statut: true },
    });
    candidatureStatut = candidature?.statut ?? null;
  }

  const visiblePubliquement = projetEstVisiblePubliquement(projet.visibilite, projet.statut);
  const visiblePourUniversite = projetEstVisiblePourUniversite(
    projet.visibilite,
    projet.statut,
    projet.universiteId,
    contexte?.universiteId ?? null,
  );
  if (!visiblePubliquement && !visiblePourUniversite) {
    if (!contexte || !utilisateurPeutAccederProjet(projet, contexte)) notFound();
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
        partenaires: projet.partenaires.map((p) => ({
          entreprise: p.entreprise.raisonSociale,
          typeContribution: p.typeContribution,
        })),
      }}
      candidatureStatut={candidatureStatut}
      estEtudiant={Boolean(contexte?.etudiantId)}
      estConnecte={Boolean(session?.user?.id)}
      role={contexte?.role ?? null}
      estEntrepriseProprietaire={Boolean(
        contexte?.entrepriseId && contexte.entrepriseId === projet.entrepriseId,
      )}
    />
  );
}
