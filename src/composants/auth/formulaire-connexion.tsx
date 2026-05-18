"use client";

import { useActionState } from "react";
import { Bouton } from "@/composants/ui/bouton";
import { Champ, ChampEtiquete } from "@/composants/ui/champ";
import { CorpsCarte } from "@/composants/ui/carte";
import { renvoyerVerification, seConnecter } from "@/app/(public)/inscription/actions";

// `googleActif` : vrai seulement si les identifiants OAuth Google sont
// configurés. Sinon on masque le bouton — un bouton qui ne mène nulle
// part est pire que pas de bouton.
export function FormulaireConnexion({ googleActif = false }: { googleActif?: boolean }) {
  const [etat, action, enCours] = useActionState(seConnecter, null);
  const [etatVerification, actionVerification, verificationEnCours] = useActionState(renvoyerVerification, null);

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
      <form action={actionVerification} className="px-5 pb-5">
        <div className="space-y-3 rounded-lg border border-bordure bg-fond/60 p-3">
          <p className="text-xs text-texte-discret">
            Email non reçu après l&apos;inscription ?
          </p>
          {etatVerification?.message ? (
            <p className="text-xs text-texte-discret">{etatVerification.message}</p>
          ) : null}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Champ name="email" type="email" placeholder="ton@email.sn" required autoComplete="email" />
            <Bouton apparence="contour" type="submit" chargement={verificationEnCours}>
              Renvoyer
            </Bouton>
          </div>
        </div>
      </form>
      {googleActif ? (
        <>
          <div className="flex items-center gap-2 px-5 text-xs text-texte-discret">
            <span className="h-px flex-1 bg-bordure" />
            <span>OU</span>
            <span className="h-px flex-1 bg-bordure" />
          </div>
          <form action="/api/auth/signin/google" method="post" className="p-5 pt-0">
            {/* Après OAuth : /bienvenue finalise le profil si besoin,
                sinon renvoie vers l'espace du compte. */}
            <input type="hidden" name="callbackUrl" value="/bienvenue" />
            <Bouton apparence="contour" pleineLargeur type="submit">
              Continuer avec Google
            </Bouton>
          </form>
        </>
      ) : null}
    </>
  );
}
