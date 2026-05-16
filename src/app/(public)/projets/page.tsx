import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
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
import type {
  CategorieProjet, NiveauProjet, ModeRemuneration, Prisma,
} from "@/generated/prisma/client";

export const metadata = {
  title: "Projets ouverts",
  description: "Tous les projets ouverts aux étudiants sur JUB Campus.",
};
export const dynamic = "force-dynamic";

type ParametresRecherche = Promise<{
  q?: string;
  categorie?: string;
  niveau?: string;
  mode?: string;
}>;

const STATUTS_PUBLICS: Prisma.ProjetWhereInput["statut"] = {
  in: ["PUBLIE", "CANDIDATURES_OUVERTES", "EQUIPE_EN_CONSTITUTION", "EN_COURS"],
};

// Données de démonstration affichées si la DB est vide.
const projetsDemo = [
  {
    slug: "refonte-billetterie-sonatel",
    titre: "Refonte de la billetterie en ligne",
    organisation: "Sonatel",
    resume: "Moderniser le tunnel d'achat de la billetterie événementielle et réduire le taux d'abandon de 12 points.",
    categorie: "WEB" as CategorieProjet,
    niveau: "AVANCE" as NiveauProjet,
    modeRemuneration: "REMUNERE" as ModeRemuneration,
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
    categorie: "ANNOTATION_DONNEES" as CategorieProjet,
    niveau: "DEBUTANT" as NiveauProjet,
    modeRemuneration: "PRIME" as ModeRemuneration,
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
    categorie: "MARKETING" as CategorieProjet,
    niveau: "INTERMEDIAIRE" as NiveauProjet,
    modeRemuneration: "APPRENTISSAGE" as ModeRemuneration,
    montant: null,
    duree: 28,
    placesMax: 4,
    competences: ["Réseaux sociaux", "Copywriting", "Canva"],
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80",
  },
];

export default async function PageProjets({ searchParams }: { searchParams: ParametresRecherche }) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const categorie = params.categorie as CategorieProjet | "" | undefined;
  const niveau = params.niveau as NiveauProjet | "" | undefined;
  const mode = params.mode as ModeRemuneration | "" | undefined;

  const where: Prisma.ProjetWhereInput = {
    statut: STATUTS_PUBLICS,
    visibilite: { in: ["PUBLIQUE", "UNIVERSITE"] },
  };
  if (q.length >= 2) {
    where.OR = [
      { titre: { contains: q, mode: "insensitive" } },
      { resume: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }
  if (categorie) where.categorie = categorie;
  if (niveau) where.niveau = niveau;
  if (mode) where.modeRemuneration = mode;

  const projets = await prisma.projet.findMany({
    where,
    orderBy: [{ publieLe: "desc" }, { creeLe: "desc" }],
    take: 60,
    include: {
      entreprise: { select: { raisonSociale: true } },
      competencesRequises: { take: 4, include: { competence: { select: { nom: true } } } },
    },
  });

  const resultats = projets.length > 0
    ? projets.map((p) => ({
        slug: p.slug,
        titre: p.titre,
        organisation: p.entreprise?.raisonSociale ?? "JUB Campus",
        resume: p.resume,
        categorie: p.categorie,
        niveau: p.niveau,
        modeRemuneration: p.modeRemuneration,
        montant: p.montantFcfa,
        duree: p.dureeJours,
        placesMax: p.placesMax,
        competences: p.competencesRequises.map((c) => c.competence.nom),
        image: p.imageCouvertureUrl ??
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
      }))
    : projetsDemo;

  const ilYaFiltres = Boolean(q || categorie || niveau || mode);
  const utiliseDemo = projets.length === 0 && !ilYaFiltres;

  return (
    <>
      <section className="border-b border-bordure bg-gradient-to-br from-jub-sage-50 via-fond to-fond">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <Insigne ton="vert">Catalogue</Insigne>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            {resultats.length} projet{resultats.length > 1 ? "s" : ""} ouvert{resultats.length > 1 ? "s" : ""}.
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-texte-discret">
            Filtre par domaine, niveau ou rémunération. Postule en un clic
            quand tu es connecté.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Form de filtres : GET vers la même page, server-rendering recalcule. */}
        <form method="get" className="mb-8">
          <Carte>
            <CorpsCarte>
              <div className="grid gap-3 sm:grid-cols-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-texte-discret" />
                  <Champ
                    name="q"
                    placeholder="Rechercher…"
                    defaultValue={q}
                    className="pl-9"
                  />
                </div>
                <Selecteur name="categorie" defaultValue={categorie ?? ""}>
                  <option value="">Toutes catégories</option>
                  {Object.entries(LIBELLES_CATEGORIE).map(([cle, libelle]) => (
                    <option key={cle} value={cle}>{libelle}</option>
                  ))}
                </Selecteur>
                <Selecteur name="niveau" defaultValue={niveau ?? ""}>
                  <option value="">Tous niveaux</option>
                  {Object.entries(LIBELLES_NIVEAU_PROJET).map(([cle, libelle]) => (
                    <option key={cle} value={cle}>{libelle}</option>
                  ))}
                </Selecteur>
                <Selecteur name="mode" defaultValue={mode ?? ""}>
                  <option value="">Toutes rémunérations</option>
                  {Object.entries(LIBELLES_MODE_REMUNERATION).map(([cle, libelle]) => (
                    <option key={cle} value={cle}>{libelle}</option>
                  ))}
                </Selecteur>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Bouton apparence="primaire" type="submit" taille="sm">Filtrer</Bouton>
                {ilYaFiltres ? (
                  <Link href="/projets" className="text-xs text-jub-orange-600 hover:underline">
                    Réinitialiser
                  </Link>
                ) : null}
                {utiliseDemo ? (
                  <span className="ml-auto text-xs italic text-texte-discret">
                    Affichage de projets de démonstration — la cohorte 1 publiera bientôt.
                  </span>
                ) : null}
              </div>
            </CorpsCarte>
          </Carte>
        </form>

        {resultats.length === 0 ? (
          <Carte>
            <CorpsCarte className="py-14 text-center text-sm text-texte-discret">
              Aucun projet ne correspond à tes critères.
              <Link href="/projets" className="ml-1 text-jub-orange-600 hover:underline">
                Effacer les filtres →
              </Link>
            </CorpsCarte>
          </Carte>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resultats.map((p) => (
              <Link key={p.slug} href={`/projets/${p.slug}`} className="group block">
                <article className="flex h-full flex-col overflow-hidden rounded-xl border border-bordure bg-fond-eleve transition-all duration-300 group-hover:-translate-y-1 group-hover:border-jub-orange-500 group-hover:shadow-xl">
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-jub-sage-950/70 via-jub-sage-950/10 to-transparent" />
                    <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-jub-sage-900 backdrop-blur">
                        {p.organisation}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${COULEURS_MODE_REMUNERATION[p.modeRemuneration]}`}>
                        {LIBELLES_MODE_REMUNERATION[p.modeRemuneration]}
                      </span>
                      {p.montant !== null ? (
                        <span className="rounded-md bg-white/95 px-2 py-0.5 text-xs font-semibold text-jub-sage-900 backdrop-blur">
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
        )}
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
