"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Bouton } from "@/composants/ui/bouton";
import { seDeconnecter } from "@/app/(public)/inscription/actions";

export function NavApp() {
  const [enCours, demarrer] = useTransition();
  return (
    <div className="flex items-center gap-3">
      <Link href="/app/notifications" className="text-sm text-texte-discret hover:text-texte">
        Notifications
      </Link>
      <Bouton
        apparence="contour"
        taille="sm"
        chargement={enCours}
        onClick={() => demarrer(() => seDeconnecter())}
      >
        Se déconnecter
      </Bouton>
    </div>
  );
}
