"use client";

// Annulation d'un retrait encore au statut DEMANDE — recrédite le solde.

import { useState, useTransition } from "react";
import { Bouton } from "@/composants/ui/bouton";
import { annulerMonRetrait } from "@/app/app/portefeuille/actions";

export function BoutonAnnulerRetrait({ retraitId }: { retraitId: string }) {
  const [confirme, setConfirme] = useState(false);
  const [enCours, demarrer] = useTransition();

  if (!confirme) {
    return (
      <Bouton apparence="fantome" taille="sm" onClick={() => setConfirme(true)}>
        Annuler
      </Bouton>
    );
  }
  return (
    <span className="flex items-center gap-1.5">
      <Bouton
        apparence="contour"
        taille="sm"
        disabled={enCours}
        onClick={() => demarrer(async () => void (await annulerMonRetrait(retraitId)))}
      >
        {enCours ? "…" : "Confirmer"}
      </Bouton>
      <Bouton apparence="fantome" taille="sm" onClick={() => setConfirme(false)}>
        Non
      </Bouton>
    </span>
  );
}
