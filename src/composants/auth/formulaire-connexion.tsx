"use client";

import { useActionState } from "react";
import { Bouton } from "@/composants/ui/bouton";
import { Champ, ChampEtiquete } from "@/composants/ui/champ";
import { CorpsCarte } from "@/composants/ui/carte";
import { seConnecter } from "@/app/(public)/inscription/actions";

export function FormulaireConnexion() {
  const [etat, action, enCours] = useActionState(seConnecter, null);

  return (
    <>
      <form action={action}>
        <CorpsCarte className="space-y-4">
          {etat?.message ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
              {etat.message}
            </p>
          ) : null}
          <ChampEtiquete libelle="Email" pour="email">
            <Champ id="email" name="email" type="email" required autoComplete="email" />
          </ChampEtiquete>
          <ChampEtiquete libelle="Mot de passe" pour="motDePasse">
            <Champ id="motDePasse" name="motDePasse" type="password" required autoComplete="current-password" />
          </ChampEtiquete>
          <Bouton apparence="primaire" taille="lg" pleineLargeur type="submit" chargement={enCours}>
            {enCours ? "Connexion…" : "Se connecter"}
          </Bouton>
        </CorpsCarte>
      </form>
      <div className="flex items-center gap-2 px-5 text-xs text-texte-discret">
        <span className="h-px flex-1 bg-bordure" />
        <span>OU</span>
        <span className="h-px flex-1 bg-bordure" />
      </div>
      <form action="/api/auth/signin/google" method="post" className="p-5 pt-0">
        <Bouton apparence="contour" pleineLargeur type="submit">
          Continuer avec Google
        </Bouton>
      </form>
    </>
  );
}
