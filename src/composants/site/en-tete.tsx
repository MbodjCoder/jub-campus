"use client";

// En-tête public — port 1:1 de la maquette (screens-public.jsx · HeaderPublic).
// Adaptations réelles : navigation Next (router/pathname) et menu utilisateur
// quand une session existe.

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/composants/maquette/primitifs";
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

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        padding: "12px 20px",
        background: sombre ? "rgba(20,26,19,0.32)" : "var(--fond)",
        backdropFilter: sombre ? "blur(10px)" : "none",
        borderBottom: "1px solid " + (sombre ? "rgba(255,255,255,0.08)" : "transparent"),
        transition: "background 220ms ease, border-color 220ms ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
          maxWidth: 1180,
          margin: "0 auto",
        }}
      >
        {/* Logo — couleur FIXE (orange), encadré d'un fond gris */}
        <button
          onClick={() => router.push("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            background: "var(--pierre-300)",
            border: "1px solid var(--bordure-forte)",
            borderRadius: 999,
            padding: "5px 13px",
            flexShrink: 0,
            cursor: "pointer",
          }}
        >
          <Logo mot blanc={false} />
        </button>

        {/* Barre de recherche centrée, équidistante */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearch();
          }}
          style={{
            flex: "0 1 360px",
            minWidth: 0,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: sombre ? "rgba(255,255,255,0.10)" : "white",
            border: "1px solid " + (sombre ? "rgba(255,255,255,0.16)" : "var(--bordure)"),
            borderRadius: 999,
            padding: "2px 14px",
            transition: "background 220ms, border-color 220ms",
          }}
        >
          <Icon.Search size={15} style={{ color: sombre ? "rgba(255,255,255,0.65)" : "var(--sage-500)", flexShrink: 0 }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Chercher un job…"
            style={{
              flex: 1,
              border: 0,
              outline: 0,
              background: "transparent",
              font: "inherit",
              fontSize: 13.5,
              color: sombre ? "white" : "var(--texte)",
              padding: "3px 0",
              minWidth: 0,
            }}
          />
        </form>

        {/* Nav droite */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          <button
            onClick={() => router.push("/projets")}
            className="hide-xs"
            style={{ padding: "8px 12px", background: "transparent", border: 0, fontWeight: 600, fontSize: 13.5, color: sombre ? "rgba(255,255,255,0.9)" : "var(--sage-700)", cursor: "pointer" }}
          >
            Jobs
          </button>
          {session ? (
            <MenuUtilisateur session={session} surFondSombre={sombre} />
          ) : (
            <>
              <button
                onClick={() => router.push("/connexion")}
                className="hide-xs"
                style={{ padding: "8px 12px", background: "transparent", border: 0, fontWeight: 600, fontSize: 13.5, color: sombre ? "rgba(255,255,255,0.9)" : "var(--sage-700)", cursor: "pointer" }}
              >
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
