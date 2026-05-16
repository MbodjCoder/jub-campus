import Link from "next/link";
import { notFound } from "next/navigation";
import { Bouton } from "@/composants/ui/bouton";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import {
  LIBELLES_CATEGORIE,
  LIBELLES_NIVEAU_PROJET,
  LIBELLES_MODE_REMUNERATION,
  COULEURS_MODE_REMUNERATION,
} from "@/lib/constantes";
import { formaterDureeJours, formaterMontantFcfa } from "@/lib/utils";

const projetsDemo = {
  "refonte-billetterie-sonatel": {
    titre: "Refonte de la billetterie en ligne",
    organisation: "Sonatel",
    organisationDesc: "Premier opérateur télécoms du Sénégal.",
    resume: "Moderniser le tunnel d'achat de la billetterie événementielle et réduire le taux d'abandon de 12 points.",
    description: `Le tunnel actuel souffre d'un taux d'abandon supérieur à 40%. Nous cherchons une équipe étudiante motivée pour :

- auditer l'expérience actuelle (parcours utilisateur, performance, accessibilité) ;
- proposer 3 maquettes haute-fidélité ;
- développer un prototype fonctionnel des écrans clés (page liste, page billet, panier, paiement) ;
- conduire 5 entretiens utilisateurs et synthétiser les apprentissages.

Tu travailleras avec une product manager senior Sonatel et un mentor JUB Campus.`,
    categorie: "WEB" as const,
    niveau: "AVANCE" as const,
    modeRemuneration: "REMUNERE" as const,
    montant: 250000,
    duree: 42,
    placesMax: 3,
    competences: ["Next.js", "Figma", "UX recherche", "TypeScript"],
    livrables: ["Audit UX (PDF)", "3 maquettes Figma", "Prototype fonctionnel", "Synthèse entretiens"],
  },
} as const;

type ParametresPage = { params: Promise<{ slug: string }> };

export default async function PageDetailProjet({ params }: ParametresPage) {
  const { slug } = await params;
  const projet = projetsDemo[slug as keyof typeof projetsDemo];
  if (!projet) notFound();

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link href="/projets" className="text-sm text-jub-vert-700 hover:underline">← Tous les projets</Link>

      <header className="mt-4 mb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Insigne ton="neutre">{projet.organisation}</Insigne>
          <Insigne ton="vert">{LIBELLES_CATEGORIE[projet.categorie]}</Insigne>
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${COULEURS_MODE_REMUNERATION[projet.modeRemuneration]}`}>
            {LIBELLES_MODE_REMUNERATION[projet.modeRemuneration]}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{projet.titre}</h1>
        <p className="max-w-3xl text-lg text-texte-discret">{projet.resume}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Carte>
            <EnteteCarte><TitreCarte>Description du projet</TitreCarte></EnteteCarte>
            <CorpsCarte>
              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-texte">
                {projet.description}
              </div>
            </CorpsCarte>
          </Carte>

          <Carte>
            <EnteteCarte><TitreCarte>Livrables attendus</TitreCarte></EnteteCarte>
            <CorpsCarte>
              <ul className="space-y-2">
                {projet.livrables.map((l) => (
                  <li key={l} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-jub-vert-700" />
                    {l}
                  </li>
                ))}
              </ul>
            </CorpsCarte>
          </Carte>

          <Carte>
            <EnteteCarte><TitreCarte>Compétences attendues</TitreCarte></EnteteCarte>
            <CorpsCarte className="flex flex-wrap gap-2">
              {projet.competences.map((c) => (
                <Insigne key={c} ton="vert">{c}</Insigne>
              ))}
            </CorpsCarte>
          </Carte>
        </div>

        <aside className="space-y-4">
          <Carte>
            <CorpsCarte className="space-y-3">
              <Bloc libelle="Niveau" valeur={LIBELLES_NIVEAU_PROJET[projet.niveau]} />
              <Bloc libelle="Durée" valeur={formaterDureeJours(projet.duree)} />
              <Bloc libelle="Places dans l'équipe" valeur={`${projet.placesMax}`} />
              <Bloc libelle="Rémunération" valeur={projet.montant ? formaterMontantFcfa(projet.montant) : "Non rémunéré (certifiant)"} />
            </CorpsCarte>
          </Carte>

          <Carte>
            <CorpsCarte className="space-y-3">
              <p className="text-sm font-medium">À propos de {projet.organisation}</p>
              <DescriptionCarte>{projet.organisationDesc}</DescriptionCarte>
            </CorpsCarte>
          </Carte>

          <Link href="/inscription/etudiant" className="block">
            <Bouton apparence="accent" pleineLargeur taille="lg">Postuler à ce projet</Bouton>
          </Link>
          <p className="text-center text-xs text-texte-discret">
            Tu seras invité à te connecter ou créer un compte avant de postuler.
          </p>
        </aside>
      </div>
    </section>
  );
}

function Bloc({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="text-texte-discret">{libelle}</span>
      <span className="font-medium text-texte">{valeur}</span>
    </div>
  );
}
