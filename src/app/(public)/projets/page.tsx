// Catalogue jobs — données réelles + composant maquette client.

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { LIBELLES_CATEGORIE } from "@/lib/constantes";
import { imageProjet } from "@/lib/medias";
import { maintenantMs } from "@/lib/utils";
import { chargerEtudiantMatching, scoreMatch } from "@/lib/matching-courant";
import { CatalogueProjets, type ProjetCatalogue } from "@/composants/maquette/catalogue";
import type { StatutProjet } from "@/generated/prisma/client";

export const metadata = {
  title: "Jobs",
  description: "Tous les jobs ouverts aux étudiants sur JUB Campus.",
};
export const dynamic = "force-dynamic";

const STATUTS_OUVERTS: StatutProjet[] = ["PUBLIE", "CANDIDATURES_OUVERTES", "EQUIPE_EN_CONSTITUTION"];

export default async function PageJobs({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const q = ((await searchParams).q ?? "").trim();
  const session = await auth();
  const etudiantConnecte = session?.user?.id
    ? await prisma.etudiant.findUnique({
        where: { utilisateurId: session.user.id },
        select: { universiteId: true },
      })
    : null;

  const [projets, etudiant] = await Promise.all([
    prisma.projet.findMany({
      where: {
        statut: { in: STATUTS_OUVERTS },
        OR: [
          { visibilite: "PUBLIQUE" },
          ...(etudiantConnecte?.universiteId
            ? [{ visibilite: "UNIVERSITE" as const, universiteId: etudiantConnecte.universiteId }]
            : []),
        ],
      },
      orderBy: { publieLe: "desc" },
      take: 80,
      select: {
        slug: true, titre: true, categorie: true, niveau: true, modeRemuneration: true,
        dureeJours: true, montantFcfa: true, imageCouvertureUrl: true, publieLe: true, creeLe: true,
        entreprise: { select: { raisonSociale: true } },
        competencesRequises: {
          select: { competenceId: true, niveauRequis: true, competence: { select: { nom: true } } },
        },
      },
    }),
    chargerEtudiantMatching(session?.user?.id),
  ]);

  const maintenant = maintenantMs();
  const liste: ProjetCatalogue[] = projets.map((p) => ({
    slug: p.slug,
    titre: p.titre,
    image: imageProjet(p),
    organisation: p.entreprise?.raisonSociale ?? "JUB Campus",
    categorieLibelle:
      LIBELLES_CATEGORIE[p.categorie as keyof typeof LIBELLES_CATEGORIE] ?? p.categorie,
    duree: p.dureeJours,
    montant: p.montantFcfa,
    matchScore: scoreMatch(etudiant, {
      niveau: p.niveau,
      categorie: p.categorie,
      competencesRequises: p.competencesRequises,
    }),
    competences: p.competencesRequises.map((c) => c.competence.nom),
    modeRemuneration: p.modeRemuneration,
    niveau: p.niveau,
    publieIlYa: Math.floor((maintenant - new Date(p.publieLe ?? p.creeLe).getTime()) / 86_400_000),
  }));

  return <CatalogueProjets projets={liste} initialQ={q} />;
}
