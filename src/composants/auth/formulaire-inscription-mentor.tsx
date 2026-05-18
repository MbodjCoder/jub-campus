"use client";

import { useActionState } from "react";
import { Bouton } from "@/composants/ui/bouton";
import { Champ, ChampEtiquete, Selecteur, ZoneTexte } from "@/composants/ui/champ";
import { CorpsCarte } from "@/composants/ui/carte";
import { UNIVERSITES_SENEGAL } from "@/lib/constantes";
import { inscrireMentor } from "@/app/(public)/inscription/actions";

export function FormulaireInscriptionMentor() {
  const [etat, action, enCours] = useActionState(inscrireMentor, null);
  const erreurs = etat?.erreurs ?? {};

  return (
    <form action={action}>
      <CorpsCarte className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <ChampEtiquete libelle="Prénom" pour="prenom" erreur={erreurs.prenom}>
            <Champ id="prenom" name="prenom" required />
          </ChampEtiquete>
          <ChampEtiquete libelle="Nom" pour="nom" erreur={erreurs.nom}>
            <Champ id="nom" name="nom" required />
          </ChampEtiquete>
        </div>
        <ChampEtiquete libelle="Email" pour="email" erreur={erreurs.email}>
          <Champ id="email" name="email" type="email" required />
        </ChampEtiquete>
        <ChampEtiquete libelle="Mot de passe" pour="motDePasse" erreur={erreurs.motDePasse}>
          <Champ id="motDePasse" name="motDePasse" type="password" required minLength={8} />
        </ChampEtiquete>
        <ChampEtiquete libelle="Confirmer le mot de passe" pour="motDePasseConfirme" erreur={erreurs.motDePasseConfirme}>
          <Champ id="motDePasseConfirme" name="motDePasseConfirme" type="password" required minLength={8} />
        </ChampEtiquete>
        <div className="grid gap-4 sm:grid-cols-2">
          <ChampEtiquete libelle="Type de mentor" pour="type" erreur={erreurs.type}>
            <Selecteur id="type" name="type" required>
              <option value="PROFESSEUR">Professeur / chercheur</option>
              <option value="PROFESSIONNEL">Professionnel en activité</option>
              <option value="ALUMNI">Alumni</option>
              <option value="EXPERT_INVITE">Expert invité</option>
            </Selecteur>
          </ChampEtiquete>
          <ChampEtiquete libelle="Université d'attache" pour="universite" optionnel>
            <Selecteur id="universite" name="universite" defaultValue="">
              <option value="">— Aucune —</option>
              {UNIVERSITES_SENEGAL.map((u) => (
                <option key={u.acronyme} value={u.acronyme}>{u.acronyme}</option>
              ))}
            </Selecteur>
          </ChampEtiquete>
        </div>
        <ChampEtiquete libelle="Poste / titre" pour="titreOuPoste" optionnel>
          <Champ id="titreOuPoste" name="titreOuPoste" placeholder="Ex. Maître de conférences, Senior Engineer, …" />
        </ChampEtiquete>
        <ChampEtiquete libelle="Spécialités" pour="specialites" erreur={erreurs.specialites} aide="Séparées par des virgules.">
          <Champ id="specialites" name="specialites" placeholder="Machine learning, gestion de projet, marketing…" />
        </ChampEtiquete>
        <ChampEtiquete libelle="Biographie courte" pour="biographie" optionnel>
          <ZoneTexte id="biographie" name="biographie" />
        </ChampEtiquete>
      </CorpsCarte>
      <div className="border-t border-bordure bg-jub-pierre-50 p-5">
        <Bouton apparence="primaire" taille="lg" pleineLargeur type="submit" chargement={enCours}>
          {enCours ? "Envoi…" : "Soumettre ma candidature mentor"}
        </Bouton>
      </div>
    </form>
  );
}
