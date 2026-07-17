"use client";

// Formulaire de demande de retrait — Wave / Orange Money.
// Validation immédiate côté client (règles pures), server action derrière.

import { useState, useTransition } from "react";
import { Bouton } from "@/composants/ui/bouton";
import { FeuilleModale } from "@/composants/ui/feuille-modale";
import { Icon } from "@/composants/maquette/icones";
import { formaterMontantFcfa } from "@/lib/utils";
import {
  verifierDemandeRetrait,
  RETRAIT_MINIMUM_FCFA,
  type ErreurRetrait,
} from "@/domaine/regles-portefeuille";
import { soumettreRetrait } from "@/app/app/portefeuille/actions";

const LIBELLES_ERREUR: Record<ErreurRetrait, string> = {
  MONTANT_INVALIDE: "Montant invalide.",
  SOUS_LE_MINIMUM: `Le retrait minimum est de ${formaterMontantFcfa(RETRAIT_MINIMUM_FCFA)}.`,
  SOLDE_INSUFFISANT: "Solde insuffisant.",
  TELEPHONE_INVALIDE: "Numéro mobile sénégalais invalide (ex. 77 123 45 67).",
};

export function FormulaireRetrait({ soldeFcfa }: { soldeFcfa: number }) {
  const [ouvert, setOuvert] = useState(false);
  const [montant, setMontant] = useState("");
  const [methode, setMethode] = useState<"WAVE" | "ORANGE_MONEY">("WAVE");
  const [telephone, setTelephone] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, demarrer] = useTransition();

  const peutRetirer = soldeFcfa >= RETRAIT_MINIMUM_FCFA;

  function envoyer() {
    setErreur(null);
    const m = Number(montant);
    const locale = verifierDemandeRetrait(soldeFcfa, m, telephone);
    if (locale) {
      setErreur(LIBELLES_ERREUR[locale]);
      return;
    }
    const fd = new FormData();
    fd.set("montantFcfa", String(m));
    fd.set("methode", methode);
    fd.set("numeroTelephone", telephone);
    demarrer(async () => {
      const r = await soumettreRetrait(fd);
      if (r.succes) {
        setOuvert(false);
        setMontant("");
        setTelephone("");
      } else {
        setErreur(r.message ?? "Erreur.");
      }
    });
  }

  return (
    <>
      <Bouton apparence="accent" taille="lg" onClick={() => setOuvert(true)} disabled={!peutRetirer}>
        <Icon.Wallet size={16} /> Retirer
      </Bouton>
      {!peutRetirer ? (
        <p className="t-xs t-discret mt-2 mb-0">
          Retrait possible à partir de {formaterMontantFcfa(RETRAIT_MINIMUM_FCFA)}.
        </p>
      ) : null}

      {ouvert ? (
        <FeuilleModale onClose={() => setOuvert(false)} titre="Retirer mes gains" className="max-w-[440px]">
          <p className="t-small mt-0">
            Solde disponible : <strong>{formaterMontantFcfa(soldeFcfa)}</strong>
          </p>

          <div className="grid gap-3">
            <label className="grid gap-1">
              <span className="text-xs font-semibold">Montant (FCFA)</span>
              <input
                className="champ t-mono"
                type="number"
                inputMode="numeric"
                min={RETRAIT_MINIMUM_FCFA}
                max={soldeFcfa}
                step={100}
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                placeholder={String(RETRAIT_MINIMUM_FCFA)}
              />
            </label>

            <div className="grid gap-1">
              <span className="text-xs font-semibold">Méthode</span>
              <div className="segmente" role="group" aria-label="Méthode de retrait">
                {(
                  [
                    { v: "WAVE", l: "Wave" },
                    { v: "ORANGE_MONEY", l: "Orange Money" },
                  ] as const
                ).map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => setMethode(o.v)}
                    className={`segmente-btn${methode === o.v ? " segmente-btn--actif" : ""}`}
                    aria-pressed={methode === o.v}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </div>

            <label className="grid gap-1">
              <span className="text-xs font-semibold">Numéro {methode === "WAVE" ? "Wave" : "Orange Money"}</span>
              <input
                className="champ"
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="77 123 45 67"
              />
            </label>

            {erreur ? (
              <p className="m-0 rounded-lg bg-danger/10 px-3 py-2 text-[13px] text-danger">{erreur}</p>
            ) : null}

            <div className="mt-1 flex justify-end gap-2.5">
              <Bouton apparence="fantome" onClick={() => setOuvert(false)}>
                Annuler
              </Bouton>
              <Bouton apparence="accent" onClick={envoyer} disabled={enCours}>
                {enCours ? "Envoi…" : "Demander le retrait"} <Icon.Arrow size={14} />
              </Bouton>
            </div>
          </div>
        </FeuilleModale>
      ) : null}
    </>
  );
}
