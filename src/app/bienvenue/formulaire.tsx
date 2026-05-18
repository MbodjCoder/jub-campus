"use client";

import { useActionState } from "react";
import { Champ, ChampEtiquete, Selecteur } from "@/composants/ui/champ";
import { Bouton } from "@/composants/ui/bouton";
import { LIBELLES_NIVEAU_ETUDE, UNIVERSITES_SENEGAL } from "@/lib/constantes";
import { finaliserProfilEtudiant } from "./actions";

export function FormulaireBienvenue({
  prenomInitial,
  nomInitial,
}: {
  prenomInitial: string;
  nomInitial: string;
}) {
  const [etat, action, enCours] = useActionState(finaliserProfilEtudiant, null);
  const err = etat?.erreurs ?? {};

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <ChampEtiquete libelle="Prénom" pour="prenom" erreur={err.prenom}>
          <Champ id="prenom" name="prenom" defaultValue={prenomInitial} required />
        </ChampEtiquete>
        <ChampEtiquete libelle="Nom" pour="nom" erreur={err.nom}>
          <Champ id="nom" name="nom" defaultValue={nomInitial} required />
        </ChampEtiquete>
      </div>

      <ChampEtiquete libelle="Université" pour="universite" erreur={err.universite}>
        <Selecteur id="universite" name="universite" defaultValue="" required>
          <option value="" disabled>— Choisir —</option>
          {UNIVERSITES_SENEGAL.map((u) => (
            <option key={u.acronyme} value={u.acronyme}>{u.acronyme}</option>
          ))}
        </Selecteur>
      </ChampEtiquete>

      <ChampEtiquete libelle="Niveau d'étude" pour="niveau" erreur={err.niveau}>
        <Selecteur id="niveau" name="niveau" defaultValue="" required>
          <option value="" disabled>— Choisir —</option>
          {Object.entries(LIBELLES_NIVEAU_ETUDE).map(([cle, libelle]) => (
            <option key={cle} value={cle}>{libelle}</option>
          ))}
        </Selecteur>
      </ChampEtiquete>

      <ChampEtiquete libelle="Filière" pour="filiere" optionnel erreur={err.filiere}>
        <Champ id="filiere" name="filiere" placeholder="Ex. Informatique" />
      </ChampEtiquete>

      <Bouton apparence="primaire" taille="lg" pleineLargeur type="submit" chargement={enCours}>
        {enCours ? "Enregistrement…" : "Accéder à mon espace"}
      </Bouton>
    </form>
  );
}
