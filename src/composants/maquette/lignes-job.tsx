"use client";

// Lignes de job — port 1:1 de la maquette (LignePrjet / LigneCatalogue).
// Conversion : <button onClick> → <Link>, survol JS conservé tel quel.

import Link from "next/link";
import { Icon } from "./icones";
import { fmt } from "./format";

export interface ProjetApercu {
  slug: string;
  image: string;
  organisation: string;
  categorieLibelle: string;
  titre: string;
  matchScore?: number | null;
  duree: number;
  montant: number | null;
}

export function LignePrjet({ projet: p }: { projet: ProjetApercu }) {
  return (
    <Link
      href={`/projets/${p.slug}`}
      style={{
        background: "var(--fond-eleve)",
        border: 0,
        padding: "14px 18px",
        textAlign: "left",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 16,
        transition: "background 120ms",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "white")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "var(--fond-eleve)")}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 10,
          flexShrink: 0,
          backgroundImage: `url(${p.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {p.matchScore != null && p.matchScore >= 80 ? (
          <span
            style={{
              position: "absolute",
              top: -5,
              right: -5,
              background: "var(--orange-500)",
              color: "var(--sage-950)",
              fontSize: 9,
              fontWeight: 800,
              padding: "2px 5px",
              borderRadius: 999,
              border: "2px solid var(--fond-eleve)",
            }}
          >
            {p.matchScore}%
          </span>
        ) : null}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="t-xs t-discret">
          {p.organisation} · {p.categorieLibelle}
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            marginTop: 2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {p.titre}
        </div>
      </div>
      <div className="hide-sm" style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span className="t-xs t-discret" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <Icon.Clock size={12} /> {fmt.duree(p.duree)}
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--sage-900)" }}>
          {p.montant != null ? fmt.fcfa(p.montant) : "Apprentissage"}
        </span>
      </div>
      <Icon.ChevronRight size={16} style={{ color: "var(--sage-400)", flexShrink: 0 }} />
    </Link>
  );
}

export function LigneCatalogue({ projet: p }: { projet: ProjetApercu }) {
  return (
    <Link
      href={`/projets/${p.slug}`}
      style={{
        background: "var(--fond-eleve)",
        border: 0,
        padding: "14px 18px",
        textAlign: "left",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 16,
        transition: "background 120ms",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "white")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "var(--fond-eleve)")}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 10,
          flexShrink: 0,
          backgroundImage: `url(${p.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {p.matchScore != null && p.matchScore >= 80 ? (
          <span
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              background: "var(--orange-500)",
              color: "var(--sage-950)",
              fontSize: 9.5,
              fontWeight: 800,
              padding: "2px 6px",
              borderRadius: 999,
              border: "2px solid var(--fond-eleve)",
            }}
          >
            {p.matchScore}%
          </span>
        ) : null}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="t-xs t-discret">
          {p.organisation} · {p.categorieLibelle}
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            marginTop: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {p.titre}
        </div>
      </div>
      <div className="hide-sm" style={{ display: "flex", alignItems: "center", gap: 18, flexShrink: 0 }}>
        <span className="t-xs t-discret" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <Icon.Clock size={12} /> {fmt.duree(p.duree)}
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--sage-900)", minWidth: 90, textAlign: "right" }}>
          {p.montant != null ? fmt.fcfa(p.montant) : "Apprentissage"}
        </span>
      </div>
      <Icon.ChevronRight size={16} style={{ color: "var(--sage-400)", flexShrink: 0 }} />
    </Link>
  );
}
