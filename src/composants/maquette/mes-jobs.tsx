"use client";

// Mes jobs — onglets En cours / Candidatures / Terminés. Données réelles
// en props ; gestion fine des tâches/livrables dans l'espace complet.
// Migré maquette → classes ; primitives ui/ ; BarreProgression ; EtatVide.

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar } from "@/composants/ui/avatar";
import { LienBouton } from "@/composants/ui/lien-bouton";
import { EtatVide } from "@/composants/ui/etat-vide";
import { BarreProgression } from "@/composants/ui/barre-progression";
import { PastilleStatut } from "@/composants/ui/pastille-statut";
import { Insigne } from "@/composants/ui/insigne";
import { Icon } from "./icones";
import { fmt } from "./format";

export interface TacheApercu {
  id: string;
  titre: string;
  statut: string;
  echeance: string | Date | null;
  assignee: string;
}
export interface LivrableApercu {
  id: string;
  titre: string;
  deposeLe: string | Date;
  statut: string;
  auteur: string;
}
export interface FeedbackApercu {
  id: string;
  auteur: string;
  date: string | Date;
  contenu: string;
  moi: boolean;
}
export interface ProjetEnCours {
  id: string;
  titre: string;
  organisation: string;
  jourActuel: number;
  duree: number;
  equipe: { nom: string; role: string }[];
  taches: TacheApercu[];
  livrables: LivrableApercu[];
  feedbacks: FeedbackApercu[];
}
export interface CandidatureApercu {
  projet: string;
  organisation: string;
  date: string | Date;
}
export interface TermineApercu {
  titre: string;
  org: string;
  score: number;
  numeroPublic: string | null;
  projetId: string;
}

interface Proprietes {
  enCours: ProjetEnCours | null;
  candidatures: CandidatureApercu[];
  termines: TermineApercu[];
}

export function MesJobs({ enCours, candidatures, termines }: Proprietes) {
  const [onglet, setOnglet] = useState("en-cours");

  return (
    <main className="fadein mx-auto max-w-[1180px] px-5 pb-8 pt-2">
      <h1 className="m-0 text-[clamp(1.5rem,3.5vw,2rem)] font-semibold tracking-[-0.025em]">
        Mes jobs
      </h1>

      <div className="segmente mb-6 mt-5 max-w-full flex-wrap" role="group" aria-label="Filtrer mes jobs">
        {[
          { v: "en-cours", l: "En cours", count: enCours ? 1 : 0 },
          { v: "candidatures", l: "Candidatures", count: candidatures.length },
          { v: "termines", l: "Terminés", count: termines.length },
        ].map((o) => (
          <button
            key={o.v}
            onClick={() => setOnglet(o.v)}
            className={cn("segmente-btn inline-flex items-center gap-1.5", onglet === o.v && "segmente-btn--actif")}
            aria-pressed={onglet === o.v}
          >
            {o.l} <span className="text-[11px] text-sage-400">{o.count}</span>
          </button>
        ))}
      </div>

      {onglet === "en-cours" ? <ProjetEnCoursInline projet={enCours} /> : null}
      {onglet === "candidatures" ? <ListeCandidatures candidatures={candidatures} /> : null}
      {onglet === "termines" ? <ListeProjetsTermines termines={termines} /> : null}
    </main>
  );
}

