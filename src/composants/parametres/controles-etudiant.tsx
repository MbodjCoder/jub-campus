"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Bouton } from "@/composants/ui/bouton";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { definirVisibilitePortfolio, supprimerMonCompte } from "@/app/app/parametres/actions";

export function ControlesParametres({ estPublic }: { estPublic: boolean }) {
  const [public_, setPublic] = useState(estPublic);
  const [enCours, demarrer] = useTransition();
  const [confirmer, setConfirmer] = useState(false);
  const [suppression, demarrerSuppression] = useTransition();

  function basculer(valeur: boolean) {
    setPublic(valeur);
    demarrer(async () => {
      const r = await definirVisibilitePortfolio(valeur);
      if (!r.succes) setPublic(!valeur); // rollback
    });
  }

  return (
    <div className="space-y-4">
      <Carte>
        <EnteteCarte>
          <TitreCarte>Sécurité</TitreCarte>
          <DescriptionCarte>Modifie ton mot de passe via un lien sécurisé envoyé par email.</DescriptionCarte>
        </EnteteCarte>
        <CorpsCarte>
          <Link href="/mot-de-passe-oublie">
            <Bouton apparence="contour">Changer le mot de passe</Bouton>
          </Link>
        </CorpsCarte>
      </Carte>

      <Carte>
        <EnteteCarte>
          <TitreCarte>Visibilité du portfolio</TitreCarte>
          <DescriptionCarte>Choisis si ton portfolio public est accessible.</DescriptionCarte>
        </EnteteCarte>
        <CorpsCarte>
          <label className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={public_}
              disabled={enCours}
              onChange={(e) => basculer(e.target.checked)}
            />
            <span className="text-sm">
              Mon portfolio est visible par toute personne ayant le lien.
              {enCours ? <span className="text-texte-discret"> · enregistrement…</span> : null}
            </span>
          </label>
        </CorpsCarte>
      </Carte>

      <Carte className="border-red-200">
        <EnteteCarte className="border-red-200 bg-red-50">
          <TitreCarte className="text-red-900">Zone dangereuse</TitreCarte>
          <DescriptionCarte>La suppression du compte est définitive et irréversible.</DescriptionCarte>
        </EnteteCarte>
        <CorpsCarte>
          {confirmer ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-red-900">
                Confirmer ? Toutes tes données (candidatures, projets, certificats) seront perdues.
              </p>
              <div className="flex gap-2">
                <form action={supprimerMonCompte}>
                  <Bouton apparence="danger" type="submit" chargement={suppression}
                    onClick={() => demarrerSuppression(() => {})}>
                    Oui, supprimer définitivement
                  </Bouton>
                </form>
                <Bouton apparence="fantome" onClick={() => setConfirmer(false)}>Annuler</Bouton>
              </div>
            </div>
          ) : (
            <Bouton apparence="danger" onClick={() => setConfirmer(true)}>
              Supprimer mon compte
            </Bouton>
          )}
        </CorpsCarte>
      </Carte>
    </div>
  );
}
