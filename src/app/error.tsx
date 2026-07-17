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
    <main className="flex min-h-[70vh] items-center justify-center px-5 py-10">
      <div className="max-w-[420px] text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-danger/15 text-[22px] font-extrabold text-danger">
          !
        </div>
        <h1 className="mt-4 text-[22px] font-semibold tracking-[-0.02em]">
          Une erreur est survenue
        </h1>
        <p className="t-small mt-2">
          Quelque chose s&apos;est mal passé. Réessaie — si le problème persiste, contacte le support.
        </p>
        <div className="mt-5 flex justify-center gap-2.5">
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
