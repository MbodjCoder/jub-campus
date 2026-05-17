"use client";

// Portfolio étudiant — port 1:1 de la maquette (screens-app.jsx ·
// PagePortfolio + BlocKpiClick + ModalPartager).

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Icon } from "./icones";
import { Bouton, Avatar } from "./primitifs";
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
    <main className="fadein" style={{ padding: "8px 20px 32px", maxWidth: 800, margin: "0 auto" }}>
      {/* Identité */}
      <div
        style={{
          position: "relative",
          padding: "24px",
          borderRadius: 18,
          overflow: "hidden",
          background: "linear-gradient(135deg, var(--sage-900), var(--sage-800))",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.18,
            backgroundImage: `url(${PHOTOS.travail})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 90% 10%, color-mix(in oklab, var(--orange-500) 30%, transparent), transparent 55%)",
          }}
        />
        <div style={{ position: "relative", color: "white" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <Avatar nom={nomComplet} src={e.avatarUrl} size={64} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1
                style={{
                  fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  margin: 0,
                  color: "white",
                }}
              >
                {nomComplet}
              </h1>
              <div className="t-small" style={{ marginTop: 2, color: "var(--sage-100)" }}>
                {e.universite}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <Bouton variant="accent" taille="sm" onClick={() => setShowShare(true)} icon={<Icon.Share size={13} />}>
              Partager
            </Bouton>
            <Bouton
              as="a"
              href="/api/portfolio/pdf"
              variant="sombre"
              taille="sm"
              icon={<Icon.Download size={13} />}
            >
              PDF
            </Bouton>
            <Bouton
              as={Link}
              href="/app/profil/modifier"
              variant="sombre"
              taille="sm"
              icon={<Icon.FileText size={13} />}
            >
              Modifier
            </Bouton>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div
        style={{
          display: "grid",
          gap: 1,
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          marginTop: 20,
          background: "var(--bordure)",
          border: "1px solid var(--bordure)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <BlocKpi libelle="Certificats" valeur={e.jobs.length} icon={<Icon.ShieldCheck size={17} />} href="/app/certificats" />
        <BlocKpi libelle="Note" valeur={e.note} icon={<Icon.Star size={17} />} href="/app/mes-projets" />
        <BlocKpi libelle="Score JUB" valeur={e.scoreJub} icon={<Icon.TrendingUp size={17} />} href="/app" />
      </div>

      {/* Compétences */}
      <section style={{ marginTop: 36 }}>
        <SectionTitre icon={<Icon.Sparkles size={15} />}>Compétences</SectionTitre>
        {e.competences.length === 0 ? (
          <p className="t-small" style={{ marginTop: 12 }}>Aucune compétence ajoutée.</p>
        ) : (
          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            {e.competences.map((c) => (
              <div key={c.nom} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    flex: "0 0 120px",
                    fontSize: 13.5,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  {c.nom}
                  {c.valide ? <Icon.ShieldCheck size={11} style={{ color: "var(--orange-500)" }} /> : null}
                </div>
                <div style={{ flex: 1, height: 4, borderRadius: 999, background: "var(--sage-50)", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${(c.niveau / 5) * 100}%`,
                      height: "100%",
                      background: c.valide ? "var(--orange-500)" : "var(--sage-400)",
                    }}
                  />
                </div>
                <div className="t-xs t-discret" style={{ minWidth: 28, textAlign: "right" }}>
                  {c.niveau}/5
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Jobs réalisés */}
      <section style={{ marginTop: 36 }}>
        <SectionTitre icon={<Icon.Briefcase size={15} />}>Jobs réalisés</SectionTitre>
        {e.jobs.length === 0 ? (
          <p className="t-small" style={{ marginTop: 12 }}>Tes jobs certifiés apparaîtront ici.</p>
        ) : (
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gap: 1,
              background: "var(--bordure)",
              border: "1px solid var(--bordure)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {e.jobs.map((p) => (
              <Link
                key={p.numeroPublic}
                href={`/v/${p.numeroPublic}`}
                style={{
                  background: "var(--fond-eleve)",
                  border: 0,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{p.titre}</div>
                  <div className="t-xs t-discret">{p.organisation}</div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--orange-700)" }}>
                  {p.score.toFixed(1).replace(".", ",")}
                </span>
                <Icon.ChevronRight size={14} style={{ color: "var(--sage-400)" }} />
              </Link>
            ))}
          </div>
        )}
      </section>

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
      style={{
        padding: "20px 10px",
        background: "var(--fond-eleve)",
        border: 0,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 8,
      }}
    >
      <span
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: "var(--sage-700)",
          color: "var(--orange-400)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      <span style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1 }}>
        {valeur}
      </span>
      <span className="t-eyebrow">{libelle}</span>
    </Link>
  );
}

function SectionTitre({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <h2
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        margin: 0,
        fontSize: 17,
        fontWeight: 600,
        letterSpacing: "-0.015em",
        color: "var(--sage-900)",
      }}
    >
      {icon ? (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 30,
            height: 30,
            borderRadius: 9,
            background: "var(--sage-700)",
            color: "var(--orange-400)",
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
      ) : null}
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
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(20,26,19,0.5)" }} onClick={onClose} />
      <div style={{ position: "relative", width: "100%", maxWidth: 420, background: "white", borderRadius: 16, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0, letterSpacing: "-0.01em" }}>Partager mon portfolio</h2>
          <button
            onClick={onClose}
            style={{ background: "var(--sage-50)", border: 0, width: 32, height: 32, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <Icon.X size={16} />
          </button>
        </div>

        <div style={{ display: "flex", gap: 6, alignItems: "center", background: "var(--fond-eleve)", borderRadius: 10, padding: "8px 10px 8px 12px" }}>
          <span style={{ flex: 1, fontSize: 13, color: "var(--sage-700)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {url}
          </span>
          <Bouton variant="primaire" taille="sm" onClick={onCopy} icon={copie ? <Icon.Check size={12} /> : <Icon.Copy size={12} />}>
            {copie ? "Copié" : "Copier"}
          </Bouton>
        </div>

        <div className="t-eyebrow" style={{ marginTop: 18, marginBottom: 10 }}>
          Partager sur
        </div>
        <div style={{ display: "grid", gap: 6, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
          {partages.map((s) => (
            <a
              key={s.l}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 14px",
                borderRadius: 10,
                background: "var(--fond-eleve)",
                color: "var(--sage-800)",
                fontSize: 13.5,
                fontWeight: 600,
              }}
            >
              <span style={{ color: "var(--sage-600)" }}>{s.icon}</span> {s.l}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
