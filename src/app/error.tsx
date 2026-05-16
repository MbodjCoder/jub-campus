"use client";

// Frontière d'erreur globale — capture les erreurs de rendu des pages.

import Link from "next/link";
import { useEffect } from "react";

export default function Erreur({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[erreur]", error);
  }, [error]);

  return (
    <main
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: 420, textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
            borderRadius: 999,
            background: "color-mix(in oklab, var(--danger) 14%, transparent)",
            color: "var(--danger)",
            fontSize: 22,
            fontWeight: 800,
          }}
        >
          !
        </div>
        <h1 style={{ marginTop: 16, fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>
          Une erreur est survenue
        </h1>
        <p className="t-small" style={{ marginTop: 8 }}>
          Quelque chose s&apos;est mal passé. Réessaie — si le problème persiste, contacte le support.
        </p>
        <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "center" }}>
          <button className="btn btn--accent" onClick={reset}>
            Réessayer
          </button>
          <Link className="btn btn--contour" href="/">
            Accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
