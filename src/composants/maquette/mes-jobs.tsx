"use client";

// Mes jobs — port 1:1 de la maquette (screens-app.jsx · PageMesProjets +
// ProjetEnCoursInline + VueKanban + VueLivrables + VueFeedback +
// ListeCandidatures + ListeProjetsTermines). Données réelles en props ;
// la gestion fine des tâches/livrables se fait dans l'espace complet.

import { useState } from "react";
import Link from "next/link";
import { Icon } from "./icones";
import { fmt } from "./format";
import { Bouton, Avatar } from "./primitifs";

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
    <main className="fadein" style={{ padding: "8px 20px 32px", maxWidth: 1180, margin: "0 auto" }}>
      <h1 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2rem)", fontWeight: 600, letterSpacing: "-0.025em", margin: 0 }}>
        Mes jobs
      </h1>

      <div
        style={{
          marginTop: 20,
          marginBottom: 24,
          display: "inline-flex",
          gap: 4,
          background: "var(--sage-50)",
          borderRadius: 999,
          padding: 3,
        }}
      >
        {[
          { v: "en-cours", l: "En cours", count: enCours ? 1 : 0 },
          { v: "candidatures", l: "Candidatures", count: candidatures.length },
          { v: "termines", l: "Terminés", count: termines.length },
        ].map((o) => (
          <button
            key={o.v}
            onClick={() => setOnglet(o.v)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              border: 0,
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              background: onglet === o.v ? "white" : "transparent",
              color: onglet === o.v ? "var(--sage-900)" : "var(--sage-600)",
              boxShadow: onglet === o.v ? "var(--ombre-xs)" : "none",
              cursor: "pointer",
            }}
          >
            {o.l} <span style={{ fontSize: 11, color: "var(--sage-400)" }}>{o.count}</span>
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
      <div
        style={{
          padding: 64,
          textAlign: "center",
          border: "1px solid var(--bordure)",
          borderRadius: 14,
          background: "var(--fond-eleve)",
        }}
      >
        <p className="t-small" style={{ margin: "0 0 14px" }}>
          Aucun job en cours. Postule à un job pour démarrer.
        </p>
        <Bouton as={Link} href="/projets" variant="accent">
          Découvrir les jobs
        </Bouton>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div className="t-xs t-discret">{p.organisation}</div>
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: "4px 0 0", letterSpacing: "-0.01em" }}>{p.titre}</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "flex" }}>
            {p.equipe.map((m, i) => (
              <span key={m.nom + i} style={{ marginLeft: i === 0 ? 0 : -8 }}>
                <Avatar nom={m.nom} size={28} />
              </span>
            ))}
          </span>
          <Bouton as={Link} href={`/app/projet/${p.id}`} variant="fantome" taille="sm" icon={<Icon.ArrowUpRight size={13} />}>
            Espace complet
          </Bouton>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ height: 4, borderRadius: 999, background: "var(--sage-50)", overflow: "hidden" }}>
          <div style={{ width: `${(p.jourActuel / p.duree) * 100}%`, height: "100%", background: "var(--orange-500)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span className="t-xs t-discret">
            J{p.jourActuel} / {p.duree}
          </span>
          <span className="t-xs t-discret">{Math.round((p.jourActuel / p.duree) * 100)}%</span>
        </div>
      </div>

      <div style={{ marginBottom: 18, display: "inline-flex", gap: 4 }}>
        {[
          { v: "kanban", l: "Tâches" },
          { v: "livrables", l: "Livrables", count: p.livrables.length },
          { v: "feedback", l: "Mentor" },
        ].map((o) => (
          <button
            key={o.v}
            onClick={() => setSousonglet(o.v)}
            style={{
              padding: "6px 0",
              marginRight: 18,
              background: "transparent",
              border: 0,
              borderBottom: "2px solid " + (sousonglet === o.v ? "var(--orange-500)" : "transparent"),
              fontSize: 13.5,
              fontWeight: 600,
              color: sousonglet === o.v ? "var(--sage-900)" : "var(--sage-600)",
              cursor: "pointer",
              marginBottom: -1,
            }}
          >
            {o.l}
            {o.count ? <span style={{ marginLeft: 5, color: "var(--sage-400)" }}>{o.count}</span> : null}
          </button>
        ))}
      </div>
      <div style={{ borderTop: "1px solid var(--bordure)", paddingTop: 18 }}>
        {sousonglet === "kanban" ? <VueKanban projet={p} /> : null}
        {sousonglet === "livrables" ? <VueLivrables projet={p} /> : null}
        {sousonglet === "feedback" ? <VueFeedback projet={p} /> : null}
      </div>
    </div>
  );
}

