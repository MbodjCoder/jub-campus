"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect, useTransition } from "react";
import {
  ChevronDown, LogOut, User, Settings, LayoutDashboard, Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { urlsParRole, LIBELLES_ROLE, obtenirInitiales } from "@/lib/role";
import { seDeconnecter } from "@/app/(public)/inscription/actions";
import type { Role } from "@/generated/prisma/client";

interface InfosSession {
  id: string;
  nom: string | null;
  email: string | null;
  image: string | null;
  role: Role;
}

interface Proprietes {
  session: InfosSession;
  /** Quand true (sur fond image sombre), les couleurs s'adaptent. */
  surFondSombre?: boolean;
}

// Menu utilisateur connecté : pilule avatar + dropdown roles-aware.
export function MenuUtilisateur({ session, surFondSombre = false }: Proprietes) {
  const [ouvert, setOuvert] = useState(false);
  const [enCours, demarrer] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function clicExterne(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOuvert(false);
    }
    function echap(e: KeyboardEvent) {
      if (e.key === "Escape") setOuvert(false);
    }
    document.addEventListener("mousedown", clicExterne);
    document.addEventListener("keydown", echap);
    return () => {
      document.removeEventListener("mousedown", clicExterne);
      document.removeEventListener("keydown", echap);
    };
  }, []);

  const urls = urlsParRole(session.role);
  const initiales = obtenirInitiales(session.nom ?? session.email ?? "?");
  const libelleRole = LIBELLES_ROLE[session.role];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOuvert((v) => !v)}
        aria-expanded={ouvert}
        aria-haspopup="menu"
        className={cn(
          "flex items-center gap-2 rounded-full backdrop-blur-md transition-colors",
          surFondSombre
            ? "bg-jub-sage-700/70 px-1.5 py-1 hover:bg-jub-sage-700/90"
            : "bg-jub-pierre-100 px-1.5 py-1 hover:bg-jub-sage-100",
        )}
      >
        <Avatar imageUrl={session.image} initiales={initiales} />
        <span
          className={cn(
            "hidden text-sm font-semibold sm:inline pr-2",
            surFondSombre ? "text-jub-sage-100" : "text-jub-sage-900",
          )}
        >
          {prenomDepuisNom(session.nom)}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform mr-1",
            ouvert && "rotate-180",
            surFondSombre ? "text-jub-sage-100" : "text-jub-sage-700",
          )}
        />
      </button>

      {ouvert ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-bordure bg-fond-eleve shadow-2xl ring-1 ring-jub-sage-900/5 animate-in fade-in zoom-in-95"
        >
          <div className="flex items-center gap-3 border-b border-bordure bg-jub-pierre-50 px-4 py-3">
            <Avatar imageUrl={session.image} initiales={initiales} taille="lg" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{session.nom ?? "—"}</p>
              <p className="truncate text-xs text-texte-discret">{session.email}</p>
              <span className="mt-1 inline-block rounded-full bg-jub-sage-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-jub-orange-500">
                {libelleRole}
              </span>
            </div>
          </div>

          <ul className="py-1">
            <ItemMenu href={urls.espace} icone={LayoutDashboard} onNavigue={() => setOuvert(false)}>
              Mon espace
            </ItemMenu>
            {session.role === "ETUDIANT" ? (
              <>
                <ItemMenu href="/app/profil" icone={User} onNavigue={() => setOuvert(false)}>
                  Mon profil
                </ItemMenu>
                <ItemMenu href="/app/certificats" icone={Award} onNavigue={() => setOuvert(false)}>
                  Mes certificats
                </ItemMenu>
              </>
            ) : null}
            {session.role === "ENTREPRISE" || session.role === "MENTOR" || session.role === "SPONSOR" ? (
              <ItemMenu href={urls.profil} icone={User} onNavigue={() => setOuvert(false)}>
                Mon profil
              </ItemMenu>
            ) : null}
            <ItemMenu href={urls.parametres} icone={Settings} onNavigue={() => setOuvert(false)}>
              Paramètres
            </ItemMenu>
          </ul>

          <div className="border-t border-bordure p-1.5">
            <button
              type="button"
              disabled={enCours}
              onClick={() => demarrer(() => seDeconnecter())}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              {enCours ? "Déconnexion…" : "Se déconnecter"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sous-composants
// ─────────────────────────────────────────────────────────────

function ItemMenu({
  href, icone: Icone, children, onNavigue,
}: {
  href: string;
  icone: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  onNavigue?: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onNavigue}
        className="flex items-center gap-2 px-4 py-2 text-sm text-texte transition-colors hover:bg-jub-orange-50 hover:text-jub-orange-700"
      >
        <Icone className="h-4 w-4" />
        {children}
      </Link>
    </li>
  );
}

interface ProprietesAvatar {
  imageUrl: string | null;
  initiales: string;
  taille?: "md" | "lg";
}

function Avatar({ imageUrl, initiales, taille = "md" }: ProprietesAvatar) {
  const dim = taille === "lg" ? "h-11 w-11" : "h-8 w-8";
  if (imageUrl) {
    return (
      <span className={cn("relative overflow-hidden rounded-full ring-2 ring-jub-orange-500/40", dim)}>
        <Image src={imageUrl} alt="" fill sizes="44px" className="object-cover" />
      </span>
    );
  }
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-full bg-jub-orange-500 font-bold text-jub-sage-950",
        dim,
        taille === "lg" ? "text-base" : "text-xs",
      )}
    >
      {initiales}
    </span>
  );
}

function prenomDepuisNom(nom: string | null): string {
  if (!nom) return "Profil";
  const morceaux = nom.trim().split(/\s+/);
  return morceaux[0] ?? "Profil";
}
