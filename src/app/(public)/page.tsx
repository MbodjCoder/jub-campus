// Landing — port 1:1 de la maquette (screens-public.jsx · Landing).
// setEcran → liens Next ; PROJETS mock → projets réels Prisma.

import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { urlsParRole } from "@/lib/role";
import { PHOTOS } from "@/lib/medias";
import { versApercu, SELECT_APERCU } from "@/lib/projet-apercu";
import { Bouton } from "@/composants/maquette/primitifs";
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
    <section
      style={{
        position: "relative",
        marginTop: -64,
        minHeight: "72vh",
        display: "flex",
        alignItems: "flex-end",
        color: "white",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${PHOTOS.hero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "saturate(0.85)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(20,26,19,0.55) 0%, rgba(20,26,19,0.40) 40%, rgba(20,26,19,0.88) 100%)",
        }}
      />

      <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", padding: "120px 20px 64px", width: "100%" }}>
        <h1
          style={{
            marginTop: 0,
            fontSize: "clamp(2.75rem, 8vw, 5.5rem)",
            fontWeight: 600,
            letterSpacing: "-0.035em",
            lineHeight: 0.98,
            color: "white",
            textShadow: "0 4px 30px rgba(0,0,0,0.3)",
          }}
        >
          L&apos;expérience pro
          <br />
          <span className="t-display" style={{ color: "var(--orange-400)", fontSize: "1.08em" }}>
            qui change tout.
          </span>
        </h1>

        <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", justifyContent: "flex-end" }}>
          <Bouton
            as={Link}
            href={urlEspace ?? "/inscription"}
            variant="accent"
            taille="lg"
            iconRight={<Icon.Arrow size={16} />}
          >
            {urlEspace ? "Mon espace" : "Commencer"}
          </Bouton>
          <Link
            href="/projets"
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.22)",
              color: "white",
              fontWeight: 600,
              fontSize: 14,
              padding: "12px 20px",
              borderRadius: 999,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            Voir les jobs <Icon.Arrow size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Jobs ouverts ────────────────────────────────────────────────
function JobsOuverts({ projets }: { projets: ReturnType<typeof versApercu>[] }) {
  return (
    <section style={{ padding: "64px 20px 32px", maxWidth: 1180, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
        <h2
          style={{
            fontSize: "clamp(1.25rem, 2vw, 1.375rem)",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Icon.Briefcase size={18} style={{ color: "var(--sage-500)" }} />
          Jobs ouverts
        </h2>
        <Link
          href="/projets"
          className="t-small"
          style={{
            background: "transparent",
            border: 0,
            color: "var(--orange-600)",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          Tout voir <Icon.Arrow size={13} />
        </Link>
      </div>
      {projets.length === 0 ? (
        <div className="carte" style={{ padding: 48, textAlign: "center" }}>
          <p className="t-small" style={{ margin: 0 }}>
            Aucun job ouvert pour l&apos;instant. Reviens vite&nbsp;!
          </p>
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
    <section style={{ padding: "56px 20px 32px", maxWidth: 1180, margin: "0 auto" }}>
      <h2
        style={{
          fontSize: "clamp(1.25rem, 2vw, 1.375rem)",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          margin: "0 0 24px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Icon.Sparkles size={18} style={{ color: "var(--sage-500)" }} />
        En 3 temps
      </h2>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "minmax(0, 1fr)" }} className="parcours-grid">
        {etapes.map((e) => (
          <Link
            key={e.n}
            href={e.href}
            className="lift"
            style={{
              textAlign: "left",
              cursor: "pointer",
              background: "var(--fond-eleve)",
              border: "1px solid var(--bordure)",
              borderRadius: 16,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "var(--sage-700)",
                  color: "var(--orange-400)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {e.icon}
              </div>
              <span className="t-display" style={{ fontSize: 22, color: "var(--orange-600)", lineHeight: 1 }}>
                {e.n}
              </span>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{e.t}</div>
              <div className="t-small" style={{ marginTop: 2 }}>
                {e.d}
              </div>
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                fontWeight: 600,
                color: "var(--orange-600)",
              }}
            >
              Y aller <Icon.Arrow size={12} />
            </span>
          </Link>
        ))}
      </div>
      <style>{`@media (min-width: 720px) { .parcours-grid { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; } }`}</style>
    </section>
  );
}

// ── CTA final ───────────────────────────────────────────────────
function CtaFinal({ urlEspace }: { urlEspace: string | null }) {
  return (
    <section style={{ padding: "64px 20px 32px", maxWidth: 1180, margin: "0 auto" }}>
      <div
        style={{
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          minHeight: 240,
          padding: "48px 28px",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${PHOTOS.campus})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(20,26,19,0.88), rgba(20,26,19,0.70))",
          }}
        />
        <div style={{ position: "relative", maxWidth: 540 }}>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 600,
              letterSpacing: "-0.025em",
              margin: 0,
              lineHeight: 1.05,
              color: "white",
            }}
          >
            Ton prochain job{" "}
            <span className="t-display" style={{ color: "var(--orange-400)", fontSize: "1.1em" }}>
              t&apos;attend.
            </span>
          </h2>
        </div>
        <div style={{ position: "relative" }}>
          <Bouton
            as={Link}
            href={urlEspace ?? "/inscription"}
            variant="accent"
            taille="lg"
            iconRight={<Icon.Arrow size={16} />}
          >
            {urlEspace ? "Rejoindre mon espace" : "Créer mon compte"}
          </Bouton>
        </div>
      </div>
    </section>
  );
}
