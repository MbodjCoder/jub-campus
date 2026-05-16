import Link from "next/link";
import Image from "next/image";
import { Bouton } from "@/composants/ui/bouton";
import { Carte, CorpsCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { BandeauLogos } from "@/composants/site/bandeau-logos";
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
      <SectionTroisPublics />
      <SectionFonctionnement />
      <SectionTypesProjets />
      <SectionAppelAction />
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero — image plein écran + texte sage + stats + logos défilants
// ─────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative -mt-16 flex min-h-screen flex-col overflow-hidden">
      <Image
        src={PHOTOS.hero}
        alt="Étudiants travaillant en équipe"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Overlay sage uniforme pour respecter la direction artistique */}
      <div className="absolute inset-0 bg-jub-sage-900/85" />
      <div className="absolute inset-0 bg-gradient-to-b from-jub-sage-900/40 via-transparent to-jub-sage-900/60" />

      <div className="relative z-10 flex flex-1 flex-col pt-28 sm:pt-32">
        <div className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6">
          <h1
            className="text-[clamp(3rem,9vw,7.5rem)] font-bold leading-[1.02] tracking-tight text-jub-sage-500"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.25)" }}
          >
            L&apos;experience<br />
            Qui change tout&nbsp;!
          </h1>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/inscription/etudiant">
              <Bouton apparence="accent" taille="lg" className="shadow-2xl shadow-jub-orange-500/40">
                Commencer gratuitement →
              </Bouton>
            </Link>
            <Link href="/comment-ca-marche">
              <Bouton
                apparence="contour"
                taille="lg"
                className="border-jub-sage-100/30 bg-jub-sage-100/10 text-jub-sage-100 backdrop-blur-md hover:bg-jub-sage-100/20"
              >
                Comment ça marche
              </Bouton>
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-16 grid w-full max-w-7xl grid-cols-2 gap-6 px-4 pb-8 sm:px-6 sm:pb-12">
          <Stat valeur="+20 000" libelle="Partenaires" />
          <Stat valeur="+200" libelle="Emplois" />
        </div>

        <div className="border-t border-jub-sage-100/10 bg-jub-sage-900/60 backdrop-blur-sm">
          <BandeauLogos surFondSombre />
        </div>
      </div>
    </section>
  );
}

