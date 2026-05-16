import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte } from "@/composants/ui/carte";

export const metadata = { title: "Statistiques" };
export const dynamic = "force-dynamic";

export default async function PageEntrepriseStatistiques() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion?suivant=/entreprise/statistiques");

  const entreprise = await prisma.entreprise.findUnique({
    where: { utilisateurId: session.user.id },
    select: { id: true },
  });
  if (!entreprise) return <p>Profil introuvable.</p>;

  const [
    nbProjets, nbCandidatures, nbAcceptees, nbCertifies, nbLivrables, nbLivrablesValides,
  ] = await Promise.all([
    prisma.projet.count({ where: { entrepriseId: entreprise.id } }),
    prisma.candidature.count({ where: { projet: { entrepriseId: entreprise.id } } }),
    prisma.candidature.count({ where: { projet: { entrepriseId: entreprise.id }, statut: "ACCEPTEE" } }),
    prisma.projet.count({ where: { entrepriseId: entreprise.id, statut: "CERTIFIE" } }),
    prisma.livrable.count({ where: { projet: { entrepriseId: entreprise.id } } }),
    prisma.livrable.count({ where: { projet: { entrepriseId: entreprise.id }, statut: "VALIDE" } }),
  ]);

  const tauxAcceptation = nbCandidatures > 0 ? Math.round((nbAcceptees / nbCandidatures) * 100) : 0;
  const tauxValidation = nbLivrables > 0 ? Math.round((nbLivrablesValides / nbLivrables) * 100) : 0;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Statistiques</h1>
        <p className="text-sm text-texte-discret">Vue chiffrée sur l&apos;activité de tes projets.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat libelle="Projets publiés" valeur={nbProjets} />
        <Stat libelle="Projets certifiés" valeur={nbCertifies} />
        <Stat libelle="Candidatures totales" valeur={nbCandidatures} />
        <Stat libelle="Taux d'acceptation" valeur={`${tauxAcceptation}%`} />
        <Stat libelle="Livrables reçus" valeur={nbLivrables} />
        <Stat libelle="Taux de validation" valeur={`${tauxValidation}%`} />
      </div>

      <Carte className="mt-8">
        <EnteteCarte><TitreCarte className="text-base">Vue avancée</TitreCarte></EnteteCarte>
        <CorpsCarte className="text-sm text-texte-discret">
          Graphiques temporels, funnels et exports CSV arrivent en V1.4.
        </CorpsCarte>
      </Carte>
    </>
  );
}

function Stat({ libelle, valeur }: { libelle: string; valeur: number | string }) {
  return (
    <Carte>
      <CorpsCarte className="space-y-1">
        <p className="text-xs uppercase tracking-wider text-texte-discret">{libelle}</p>
        <p className="text-2xl font-bold">{valeur}</p>
      </CorpsCarte>
    </Carte>
  );
}
