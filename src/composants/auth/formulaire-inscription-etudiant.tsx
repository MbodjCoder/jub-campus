"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Bouton } from "@/composants/ui/bouton";
import { Champ, ChampEtiquete, Selecteur } from "@/composants/ui/champ";
import { CorpsCarte } from "@/composants/ui/carte";
import { UNIVERSITES_SENEGAL, LIBELLES_NIVEAU_ETUDE } from "@/lib/constantes";
import { inscrireEtudiant } from "@/app/(public)/inscription/actions";

export function FormulaireInscriptionEtudiant() {
  const [etat, action, enCours] = useActionState(inscrireEtudiant, null);
  const erreurs = etat?.erreurs ?? {};

  return (
    <form action={action}>
      <CorpsCarte className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <ChampEtiquete libelle="Prénom" pour="prenom" erreur={erreurs.prenom}>
            <Champ id="prenom" name="prenom" required autoComplete="given-name" />
          </ChampEtiquete>
          <ChampEtiquete libelle="Nom" pour="nom" erreur={erreurs.nom}>
            <Champ id="nom" name="nom" required autoComplete="family-name" />
          </ChampEtiquete>
        </div>
        <ChampEtiquete
          libelle="Email"
          pour="email"
          aide="Privilégie l'email de ton université (.edu.sn) si tu en as un."
          erreur={erreurs.email}
        >
          <Champ id="email" name="email" type="email" required autoComplete="email" />
        </ChampEtiquete>
        <ChampEtiquete libelle="Mot de passe" pour="motDePasse" aide="8 caractères minimum." erreur={erreurs.motDePasse}>
          <Champ id="motDePasse" name="motDePasse" type="password" required autoComplete="new-password" minLength={8} />
        </ChampEtiquete>
        <ChampEtiquete libelle="Confirmer le mot de passe" pour="motDePasseConfirme" erreur={erreurs.motDePasseConfirme}>
          <Champ id="motDePasseConfirme" name="motDePasseConfirme" type="password" required autoComplete="new-password" minLength={8} />
        </ChampEtiquete>
        <div className="grid gap-4 sm:grid-cols-2">
          <ChampEtiquete libelle="Université" pour="universite" erreur={erreurs.universite}>
            <Selecteur id="universite" name="universite" required defaultValue="UGB">
              {UNIVERSITES_SENEGAL.map((u) => (
                <option key={u.acronyme} value={u.acronyme}>{u.nom} ({u.acronyme})</option>
              ))}
            </Selecteur>
          </ChampEtiquete>
          <ChampEtiquete libelle="Niveau d'étude" pour="niveau" erreur={erreurs.niveau}>
            <Selecteur id="niveau" name="niveau" required defaultValue="L3">
              {Object.entries(LIBELLES_NIVEAU_ETUDE).map(([cle, libelle]) => (
                <option key={cle} value={cle}>{libelle}</option>
              ))}
            </Selecteur>
          </ChampEtiquete>
        </div>
        <ChampEtiquete libelle="Filière" pour="filiere" optionnel aide="Ex. Informatique, Sociologie, Sciences éco, …">
          <Champ id="filiere" name="filiere" />
        </ChampEtiquete>
        <label className="flex items-start gap-2 text-sm text-texte-discret">
          <input type="checkbox" name="cgu" required className="mt-0.5" />
          <span>
            J&apos;accepte les{" "}
            <Link href="/cgu" className="text-jub-vert-700 underline">CGU</Link> et la{" "}
            <Link href="/confidentialite" className="text-jub-vert-700 underline">politique de confidentialité</Link>.
          </span>
        </label>
        {erreurs.cgu ? <p className="text-xs text-alerte">{erreurs.cgu}</p> : null}
      </CorpsCarte>
      <div className="border-t border-bordure bg-jub-pierre-50 p-5">
        <Bouton apparence="primaire" taille="lg" pleineLargeur type="submit" chargement={enCours}>
          {enCours ? "Création…" : "Créer mon compte"}
        </Bouton>
      </div>
    </form>
  );
}
