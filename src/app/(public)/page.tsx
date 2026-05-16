import Link from "next/link";
import Image from "next/image";
import { Bouton } from "@/composants/ui/bouton";
import { Carte, CorpsCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { cn } from "@/lib/utils";

// Photos Unsplash retenues (URLs stables, libres de droits).
const PHOTOS = {
  hero: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2400&q=85",
  etudiant: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80",
  entreprise: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
  mentor: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=80",
  ctaFinal: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2400&q=85",
} as const;

export default function PageAccueil() {
  return (
    <>
      <Hero />
      <BandeauChiffres />
      <SectionTroisPublics />
      <SectionFonctionnement />
      <SectionTypesProjets />
      <SectionPartenaires />
      <SectionAppelAction />
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative -mt-16 flex min-h-[92vh] items-center overflow-hidden pt-16">
      <Image
        src={PHOTOS.hero}
        alt="Étudiants travaillant en équipe"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-jub-vert-950/92 via-jub-vert-950/70 to-jub-vert-950/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-jub-vert-950/70 via-transparent to-jub-vert-950/20" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-2xl space-y-7 text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-jub-jaune-400" />
            Pilote UGB Saint-Louis · Phase 1
          </span>

          <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.04] tracking-tight">
            L&apos;expérience pro<br />
            <span className="bg-gradient-to-r from-jub-jaune-400 to-jub-jaune-500 bg-clip-text text-transparent">
              qui change tout.
            </span>
          </h1>

          <p className="max-w-xl text-lg text-white/85 sm:text-xl">
            Même sans réseau et sans stage classique, travaille sur de vrais projets,
            prouve tes compétences avec des certificats vérifiables et accède aux
            entreprises qui te cherchent.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/inscription/etudiant">
              <Bouton apparence="accent" taille="lg" className="shadow-2xl shadow-jub-jaune-500/40">
                Commencer gratuitement →
              </Bouton>
            </Link>
            <Link href="/comment-ca-marche">
              <Bouton
                apparence="contour"
                taille="lg"
                className="border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
              >
                Voir comment ça marche
              </Bouton>
            </Link>
          </div>

          <ul className="grid max-w-xl grid-cols-2 gap-x-6 gap-y-2 pt-4 text-sm text-white/75">
            {[
              "100% gratuit étudiants",
              "Certificats QR vérifiables",
              "Portfolio public partageable",
              "Mentorat intégré",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-jub-jaune-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:block">
        <div className="flex flex-col items-center gap-1 text-white/60 animate-pulse">
          <span className="text-[10px] uppercase tracking-widest">Découvrir</span>
          <span className="text-xl">↓</span>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Bandeau chiffres flottant
// ─────────────────────────────────────────────────────────────

function BandeauChiffres() {
  const chiffres = [
    { valeur: "1", libelle: "université pilote (UGB)" },
    { valeur: "7+", libelle: "universités prévues an 1" },
    { valeur: "100%", libelle: "gratuit étudiants" },
    { valeur: "QR", libelle: "vérification publique" },
  ];
  return (
    <section className="relative z-10 -mt-14 px-4 sm:px-6">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 rounded-2xl border border-bordure bg-fond-eleve p-6 shadow-xl shadow-jub-vert-950/5 sm:grid-cols-4 sm:gap-6 sm:p-8">
        {chiffres.map((c) => (
          <div key={c.libelle} className="text-center sm:text-left">
            <p className="text-3xl font-bold tracking-tight text-jub-vert-900 sm:text-4xl">{c.valeur}</p>
            <p className="mt-1 text-xs text-texte-discret sm:text-sm">{c.libelle}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// 3 publics avec images de fond
// ─────────────────────────────────────────────────────────────

function SectionTroisPublics() {
  const roles = [
    {
      tag: "ÉTUDIANTS",
      titre: "Prouve ce que tu sais faire.",
      desc: "Travaille sur des projets concrets, sois encadré par des pros, obtiens des certificats vérifiables et un portfolio public partageable sur LinkedIn.",
      href: "/inscription/etudiant",
      libelleLien: "Créer mon compte étudiant",
      image: PHOTOS.etudiant,
      gradient: "bg-gradient-to-br from-jub-vert-950/85 via-jub-vert-900/75 to-jub-vert-700/50",
      accent: "text-jub-jaune-400",
    },
    {
      tag: "ENTREPRISES",
      titre: "Sourcer mieux, recruter sûr.",
      desc: "Publie un projet, vois les étudiants travailler en conditions réelles, choisis tes futurs talents sur preuves — pas sur CV.",
      href: "/entreprises",
      libelleLien: "Découvrir nos offres",
      image: PHOTOS.entreprise,
      gradient: "bg-gradient-to-br from-violet-950/85 via-violet-900/75 to-violet-700/50",
      accent: "text-violet-200",
    },
    {
      tag: "MENTORS",
      titre: "Forme par la pratique.",
      desc: "Propose un projet, encadre une équipe, valide les compétences. Tes recommandations comptent dans le score JUB de l'étudiant.",
      href: "/inscription/mentor",
      libelleLien: "Devenir mentor",
      image: PHOTOS.mentor,
      gradient: "bg-gradient-to-br from-sky-950/85 via-sky-900/75 to-sky-700/50",
      accent: "text-sky-200",
    },
  ] as const;

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="mb-14 max-w-2xl">
        <Insigne ton="vert">Pour qui ?</Insigne>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Trois publics. Une même promesse.
        </h2>
        <p className="mt-3 text-texte-discret">
          Chaque acteur tient un rôle précis dans le cycle. Personne ne tire l&apos;autre vers le bas.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {roles.map((r) => (
          <Link key={r.tag} href={r.href} className="group block">
            <div className="relative h-full overflow-hidden rounded-2xl border border-bordure bg-jub-vert-950 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:shadow-jub-vert-950/20">
              <Image
                src={r.image}
                alt=""
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover opacity-40 transition-all duration-500 group-hover:scale-105 group-hover:opacity-50"
              />
              <div className={cn("absolute inset-0", r.gradient)} />
              <div className="relative z-10 flex h-full min-h-[320px] flex-col p-7 text-white">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-sm">
                  <span className={cn("h-1 w-1 rounded-full", r.accent.replace("text-", "bg-"))} />
                  {r.tag}
                </span>
                <h3 className="mt-5 text-2xl font-semibold leading-tight">{r.titre}</h3>
                <p className="mt-3 flex-1 text-sm text-white/80">{r.desc}</p>
                <span className={cn("mt-6 inline-flex items-center gap-1.5 text-sm font-medium transition-transform group-hover:translate-x-1", r.accent)}>
                  {r.libelleLien} <span aria-hidden>→</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Comment ça marche — timeline horizontale
// ─────────────────────────────────────────────────────────────

function SectionFonctionnement() {
  const etapes = [
    { num: "01", titre: "Crée ton profil", desc: "Université, niveau, compétences, objectifs. Cinq minutes." },
    { num: "02", titre: "Postule à un projet", desc: "Catalogue filtré par domaine, niveau, durée, rémunération." },
    { num: "03", titre: "Travaille avec l'équipe", desc: "Kanban tâches, livrables, feedback du mentor — tout au même endroit." },
    { num: "04", titre: "Reçois ton certificat", desc: "PDF + QR vérifiable publiquement. Portfolio mis à jour automatiquement." },
  ];

  return (
    <section className="relative border-y border-bordure bg-jub-pierre-100 py-24">
      <div className="absolute inset-0 -z-0 opacity-30 [background:radial-gradient(circle_at_top_left,_var(--jub-vert-200),_transparent_50%),radial-gradient(circle_at_bottom_right,_var(--jub-jaune-400)_-30%,_transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-16 max-w-2xl">
          <Insigne ton="vert">Comment ça marche</Insigne>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            De la candidature au certificat, en quatre temps.
          </h2>
        </div>

        <ol className="relative grid gap-8 lg:grid-cols-4 lg:gap-4">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-jub-vert-300 to-transparent lg:block" />
          {etapes.map((e, i) => (
            <li key={e.num} className="relative">
              <div className="relative z-10 mb-5 flex items-center gap-3 lg:block">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-jub-vert-900 text-lg font-bold text-white shadow-lg shadow-jub-vert-900/30 ring-4 ring-jub-pierre-100">
                  {e.num}
                </span>
                {i < etapes.length - 1 ? (
                  <span aria-hidden className="h-px flex-1 bg-jub-vert-300 lg:hidden" />
                ) : null}
              </div>
              <h3 className="text-lg font-semibold tracking-tight">{e.titre}</h3>
              <p className="mt-1.5 text-sm text-texte-discret">{e.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// 4 modes de rémunération — cards gradient distinctes
// ─────────────────────────────────────────────────────────────

function SectionTypesProjets() {
  const types = [
    {
      tag: "APPRENTISSAGE",
      titre: "Apprentissage certifiant",
      desc: "Court, encadré, certifié. L'option idéale pour démarrer.",
      gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
      accent: "text-emerald-700 border-emerald-200 bg-emerald-50",
    },
    {
      tag: "PRIME",
      titre: "Avec prime",
      desc: "Récompense forfaitaire à la fin si le projet est livré.",
      gradient: "from-amber-400/10 via-amber-400/5 to-transparent",
      accent: "text-amber-700 border-amber-200 bg-amber-50",
    },
    {
      tag: "RÉMUNÉRÉ",
      titre: "Rémunéré",
      desc: "Payé par une entreprise. Pour projets à forte valeur ajoutée.",
      gradient: "from-violet-500/10 via-violet-500/5 to-transparent",
      accent: "text-violet-700 border-violet-200 bg-violet-50",
    },
    {
      tag: "SPONSORISÉ",
      titre: "Sponsorisé",
      desc: "Financé par une ONG, institution ou fondation thématique.",
      gradient: "from-sky-500/10 via-sky-500/5 to-transparent",
      accent: "text-sky-700 border-sky-200 bg-sky-50",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="mb-14 max-w-2xl">
        <Insigne ton="vert">Quatre modes</Insigne>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Tous les projets ne se valent pas.<br className="hidden sm:inline" /> Et c&apos;est tant mieux.
        </h2>
        <p className="mt-3 text-texte-discret">
          La rémunération est transparente sur chaque projet. Aucun étudiant ne paie jamais JUB Campus.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {types.map((t) => (
          <div
            key={t.tag}
            className="relative overflow-hidden rounded-xl border border-bordure bg-fond-eleve p-6 transition-all hover:-translate-y-1 hover:border-jub-vert-500 hover:shadow-lg"
          >
            <div className={cn("absolute inset-0 -z-0 bg-gradient-to-br", t.gradient)} />
            <div className="relative z-10 space-y-3">
              <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", t.accent)}>
                {t.tag}
              </span>
              <h3 className="text-lg font-semibold tracking-tight">{t.titre}</h3>
              <p className="text-sm text-texte-discret">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Partenaires
// ─────────────────────────────────────────────────────────────

function SectionPartenaires() {
  const partenaires = ["UGB", "Sonatel", "Wave", "Orange Digital", "Sococim", "Min. ESRI", "ODC", "UCAD"];
  return (
    <section className="border-t border-bordure bg-fond-eleve py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <Insigne ton="vert">Premiers partenaires</Insigne>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Construit avec les acteurs sérieux de l&apos;écosystème sénégalais.
            </h2>
          </div>
          <Link href="/contact" className="text-sm font-medium text-jub-vert-700 hover:underline">
            Devenir partenaire →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {partenaires.map((p) => (
            <div
              key={p}
              className="flex h-20 items-center justify-center rounded-xl border border-bordure bg-fond text-sm font-semibold tracking-tight text-jub-pierre-700 transition-all hover:border-jub-vert-300 hover:bg-jub-vert-50"
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Appel à action final
// ─────────────────────────────────────────────────────────────

function SectionAppelAction() {
  return (
    <section className="relative overflow-hidden bg-jub-vert-950 text-white">
      <Image
        src={PHOTOS.ctaFinal}
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-jub-vert-950 via-jub-vert-950/95 to-jub-vert-900/70" />
      <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_top_right,_var(--jub-jaune-500),_transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Ton prochain projet t&apos;attend.
        </h2>
        <p className="mt-4 text-lg text-jub-vert-100">
          Crée ton compte gratuit, ajoute tes compétences, postule au premier projet qui te parle.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/inscription/etudiant">
            <Bouton apparence="accent" taille="lg" className="shadow-xl shadow-jub-jaune-500/40">
              Je crée mon compte
            </Bouton>
          </Link>
          <Link href="/projets">
            <Bouton
              apparence="contour"
              taille="lg"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
            >
              Voir les projets
            </Bouton>
          </Link>
        </div>
      </div>
    </section>
  );
}
