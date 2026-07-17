// Landing publique — migrée hors styles inline (fondation UI, sprint R1).
// Visuel identique à la maquette ; layout en classes Tailwind + tokens,
// photos via next/image (priorité hero, lazy pour le reste).

import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { urlsParRole } from "@/lib/role";
import { PHOTOS } from "@/lib/medias";
import { versApercu, SELECT_APERCU } from "@/lib/projet-apercu";
import { LienBouton } from "@/composants/ui/lien-bouton";
import { EtatVide } from "@/composants/ui/etat-vide";
import { Icon } from "@/composants/maquette/icones";
import { LignePrjet } from "@/composants/maquette/lignes-job";
import type { StatutProjet } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

const STATUTS_OUVERTS: StatutProjet[] = ["PUBLIE", "CANDIDATURES_OUVERTES", "EQUIPE_EN_CONSTITUTION"];

export default async function PageAccueil() {
  const session = await auth();
  const urlEspace = session?.user?.id ? urlsParRole(session.user.role).espace : null;

  const projets = await prisma.projet.findMany({
    where: { statut: { in: STATUTS_OUVERTS }, visibilite: "PUBLIQUE" },
    orderBy: { publieLe: "desc" },
    take: 3,
    select: SELECT_APERCU,
  });
  const apercus = projets.map(versApercu);

  return (
    <main className="fadein">
      <Hero urlEspace={urlEspace} />
      <JobsOuverts projets={apercus} />
      <Parcours />
      <CtaFinal urlEspace={urlEspace} />
    </main>
  );
}

// ── Hero ────────────────────────────────────────────────────────
function Hero({ urlEspace }: { urlEspace: string | null }) {
  return (
    <section className="relative -mt-16 flex min-h-screen items-end overflow-hidden text-white">
      <Image
        src={PHOTOS.hero}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover saturate-[0.85]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-sage-950/55 via-sage-950/40 to-sage-950/90" />

      <div className="relative mx-auto w-full max-w-[1180px] px-5 pb-16 pt-[120px]">
        <h1 className="mt-0 text-[clamp(2.75rem,8vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-white [text-shadow:0_4px_30px_rgba(0,0,0,0.3)]">
          L&apos;expérience pro
          <br />
          <span className="t-display text-[1.08em] text-orange-400">qui change tout.</span>
        </h1>

        <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
          <LienBouton
            href={urlEspace ?? "/inscription"}
            apparence="accent"
            taille="lg"
            iconeDroite={<Icon.Arrow size={16} />}
          >
            {urlEspace ? "Mon espace" : "Commencer"}
          </LienBouton>
          <LienBouton href="/projets" apparence="verre" iconeDroite={<Icon.Arrow size={14} />}>
            Voir les jobs
          </LienBouton>
        </div>
      </div>
    </section>
  );
}

// ── Jobs ouverts ────────────────────────────────────────────────
function JobsOuverts({ projets }: { projets: ReturnType<typeof versApercu>[] }) {
  return (
    <section className="mx-auto max-w-[1180px] px-5 pb-8 pt-16">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="m-0 flex items-center gap-2.5 text-[clamp(1.25rem,2vw,1.375rem)] font-semibold tracking-[-0.01em]">
          <Icon.Briefcase size={18} className="text-sage-500" />
          Jobs ouverts
        </h2>
        <Link href="/projets" className="t-small inline-flex items-center gap-1 font-semibold text-orange-600">
          Tout voir <Icon.Arrow size={13} />
        </Link>
      </div>
      {projets.length === 0 ? (
        <EtatVide
          icone={<Icon.Briefcase size={20} />}
          titre="Aucun job ouvert pour l'instant"
          description="De nouvelles missions arrivent régulièrement. Reviens vite !"
        />
      ) : (
        <div className="liste-bordee">
          {projets.map((p) => (
            <LignePrjet key={p.slug} projet={p} />
          ))}
        </div>
      )}
    </section>
  );
}

// ── Parcours ────────────────────────────────────────────────────
function Parcours() {
  const etapes = [
    { n: "01", icon: <Icon.Briefcase size={20} />, t: "Postuler", d: "Au job qui te parle", href: "/projets" },
    { n: "02", icon: <Icon.Kanban size={20} />, t: "Travailler", d: "Avec ton équipe et mentor", href: "/comment-ca-marche" },
    { n: "03", icon: <Icon.ShieldCheck size={20} />, t: "Certifier", d: "PDF + QR vérifiable", href: "/verifier" },
  ];
  return (
    <section className="mx-auto max-w-[1180px] px-5 pb-8 pt-14">
      <h2 className="mb-6 mt-0 flex items-center gap-2.5 text-[clamp(1.25rem,2vw,1.375rem)] font-semibold tracking-[-0.01em]">
        <Icon.Sparkles size={18} className="text-sage-500" />
        En 3 temps
      </h2>
      <div className="grid gap-3 md:grid-cols-3">
        {etapes.map((e) => (
          <Link
            key={e.n}
            href={e.href}
            className="lift carte flex cursor-pointer flex-col gap-3.5 rounded-2xl p-5 text-left no-underline"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage-700 text-orange-400">
                {e.icon}
              </div>
              <span className="t-display text-[22px] leading-none text-orange-600">{e.n}</span>
            </div>
            <div>
              <div className="text-base font-semibold">{e.t}</div>
              <div className="t-small mt-0.5">{e.d}</div>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600">
              Y aller <Icon.Arrow size={12} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── CTA final ───────────────────────────────────────────────────
function CtaFinal({ urlEspace }: { urlEspace: string | null }) {
  return (
    <section className="mx-auto max-w-[1180px] px-5 pb-8 pt-16">
      <div className="relative flex min-h-60 flex-wrap items-center justify-between gap-6 overflow-hidden rounded-[20px] px-7 py-12 text-white">
        <Image src={PHOTOS.campus} alt="" fill sizes="1180px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-sage-950/90 to-sage-950/70" />
        <div className="relative max-w-[540px]">
          <h2 className="m-0 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-white">
            Ton prochain job{" "}
            <span className="t-display text-[1.1em] text-orange-400">t&apos;attend.</span>
          </h2>
        </div>
        <div className="relative">
          <LienBouton
            href={urlEspace ?? "/inscription"}
            apparence="accent"
            taille="lg"
            iconeDroite={<Icon.Arrow size={16} />}
          >
            {urlEspace ? "Rejoindre mon espace" : "Créer mon compte"}
          </LienBouton>
        </div>
      </div>
    </section>
  );
}
