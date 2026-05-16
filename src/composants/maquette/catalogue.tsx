"use client";

// Catalogue jobs — port 1:1 de la maquette (screens-public-2.jsx ·
// PageCatalogueProjets + FiltreGroupe). Filtrage client en mémoire,
// identique à la maquette ; PROJETS mock → projets réels en props.

import { useState, useMemo } from "react";
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
    <main className="fadein" style={{ maxWidth: 1180, margin: "0 auto", padding: "24px 20px 64px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <h1 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2rem)", fontWeight: 600, letterSpacing: "-0.025em", margin: 0 }}>
          Jobs <span className="t-discret" style={{ fontWeight: 400 }}>· {resultats.length}</span>
        </h1>
        <div style={{ display: "flex", gap: 4, background: "var(--sage-50)", borderRadius: 999, padding: 3 }}>
          {[
            { v: "match", l: "Pour moi" },
            { v: "recent", l: "Récents" },
            { v: "remuneration", l: "Mieux payés" },
          ].map((o) => (
            <button
              key={o.v}
              onClick={() => setTri(o.v)}
              style={{
                padding: "6px 12px",
                border: 0,
                borderRadius: 999,
                fontSize: 12.5,
                fontWeight: 600,
                background: tri === o.v ? "white" : "transparent",
                color: tri === o.v ? "var(--sage-900)" : "var(--sage-600)",
                boxShadow: tri === o.v ? "var(--ombre-xs)" : "none",
                cursor: "pointer",
              }}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 18, display: "grid", gap: 10 }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--texte-discret)" }}>
            <Icon.Search size={15} />
          </span>
          <input
            className="champ"
            style={{ paddingLeft: 38 }}
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
            className="t-xs"
            style={{
              alignSelf: "flex-start",
              background: "transparent",
              border: 0,
              color: "var(--orange-600)",
              fontWeight: 600,
              marginTop: 2,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              cursor: "pointer",
            }}
          >
            <Icon.X size={12} /> Effacer tous les filtres
          </button>
        ) : null}
      </div>

      {resultats.length === 0 ? (
        <div
          style={{
            padding: 64,
            textAlign: "center",
            border: "1px solid var(--bordure)",
            borderRadius: 14,
            background: "var(--fond-eleve)",
          }}
        >
          <p className="t-small">Aucun job ne correspond.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 1,
            background: "var(--bordure)",
            border: "1px solid var(--bordure)",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
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
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <span className="t-eyebrow" style={{ minWidth: 100 }}>
        {libelle}
      </span>
      {options.map((o) => (
        <button
          key={o.v}
          onClick={() => setValeur(o.v)}
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            fontSize: 12.5,
            fontWeight: 600,
            background: valeur === o.v ? "var(--sage-700)" : "transparent",
            color: valeur === o.v ? "white" : "var(--sage-700)",
            border: "1px solid " + (valeur === o.v ? "var(--sage-700)" : "var(--bordure)"),
            cursor: "pointer",
          }}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}