function VueKanban({ projet: p }: { projet: ProjetEnCours }) {
  const colonnes = [
    { id: "A_FAIRE", titre: "À faire" },
    { id: "EN_COURS", titre: "En cours" },
    { id: "EN_REVUE", titre: "En revue" },
    { id: "TERMINEE", titre: "Terminé" },
  ];
  return (
    <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr" }} className="kanban-grid">
      {colonnes.map((col) => {
        const taches = p.taches.filter((t) => t.statut === col.id);
        return (
          <div key={col.id}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, padding: "0 4px" }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background:
                    col.id === "A_FAIRE"
                      ? "var(--sage-300)"
                      : col.id === "EN_COURS"
                        ? "var(--orange-500)"
                        : col.id === "EN_REVUE"
                          ? "var(--sage-500)"
                          : "var(--sage-700)",
                }}
              />
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>{col.titre}</span>
              <span className="t-xs t-discret">{taches.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {taches.map((t) => (
                <div
                  key={t.id}
                  style={{ background: "white", border: "1px solid var(--bordure)", borderRadius: 10, padding: "12px 14px" }}
                >
                  <div style={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.35 }}>{t.titre}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                    <Avatar nom={t.assignee} size={20} />
                    {t.echeance ? <span className="t-xs t-discret">{fmt.dateCourt(t.echeance)}</span> : null}
                  </div>
                </div>
              ))}
              {taches.length === 0 ? (
                <div
                  style={{
                    padding: "12px 14px",
                    border: "1.5px dashed var(--bordure-forte)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "var(--sage-400)",
                  }}
                >
                  Vide
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
      <style>{`
        @media (min-width: 700px) { .kanban-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (min-width: 1100px) { .kanban-grid { grid-template-columns: repeat(4, 1fr) !important; } }
      `}</style>
    </div>
  );
}

function VueLivrables({ projet: p }: { projet: ProjetEnCours }) {
  return (
    <div>
      {p.livrables.length > 0 ? (
        <div
          style={{
            display: "grid",
            gap: 1,
            background: "var(--bordure)",
            border: "1px solid var(--bordure)",
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: 18,
          }}
        >
          {p.livrables.map((l) => (
            <div
              key={l.id}
              style={{ background: "var(--fond-eleve)", padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: l.statut === "VALIDE" ? "var(--orange-500)" : "var(--sage-100)",
                  color: l.statut === "VALIDE" ? "var(--sage-950)" : "var(--sage-700)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {l.statut === "VALIDE" ? <Icon.Check size={15} /> : <Icon.FileText size={15} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{l.titre}</div>
                <div className="t-xs t-discret">
                  {l.auteur} · {fmt.date(l.deposeLe)}
                </div>
              </div>
              <span className={l.statut === "VALIDE" ? "pilule pilule--orange" : "pilule pilule--ghost"}>
                {l.statut === "VALIDE" ? "Validé" : "En revue"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="t-small" style={{ marginBottom: 18 }}>Aucun livrable déposé.</p>
      )}

      <Link
        href={`/app/projet/${p.id}`}
        style={{
          width: "100%",
          padding: "14px 18px",
          border: "1.5px dashed var(--bordure-forte)",
          borderRadius: 12,
          background: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          color: "var(--sage-700)",
          fontWeight: 600,
          fontSize: 14,
          cursor: "pointer",
        }}
      >
        <Icon.Upload size={15} /> Déposer un livrable
      </Link>
    </div>
  );
}

function VueFeedback({ projet: p }: { projet: ProjetEnCours }) {
  return (
    <div style={{ maxWidth: 720 }}>
      {p.feedbacks.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {p.feedbacks.map((f) => (
            <div key={f.id} style={{ display: "flex", gap: 10, flexDirection: f.moi ? "row-reverse" : "row" }}>
              <Avatar nom={f.auteur} size={28} />
              <div style={{ maxWidth: "80%" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 4,
                    flexDirection: f.moi ? "row-reverse" : "row",
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{f.auteur}</span>
                  <span className="t-xs t-discret">· {fmt.dateCourt(f.date)}</span>
                </div>
                <div
                  style={{
                    background: f.moi ? "var(--sage-700)" : "var(--fond-eleve)",
                    color: f.moi ? "white" : "var(--texte)",
                    padding: "10px 14px",
                    borderRadius: 14,
                    borderTopRightRadius: f.moi ? 4 : 14,
                    borderTopLeftRadius: f.moi ? 14 : 4,
                    fontSize: 13.5,
                    lineHeight: 1.5,
                  }}
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

      <div style={{ marginTop: 20 }}>
        <Bouton as={Link} href={`/app/projet/${p.id}`} variant="primaire" icon={<Icon.Chat size={13} />}>
          Répondre dans l&apos;espace projet
        </Bouton>
      </div>
    </div>
  );
}

function ListeCandidatures({ candidatures }: { candidatures: CandidatureApercu[] }) {
  if (candidatures.length === 0) {
    return (
      <div style={{ padding: 64, textAlign: "center", border: "1px solid var(--bordure)", borderRadius: 12, background: "var(--fond-eleve)" }}>
        <p className="t-small">Aucune candidature envoyée.</p>
      </div>
    );
  }
  return (
    <div
      style={{
        display: "grid",
        gap: 1,
        background: "var(--bordure)",
        border: "1px solid var(--bordure)",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {candidatures.map((c, i) => (
        <div key={i} style={{ background: "var(--fond-eleve)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
          <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: 999, background: "var(--orange-500)", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{c.projet}</div>
            <div className="t-xs t-discret">
              {c.organisation} · postulée {fmt.ilYa(c.date)}
            </div>
          </div>
          <span className="pilule pilule--ghost">En attente</span>
        </div>
      ))}
    </div>
  );
}

function ListeProjetsTermines({ termines }: { termines: TermineApercu[] }) {
  if (termines.length === 0) {
    return (
      <div style={{ padding: 64, textAlign: "center", border: "1px solid var(--bordure)", borderRadius: 12, background: "var(--fond-eleve)" }}>
        <p className="t-small">Aucun job terminé pour l&apos;instant.</p>
      </div>
    );
  }
  return (
    <div
      style={{
        display: "grid",
        gap: 1,
        background: "var(--bordure)",
        border: "1px solid var(--bordure)",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {termines.map((p, i) => (
        <Link
          key={i}
          href={p.numeroPublic ? `/v/${p.numeroPublic}` : `/app/projet/${p.projetId}`}
          style={{
            background: "var(--fond-eleve)",
            border: 0,
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            textAlign: "left",
            cursor: "pointer",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{p.titre}</div>
            <div className="t-xs t-discret">{p.org}</div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--orange-700)" }}>
            {p.score.toFixed(1).replace(".", ",")}
          </span>
          {p.numeroPublic ? (
            <span className="pilule pilule--orange">
              <Icon.ShieldCheck size={11} /> Certifié
            </span>
          ) : null}
          <Icon.ChevronRight size={14} style={{ color: "var(--sage-400)" }} />
        </Link>
      ))}
    </div>
  );
}
