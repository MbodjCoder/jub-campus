"use client";

// Coquille de l'espace étudiant — sidebar desktop, barre d'onglets mobile,
// drawer notifications, palette de recherche.
// Migré maquette → classes : responsive Tailwind (min-[900px]:*), zéro <style>.

import { useState, useRef, useEffect, useMemo, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/composants/ui/logo";
import { Icon } from "./icones";
import { fmt } from "./format";
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
  { id: "/app/portefeuille", l: "Portefeuille", icon: <Icon.Wallet size={17} /> },
  { id: "/app/profil", l: "Profil", icon: <Icon.Globe size={17} /> },
];

const TITRES: Record<string, string> = {
  "/app": "Tableau de bord",
  "/app/mes-projets": "Mes jobs",
  "/app/portefeuille": "Mon portefeuille",
  "/app/profil": "Mon profil",
};

export function CoquilleApp({
  session, notifications, projetsRecherche, children,
}: Proprietes) {
  const chemin = usePathname();
  const estActif = (id: string) => (id === "/app" ? chemin === "/app" : chemin.startsWith(id));

  return (
    <div className="flex min-h-screen bg-fond">
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col gap-7 border-r border-bordure bg-fond p-5 min-[900px]:flex">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo mot />
        </Link>

        <nav className="flex flex-col gap-0.5">
          {LIENS.map((l) => {
            const actif = estActif(l.id);
            return (
              <Link
                key={l.id}
                href={l.id}
                className={cn(
                  "flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-sm font-medium no-underline",
                  actif ? "bg-sage-700 text-white" : "text-sage-800 hover:bg-sage-50",
                )}
              >
                <span className={actif ? "text-orange-400" : "text-sage-500"}>{l.icon}</span>
                <span>{l.l}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBarApp notifications={notifications} projetsRecherche={projetsRecherche} session={session} />
        <div className="flex-1 pb-24">{children}</div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-bordure bg-white pb-[18px] pt-2 min-[900px]:hidden">
        {LIENS.map((l) => {
          const actif = estActif(l.id);
          return (
            <Link
              key={l.id}
              href={l.id}
              className={cn(
                "flex flex-col items-center gap-[3px] px-3.5 py-1 no-underline",
                actif ? "text-sage-900" : "text-sage-500",
              )}
              aria-current={actif ? "page" : undefined}
            >
              <span className={actif ? "text-orange-500" : undefined}>{l.icon}</span>
              <span className={cn("text-[10.5px]", actif ? "font-bold" : "font-medium")}>
                {l.l.split(" ")[0]}
              </span>
            </Link>
          );
        })}
      </nav>
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
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-fond px-5 py-3">
      <div className="flex items-center gap-2.5 min-[900px]:hidden">
        <Logo taille="md" />
      </div>
      <h1 className="m-0 hidden flex-1 text-[15px] font-semibold min-[900px]:block">
        {TITRES[chemin] ?? ""}
      </h1>

      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={() => setShowSearch(true)}
          className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-bordure bg-white px-3 text-[13px] text-sage-500 min-[900px]:min-w-[200px]"
        >
          <Icon.Search size={15} /> <span className="hide-sm">Rechercher</span>
        </button>

        <button
          onClick={() => setNotifOuvert(true)}
          className={cn(
            "relative inline-flex h-9 min-w-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full border",
            nonLues > 0
              ? "border-orange-500 bg-orange-500 px-3 text-sage-950 shadow-[0_4px_14px_-4px_rgba(255,170,0,0.6)]"
              : "border-bordure bg-white p-0 text-sage-700",
          )}
          title={`${nonLues} notification${nonLues > 1 ? "s" : ""}`}
        >
          <Icon.Bell size={15} />
          {nonLues > 0 ? <span className="text-xs font-extrabold">{nonLues}</span> : null}
        </button>

        {/* Menu profil — présent sur toutes les pages de l'espace.
            Accès : Mon espace, Mon profil, Mes certificats, Paramètres,
            Déconnexion. Point unique : pas de doublon dans la barre latérale. */}
        <MenuUtilisateur session={session} />
      </div>

      {notifOuvert ? <DrawerNotifications notifications={notifications} onClose={() => setNotifOuvert(false)} /> : null}
      {showSearch ? <ModalRecherche projets={projetsRecherche} onClose={() => setShowSearch(false)} /> : null}
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
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-sage-950/40" onClick={onClose} />
      <div className="slidein absolute inset-y-0 right-0 flex w-full max-w-[380px] flex-col bg-white shadow-[-20px_0_60px_-20px_rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-between border-b border-bordure p-[18px]">
          <div>
            <h2 className="m-0 text-[17px] font-semibold tracking-[-0.01em]">Notifications</h2>
            <p className="t-xs t-discret mt-0.5 mb-0">{nonLues} nouvelles</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-0 bg-sage-50"
            aria-label="Fermer"
          >
            <Icon.X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {notifications.length === 0 ? (
            <p className="t-small p-10 text-center">Aucune notification.</p>
          ) : (
            notifications.map((n) => {
              const corps = (
                <div
                  className={cn(
                    "flex items-start gap-3 border-b border-bordure px-[18px] py-3.5",
                    !n.lue && "bg-orange-500/5",
                    n.lien ? "cursor-pointer hover:bg-fond-eleve" : "cursor-default",
                  )}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sage-700 text-orange-400">
                    <IconePourType type={n.type} />
                  </span>
                  <div className="flex-1">
                    <div className={cn("text-[13.5px] leading-[1.4]", n.lue ? "font-medium" : "font-semibold")}>
                      {n.titre}
                    </div>
                    <div className="t-xs t-discret mt-1">{fmt.ilYa(n.creeLe)}</div>
                  </div>
                  {!n.lue ? <span className="mt-1.5 h-[7px] w-[7px] rounded-full bg-orange-500" /> : null}
                </div>
              );
              return n.lien ? (
                <Link key={n.id} href={n.lien} onClick={onClose} className="no-underline text-inherit">
                  {corps}
                </Link>
              ) : (
                <div key={n.id}>{corps}</div>
              );
            })
          )}
        </div>
        <div className="border-t border-bordure p-3.5">
          <button
            onClick={() => demarrer(async () => { await marquerToutesNotificationsLues(); onClose(); })}
            className="t-xs w-full cursor-pointer border-0 bg-transparent px-3 py-2.5 font-semibold text-sage-700 disabled:opacity-50"
            disabled={enCours || nonLues === 0}
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
    <div className="fixed inset-0 z-[100] flex flex-col items-center px-4 pb-4 pt-[8vh]">
      <div className="absolute inset-0 bg-sage-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[560px] overflow-hidden rounded-[14px] bg-white shadow-lg">
        <div className="flex items-center gap-2.5 border-b border-bordure px-[18px] py-3.5">
          <Icon.Search size={17} className="text-sage-500" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "Enter") { router.push(`/projets?q=${encodeURIComponent(q)}`); onClose(); }
            }}
            placeholder="Chercher un job, une entreprise, une compétence…"
            className="flex-1 border-0 bg-transparent text-[15px] outline-none [font:inherit]"
          />
          <button
            onClick={onClose}
            className="cursor-pointer rounded border-0 bg-sage-50 px-2 py-[3px] text-[11px] text-sage-600"
          >
            Esc
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-10 text-center">
              <p className="t-small">Aucun résultat.</p>
            </div>
          ) : (
            <ul className="m-0 list-none p-0">
              {results.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/projets/${p.slug}`}
                    onClick={onClose}
                    className="flex w-full cursor-pointer items-center gap-3 px-[18px] py-3 text-left no-underline text-inherit hover:bg-fond-eleve"
                  >
                    <div
                      className="h-9 w-9 shrink-0 rounded-lg bg-cover bg-center"
                      // eslint-disable-next-line react/forbid-dom-props -- URL d'image dynamique
                      style={{ backgroundImage: `url(${p.image})` }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{p.titre}</div>
                      <div className="t-xs t-discret">{p.organisation}</div>
                    </div>
                    <Icon.ChevronRight size={14} className="text-sage-400" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-bordure px-[18px] py-2.5">
          <span className="t-xs t-discret">{results.length} suggestion{results.length > 1 ? "s" : ""}</span>
          <button
            onClick={() => { router.push("/projets"); onClose(); }}
            className="t-xs inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent font-semibold text-orange-600"
          >
            Tous les jobs <Icon.Arrow size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}
