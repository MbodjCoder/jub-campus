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
      entreprise: { select: { raisonSociale: true, utilisateurId: true } },
      mentorPrincipal: { select: { prenom: true, nom: true, titreOuPoste: true, estVerifie: true, utilisateurId: true } },
      competencesRequises: { include: { competence: { select: { nom: true } } } },
      equipe: { include: { membres: { select: { etudiantId: true } } } },
    },
  });
  if (!projet) notFound();

  const session = await auth();
  let candidatureStatut: string | null = null;
  let estEtudiant = false;
  let etudiantId: string | null = null;
  if (session?.user?.id) {
    const etudiant = await prisma.etudiant.findUnique({
      where: { utilisateurId: session.user.id },
      select: { id: true },
    });
    if (etudiant) {
      estEtudiant = true;
      etudiantId = etudiant.id;
      const c = await prisma.candidature.findUnique({
        where: { projetId_etudiantId: { projetId: projet.id, etudiantId: etudiant.id } },
        select: { statut: true },
      });
      candidatureStatut = c?.statut ?? null;
    }
  }

  // Garde-fou de visibilité : un projet privé ou non publié n'est lisible
  // que par son entreprise, son mentor, un membre de l'équipe ou un admin.
  const STATUTS_CACHES = ["BROUILLON", "EN_VALIDATION", "ANNULE", "ARCHIVE"];
  const estPublic =
    projet.visibilite !== "PRIVEE" && !STATUTS_CACHES.includes(projet.statut);
  if (!estPublic) {
    const role = session?.user?.role;
    const estAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
    const estProprietaire =
      (projet.entreprise?.utilisateurId != null && projet.entreprise.utilisateurId === session?.user?.id) ||
      (projet.mentorPrincipal?.utilisateurId != null && projet.mentorPrincipal.utilisateurId === session?.user?.id);
    const estMembre =
      etudiantId != null && (projet.equipe?.membres.some((m) => m.etudiantId === etudiantId) ?? false);
    if (!estAdmin && !estProprietaire && !estMembre) notFound();
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