function Stat({ valeur, libelle }: { valeur: string; libelle: string }) {
  return (
    <div className="flex items-baseline justify-center gap-3 sm:justify-start sm:gap-4">
      <span className="text-[clamp(2rem,5vw,3.75rem)] font-bold tracking-tight text-jub-orange-500">
        {valeur}
      </span>
      <span className="text-[clamp(1rem,2.5vw,1.75rem)] font-medium italic text-jub-sage-100">
        {libelle}
      </span>
    </div>
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
      href: "/inscription/etudiant",
      libelleCta: "Créer mon compte",
      image: PHOTOS.etudiant,
      // Image bien visible : overlay sombre fin uniquement en bas (lisibilité texte)
      overlay: "bg-gradient-to-t from-jub-sage-950/90 via-jub-sage-900/40 to-jub-sage-900/10",
    },
    {
      tag: "ENTREPRISES",
      titre: "Sourcer mieux, recruter sûr.",
      href: "/entreprises",
      libelleCta: "Découvrir",
      image: PHOTOS.entreprise,
      overlay: "bg-gradient-to-t from-violet-950/90 via-violet-900/40 to-violet-900/10",
    },
    {
      tag: "MENTORS",
      titre: "Forme par la pratique.",
      href: "/inscription/mentor",
      libelleCta: "Devenir mentor",
      image: PHOTOS.mentor,
      overlay: "bg-gradient-to-t from-sky-950/90 via-sky-900/40 to-sky-900/10",
    },
  ] as const;

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="mb-14 max-w-2xl">
        <Insigne ton="vert">Pour qui ?</Insigne>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Trois publics. Une même promesse.
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {roles.map((r) => (
          <Link key={r.tag} href={r.href} className="group block focus-visible:outline-none">
            <article className="relative h-full min-h-[420px] overflow-hidden rounded-2xl border border-bordure bg-jub-sage-900 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:shadow-jub-sage-900/30 group-hover:ring-2 group-hover:ring-jub-orange-500/50">
              <Image
                src={r.image}
                alt=""
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay : sombre en bas pour lisibilité, transparent en haut pour voir l'image */}
              <div className={cn("absolute inset-0", r.overlay)} />

              <div className="relative z-10 flex h-full min-h-[420px] flex-col items-center p-6 text-center sm:p-7">
                {/* Tag : fond sage #5f6c57, texte orange #ffaa00, point logo JUB (orange + centre sage)
                    Pour changer la COULEUR DU TEXTE du tag, modifie la classe
                    text-jub-orange-500 ci-dessous (voir tableau dans la conversation
                    ou globals.css pour la liste complète des tokens). */}
                <span
                  className="inline-flex items-center gap-2 rounded-full bg-jub-sage-500 px-4 py-1.5 text-base font-extrabold uppercase tracking-wider text-jub-orange-500 shadow-xl backdrop-blur-md sm:text-lg"
                >
                  <span className="relative flex h-4 w-4 items-center justify-center rounded-full bg-jub-orange-500 sm:h-5 sm:w-5">
                    <span className="block h-1.5 w-1.5 rounded-full bg-jub-sage-500 sm:h-2 sm:w-2" />
                  </span>
                  {r.tag}
                </span>

                <div className="mt-auto flex flex-col items-center gap-4">
                  <h3
                    className="text-lg font-semibold italic leading-snug text-white sm:text-xl"
                    style={{ textShadow: "0 2px 14px rgba(0,0,0,0.55)" }}
                  >
                    {r.titre}
                  </h3>

                  <span
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-jub-orange-500 px-5 py-2.5 text-sm font-bold text-jub-sage-950 shadow-lg shadow-jub-orange-500/40 transition-all group-hover:bg-jub-orange-400 group-hover:shadow-xl group-hover:shadow-jub-orange-500/50"
                  >
                    {r.libelleCta} <span aria-hidden>→</span>
                  </span>
                </div>
              </div>
            </article>
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
      <div className="absolute inset-0 -z-0 opacity-30 [background:radial-gradient(circle_at_top_left,_var(--jub-sage-200),_transparent_50%),radial-gradient(circle_at_bottom_right,_var(--jub-orange-300)_-30%,_transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-16 max-w-2xl">
          <Insigne ton="vert">Comment ça marche</Insigne>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            De la candidature au certificat, en quatre temps.
          </h2>
        </div>

        <ol className="relative grid gap-8 lg:grid-cols-4 lg:gap-4">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-jub-sage-300 to-transparent lg:block" />
          {etapes.map((e, i) => (
            <li key={e.num} className="relative">
              <div className="relative z-10 mb-5 flex items-center gap-3 lg:block">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-jub-sage-700 text-lg font-bold text-white shadow-lg shadow-jub-sage-700/30 ring-4 ring-jub-pierre-100">
                  {e.num}
                </span>
                {i < etapes.length - 1 ? (
                  <span aria-hidden className="h-px flex-1 bg-jub-sage-300 lg:hidden" />
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
// 4 modes de rémunération
// ─────────────────────────────────────────────────────────────

function SectionTypesProjets() {
  const types = [
    {
      tag: "APPRENTISSAGE",
      titre: "Apprentissage certifiant",
      desc: "Court, encadré, certifié. L'option idéale pour démarrer.",
      gradient: "from-jub-sage-200/30 via-jub-sage-100/20 to-transparent",
      accent: "text-jub-sage-700 border-jub-sage-200 bg-jub-sage-50",
    },
    {
      tag: "PRIME",
      titre: "Avec prime",
      desc: "Récompense forfaitaire à la fin si le projet est livré.",
      gradient: "from-jub-orange-100/40 via-jub-orange-50/20 to-transparent",
      accent: "text-jub-orange-700 border-jub-orange-200 bg-jub-orange-50",
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
            className="relative overflow-hidden rounded-xl border border-bordure bg-fond-eleve p-6 transition-all hover:-translate-y-1 hover:border-jub-orange-300 hover:shadow-lg"
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
// Appel à action final
// ─────────────────────────────────────────────────────────────

function SectionAppelAction() {
  return (
    <section className="relative overflow-hidden bg-jub-sage-900 text-white">
      <Image
        src={PHOTOS.ctaFinal}
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-jub-sage-900 via-jub-sage-900/95 to-jub-sage-700/70" />
      <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_top_right,_var(--jub-orange-500),_transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Ton prochain projet t&apos;attend.
        </h2>
        <p className="mt-4 text-lg text-jub-sage-100">
          Crée ton compte gratuit, ajoute tes compétences, postule au premier projet qui te parle.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/inscription/etudiant">
            <Bouton apparence="accent" taille="lg" className="shadow-xl shadow-jub-orange-500/40">
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
