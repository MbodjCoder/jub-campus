"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// En-tête JUB Campus en deux pilules flottantes :
// pilule logo à gauche, pilule navigation à droite.
// Toujours fixe en haut, transparente vers le bg (image de fond visible).
export function EnTeteSite() {
  const chemin = usePathname();
  const surAccueil = chemin === "/";
  const [defile, setDefile] = useState(false);

  useEffect(() => {
    const onScroll = () => setDefile(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sur la page d'accueil, l'en-tête baigne dans l'image jusqu'au scroll.
  // Sur les autres pages, fond légèrement plus opaque pour la lisibilité.
  const fondPilule = surAccueil && !defile
    ? "bg-jub-sage-700/70"
    : "bg-jub-sage-700/85";

  const liens = [
    { href: "/projets", l: "Projets" },
    { href: "/entreprises", l: "Entreprises" },
    { href: "/a-propos", l: "À propos" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <Link
          href="/"
          className={cn(
            "flex shrink-0 items-center gap-2.5 rounded-full px-4 py-2 backdrop-blur-md transition-all sm:px-5 sm:py-2.5",
            fondPilule,
          )}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-jub-orange-500 shadow-md shadow-jub-orange-500/30 sm:h-10 sm:w-10" />
          <span className="text-2xl font-extrabold tracking-tight text-jub-orange-500 sm:text-3xl">
            JUB
          </span>
        </Link>

        <nav
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-1.5 backdrop-blur-md transition-all sm:px-3 sm:py-2",
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
                  "rounded-full px-3 py-1.5 text-sm font-semibold transition-colors hidden sm:inline-block sm:px-5",
                  actif ? "bg-jub-sage-900/40 text-white" : "text-jub-sage-100 hover:text-white",
                )}
              >
                {item.l}
              </Link>
            );
          })}
          <Link
            href="/connexion"
            className="rounded-full px-3 py-1.5 text-sm font-bold text-jub-orange-500 transition-colors hover:text-jub-orange-400 sm:px-5"
          >
            Connexion
          </Link>
        </nav>
      </div>
    </header>
  );
}
