"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bouton } from "@/composants/ui/bouton";
import { cn } from "@/lib/utils";

export function EnTeteSite() {
  const chemin = usePathname();
  const surAccueil = chemin === "/";
  const [defile, setDefile] = useState(false);

  useEffect(() => {
    if (!surAccueil) return;
    const onScroll = () => setDefile(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [surAccueil]);

  const transparent = surAccueil && !defile;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        transparent
          ? "bg-transparent"
          : "border-b border-bordure bg-fond/85 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.04)]",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-lg font-bold transition-colors",
              transparent ? "bg-white text-jub-vert-950" : "bg-jub-vert-900 text-white",
            )}
          >
            J
          </span>
          <span className={cn("font-semibold tracking-tight transition-colors", transparent ? "text-white" : "text-texte")}>
            JUB <span className={transparent ? "text-jub-jaune-400" : "text-jub-vert-700"}>Campus</span>
          </span>
        </Link>
        <nav className="hidden gap-7 md:flex">
          {[
            { href: "/projets", l: "Projets" },
            { href: "/comment-ca-marche", l: "Comment ça marche" },
            { href: "/entreprises", l: "Entreprises" },
            { href: "/a-propos", l: "À propos" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors",
                transparent ? "text-white/80 hover:text-white" : "text-texte-discret hover:text-texte",
              )}
            >
              {item.l}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/connexion"
            className={cn(
              "hidden text-sm font-medium transition-colors sm:inline",
              transparent ? "text-white/90 hover:text-white" : "text-texte hover:text-jub-vert-700",
            )}
          >
            Connexion
          </Link>
          <Link href="/inscription">
            <Bouton apparence={transparent ? "accent" : "primaire"} taille="sm">
              Commencer
            </Bouton>
          </Link>
        </div>
      </div>
    </header>
  );
}
