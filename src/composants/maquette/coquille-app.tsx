"use client";

// Coquille de l'espace étudiant — port 1:1 de la maquette (screens-app.jsx ·
// ShellApp + TopBarApp + DrawerNotifications + ModalRecherche).
// setEcran → liens Next ; NOTIFICATIONS / PROJETS mock → données réelles.

import { useState, useRef, useEffect, useMemo, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "./icones";
import { fmt } from "./format";
import { Logo } from "./primitifs";
import type { ProjetApercu } from "./lignes-job";
import { MenuUtilisateur } from "@/composants/site/menu-utilisateur";
import { marquerToutesNotificationsLues } from "@/app/app/notifications/actions";
import type { Role } from "@/generated/prisma/client";

export interface NotifApercu {
  id: string;
  type: string;
  titre: string;
  lue: boolean;
  creeLe: string | Date;
  lien: string | null;
}

export interface SessionApp {
  id: string;
  nom: string | null;
  email: string | null;
  image: string | null;
  role: Role;
}

interface Proprietes {
  session: SessionApp;
  notifications: NotifApercu[];
  projetsRecherche: ProjetApercu[];
  children: ReactNode;
}

const LIENS = [
  { id: "/app", l: "Accueil", icon: <Icon.Home size={17} /> },
  { id: "/app/mes-projets", l: "Projets", icon: <Icon.Kanban size={17} /> },
  { id: "/app/profil", l: "Profil", icon: <Icon.Globe size={17} /> },
];

const TITRES: Record<string, string> = {
  "/app": "Tableau de bord",
  "/app/mes-projets": "Mes jobs",
  "/app/profil": "Mon profil",
};

export function CoquilleApp({
  session, notifications, projetsRecherche, children,
}: Proprietes) {
  const chemin = usePathname();
  const estActif = (id: string) => (id === "/app" ? chemin === "/app" : chemin.startsWith(id));

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--fond)" }}>
      <aside
        className="sidebar"
        style={{
          width: 224,
          flexShrink: 0,
          padding: 20,
          borderRight: "1px solid var(--bordure)",
          background: "var(--fond)",
          display: "none",
          flexDirection: "column",
          gap: 28,
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <Link href="/" style={{ background: "transparent", border: 0, padding: 0, display: "flex", alignItems: "center", gap: 10 }}>
          <Logo mot />
        </Link>

        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {LIENS.map((l) => {
            const actif = estActif(l.id);
            return (
              <Link
                key={l.id}
                href={l.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 10,
                  border: 0,
                  background: actif ? "var(--sage-700)" : "transparent",
                  color: actif ? "white" : "var(--sage-800)",
                  fontWeight: 500,
                  fontSize: 14,
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <span style={{ color: actif ? "var(--orange-400)" : "var(--sage-500)" }}>{l.icon}</span>
                <span>{l.l}</span>
              </Link>
            );
          })}
        </nav>

      </aside>

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <TopBarApp notifications={notifications} projetsRecherche={projetsRecherche} session={session} />
        <div style={{ flex: 1, paddingBottom: 96 }}>{children}</div>
      </div>

      <nav
        className="bottom-nav"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "white",
          borderTop: "1px solid var(--bordure)",
          display: "flex",
          justifyContent: "space-around",
          padding: "8px 0 18px",
          zIndex: 40,
        }}
      >
        {LIENS.map((l) => {
          const actif = estActif(l.id);
          return (
            <Link
              key={l.id}
              href={l.id}
              style={{
                background: "transparent",
                border: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                color: actif ? "var(--sage-900)" : "var(--sage-500)",
                padding: "4px 14px",
                cursor: "pointer",
              }}
            >
              <span style={{ color: actif ? "var(--orange-500)" : "inherit" }}>{l.icon}</span>
              <span style={{ fontSize: 10.5, fontWeight: actif ? 700 : 500 }}>{l.l.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>

      <style>{`
        @media (min-width: 900px) {
          .sidebar { display: flex !important; }
          .bottom-nav { display: none !important; }
        }
      `}</style>
    </div>
  );
}

// ── Top bar ─────────────────────────────────────────────────────
function TopBarApp({
  notifications, projetsRecherche, session,
}: {
  notifications: NotifApercu[];
  projetsRecherche: ProjetApercu[];
  session: SessionApp;
}) {
  const chemin = usePathname();
  const [notifOuvert, setNotifOuvert] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const nonLues = notifications.filter((n) => !n.lue).length;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        padding: "12px 20px",
        background: "var(--fond)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div className="topbar-mobile-logo" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Logo size="md" />
      </div>
      <h1 className="topbar-title" style={{ fontSize: 15, fontWeight: 600, margin: 0, display: "none" }}>
        {TITRES[chemin] ?? ""}
      </h1>

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <button
          onClick={() => setShowSearch(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            background: "white",
            border: "1px solid var(--bordure)",
            height: 36,
            padding: "0 12px",
            borderRadius: 999,
            color: "var(--sage-500)",
            cursor: "pointer",
            fontSize: 13,
            flexShrink: 0,
          }}
          className="search-button"
        >
          <Icon.Search size={15} /> <span className="hide-sm">Rechercher</span>
        </button>

        <button
          onClick={() => setNotifOuvert(true)}
          style={{
            background: nonLues > 0 ? "var(--orange-500)" : "white",
            color: nonLues > 0 ? "var(--sage-950)" : "var(--sage-700)",
            border: nonLues > 0 ? "1px solid var(--orange-500)" : "1px solid var(--bordure)",
            width: "auto",
            height: 36,
            padding: nonLues > 0 ? "0 12px" : 0,
            minWidth: 36,
            flexShrink: 0,
            borderRadius: 999,
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            cursor: "pointer",
            boxShadow: nonLues > 0 ? "0 4px 14px -4px color-mix(in oklab, var(--orange-500) 60%, transparent)" : "none",
          }}
          title={`${nonLues} notification${nonLues > 1 ? "s" : ""}`}
        >
          <Icon.Bell size={15} />
          {nonLues > 0 ? <span style={{ fontSize: 12, fontWeight: 800 }}>{nonLues}</span> : null}
        </button>

        {/* Menu profil — présent sur toutes les pages de l'espace.
            Accès : Mon espace, Mon profil, Mes certificats, Paramètres,
            Déconnexion. Point unique : pas de doublon dans la barre latérale. */}
        <MenuUtilisateur session={session} />
      </div>

      {notifOuvert ? <DrawerNotifications notifications={notifications} onClose={() => setNotifOuvert(false)} /> : null}
      {showSearch ? <ModalRecherche projets={projetsRecherche} onClose={() => setShowSearch(false)} /> : null}

      <style>{`
        @media (min-width: 900px) {
          .topbar-mobile-logo { display: none !important; }
          .topbar-title { display: block !important; flex: 1; }
          .search-button { min-width: 200px; }
        }
      `}</style>
    </header>
  );
}

// ── Drawer notifications ────────────────────────────────────────
function DrawerNotifications({
  notifications, onClose,
}: {
  notifications: NotifApercu[];
  onClose: () => void;
}) {
  const [enCours, demarrer] = useTransition();
  const nonLues = notifications.filter((n) => !n.lue).length;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(20,26,19,0.4)" }} onClick={onClose} />
      <div
        className="slidein"
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "100%",
          maxWidth: 380,
          background: "white",
          boxShadow: "-20px 0 60px -20px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: 18, borderBottom: "1px solid var(--bordure)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0, letterSpacing: "-0.01em" }}>Notifications</h2>
            <p className="t-xs t-discret" style={{ marginTop: 2 }}>{nonLues} nouvelles</p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "var(--sage-50)", border: 0, width: 32, height: 32, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <Icon.X size={16} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {notifications.length === 0 ? (
            <p className="t-small" style={{ padding: 40, textAlign: "center" }}>Aucune notification.</p>
          ) : (
            notifications.map((n) => {
              const corps = (
                <div
                  style={{
                    padding: "14px 18px",
                    borderBottom: "1px solid var(--bordure)",
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    background: n.lue ? "transparent" : "color-mix(in oklab, var(--orange-500) 6%, transparent)",
                    cursor: n.lien ? "pointer" : "default",
                  }}
                >
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      flexShrink: 0,
                      background: "var(--sage-700)",
                      color: "var(--orange-400)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconePourType type={n.type} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: n.lue ? 500 : 600, lineHeight: 1.4 }}>{n.titre}</div>
                    <div className="t-xs t-discret" style={{ marginTop: 4 }}>{fmt.ilYa(n.creeLe)}</div>
                  </div>
                  {!n.lue ? (
                    <span style={{ width: 7, height: 7, borderRadius: 999, background: "var(--orange-500)", marginTop: 6 }} />
                  ) : null}
                </div>
              );
              return n.lien ? (
                <Link key={n.id} href={n.lien} onClick={onClose}>
                  {corps}
                </Link>
              ) : (
                <div key={n.id}>{corps}</div>
              );
            })
          )}
        </div>
        <div style={{ padding: 14, borderTop: "1px solid var(--bordure)" }}>
          <button
            onClick={() => demarrer(async () => { await marquerToutesNotificationsLues(); onClose(); })}
            className="t-xs"
            disabled={enCours || nonLues === 0}
            style={{
              width: "100%",
              padding: "10px 12px",
              background: "transparent",
              border: 0,
              color: "var(--sage-700)",
              fontWeight: 600,
              cursor: "pointer",
              opacity: nonLues === 0 ? 0.5 : 1,
            }}
          >
            Tout marquer comme lu
          </button>
        </div>
      </div>
    </div>
  );
}

function IconePourType({ type }: { type: string }) {
  if (type === "LIVRABLE_FEEDBACK") return <Icon.Chat size={15} />;
  if (type === "CANDIDATURE_ACCEPTEE") return <Icon.Check size={15} />;
  if (type === "TACHE_ASSIGNEE") return <Icon.Kanban size={15} />;
  if (type === "PROJET_PUBLIE") return <Icon.Sparkles size={15} />;
  return <Icon.Bell size={15} />;
}

// ── Modal recherche ─────────────────────────────────────────────
function ModalRecherche({
  projets, onClose,
}: {
  projets: ProjetApercu[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const results = useMemo(() => {
    if (q.trim().length < 1) return projets.slice(0, 5);
    const qq = q.toLowerCase();
    return projets
      .filter((p) => p.titre.toLowerCase().includes(qq) || p.organisation.toLowerCase().includes(qq))
      .slice(0, 6);
  }, [projets, q]);

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 100, padding: "8vh 16px 16px", display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(20,26,19,0.4)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 560,
          background: "white",
          borderRadius: 14,
          boxShadow: "var(--ombre-lg)",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: "1px solid var(--bordure)" }}>
          <Icon.Search size={17} style={{ color: "var(--sage-500)" }} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "Enter") { router.push(`/projets?q=${encodeURIComponent(q)}`); onClose(); }
            }}
            placeholder="Chercher un job, une entreprise, une compétence…"
            style={{ flex: 1, border: 0, outline: 0, background: "transparent", font: "inherit", fontSize: 15 }}
          />
          <button
            onClick={onClose}
            style={{ background: "var(--sage-50)", border: 0, padding: "3px 8px", borderRadius: 4, fontSize: 11, color: "var(--sage-600)", cursor: "pointer" }}
          >
            Esc
          </button>
        </div>
        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {results.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center" }}>
              <p className="t-small">Aucun résultat.</p>
            </div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {results.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/projets/${p.slug}`}
                    onClick={onClose}
                    style={{ width: "100%", background: "transparent", border: 0, padding: "12px 18px", textAlign: "left", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--fond-eleve)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        flexShrink: 0,
                        backgroundImage: `url(${p.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {p.titre}
                      </div>
                      <div className="t-xs t-discret">{p.organisation}</div>
                    </div>
                    <Icon.ChevronRight size={14} style={{ color: "var(--sage-400)" }} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={{ padding: "10px 18px", borderTop: "1px solid var(--bordure)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="t-xs t-discret">{results.length} suggestion{results.length > 1 ? "s" : ""}</span>
          <button
            onClick={() => { router.push("/projets"); onClose(); }}
            className="t-xs"
            style={{ background: "transparent", border: 0, color: "var(--orange-600)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer" }}
          >
            Tous les jobs <Icon.Arrow size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}
