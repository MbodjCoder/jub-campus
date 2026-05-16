import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Users, Clock, Briefcase, ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { Kanban } from "@/composants/projet/kanban";
import { FormulaireTache } from "@/composants/projet/formulaire-tache";
import { Livrables } from "@/composants/projet/livrables";
import {
  LIBELLES_CATEGORIE,
  LIBELLES_NIVEAU_PROJET,
  LIBELLES_MODE_REMUNERATION,
  LIBELLES_STATUT_PROJET,
} from "@/lib/constantes";
import { formaterDureeJours, formaterMontantFcfa } from "@/lib/utils";

type ProprietesPage = { params: Promise<{ id: string }> };

export default async function PageEspaceProjet({ params }: ProprietesPage) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const projet = await prisma.projet.findUnique({
    where: { id },
    include: {
      entreprise: true,
      mentorPrincipal: true,
      equipe: { include: { membres: { include: { etudiant: true } } } },
      taches: {
        orderBy: { creeLe: "desc" },
        include: { assignee: { select: { id: true, prenom: true, nom: true } } },
      },
      livrables: {
        orderBy: { deposeLe: "desc" },
        include: {
          deposePar: { select: { nomComplet: true } },
          feedbacks: {
            orderBy: { creeLe: "asc" },
            include: { auteur: { select: { nomComplet: true } } },
          },
        },
      },
    },
  });

  if (!projet) notFound();

  const membres = projet.equipe?.membres.map((m) => m.etudiant) ?? [];

  return (
    <>
      <Link
        href="/app/mes-projets"
        className="mb-4 inline-flex items-center gap-1 text-sm text-jub-sage-700 hover:text-jub-orange-600"
      >
        <ArrowLeft className="h-4 w-4" /> Mes projets
      </Link>

      <header className="mb-8 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Insigne ton="orange">{LIBELLES_STATUT_PROJET[projet.statut]}</Insigne>
          <Insigne ton="vert">{LIBELLES_CATEGORIE[projet.categorie]}</Insigne>
          <Insigne ton="neutre">{LIBELLES_NIVEAU_PROJET[projet.niveau]}</Insigne>
          <Insigne ton="sombre">{LIBELLES_MODE_REMUNERATION[projet.modeRemuneration]}</Insigne>
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{projet.titre}</h1>
        <p className="max-w-3xl text-sm text-texte-discret">{projet.resume}</p>
      </header>

      <div className="mb-10 grid gap-3 sm:grid-cols-4">
        <BlocStat icone={<Briefcase className="h-4 w-4" />} libelle="Organisation" valeur={projet.entreprise?.raisonSociale ?? "JUB Campus"} />
        <BlocStat icone={<Clock className="h-4 w-4" />} libelle="Durée" valeur={formaterDureeJours(projet.dureeJours)} />
        <BlocStat icone={<Users className="h-4 w-4" />} libelle="Équipe" valeur={`${membres.length}/${projet.placesMax}`} />
        <BlocStat libelle="Rémunération" valeur={projet.montantFcfa ? formaterMontantFcfa(projet.montantFcfa) : "—"} />
      </div>

      <section className="mb-12">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold tracking-tight">Tableau des tâches</h2>
          <FormulaireTache projetId={projet.id} membres={membres} />
        </div>
        <Kanban taches={projet.taches} />
      </section>

      <section>
        <Livrables projetId={projet.id} livrables={projet.livrables} />
      </section>

      <section className="mt-12">
        <Carte>
          <EnteteCarte>
            <TitreCarte className="text-base">Équipe</TitreCarte>
          </EnteteCarte>
          <CorpsCarte className="flex flex-wrap gap-3">
            {membres.length === 0 ? (
              <p className="text-sm italic text-texte-discret">Pas encore de membre.</p>
            ) : (
              membres.map((m) => (
                <Link
                  key={m.id}
                  href={`/u/${m.slug}`}
                  className="flex items-center gap-2 rounded-full border border-bordure bg-fond-eleve px-3 py-1.5 text-sm transition-all hover:border-jub-orange-300 hover:bg-jub-orange-50"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-jub-orange-500 text-xs font-bold text-white">
                    {m.prenom[0]}{m.nom[0]}
                  </span>
                  {m.prenom} {m.nom}
                </Link>
              ))
            )}
          </CorpsCarte>
        </Carte>
      </section>
    </>
  );
}

function BlocStat({ icone, libelle, valeur }: { icone?: React.ReactNode; libelle: string; valeur: string }) {
  return (
    <div className="rounded-xl border border-bordure bg-fond-eleve p-4">
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-texte-discret">
        {icone}
        {libelle}
      </p>
      <p className="mt-1 truncate text-base font-bold">{valeur}</p>
    </div>
  );
}
