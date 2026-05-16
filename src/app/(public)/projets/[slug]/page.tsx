import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
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
import { FormulaireCandidature } from "@/composants/projet/formulaire-candidature";

export const dynamic = "force-dynamic";

// Données de démonstration affichées si le slug n'est pas en DB
// (utile tant que la cohorte 1 n'a pas publié de vrais projets).
const projetsDemo: Record<string, {
  titre: string; organisation: string; organisationDesc: string; resume: string; description: string;
  categorie: "WEB" | "DATA" | "MARKETING" | "ANNOTATION_DONNEES" | "ENQUETE_TERRAIN";
  niveau: "DEBUTANT" | "INTERMEDIAIRE" | "AVANCE";
  modeRemuneration: "APPRENTISSAGE" | "PRIME" | "REMUNERE" | "SPONSORISE";
  montant: number | null; duree: number; placesMax: number;
  competences: string[]; livrables: string[];
}> = {
  "refonte-billetterie-sonatel": {
    titre: "Refonte de la billetterie en ligne",
    organisation: "Sonatel",
    organisationDesc: "Premier opérateur télécoms du Sénégal.",
    resume: "Moderniser le tunnel d'achat de la billetterie événementielle et réduire le taux d'abandon de 12 points.",
    description: "Le tunnel actuel souffre d'un taux d'abandon supérieur à 40%. Nous cherchons une équipe étudiante motivée pour auditer l'UX, proposer 3 maquettes haute-fidélité, développer un prototype et conduire 5 entretiens utilisateurs.",
    categorie: "WEB", niveau: "AVANCE", modeRemuneration: "REMUNERE",
    montant: 250000, duree: 42, placesMax: 3,
    competences: ["Next.js", "Figma", "UX recherche", "TypeScript"],
    livrables: ["Audit UX (PDF)", "3 maquettes Figma", "Prototype fonctionnel", "Synthèse entretiens"],
  },
};

type ParametresPage = { params: Promise<{ slug: string }> };

