"use client";

// Boutons de l'écran paie ops — envoi Wave, lot complet, réconciliation,
// marquage manuel (Orange Money).

import { useState, useTransition } from "react";
import { Bouton } from "@/composants/ui/bouton";
import { Icon } from "@/composants/maquette/icones";
import {
  payerRetrait,
  payerTousLesRetraits,
  reconcilierRetraits,
  marquerPayeManuellement,
} from "@/app/admin/paie/actions";

export function BoutonPayer({ retraitId, methode }: { retraitId: string; methode: string }) {
  const [erreur, setErreur] = useState<string | null>(null);
  const [confirme, setConfirme] = useState(false);
  const [enCours, demarrer] = useTransition();

  const estWave = methode === "WAVE";

  if (!confirme) {
    return (
      <span className="flex flex-col items-end gap-1">
        <Bouton apparence="accent" taille="sm" onClick={() => setConfirme(true)}>
          {estWave ? "Payer via Wave" : "Marquer payé"}
        </Bouton>
        {erreur ? <span className="t-xs text-danger">{erreur}</span> : null}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5">
      <Bouton
        apparence="accent"
        taille="sm"
        disabled={enCours}
        onClick={() =>
          demarrer(async () => {
            const r = estWave ? await payerRetrait(retraitId) : await marquerPayeManuellement(retraitId);
            setConfirme(false);
            if (r.succes) {
              setErreur(null);
            } else {
              const message = "message" in r && typeof r.message === "string" ? r.message : "Erreur.";
              setErreur(message);
            }
          })
        }
      >
        {enCours ? "Envoi…" : "Confirmer"}
      </Bouton>
      <Bouton apparence="fantome" taille="sm" onClick={() => setConfirme(false)}>
        Non
      </Bouton>
    </span>
  );
}

export function BoutonPayerTout({ nb }: { nb: number }) {
  const [resultat, setResultat] = useState<string | null>(null);
  const [confirme, setConfirme] = useState(false);
  const [enCours, demarrer] = useTransition();

  if (nb === 0) return null;
  if (!confirme) {
    return (
      <span className="flex flex-col items-end gap-1">
        <Bouton apparence="accent" onClick={() => setConfirme(true)}>
          <Icon.Wallet size={15} /> Payer les {nb} retraits Wave
        </Bouton>
        {resultat ? <span className="t-xs t-discret">{resultat}</span> : null}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5">
      <Bouton
        apparence="accent"
        disabled={enCours}
        onClick={() =>
          demarrer(async () => {
            const r = await payerTousLesRetraits();
            setConfirme(false);
            setResultat(`${r.payes} payé(s), ${r.erreurs} erreur(s) sur ${r.total}.`);
          })
        }
      >
        {enCours ? "Envoi du lot…" : `Confirmer l'envoi de ${nb} paiement(s)`}
      </Bouton>
      <Bouton apparence="fantome" onClick={() => setConfirme(false)}>
        Annuler
      </Bouton>
    </span>
  );
}

export function BoutonReconcilier({ nb }: { nb: number }) {
  const [enCours, demarrer] = useTransition();
  if (nb === 0) return null;
  return (
    <Bouton
      apparence="contour"
      taille="sm"
      disabled={enCours}
      onClick={() => demarrer(async () => void (await reconcilierRetraits()))}
    >
      {enCours ? "Vérification…" : `Vérifier les ${nb} en cours`}
    </Bouton>
  );
}
