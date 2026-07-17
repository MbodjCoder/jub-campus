"use client";

// Catalogue jobs — filtrage client en mémoire, projets réels en props.
// Migré maquette → classes (.segmente, .filtre-jeton, .liste-bordee).

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { EtatVide } from "@/composants/ui/etat-vide";
import { Icon } from "./icones";
import { LigneCatalogue, type ProjetApercu } from "./lignes-job";

export interface ProjetCatalogue extends ProjetApercu {
  competences: string[];
  modeRemuneration: string;
  niveau: string;
  publieIlYa: number;
}

export function CatalogueProjets({
  projets,
  initialQ = "",
}: {
  projets: ProjetCatalogue[];
  initialQ?: string;
}) {
  const [q, setQ] = useState(initialQ);
  const [mode, setMode] = useState("");
  const [duree, setDuree] = useState("");
  const [niveau, setNiveau] = useState("");
  const [tri, setTri] = useState("match");

  const resultats = useMemo(() => {
    let r = projets.slice();
    if (q.trim().length >= 2) {
      const qq = q.toLowerCase();
      r = r.filter(
        (p) =>
          p.titre.toLowerCase().includes(qq) ||
          p.organisation.toLowerCase().includes(qq) ||
          p.competences.some((c) => c.toLowerCase().includes(qq)),
      );
    }
    if (mode) r = r.filter((p) => p.modeRemuneration === mode);
    if (niveau) r = r.filter((p) => p.niveau === niveau);
    if (duree === "court") r = r.filter((p) => p.duree <= 21);
    if (duree === "moyen") r = r.filter((p) => p.duree > 21 && p.duree <= 35);
    if (duree === "long") r = r.filter((p) => p.duree > 35);
    if (tri === "match") r.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
    if (tri === "recent") r.sort((a, b) => a.publieIlYa - b.publieIlYa);
    if (tri === "remuneration") r.sort((a, b) => (b.montant || 0) - (a.montant || 0));
    return r;
  }, [projets, q, mode, niveau, duree, tri]);

  const aFiltres = q || mode || niveau || duree;

  return (
    <main className="fadein mx-auto max-w-[1180px] px-5 pb-16 pt-6">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="m-0 text-[clamp(1.5rem,3.5vw,2rem)] font-semibold tracking-[-0.025em]">
          Jobs <span className="t-discret font-normal">· {resultats.length}</span>
        </h1>
        <div className="segmente" role="group" aria-label="Trier les jobs">
          {[
            { v: "match", l: "Pour moi" },
            { v: "recent", l: "Récents" },
            { v: "remuneration", l: "Mieux payés" },
          ].map((o) => (
            <button
              key={o.v}
              onClick={() => setTri(o.v)}
              className={cn("segmente-btn", tri === o.v && "segmente-btn--actif")}
              aria-pressed={tri === o.v}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 grid gap-2.5">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-texte-discret">
            <Icon.Search size={15} />
          </span>
          <input
            className="champ pl-9"
            placeholder="Rechercher un job, une entreprise, une compétence…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <FiltreGroupe
          libelle="Rémunération"
          valeur={mode}
          setValeur={setMode}
          options={[
            { v: "", l: "Toutes" },
            { v: "APPRENTISSAGE", l: "Apprentissage" },
            { v: "PRIME", l: "Avec prime" },
            { v: "REMUNERE", l: "Rémunéré" },
            { v: "SPONSORISE", l: "Sponsorisé" },
          ]}
        />
        <FiltreGroupe
          libelle="Niveau"
          valeur={niveau}
          setValeur={setNiveau}
          options={[
            { v: "", l: "Tous" },
            { v: "DEBUTANT", l: "Débutant" },
            { v: "INTERMEDIAIRE", l: "Intermédiaire" },
            { v: "AVANCE", l: "Avancé" },
          ]}
        />
        <FiltreGroupe
          libelle="Durée"
          valeur={duree}
          setValeur={setDuree}
          options={[
            { v: "", l: "Toutes" },
            { v: "court", l: "≤ 3 sem." },
            { v: "moyen", l: "3–5 sem." },
            { v: "long", l: "> 5 sem." },
          ]}
        />

        {aFiltres ? (
          <button
            onClick={() => {
              setQ("");
              setMode("");
              setNiveau("");
              setDuree("");
            }}
            className="t-xs mt-0.5 inline-flex cursor-pointer items-center gap-1 self-start border-0 bg-transparent font-semibold text-orange-600"
          >
            <Icon.X size={12} /> Effacer tous les filtres
          </button>
        ) : null}
      </div>

      {resultats.length === 0 ? (
        <EtatVide
          icone={<Icon.Search size={20} />}
          titre="Aucun job ne correspond"
          description="Essaie d'élargir tes filtres ou de modifier ta recherche."
        />
      ) : (
        <div className="liste-bordee">
          {resultats.map((p) => (
            <LigneCatalogue key={p.slug} projet={p} />
          ))}
        </div>
      )}
    </main>
  );
}

function FiltreGroupe({
  libelle,
  valeur,
  setValeur,
  options,
}: {
  libelle: string;
  valeur: string;
  setValeur: (v: string) => void;
  options: { v: string; l: string }[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={libelle}>
      <span className="t-eyebrow min-w-[100px]">{libelle}</span>
      {options.map((o) => (
        <button
          key={o.v}
          onClick={() => setValeur(o.v)}
          className={cn("filtre-jeton", valeur === o.v && "filtre-jeton--actif")}
          aria-pressed={valeur === o.v}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}
