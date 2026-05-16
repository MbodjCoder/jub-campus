import Link from "next/link";
import Image from "next/image";
import { Carte, CorpsCarte } from "@/composants/ui/carte";
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

// Démonstration. Sera remplacé par requête Prisma quand la cohorte 1 publiera.
const projetsDemo = [
  {
    slug: "refonte-billetterie-sonatel",
    titre: "Refonte de la billetterie en ligne",
    organisation: "Sonatel",
    resume: "Moderniser le tunnel d'achat de la billetterie événementielle et réduire le taux d'abandon de 12 points.",
    categorie: "WEB" as const,
    niveau: "AVANCE" as const,
    modeRemuneration: "REMUNERE" as const,
    montant: 250000,
    duree: 42,
    placesMax: 3,
    competences: ["Next.js", "Figma", "UX recherche"],
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
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
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80",
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
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80",
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
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "dashboard-sococim-rh",
    titre: "Dashboard RH interne — Sococim",
    organisation: "Sococim Industries",
    resume: "Construire un tableau de bord temps réel des effectifs et des absences.",
    categorie: "DATA" as const,
    niveau: "AVANCE" as const,
    modeRemuneration: "PRIME" as const,
    montant: 200000,
    duree: 35,
    placesMax: 2,
    competences: ["Power BI", "SQL", "Communication écrite"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "site-vitrine-ferme-bissap",
    titre: "Site vitrine pour une coopérative agricole",
    organisation: "Ferme Bissap Niayes",
    resume: "Concevoir un site présentant la coopérative, ses produits et un formulaire de précommande.",
    categorie: "WEB" as const,
    niveau: "DEBUTANT" as const,
    modeRemuneration: "APPRENTISSAGE" as const,
    montant: null,
    duree: 21,
    placesMax: 3,
    competences: ["HTML/CSS", "Photographie", "Rédaction"],
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function PageProjets() {
  return (
    <>
      <section className="border-b border-bordure bg-gradient-to-br from-jub-vert-50 via-fond to-fond">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <Insigne ton="vert">Catalogue</Insigne>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            {projetsDemo.length} projets ouverts.
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-texte-discret">
            Filtre par domaine, niveau, durée ou rémunération. Postule en un clic
            si tu es connecté — sinon, crée ton compte gratuitement.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
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

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projetsDemo.map((p) => (
            <Link key={p.slug} href={`/projets/${p.slug}`} className="group block">
              <article className="flex h-full flex-col overflow-hidden rounded-xl border border-bordure bg-fond-eleve transition-all duration-300 group-hover:-translate-y-1 group-hover:border-jub-vert-500 group-hover:shadow-xl">
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-jub-vert-950/70 via-jub-vert-950/10 to-transparent" />
                  <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-jub-vert-900 backdrop-blur">
                      {p.organisation}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${COULEURS_MODE_REMUNERATION[p.modeRemuneration]}`}>
                      {LIBELLES_MODE_REMUNERATION[p.modeRemuneration]}
                    </span>
                    {p.montant !== null ? (
                      <span className="rounded-md bg-white/95 px-2 py-0.5 text-xs font-semibold text-jub-vert-900 backdrop-blur">
                        {formaterMontantFcfa(p.montant)}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-semibold leading-snug tracking-tight">{p.titre}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-texte-discret">{p.resume}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.competences.slice(0, 3).map((c) => (
                      <Insigne key={c} ton="vert">{c}</Insigne>
                    ))}
                  </div>

                  <div className="mt-auto grid grid-cols-3 gap-2 border-t border-bordure pt-4 text-xs text-texte-discret">
                    <Stat libelle="Niveau" valeur={LIBELLES_NIVEAU_PROJET[p.niveau]} />
                    <Stat libelle="Durée" valeur={formaterDureeJours(p.duree)} />
                    <Stat libelle="Places" valeur={`${p.placesMax}`} />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/inscription/etudiant">
            <Bouton apparence="accent" taille="lg">Créer un compte pour postuler →</Bouton>
          </Link>
        </div>
      </section>
    </>
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
