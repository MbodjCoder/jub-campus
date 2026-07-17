"use client";

// En-tête public — navigation Next (router/pathname), menu utilisateur
// quand une session existe. Fond sombre translucide en haut de l'accueil.
// Migré maquette → classes ; la bascule sombre/clair est en classes conditionnelles.

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/composants/ui/logo";
import { Icon } from "@/composants/maquette/icones";
import { MenuUtilisateur } from "@/composants/site/menu-utilisateur";
import type { Role } from "@/generated/prisma/client";

interface InfosSession {
  id: string;
  nom: string | null;
  email: string | null;
  image: string | null;
  role: Role;
}

export function EnTeteSite({ session }: { session: InfosSession | null }) {
  const chemin = usePathname();
  const router = useRouter();
  const [defile, setDefile] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const h = () => setDefile(window.scrollY > 20);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Fond sombre tant qu'on est en haut de l'accueil.
  const sombre = chemin === "/" && !defile;

  const onSearch = () => {
    const t = q.trim();
    router.push(t ? `/projets?q=${encodeURIComponent(t)}` : "/projets");
  };

  const classeLienNav = cn(
    "hide-xs cursor-pointer border-0 bg-transparent px-3 py-2 text-[13.5px] font-semibold",
    sombre ? "text-white/90" : "text-sage-700",
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b px-5 py-3 transition-[background,border-color] duration-200",
        sombre
          ? "border-white/10 bg-sage-950/30 backdrop-blur-[10px]"
          : "border-transparent bg-fond",
      )}
    >
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-3.5">
        {/* Logo — cadre intégré au composant Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <Logo mot />
        </Link>

        {/* Barre de recherche centrée, équidistante */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearch();
          }}
          className={cn(
            "flex min-w-0 flex-[0_1_360px] items-center gap-2 rounded-full border px-3.5 py-0.5 transition-[background,border-color] duration-200",
            sombre ? "border-white/15 bg-white/10" : "border-bordure bg-white",
          )}
        >
          <Icon.Search size={15} className={cn("shrink-0", sombre ? "text-white/65" : "text-sage-500")} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Chercher un job…"
            className={cn(
              "min-w-0 flex-1 border-0 bg-transparent py-[3px] text-[13.5px] outline-none [font:inherit]",
              sombre ? "text-white placeholder:text-white/50" : "text-texte",
            )}
          />
        </form>

        {/* Nav droite */}
        <div className="flex shrink-0 items-center gap-1">
          <button onClick={() => router.push("/projets")} className={classeLienNav}>
            Jobs
          </button>
          {session ? (
            <MenuUtilisateur session={session} surFondSombre={sombre} />
          ) : (
            <>
              <button onClick={() => router.push("/connexion")} className={classeLienNav}>
                Connexion
              </button>
              <button className="btn btn--accent btn--sm" onClick={() => router.push("/inscription")}>
                Commencer
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
