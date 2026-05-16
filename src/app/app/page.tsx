import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { Bouton } from "@/composants/ui/bouton";

export const metadata = { title: "Tableau de bord" };

export default async function TableauDeBordEtudiant() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const etudiant = await prisma.etudiant.findUnique({
    where: { utilisateurId: session.user.id },
    include: {
      candidatures: { where: { statut: "EN_ATTENTE" } },
      membreEquipes: { include: { equipe: { include: { projet: true } } } },
      certificats: true,
    },
  });

  if (!etudiant) {
    return (
      <Carte>
        <CorpsCarte>Profil étudiant introuvable.</CorpsCarte>
      </Carte>
    );
  }

  const projetsActifs = etudiant.membreEquipes.filter((m) =>
    ["EN_COURS", "EN_REVISION", "EQUIPE_EN_CONSTITUTION"].includes(m.equipe.projet.statut),
  );

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Bienvenue, {etudiant.prenom}</h1>
        <p className="text-texte-discret">Voici où tu en es aujourd&apos;hui.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CarteStat libelle="Score JUB" valeur={etudiant.scoreJub.toString()} indication="Évolue avec tes projets" />
        <CarteStat libelle="Projets actifs" valeur={projetsActifs.length.toString()} />
        <CarteStat libelle="Candidatures en cours" valeur={etudiant.candidatures.length.toString()} />
        <CarteStat libelle="Certificats obtenus" valeur={etudiant.certificats.length.toString()} indication="Tous publics" />
      </div>

      {etudiant.certificats.length === 0 && projetsActifs.length === 0 && etudiant.candidatures.length === 0 ? (
        <Carte className="mt-10">
          <CorpsCarte className="text-center py-12 space-y-4">
            <h2 className="text-xl font-semibold">Prêt à démarrer ?</h2>
            <p className="text-texte-discret max-w-md mx-auto">
              Tu n&apos;as pas encore de projet. Parcours le catalogue et postule au premier projet
              qui correspond à tes compétences.
            </p>
            <Link href="/projets" className="inline-block">
              <Bouton apparence="accent" taille="lg">Découvrir les projets</Bouton>
            </Link>
          </CorpsCarte>
        </Carte>
      ) : null}

      {projetsActifs.length > 0 ? (
        <section className="mt-10 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-texte-discret">Tes projets en cours</h2>
          {projetsActifs.map((m) => (
            <Carte key={m.equipeId}>
              <CorpsCarte className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{m.equipe.projet.titre}</p>
                  <p className="text-xs text-texte-discret">{m.roleEquipe}</p>
                </div>
                <Insigne ton="bleu">{m.equipe.projet.statut.replace(/_/g, " ")}</Insigne>
              </CorpsCarte>
            </Carte>
          ))}
        </section>
      ) : null}
    </>
  );
}

function CarteStat({ libelle, valeur, indication }: { libelle: string; valeur: string; indication?: string }) {
  return (
    <Carte>
      <CorpsCarte className="space-y-1">
        <p className="text-xs uppercase tracking-wider text-texte-discret">{libelle}</p>
        <p className="text-2xl font-bold">{valeur}</p>
        {indication ? <p className="text-xs text-texte-discret">{indication}</p> : null}
      </CorpsCarte>
    </Carte>
  );
}
