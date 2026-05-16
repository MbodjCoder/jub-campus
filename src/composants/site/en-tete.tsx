"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// En-tête JUB Campus : pilule logo + pilule nav (desktop) / menu burger (mobile).
// Toujours fixe en haut. Reste visible au défilement.
export function EnTeteSite() {
  const chemin = usePathname();
  const surAccueil = chemin === "/";
  const [defile, setDefile] = useState(false);
  const [menuOuvert, setMenuOuvert] = useState(false);

  useEffect(() => {
    const onScroll = () => setDefile(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fermer le menu mobile à chaque navigation.
  useEffect(() => {
    setMenuOuvert(false);
  }, [chemin]);

  // Bloquer le scroll du body quand le menu mobile est ouvert.
  useEffect(() => {
    if (menuOuvert) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [menuOuvert]);

  const fondPilule = surAccueil && !defile
    ? "bg-jub-sage-700/70"
    : "bg-jub-sage-700/90";

  const liens = [
    { href: "/projets", l: "Projets" },
    { href: "/entreprises", l: "Entreprises" },
    { href: "/a-propos", l: "À propos" },
  ];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <LogoJub fondPilule={fondPilule} />

          {/* Nav desktop (≥ md) */}
          <nav
            className={cn(
              "hidden items-center gap-1 rounded-full px-2 py-1.5 backdrop-blur-md transition-all md:flex lg:px-3 lg:py-2",
              fondPilule,
            )}
          >
            {liens.map((item) => {
              const actif = chemin === item.href || chemin.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors lg:px-5",
                    actif ? "bg-jub-sage-900/40 text-white" : "text-jub-sage-100 hover:text-white",
                  )}
                >
                  {item.l}
                </Link>
              );
            })}
            <Link
              href="/connexion"
              className="rounded-full px-4 py-1.5 text-sm font-bold text-jub-orange-500 transition-colors hover:text-jub-orange-400 lg:px-5"
            >
              Connexion
            </Link>
          </nav>

          {/* Bouton burger (< md) */}
          <button
            type="button"
            aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOuvert}
            onClick={() => setMenuOuvert((v) => !v)}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-md transition-all md:hidden",
              fondPilule,
            )}
          >
            <IconeBurger ouvert={menuOuvert} />
          </button>
        </div>
      </header>

      {/* Menu mobile en plein écran */}
      <MenuMobile ouvert={menuOuvert} liens={liens} chemin={chemin} onFermer={() => setMenuOuvert(false)} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Logo JUB : cercle orange avec point sage au centre + texte
// ─────────────────────────────────────────────────────────────

function LogoJub({ fondPilule }: { fondPilule: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex shrink-0 items-center gap-2.5 rounded-full px-3 py-1.5 backdrop-blur-md transition-all sm:px-4 sm:py-2 lg:px-5 lg:py-2.5",
        fondPilule,
      )}
    >
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-jub-orange-500 shadow-md shadow-jub-orange-500/30 sm:h-9 sm:w-9 lg:h-10 lg:w-10">
        <span className="block h-2.5 w-2.5 rounded-full bg-jub-sage-500 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5" />
      </span>
      <span className="text-xl font-extrabold tracking-tight text-jub-orange-500 sm:text-2xl lg:text-3xl">
        JUB
      </span>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────
// Burger animé (ouvert / fermé)
// ─────────────────────────────────────────────────────────────

function IconeBurger({ ouvert }: { ouvert: boolean }) {
  return (
    <span className="relative flex h-5 w-6 flex-col justify-between" aria-hidden>
      <span
        className={cn(
          "h-0.5 w-full origin-center rounded-full bg-jub-sage-100 transition-all duration-300",
          ouvert ? "translate-y-[9px] rotate-45 bg-jub-orange-500" : "",
        )}
      />
      <span
        className={cn(
          "h-0.5 w-full rounded-full bg-jub-sage-100 transition-all duration-200",
          ouvert ? "opacity-0" : "opacity-100",
        )}
      />
      <span
        className={cn(
          "h-0.5 w-full origin-center rounded-full bg-jub-sage-100 transition-all duration-300",
          ouvert ? "-translate-y-[9px] -rotate-45 bg-jub-orange-500" : "",
        )}
      />
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Menu mobile plein écran
// ─────────────────────────────────────────────────────────────

function MenuMobile({
  ouvert, liens, chemin, onFermer,
}: {
  ouvert: boolean;
  liens: { href: string; l: string }[];
  chemin: string;
  onFermer: () => void;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-40 md:hidden transition-all duration-300",
        ouvert ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!ouvert}
    >
      <div className="absolute inset-0 bg-jub-sage-900/95 backdrop-blur-xl" onClick={onFermer} />

      <nav className="relative flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
        {liens.map((item, i) => {
          const actif = chemin === item.href || chemin.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block w-full max-w-xs rounded-2xl px-6 py-4 text-2xl font-bold transition-all",
                actif ? "bg-jub-sage-700 text-white" : "text-jub-sage-100 hover:bg-jub-sage-700/60 hover:text-white",
                "transition-transform",
                ouvert ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
              )}
              style={{ transitionDelay: ouvert ? `${i * 60}ms` : "0ms" }}
            >
              {item.l}
            </Link>
          );
        })}

        <div className="my-4 h-px w-32 bg-jub-sage-700" />

        <Link
          href="/connexion"
          className={cn(
            "block w-full max-w-xs rounded-2xl bg-jub-orange-500 px-6 py-4 text-2xl font-bold text-jub-sage-950 shadow-lg shadow-jub-orange-500/30 transition-all hover:bg-jub-orange-400",
            ouvert ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
          )}
          style={{ transitionDelay: ouvert ? `${liens.length * 60 + 30}ms` : "0ms" }}
        >
          Connexion
        </Link>

        <Link
          href="/inscription/etudiant"
          className={cn(
            "mt-2 block w-full max-w-xs rounded-2xl border border-jub-sage-100/30 px-6 py-4 text-lg font-semibold text-jub-sage-100 transition-all hover:bg-jub-sage-100/10",
            ouvert ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
          )}
          style={{ transitionDelay: ouvert ? `${liens.length * 60 + 90}ms` : "0ms" }}
        >
          Créer un compte
        </Link>
      </nav>
    </div>
  );
}