function ProjetEnCoursInline({ projet: p }: { projet: ProjetEnCours | null }) {
  const [sousonglet, setSousonglet] = useState("kanban");

  if (!p) {
    return (
      <EtatVide
        icone={<Icon.Kanban size={20} />}
        titre="Aucun job en cours"
        description="Postule à un job pour démarrer."
        action={
          <LienBouton href="/projets" apparence="accent">
            Découvrir les jobs
          </LienBouton>
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="t-xs t-discret">{p.organisation}</div>
          <h2 className="mb-0 mt-1 text-xl font-semibold tracking-[-0.01em]">{p.titre}</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex">
            {p.equipe.map((m, i) => (
              <span key={m.nom + i} className={i === 0 ? undefined : "-ml-2"}>
                <Avatar nom={m.nom} taille={28} />
              </span>
            ))}
          </span>
          <LienBouton
            href={`/app/projet/${p.id}`}
            apparence="fantome"
            taille="sm"
            icone={<Icon.ArrowUpRight size={13} />}
          >
            Espace complet
          </LienBouton>
        </div>
      </div>

      <div className="mb-5">
        <BarreProgression
          valeur={p.jourActuel}
          max={p.duree}
          accent
          etiquette="Avancement du job"
          className="h-1"
        />
        <div className="mt-1.5 flex justify-between">
          <span className="t-xs t-discret">
            J{p.jourActuel} / {p.duree}
          </span>
          <span className="t-xs t-discret">{Math.round((p.jourActuel / p.duree) * 100)}%</span>
        </div>
      </div>

      <div className="mb-[18px] inline-flex gap-1">
        {[
          { v: "kanban", l: "Tâches" },
          { v: "livrables", l: "Livrables", count: p.livrables.length },
          { v: "feedback", l: "Mentor" },
        ].map((o) => (
          <button
            key={o.v}
            onClick={() => setSousonglet(o.v)}
            className={cn(
              "-mb-px mr-[18px] cursor-pointer border-0 border-b-2 bg-transparent py-1.5 text-[13.5px] font-semibold",
              sousonglet === o.v
                ? "border-b-orange-500 text-sage-900"
                : "border-b-transparent text-sage-600",
            )}
            aria-pressed={sousonglet === o.v}
          >
            {o.l}
            {o.count ? <span className="ml-[5px] text-sage-400">{o.count}</span> : null}
          </button>
        ))}
      </div>
      <div className="border-t border-bordure pt-[18px]">
        {sousonglet === "kanban" ? <VueKanban projet={p} /> : null}
        {sousonglet === "livrables" ? <VueLivrables projet={p} /> : null}
        {sousonglet === "feedback" ? <VueFeedback projet={p} /> : null}
      </div>
    </div>
  );
}

const POINT_COLONNE: Record<string, string> = {
  A_FAIRE: "bg-sage-300",
  EN_COURS: "bg-orange-500",
  EN_REVUE: "bg-sage-500",
  TERMINEE: "bg-sage-700",
};

function VueKanban({ projet: p }: { projet: ProjetEnCours }) {
  const colonnes = [
    { id: "A_FAIRE", titre: "À faire" },
    { id: "EN_COURS", titre: "En cours" },
    { id: "EN_REVUE", titre: "En revue" },
    { id: "TERMINEE", titre: "Terminé" },
  ];
  return (
    <div className="grid gap-3 min-[700px]:grid-cols-2 min-[1100px]:grid-cols-4">
      {colonnes.map((col) => {
        const taches = p.taches.filter((t) => t.statut === col.id);
        return (
          <div key={col.id}>
            <div className="mb-2.5 flex items-center gap-2 px-1">
              <span className={cn("h-1.5 w-1.5 rounded-full", POINT_COLONNE[col.id])} />
              <span className="text-[12.5px] font-semibold">{col.titre}</span>
              <span className="t-xs t-discret">{taches.length}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {taches.map((t) => (
                <div key={t.id} className="rounded-[10px] border border-bordure bg-white px-3.5 py-3">
                  <div className="text-[13.5px] font-medium leading-[1.35]">{t.titre}</div>
                  <div className="mt-2.5 flex items-center justify-between">
                    <Avatar nom={t.assignee} taille={20} />
                    {t.echeance ? <span className="t-xs t-discret">{fmt.dateCourt(t.echeance)}</span> : null}
                  </div>
                </div>
              ))}
              {taches.length === 0 ? (
                <div className="rounded-lg border-[1.5px] border-dashed border-bordure-forte px-3.5 py-3 text-xs text-sage-400">
                  Vide
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function VueLivrables({ projet: p }: { projet: ProjetEnCours }) {
  return (
    <div>
      {p.livrables.length > 0 ? (
        <div className="liste-bordee mb-[18px] rounded-xl">
          {p.livrables.map((l) => (
            <div key={l.id} className="flex flex-wrap items-center gap-3.5 bg-fond-eleve px-[18px] py-3.5">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  l.statut === "VALIDE" ? "bg-orange-500 text-sage-950" : "bg-sage-100 text-sage-700",
                )}
              >
                {l.statut === "VALIDE" ? <Icon.Check size={15} /> : <Icon.FileText size={15} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{l.titre}</div>
                <div className="t-xs t-discret">
                  {l.auteur} · {fmt.date(l.deposeLe)}
                </div>
              </div>
              <PastilleStatut domaine="livrable" statut={l.statut} />
            </div>
          ))}
        </div>
      ) : (
        <p className="t-small mb-[18px]">Aucun livrable déposé.</p>
      )}

      <Link
        href={`/app/projet/${p.id}`}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-bordure-forte bg-transparent px-[18px] py-3.5 text-sm font-semibold text-sage-700 no-underline"
      >
        <Icon.Upload size={15} /> Déposer un livrable
      </Link>
    </div>
  );
}

function VueFeedback({ projet: p }: { projet: ProjetEnCours }) {
  return (
    <div className="max-w-[720px]">
      {p.feedbacks.length > 0 ? (
        <div className="flex flex-col gap-3.5">
          {p.feedbacks.map((f) => (
            <div key={f.id} className={cn("flex gap-2.5", f.moi && "flex-row-reverse")}>
              <Avatar nom={f.auteur} taille={28} />
              <div className="max-w-[80%]">
                <div className={cn("mb-1 flex items-center gap-1.5", f.moi && "flex-row-reverse")}>
                  <span className="text-xs font-semibold">{f.auteur}</span>
                  <span className="t-xs t-discret">· {fmt.dateCourt(f.date)}</span>
                </div>
                <div
                  className={cn(
                    "rounded-[14px] px-3.5 py-2.5 text-[13.5px] leading-normal",
                    f.moi
                      ? "rounded-tr bg-sage-700 text-white"
                      : "rounded-tl bg-fond-eleve text-texte",
                  )}
                >
                  {f.contenu}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="t-small">Aucun échange avec le mentor pour l&apos;instant.</p>
      )}

      <div className="mt-5">
        <LienBouton href={`/app/projet/${p.id}`} apparence="primaire" icone={<Icon.Chat size={13} />}>
          Répondre dans l&apos;espace projet
        </LienBouton>
      </div>
    </div>
  );
}

function ListeCandidatures({ candidatures }: { candidatures: CandidatureApercu[] }) {
  if (candidatures.length === 0) {
    return (
      <EtatVide
        icone={<Icon.Send size={20} />}
        titre="Aucune candidature envoyée"
        description="Ta prochaine mission commence par une candidature."
        action={
          <LienBouton href="/projets" apparence="accent">
            Voir les jobs ouverts
          </LienBouton>
        }
      />
    );
  }
  return (
    <div className="liste-bordee rounded-xl">
      {candidatures.map((c, i) => (
        <div key={i} className="flex flex-wrap items-center gap-3.5 bg-fond-eleve px-5 py-4">
          <span className="pulse-dot h-2 w-2 shrink-0 rounded-full bg-orange-500" />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold">{c.projet}</div>
            <div className="t-xs t-discret">
              {c.organisation} · postulée {fmt.ilYa(c.date)}
            </div>
          </div>
          <PastilleStatut domaine="candidature" statut="EN_ATTENTE" />
        </div>
      ))}
    </div>
  );
}

function ListeProjetsTermines({ termines }: { termines: TermineApercu[] }) {
  if (termines.length === 0) {
    return (
      <EtatVide
        icone={<Icon.ShieldCheck size={20} />}
        titre="Aucun job terminé pour l'instant"
        description="Chaque job terminé rejoint ton palmarès avec son certificat vérifiable."
      />
    );
  }
  return (
    <div className="liste-bordee rounded-xl">
      {termines.map((p, i) => (
        <Link
          key={i}
          href={p.numeroPublic ? `/v/${p.numeroPublic}` : `/app/projet/${p.projetId}`}
          className="flex flex-wrap items-center gap-3.5 bg-fond-eleve px-[18px] py-3.5 text-left no-underline text-inherit hover:bg-white"
        >
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold">{p.titre}</div>
            <div className="t-xs t-discret">{p.org}</div>
          </div>
          <span className="t-mono text-[13px] font-bold text-orange-700">
            {p.score.toFixed(1).replace(".", ",")}
          </span>
          {p.numeroPublic ? (
            <Insigne ton="orange">
              <Icon.ShieldCheck size={11} /> Certifié
            </Insigne>
          ) : null}
          <Icon.ChevronRight size={14} className="text-sage-400" />
        </Link>
      ))}
    </div>
  );
}
