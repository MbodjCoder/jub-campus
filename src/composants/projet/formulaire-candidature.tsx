"use client";

import { useState, useTransition } from "react";
import { Send } from "lucide-react";
import { Bouton } from "@/composants/ui/bouton";
import { ChampEtiquete, ZoneTexte } from "@/composants/ui/champ";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { soumettreCandidature } from "@/app/(public)/projets/[slug]/actions";

export function FormulaireCandidature({ projetId, titreProjet }: { projetId: string; titreProjet: string }) {
  const [enCours, demarrer] = useTransition();
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState(false);

  async function handleSubmit(formData: FormData) {
    setErreur(null);
    demarrer(async () => {
      const r = await soumettreCandidature(formData);
      if (!r?.succes) {
        setErreur(r?.message ?? "Erreur inconnue.");
      } else {
        setSucces(true);
      }
    });
  }

  if (succes) {
    return (
      <Carte className="border-jub-orange-300 bg-jub-orange-50/60">
        <CorpsCarte className="text-center space-y-2">
          <p className="text-2xl">🎉</p>
          <p className="font-semibold">Candidature envoyée !</p>
          <p className="text-sm text-texte-discret">
            L&apos;équipe te répondra sous quelques jours. Tu seras notifié dès qu&apos;il y a du nouveau.
          </p>
        </CorpsCarte>
      </Carte>
    );
  }

  return (
    <Carte>
      <EnteteCarte>
        <TitreCarte className="text-base">Postuler à ce projet</TitreCarte>
        <DescriptionCarte>
          Une lettre courte qui montre ta motivation et ton intérêt pour {titreProjet}.
        </DescriptionCarte>
      </EnteteCarte>
      <form action={handleSubmit}>
        <input type="hidden" name="projetId" value={projetId} />
        <CorpsCarte className="space-y-4">
          {erreur ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">{erreur}</p>
          ) : null}
          <ChampEtiquete libelle="Lettre de motivation" pour="lettre" aide="200 caractères minimum, 1500 max.">
            <ZoneTexte
              id="lettre"
              name="lettre"
              required
              rows={6}
              minLength={200}
              maxLength={1500}
              placeholder="Pourquoi ce projet t'intéresse, ce que tu pourrais apporter à l'équipe, ce que tu veux apprendre…"
            />
          </ChampEtiquete>
        </CorpsCarte>
        <div className="border-t border-bordure bg-jub-pierre-50 p-4">
          <Bouton apparence="accent" pleineLargeur type="submit" chargement={enCours}>
            <Send className="h-4 w-4" /> Envoyer ma candidature
          </Bouton>
        </div>
      </form>
    </Carte>
  );
}