export default async function PageDetailProjet({ params }: ParametresPage) {
  const { slug } = await params;

  // Cherche d'abord en base, sinon retombe sur les données démo.
  const projetReel = await prisma.projet.findUnique({
    where: { slug },
    include: {
      entreprise: true,
      mentorPrincipal: true,
      competencesRequises: { include: { competence: true } },
      equipe: { include: { membres: true } },
      candidatures: { select: { id: true } },
    },
  });

  // Détermine la candidature existante pour l'utilisateur connecté.
  const session = await auth();
  let candidatureExistante: { id: string; statut: string } | null = null;
  let estEtudiant = false;
  if (session?.user?.id && projetReel) {
    const etudiant = await prisma.etudiant.findUnique({
      where: { utilisateurId: session.user.id },
      select: { id: true },
    });
    if (etudiant) {
      estEtudiant = true;
      const c = await prisma.candidature.findUnique({
        where: { projetId_etudiantId: { projetId: projetReel.id, etudiantId: etudiant.id } },
        select: { id: true, statut: true },
      });
      candidatureExistante = c;
    }
  }

  if (!projetReel) {
    const demo = projetsDemo[slug];
    if (!demo) notFound();
    return <RenduDemo slug={slug} demo={demo} />;
  }

  const placesRestantes = Math.max(
    0,
    projetReel.placesMax - (projetReel.equipe?.membres.length ?? 0),
  );

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link href="/projets" className="inline-flex items-center gap-1 text-sm text-jub-orange-600 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Tous les projets
      </Link>

      <header className="mt-4 mb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Insigne ton="neutre">{projetReel.entreprise?.raisonSociale ?? "JUB Campus"}</Insigne>
          <Insigne ton="vert">{LIBELLES_CATEGORIE[projetReel.categorie]}</Insigne>
          <Insigne ton="orange">{LIBELLES_NIVEAU_PROJET[projetReel.niveau]}</Insigne>
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${COULEURS_MODE_REMUNERATION[projetReel.modeRemuneration]}`}>
            {LIBELLES_MODE_REMUNERATION[projetReel.modeRemuneration]}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{projetReel.titre}</h1>
        <p className="max-w-3xl text-lg text-texte-discret">{projetReel.resume}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Carte>
            <EnteteCarte><TitreCarte>Description du projet</TitreCarte></EnteteCarte>
            <CorpsCarte>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-texte">
                {projetReel.description}
              </div>
            </CorpsCarte>
          </Carte>

          {projetReel.competencesRequises.length > 0 ? (
            <Carte>
              <EnteteCarte><TitreCarte>Compétences attendues</TitreCarte></EnteteCarte>
              <CorpsCarte className="flex flex-wrap gap-2">
                {projetReel.competencesRequises.map((c) => (
                  <Insigne key={c.competenceId} ton="vert">{c.competence.nom}</Insigne>
                ))}
              </CorpsCarte>
            </Carte>
          ) : null}
        </div>

        <aside className="space-y-4">
          <Carte>
            <CorpsCarte className="space-y-3">
              <Bloc libelle="Niveau" valeur={LIBELLES_NIVEAU_PROJET[projetReel.niveau]} />
              <Bloc libelle="Durée" valeur={formaterDureeJours(projetReel.dureeJours)} />
              <Bloc libelle="Places restantes" valeur={`${placesRestantes} / ${projetReel.placesMax}`} />
              <Bloc
                libelle="Rémunération"
                valeur={projetReel.montantFcfa ? formaterMontantFcfa(projetReel.montantFcfa) : "Apprentissage certifiant"}
              />
            </CorpsCarte>
          </Carte>

          {candidatureExistante ? (
            <Carte>
              <CorpsCarte className="space-y-2 text-center">
                <p className="text-sm text-texte-discret">Tu as déjà postulé sur ce projet.</p>
                <Insigne ton={
                  candidatureExistante.statut === "ACCEPTEE" ? "vert" :
                  candidatureExistante.statut === "REFUSEE" ? "rouge" :
                  candidatureExistante.statut === "RETIREE" ? "neutre" : "orange"
                }>
                  {candidatureExistante.statut.replace("_", " ")}
                </Insigne>
              </CorpsCarte>
            </Carte>
          ) : estEtudiant ? (
            placesRestantes > 0 ? (
              <FormulaireCandidature projetId={projetReel.id} titreProjet={projetReel.titre} />
            ) : (
              <Carte>
                <CorpsCarte className="text-center text-sm text-texte-discret">
                  Plus de place disponible.
                </CorpsCarte>
              </Carte>
            )
          ) : !session?.user?.id ? (
            <Link href="/inscription/etudiant" className="block">
              <Bouton apparence="accent" pleineLargeur taille="lg">
                Créer un compte pour postuler
              </Bouton>
            </Link>
          ) : null}
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

// ─────────────────────────────────────────────────────────────
// Rendu pour les projets de démonstration (non persistés en DB)
// ─────────────────────────────────────────────────────────────

function RenduDemo({ slug, demo }: { slug: string; demo: NonNullable<(typeof projetsDemo)[keyof typeof projetsDemo]> }) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link href="/projets" className="inline-flex items-center gap-1 text-sm text-jub-orange-600 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Tous les projets
      </Link>
      <header className="mt-4 mb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Insigne ton="neutre">{demo.organisation}</Insigne>
          <Insigne ton="vert">{LIBELLES_CATEGORIE[demo.categorie]}</Insigne>
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${COULEURS_MODE_REMUNERATION[demo.modeRemuneration]}`}>
            {LIBELLES_MODE_REMUNERATION[demo.modeRemuneration]}
          </span>
          <Insigne ton="jaune">Démonstration</Insigne>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{demo.titre}</h1>
        <p className="max-w-3xl text-lg text-texte-discret">{demo.resume}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Carte>
            <EnteteCarte><TitreCarte>Description du projet</TitreCarte></EnteteCarte>
            <CorpsCarte>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{demo.description}</div>
            </CorpsCarte>
          </Carte>
          <Carte>
            <EnteteCarte><TitreCarte>Livrables attendus</TitreCarte></EnteteCarte>
            <CorpsCarte>
              <ul className="space-y-2">
                {demo.livrables.map((l) => (
                  <li key={l} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-jub-orange-500" />
                    {l}
                  </li>
                ))}
              </ul>
            </CorpsCarte>
          </Carte>
          <Carte>
            <EnteteCarte><TitreCarte>Compétences attendues</TitreCarte></EnteteCarte>
            <CorpsCarte className="flex flex-wrap gap-2">
              {demo.competences.map((c) => (
                <Insigne key={c} ton="vert">{c}</Insigne>
              ))}
            </CorpsCarte>
          </Carte>
        </div>

        <aside className="space-y-4">
          <Carte>
            <CorpsCarte className="space-y-3">
              <Bloc libelle="Niveau" valeur={LIBELLES_NIVEAU_PROJET[demo.niveau]} />
              <Bloc libelle="Durée" valeur={formaterDureeJours(demo.duree)} />
              <Bloc libelle="Places dans l'équipe" valeur={`${demo.placesMax}`} />
              <Bloc libelle="Rémunération" valeur={demo.montant ? formaterMontantFcfa(demo.montant) : "Non rémunéré"} />
            </CorpsCarte>
          </Carte>
          <Carte>
            <CorpsCarte className="text-center text-sm text-texte-discret">
              <p className="font-medium text-texte">Projet de démonstration</p>
              <p className="mt-1">Ce projet est utilisé pour illustrer la plateforme. La candidature sera ouverte quand la cohorte 1 publiera ses vrais projets.</p>
            </CorpsCarte>
          </Carte>
          <p className="text-[10px] text-center font-mono text-texte-discret">slug: {slug}</p>
        </aside>
      </div>
    </section>
  );
}
