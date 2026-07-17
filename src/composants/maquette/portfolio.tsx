"use client";

// Portfolio étudiant — identité, KPIs, compétences, jobs certifiés, partage.
// Migré maquette → classes ; FeuilleModale ; BarreProgression ; primitives ui/.

import { useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Bouton } from "@/composants/ui/bouton";
import { LienBouton } from "@/composants/ui/lien-bouton";
import { BarreProgression } from "@/composants/ui/barre-progression";
import { FeuilleModale } from "@/composants/ui/feuille-modale";
import { Icon } from "./icones";
import { AvatarModifiable } from "@/composants/site/avatar-modifiable";
import { PHOTOS } from "@/lib/medias";

export interface PortfolioData {
  prenom: string;
  nom: string;
  slug: string;
  scoreJub: number;
  avatarUrl: string | null;
  universite: string;
  note: string;
  competences: { nom: string; niveau: number; valide: boolean }[];
  jobs: { numeroPublic: string; titre: string; organisation: string; score: number }[];
}

export function MonPortfolio({ data: e }: { data: PortfolioData }) {
  const [showShare, setShowShare] = useState(false);
  const nomComplet = `${e.prenom} ${e.nom}`;

  return (
    <main className="fadein mx-auto max-w-[800px] px-5 pb-8 pt-2">
      {/* Identité */}
      <div className="relative overflow-hidden rounded-[18px] bg-gradient-to-br from-sage-900 to-sage-800 p-6">
        <Image src={PHOTOS.travail} alt="" fill sizes="800px" className="object-cover opacity-[0.18]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(255,170,0,0.3),transparent_55%)]" />
        <div className="relative text-white">
          <div className="flex flex-wrap items-center gap-4">
            <AvatarModifiable nom={nomComplet} src={e.avatarUrl} taille={64} />
            <div className="min-w-0 flex-1">
              <h1 className="m-0 text-[clamp(1.25rem,3vw,1.75rem)] font-semibold tracking-[-0.02em] text-white">
                {nomComplet}
              </h1>
              <div className="t-small mt-0.5 text-sage-100">{e.universite}</div>
            </div>
          </div>

          <div className="mt-[18px] flex flex-wrap justify-end gap-2">
            <Bouton apparence="accent" taille="sm" onClick={() => setShowShare(true)}>
              <Icon.Share size={13} /> Partager
            </Bouton>
            <a href="/api/portfolio/pdf" className="btn btn--sombre btn--sm">
              <Icon.Download size={13} /> PDF
            </a>
            <LienBouton href="/app/profil/modifier" apparence="sombre" taille="sm" icone={<Icon.FileText size={13} />}>
              Modifier
            </LienBouton>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="liste-bordee mt-5 grid-cols-3 rounded-xl">
        <BlocKpi libelle="Certificats" valeur={e.jobs.length} icon={<Icon.ShieldCheck size={17} />} href="/app/certificats" />
        <BlocKpi libelle="Note" valeur={e.note} icon={<Icon.Star size={17} />} href="/app/mes-projets" />
        <BlocKpi libelle="Score JUB" valeur={e.scoreJub} icon={<Icon.TrendingUp size={17} />} href="/app" />
      </div>

      {/* Compétences + Jobs réalisés — alignés horizontalement */}
      <div className="mt-9 grid gap-7 md:grid-cols-2">
        <section>
          <SectionTitre icon={<Icon.Sparkles size={18} />}>Compétences</SectionTitre>
          {e.competences.length === 0 ? (
            <p className="t-small mt-3">Aucune compétence ajoutée.</p>
          ) : (
            <div className="mt-3 grid gap-2.5">
              {e.competences.map((c) => (
                <div key={c.nom} className="flex flex-wrap items-center gap-3.5">
                  <div className="flex flex-[1_1_120px] items-center gap-[5px] text-[13.5px] font-medium">
                    {c.nom}
                    {c.valide ? <Icon.ShieldCheck size={11} className="text-orange-500" /> : null}
                  </div>
                  <BarreProgression
                    valeur={c.niveau}
                    max={5}
                    accent={c.valide}
                    etiquette={`Niveau en ${c.nom}`}
                    className={cn("h-1 min-w-[120px] flex-[1_1_140px]", !c.valide && "[&>span]:bg-sage-400")}
                  />
                  <div className="t-xs t-discret min-w-7 text-right">{c.niveau}/5</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Jobs réalisés */}
        <section>
          <SectionTitre icon={<Icon.Briefcase size={18} />}>Jobs réalisés</SectionTitre>
          {e.jobs.length === 0 ? (
            <p className="t-small mt-3">Tes jobs certifiés apparaîtront ici.</p>
          ) : (
            <div className="liste-bordee mt-3 rounded-xl">
              {e.jobs.map((p) => (
                <Link
                  key={p.numeroPublic}
                  href={`/v/${p.numeroPublic}`}
                  className="flex items-center gap-3.5 bg-fond-eleve px-4 py-3.5 text-left no-underline text-inherit hover:bg-white"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{p.titre}</div>
                    <div className="t-xs t-discret">{p.organisation}</div>
                  </div>
                  <span className="t-mono text-[13px] font-bold text-orange-700">
                    {p.score.toFixed(1).replace(".", ",")}
                  </span>
                  <Icon.ChevronRight size={14} className="text-sage-400" />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {showShare ? <ModalPartager slug={e.slug} onClose={() => setShowShare(false)} /> : null}
    </main>
  );
}

function BlocKpi({
  libelle, valeur, icon, href,
}: {
  libelle: string;
  valeur: ReactNode;
  icon: ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex cursor-pointer flex-col items-center justify-center gap-2 bg-fond-eleve px-2.5 py-5 text-center no-underline text-inherit hover:bg-white"
    >
      <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-sage-700 text-orange-400">
        {icon}
      </span>
      <span className="text-2xl font-semibold leading-none tracking-[-0.02em]">{valeur}</span>
      <span className="t-eyebrow">{libelle}</span>
    </Link>
  );
}

function SectionTitre({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <h2 className="m-0 flex items-center gap-2 text-[17px] font-semibold tracking-[-0.015em] text-sage-900">
      {icon ? <span className="inline-flex shrink-0 items-center justify-center text-sage-500">{icon}</span> : null}
      {children}
    </h2>
  );
}

function ModalPartager({ slug, onClose }: { slug: string; onClose: () => void }) {
  const url = `https://jubcampus.sn/u/${slug}`;
  const [copie, setCopie] = useState(false);
  const onCopy = () => {
    try {
      navigator.clipboard.writeText(url);
      setCopie(true);
      setTimeout(() => setCopie(false), 1800);
    } catch {
      /* presse-papiers indisponible */
    }
  };
  const partages = [
    { l: "WhatsApp", icon: <Icon.Whatsapp size={16} />, href: `https://wa.me/?text=${encodeURIComponent("Mon portfolio " + url)}` },
    { l: "LinkedIn", icon: <Icon.Linkedin size={16} />, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { l: "Facebook", icon: <Icon.Facebook size={16} />, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { l: "Email", icon: <Icon.Mail size={16} />, href: `mailto:?subject=Mon portfolio JUB&body=${encodeURIComponent(url)}` },
  ];
  return (
    <FeuilleModale onClose={onClose} titre="Partager mon portfolio" className="max-w-[420px]">
      <div className="flex items-center gap-1.5 rounded-[10px] bg-fond-eleve py-2 pl-3 pr-2.5">
        <span className="min-w-0 flex-1 truncate text-[13px] text-sage-700">{url}</span>
        <Bouton apparence="primaire" taille="sm" onClick={onCopy}>
          {copie ? <Icon.Check size={12} /> : <Icon.Copy size={12} />} {copie ? "Copié" : "Copier"}
        </Bouton>
      </div>

      <div className="t-eyebrow mb-2.5 mt-[18px]">Partager sur</div>
      <div className="grid grid-cols-2 gap-1.5">
        {partages.map((s) => (
          <a
            key={s.l}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-[10px] bg-fond-eleve px-3.5 py-3 text-[13.5px] font-semibold text-sage-800 no-underline hover:bg-sage-50"
          >
            <span className="text-sage-600">{s.icon}</span> {s.l}
          </a>
        ))}
      </div>
    </FeuilleModale>
  );
}
