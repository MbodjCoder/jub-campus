"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Bouton } from "@/composants/ui/bouton";
import { Champ, ChampEtiquete, Selecteur, ZoneTexte } from "@/composants/ui/champ";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte } from "@/composants/ui/carte";
import { creerTache } from "@/app/app/projet/[id]/actions";

export function FormulaireTache({ projetId, membres }: {
  projetId: string;
  membres: Array<{ id: string; prenom: string; nom: string }>;
}) {
  const [ouvert, setOuvert] = useState(false);
  const [enCours, demarrer] = useTransition();
  const [erreur, setErreur] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setErreur(null);
    demarrer(async () => {
      const r = await creerTache(formData);
      if (!r?.succes) {
        setErreur(r?.message ?? "Erreur inconnue");
      } else {
        setOuvert(false);
      }
    });
  }

  if (!ouvert) {
    return (
      <Bouton apparence="contour" onClick={() => setOuvert(true)}>
        <Plus className="h-4 w-4" /> Ajouter une tâche
      </Bouton>
    );
  }

  return (
    <Carte>
      <EnteteCarte>
        <TitreCarte className="text-base">Nouvelle tâche</TitreCarte>
      </EnteteCarte>
      <form action={handleSubmit}>
        <input type="hidden" name="projetId" value={projetId} />
        <CorpsCarte className="space-y-4">
          {erreur ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">{erreur}</p>
          ) : null}

          <ChampEtiquete libelle="Titre" pour="titre-tache">
            <Champ id="titre-tache" name="titre" required maxLength={120} placeholder="Ex. Concevoir la maquette panier" />
          </ChampEtiquete>

          <ChampEtiquete libelle="Description" pour="desc-tache" optionnel>
            <ZoneTexte id="desc-tache" name="description" rows={3} />
          </ChampEtiquete>

          <div className="grid gap-4 sm:grid-cols-3">
            <ChampEtiquete libelle="Priorité" pour="prio-tache">
              <Selecteur id="prio-tache" name="priorite" defaultValue="NORMALE">
                <option value="BASSE">Basse</option>
                <option value="NORMALE">Normale</option>
                <option value="HAUTE">Haute</option>
                <option value="URGENTE">Urgente</option>
              </Selecteur>
            </ChampEtiquete>

            <ChampEtiquete libelle="Assigner à" pour="assignee-tache" optionnel>
              <Selecteur id="assignee-tache" name="assigneeId" defaultValue="">
                <option value="">— Non assignée —</option>
                {membres.map((m) => (
                  <option key={m.id} value={m.id}>{m.prenom} {m.nom}</option>
                ))}
              </Selecteur>
            </ChampEtiquete>

            <ChampEtiquete libelle="Échéance" pour="ech-tache" optionnel>
              <Champ id="ech-tache" name="echeance" type="date" />
            </ChampEtiquete>
          </div>
        </CorpsCarte>
        <div className="flex justify-end gap-2 border-t border-bordure bg-jub-pierre-50 p-4">
          <Bouton apparence="fantome" type="button" onClick={() => setOuvert(false)}>Annuler</Bouton>
          <Bouton apparence="primaire" type="submit" chargement={enCours}>Créer la tâche</Bouton>
        </div>
      </form>
    </Carte>
  );
}
