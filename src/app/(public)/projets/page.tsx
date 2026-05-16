import Link from "next/link";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { Bouton } from "@/composants/ui/bouton";
import { Champ, Selecteur } from "@/composants/ui/champ";
import {
  LIBELLES_CATEGORIE,
  LIBELLES_NIVEAU_PROJET,
  LIBELLES_MODE_REMUNERATION,
  COULEURS_MODE_REMUNERATION,
} from "@/lib/constantes";
import { formaterMontantFcfa, formaterDureeJours } from "@/lib/utils";

export const metadata = {
  title: "Projets ouverts",
  description: "Tous les projets ouverts aux étudiants sur JUB Campus.",
};

// Démonstration tant que la base n'est pas peuplée.
const projetsDemo = [
  {
    slug: "refonte-billetterie-sonatel",
    titre: "Refonte de la billetterie en ligne",
    organisation: "Sonatel",
    resume: "Moderniser le tunnel d'achat de la billetterie événementielle et réduire le taux d'abandon.",
    categorie: "WEB" as const,
    niveau: "AVANCE" as const,
    modeRemuneration: "REMUNERE" as const,
    montant: 250000,
    duree: 42,
    placesMax: 3,
    competences: ["Next.js", "Figma", "UX recherche"],
  },
  {
    slug: "dataset-agriculture-ugb",
    titre: "Annotation d'un dataset agricole vallée du fleuve",
    organisation: "Laboratoire SAT — UGB",
    resume: "Annoter 1500 images aériennes pour entraîner un modèle de détection de cultures.",
    categorie: "ANNOTATION_DONNEES" as const,
    niveau: "DEBUTANT" as const,
    modeRemuneration: "PRIME" as const,
    montant: 80000,
    duree: 21,
    placesMax: 8,
    competences: ["Annotation", "Rigueur", "Travail en équipe"],
  },
  {
    slug: "campagne-orange-money-etudiants",
    titre: "Campagne réseaux sociaux Orange Money campus",
    organisation: "Orange Digital Center",
    resume: "Concevoir et animer 3 mini-campagnes ciblant les étudiants UGB et UCAD.",
    categorie: "MARKETING" as const,
    niveau: "INTERMEDIAIRE" as const,
    modeRemuneration: "APPRENTISSAGE" as const,
    montant: null,
    duree: 28,
    placesMax: 4,
    competences: ["Réseaux sociaux", "Copywriting", "Canva"],
  },
  {
    slug: "etude-impact-eau-saint-louis",
    titre: "Étude qualitative sur l'accès à l'eau à Pikine Saint-Louis",
    organisation: "ONG Eau Pour Tous",
    resume: "Mener 40 entretiens semi-directifs et produire un rapport d'impact.",
    categorie: "ENQUETE_TERRAIN" as const,
    niveau: "INTERMEDIAIRE" as const,
    modeRemuneration: "SPONSORISE" as const,
    montant: 150000,
    duree: 35,
    placesMax: 5,
    competences: ["Enquête terrain", "Sociologie", "Wolof"],
  },
];

export default function PageProjets() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Projets ouverts</h1>
          <p className="mt-2 text-texte-discret">{projetsDemo.length} projets à postuler.</p>
        </div>
        <Link href="/inscription/etudiant">
          <Bouton apparence="accent">Postuler — créer un compte</Bouton>
        </Link>
      </header>

      <Carte className="mb-8">
        <CorpsCarte>
          <div className="grid gap-3 sm:grid-cols-4">
            <Champ placeholder="Rechercher un projet…" />
            <Selecteur defaultValue="">
              <option value="">Toutes catégories</option>
              {Object.entries(LIBELLES_CATEGORIE).map(([cle, libelle]) => (
                <option key={cle} value={cle}>{libelle}</option>
              ))}
            </Selecteur>
            <Selecteur defaultValue="">
              <option value="">Tous niveaux</option>
              {Object.entries(LIBELLES_NIVEAU_PROJET).map(([cle, libelle]) => (
                <option key={cle} value={cle}>{libelle}</option>
              ))}
            </Selecteur>
            <Selecteur defaultValue="">
              <option value="">Toutes rémunérations</option>
              {Object.entries(LIBELLES_MODE_REMUNERATION).map(([cle, libelle]) => (
                <option key={cle} value={cle}>{libelle}</option>
              ))}
            </Selecteur>
          </div>
        </CorpsCarte>
      </Carte>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projetsDemo.map((p) => (
          <Link key={p.slug} href={`/projets/${p.slug}`} className="block group">
            <Carte className="h-full transition-all group-hover:border-jub-vert-500 group-hover:shadow-md">
              <EnteteCarte className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <Insigne ton="neutre">{p.organisation}</Insigne>
                  <TitreCarte className="text-base leading-tight">{p.titre}</TitreCarte>
                </div>
              </EnteteCarte>
              <CorpsCarte className="space-y-4">
                <DescriptionCarte>{p.resume}</DescriptionCarte>
                <div className="flex flex-wrap gap-1.5">
                  {p.competences.map((c) => (
                    <Insigne key={c} ton="vert">{c}</Insigne>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 font-medium ${COULEURS_MODE_REMUNERATION[p.modeRemuneration]}`}>
                    {LIBELLES_MODE_REMUNERATION[p.modeRemuneration]}
                  </span>
                  {p.montant !== null ? (
                    <span className="text-texte-discret">{formaterMontantFcfa(p.montant)}</span>
                  ) : null}
                </div>
                <div className="grid grid-cols-3 gap-2 border-t border-bordure pt-3 text-xs text-texte-discret">
                  <Stat libelle="Niveau" valeur={LIBELLES_NIVEAU_PROJET[p.niveau]} />
                  <Stat libelle="Durée" valeur={formaterDureeJours(p.duree)} />
                  <Stat libelle="Places" valeur={`${p.placesMax}`} />
                </div>
              </CorpsCarte>
            </Carte>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Stat({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider">{libelle}</p>
      <p className="font-medium text-texte">{valeur}</p>
    </div>
  );
}
