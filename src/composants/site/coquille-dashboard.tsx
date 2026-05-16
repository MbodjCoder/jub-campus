"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FolderPlus, Inbox, Users, BarChart3, Settings,
  FolderKanban, FileCheck, Star, Building2, Award, AlertTriangle, FileText,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/composants/ui/logo";
import { MenuUtilisateur } from "@/composants/site/menu-utilisateur";
import { NotificationCloche } from "@/composants/site/notification-cloche";
import type { Role } from "@/generated/prisma/client";

interface InfosSession {
  id: string;
  nom: string | null;
  email: string | null;
  image: string | null;
  role: Role;
}

interface Notif {
  id: string;
  type: string;
  titre: string;
  contenu: string;
  lien: string | null;
  lue: boolean;
  creeLe: Date | string;
}

type Variante = "entreprise" | "mentor" | "admin";

interface Lien {
  libelle: string;
  href: string;
  Icone: LucideIcon;
}

const NAV: Record<Variante, { etiquette: string; liens: Lien[] }> = {
  entreprise: {
    etiquette: "Entreprise",
    liens: [
      { libelle: "Tableau de bord", href: "/entreprise", Icone: LayoutDashboard },
      { libelle: "Publier un job", href: "/entreprise/publier", Icone: FolderPlus },
      { libelle: "Candidatures", href: "/entreprise/candidatures", Icone: Inbox },
      { libelle: "Talents", href: "/entreprise/talents", Icone: Users },
      { libelle: "Statistiques", href: "/entreprise/statistiques", Icone: BarChart3 },
      { libelle: "Paramètres", href: "/entreprise/parametres", Icone: Settings },
    ],
  },
  mentor: {
    etiquette: "Mentor",
    liens: [
      { libelle: "Tableau de bord", href: "/mentor", Icone: LayoutDashboard },
      { libelle: "Jobs encadrés", href: "/mentor/projets", Icone: FolderKanban },
      { libelle: "Étudiants suivis", href: "/mentor/etudiants", Icone: Users },
      { libelle: "Livrables à corriger", href: "/mentor/corrections", Icone: FileCheck },
      { libelle: "Évaluations", href: "/mentor/evaluations", Icone: Star },
      { libelle: "Paramètres", href: "/mentor/parametres", Icone: Settings },
    ],
  },
  admin: {
    etiquette: "Administration",
    liens: [
      { libelle: "Vue d'ensemble", href: "/admin", Icone: LayoutDashboard },
      { libelle: "Utilisateurs", href: "/admin/utilisateurs", Icone: Users },
      { libelle: "Entreprises", href: "/admin/entreprises", Icone: Building2 },
      { libelle: "Jobs", href: "/admin/projets", Icone: FolderKanban },
      { libelle: "Certificats", href: "/admin/certificats", Icone: Award },
      { libelle: "Signalements", href: "/admin/signalements", Icone: AlertTriangle },
      { libelle: "Journal d'audit", href: "/admin/journal", Icone: FileText },
    ],
  },
};

interface Proprietes {
  variante: Variante;
  session: InfosSession;
  notifications: Notif[];
  nbNonLues: number;
  children: React.ReactNode;
}

// Coquille partagée des espaces entreprise / mentor / admin.
export function CoquilleDashboard({ variante, session, notifications, nbNonLues, children }: Proprietes) {
  const chemin = usePathname();
  const { etiquette, liens } = NAV[variante];
  const racine = liens[0].href;
  const estActif = (href: string) =>
    href === racine ? chemin === racine : chemin.startsWith(href);

  return (
    <div className="flex min-h-screen bg-fond">
      {/* Barre latérale */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-7 border-r border-bordure bg-fond p-5 lg:flex">
        <Link href={racine} className="flex items-center gap-2" aria-label="Accueil JUB">
          <Logo />
          <span className="t-xs t-discret">{etiquette}</span>
        </Link>
        <nav className="flex flex-col gap-0.5">
          {liens.map(({ libelle, href, Icone }) => {
            const actif = estActif(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors"
                style={{
                  background: actif ? "var(--sage-700)" : "transparent",
                  color: actif ? "#fff" : "var(--sage-800)",
                }}
              >
                <span style={{ color: actif ? "var(--orange-400)" : "var(--sage-500)" }}>
                  <Icone size={17} />
                </span>
                {libelle}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Colonne principale */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-bordure bg-fond px-5 py-3">
          <Link href={racine} className="flex items-center gap-2 lg:hidden">
            <Logo />
          </Link>
          <span className="hidden text-[15px] font-semibold lg:block">JUB · {etiquette}</span>
          <div className="flex items-center gap-2">
            <NotificationCloche notifications={notifications} nbNonLues={nbNonLues} />
            <MenuUtilisateur session={session} />
          </div>
        </header>

        {/* Nav mobile horizontale */}
        <nav className="flex gap-1 overflow-x-auto border-b border-bordure bg-fond px-3 py-2 lg:hidden">
          {liens.map(({ libelle, href }) => {
            const actif = estActif(href);
            return (
              <Link
                key={href}
                href={href}
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors"
                style={{
                  background: actif ? "var(--sage-700)" : "transparent",
                  color: actif ? "#fff" : "var(--sage-600)",
                }}
              >
                {libelle}
              </Link>
            );
          })}
        </nav>

        <main className="min-w-0 flex-1 px-5 py-6">{children}</main>
      </div>
    </div>
  );
}
