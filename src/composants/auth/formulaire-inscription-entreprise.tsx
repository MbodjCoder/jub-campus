"use client";

import { useActionState } from "react";
import { Bouton } from "@/composants/ui/bouton";
import { Champ, ChampEtiquete, Selecteur, ZoneTexte } from "@/composants/ui/champ";
import { CorpsCarte } from "@/composants/ui/carte";
import { inscrireEntreprise } from "@/app/(public)/inscription/actions";

export function FormulaireInscriptionEntreprise() {
  const [etat, action, enCours] = useActionState(inscrireEntreprise, null);
  const erreurs = etat?.erreurs ?? {};

  return (
    <form action={action}>
      <CorpsCarte className="space-y-5">
        <ChampEtiquete libelle="Raison sociale" pour="raisonSociale" erreur={erreurs.raisonSociale}>
          <Champ id="raisonSociale" name="raisonSociale" required />
        </ChampEtiquete>
        <div className="grid gap-4 sm:grid-cols-2">
          <ChampEtiquete libelle="Secteur" pour="secteur" erreur={erreurs.secteur}>
            <Champ id="secteur" name="secteur" required placeholder="Télécoms, banque, ONG, …" />
          </ChampEtiquete>
          <ChampEtiquete libelle="Taille" pour="taille" erreur={erreurs.taille}>
            <Selecteur id="taille" name="taille" required>
              <option value="TRES_PETITE">Moins de 10 personnes</option>
              <option value="PETITE">10 à 49</option>
              <option value="MOYENNE">50 à 249</option>
              <option value="GRANDE">250 et plus</option>
            </Selecteur>
          </ChampEtiquete>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ChampEtiquete libelle="NINEA" pour="ninea" optionnel>
            <Champ id="ninea" name="ninea" />
          </ChampEtiquete>
          <ChampEtiquete libelle="RCCM" pour="rccm" optionnel>
            <Champ id="rccm" name="rccm" />
          </ChampEtiquete>
        </div>
        <ChampEtiquete libelle="Site web" pour="siteWeb" optionnel erreur={erreurs.siteWeb}>
          <Champ id="siteWeb" name="siteWeb" type="url" placeholder="https://" />
        </ChampEtiquete>
        <ChampEtiquete libelle="Email du contact" pour="email" erreur={erreurs.email}>
          <Champ id="email" name="email" type="email" required autoComplete="email" />
        </ChampEtiquete>
        <ChampEtiquete libelle="Mot de passe" pour="motDePasse" erreur={erreurs.motDePasse}>
          <Champ id="motDePasse" name="motDePasse" type="password" required minLength={8} />
        </ChampEtiquete>
        <ChampEtiquete libelle="Décris ton activité" pour="description" optionnel>
          <ZoneTexte id="description" name="description" placeholder="En 2-3 phrases…" />
        </ChampEtiquete>
      </CorpsCarte>
      <div className="border-t border-bordure bg-jub-pierre-50 p-5">
        <Bouton apparence="primaire" taille="lg" pleineLargeur type="submit" chargement={enCours}>
          {enCours ? "Envoi…" : "Demander la validation"}
        </Bouton>
      </div>
    </form>
  );
}
