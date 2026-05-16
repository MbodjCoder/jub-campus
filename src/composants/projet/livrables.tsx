"use client";

import { useState, useTransition } from "react";
import { Paperclip, MessageSquare, Plus, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Bouton } from "@/composants/ui/bouton";
import { Champ, ChampEtiquete, Selecteur, ZoneTexte } from "@/composants/ui/champ";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { formaterDate } from "@/lib/utils";
import {
  deposerLivrable,
  ajouterFeedback,
  changerStatutLivrable,
} from "@/app/app/projet/[id]/actions";

type StatutLivrable = "EN_REVUE" | "VALIDE" | "A_CORRIGER" | "REJETE";

interface Livrable {
  id: string;
  titre: string;
  description: string | null;
  fichierUrl: string;
  typeMime: string;
  statut: StatutLivrable;
  deposeLe: Date;
  deposePar: { nomComplet: string | null };
  feedbacks: Array<{
    id: string;
    contenu: string;
    note: number | null;
    creeLe: Date;
    auteur: { nomComplet: string | null };
  }>;
}

const LIBELLES_STATUT_LIVRABLE: Record<StatutLivrable, { libelle: string; ton: "neutre" | "vert" | "orange" | "rouge" }> = {
  EN_REVUE:    { libelle: "En revue",    ton: "neutre" },
  VALIDE:      { libelle: "Validé",      ton: "vert" },
  A_CORRIGER:  { libelle: "À corriger",  ton: "orange" },
  REJETE:      { libelle: "Rejeté",      ton: "rouge" },
};

export function Livrables({ projetId, livrables }: { projetId: string; livrables: Livrable[] }) {
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold tracking-tight">Livrables</h2>
        {!formulaireOuvert ? (
          <Bouton apparence="accent" onClick={() => setFormulaireOuvert(true)}>
            <Plus className="h-4 w-4" /> Déposer un livrable
          </Bouton>
        ) : null}
      </div>

      {formulaireOuvert ? (
        <FormulaireDeposer projetId={projetId} onFerme={() => setFormulaireOuvert(false)} />
      ) : null}

      {livrables.length === 0 ? (
        <Carte>
          <CorpsCarte className="py-12 text-center text-sm text-texte-discret">
            Aucun livrable déposé pour l&apos;instant.
          </CorpsCarte>
        </Carte>
      ) : (
        <div className="space-y-3">
          {livrables.map((l) => <BlocLivrable key={l.id} livrable={l} />)}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Formulaire de dépôt
// ─────────────────────────────────────────────────────────────

function FormulaireDeposer({ projetId, onFerme }: { projetId: string; onFerme: () => void }) {
  const [enCours, demarrer] = useTransition();
  const [erreur, setErreur] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setErreur(null);
    demarrer(async () => {
      const r = await deposerLivrable(formData);
      if (!r?.succes) {
        setErreur(r?.message ?? "Erreur inconnue.");
      } else {
        onFerme();
      }
    });
  }

  return (
    <Carte>
      <EnteteCarte>
        <TitreCarte className="text-base">Nouveau livrable</TitreCarte>
      </EnteteCarte>
      <form action={handleSubmit}>
        <input type="hidden" name="projetId" value={projetId} />
        <CorpsCarte className="space-y-4">
          {erreur ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">{erreur}</p>
          ) : null}

          <ChampEtiquete libelle="Titre du livrable" pour="titre-livrable">
            <Champ id="titre-livrable" name="titre" required maxLength={160} placeholder="Ex. Maquette Figma v2" />
          </ChampEtiquete>

          <ChampEtiquete
            libelle="URL du fichier"
            pour="url-livrable"
            aide="Lien Drive / Notion / Figma / GitHub… Le stockage direct arrive en V1.3 (Supabase Storage)."
          >
            <Champ id="url-livrable" name="fichierUrl" type="url" required placeholder="https://" />
          </ChampEtiquete>

          <ChampEtiquete libelle="Description" pour="desc-livrable" optionnel>
            <ZoneTexte id="desc-livrable" name="description" rows={3} placeholder="Ce qui a été fait, ce qui reste, points d'attention…" />
          </ChampEtiquete>
        </CorpsCarte>
        <div className="flex justify-end gap-2 border-t border-bordure bg-jub-pierre-50 p-4">
          <Bouton apparence="fantome" type="button" onClick={onFerme}>Annuler</Bouton>
          <Bouton apparence="primaire" type="submit" chargement={enCours}>Déposer</Bouton>
        </div>
      </form>
    </Carte>
  );
}

// ─────────────────────────────────────────────────────────────
// Carte livrable + fil de feedback
// ─────────────────────────────────────────────────────────────

function BlocLivrable({ livrable }: { livrable: Livrable }) {
  const [filOuvert, setFilOuvert] = useState(false);
  const meta = LIBELLES_STATUT_LIVRABLE[livrable.statut];

  return (
    <Carte>
      <CorpsCarte className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-jub-sage-100 text-jub-sage-700">
              <Paperclip className="h-5 w-5" />
            </span>
            <div>
              <a
                href={livrable.fichierUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-jub-orange-600 hover:underline"
              >
                {livrable.titre}
              </a>
              <p className="text-xs text-texte-discret">
                Déposé par {livrable.deposePar.nomComplet ?? "—"} · {formaterDate(livrable.deposeLe)}
              </p>
              {livrable.description ? (
                <p className="mt-2 text-sm text-texte">{livrable.description}</p>
              ) : null}
            </div>
          </div>

          <SelecteurStatutLivrable livrableId={livrable.id} statutCourant={livrable.statut} />
        </div>

        <div className="flex items-center justify-between border-t border-bordure pt-3">
          <Insigne ton={meta.ton}>{meta.libelle}</Insigne>
          <button
            onClick={() => setFilOuvert((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-jub-sage-700 hover:text-jub-orange-600"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            {livrable.feedbacks.length} feedback{livrable.feedbacks.length > 1 ? "s" : ""}
            {filOuvert ? " · masquer" : " · afficher"}
          </button>
        </div>

        {filOuvert ? <FilFeedback livrableId={livrable.id} feedbacks={livrable.feedbacks} /> : null}
      </CorpsCarte>
    </Carte>
  );
}

function SelecteurStatutLivrable({ livrableId, statutCourant }: { livrableId: string; statutCourant: StatutLivrable }) {
  const [statut, setStatut] = useState(statutCourant);
  const [enCours, demarrer] = useTransition();

  function change(nouveau: StatutLivrable) {
    setStatut(nouveau);
    demarrer(async () => { await changerStatutLivrable(livrableId, nouveau); });
  }

  return (
    <Selecteur
      value={statut}
      disabled={enCours}
      onChange={(e) => change(e.target.value as StatutLivrable)}
      className="w-auto min-w-[140px] text-xs"
    >
      <option value="EN_REVUE">En revue</option>
      <option value="VALIDE">Validé</option>
      <option value="A_CORRIGER">À corriger</option>
      <option value="REJETE">Rejeté</option>
    </Selecteur>
  );
}

// ─────────────────────────────────────────────────────────────
// Fil de feedback : liste + formulaire d'ajout
// ─────────────────────────────────────────────────────────────

function FilFeedback({ livrableId, feedbacks }: { livrableId: string; feedbacks: Livrable["feedbacks"] }) {
  const [enCours, demarrer] = useTransition();
  const [erreur, setErreur] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setErreur(null);
    demarrer(async () => {
      const r = await ajouterFeedback(formData);
      if (!r?.succes) setErreur(r?.message ?? "Erreur.");
    });
  }

  return (
    <div className="mt-4 space-y-3 rounded-lg bg-jub-pierre-100/60 p-4">
      {feedbacks.length === 0 ? (
        <p className="text-xs italic text-texte-discret">Aucun feedback pour ce livrable.</p>
      ) : (
        feedbacks.map((f) => (
          <div key={f.id} className="rounded-md border border-bordure bg-fond-eleve p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold">{f.auteur.nomComplet ?? "—"}</span>
              <span className="text-[10px] text-texte-discret">{formaterDate(f.creeLe)}</span>
            </div>
            {f.note !== null ? (
              <div className="mt-1 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3",
                      i < f.note! ? "fill-jub-orange-500 text-jub-orange-500" : "text-jub-pierre-300",
                    )}
                  />
                ))}
              </div>
            ) : null}
            <p className="mt-2 whitespace-pre-wrap text-sm text-texte">{f.contenu}</p>
          </div>
        ))
      )}

      <form action={handleSubmit} className="space-y-2 border-t border-jub-pierre-300/40 pt-3">
        <input type="hidden" name="livrableId" value={livrableId} />
        {erreur ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-900">{erreur}</p>
        ) : null}
        <ZoneTexte name="contenu" required rows={2} placeholder="Ton retour sur ce livrable…" />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-xs text-texte-discret">
            Note :
            <Selecteur name="note" defaultValue="" className="h-8 w-auto text-xs">
              <option value="">—</option>
              <option value="1">1/5</option>
              <option value="2">2/5</option>
              <option value="3">3/5</option>
              <option value="4">4/5</option>
              <option value="5">5/5</option>
            </Selecteur>
          </label>
          <Bouton apparence="primaire" taille="sm" type="submit" chargement={enCours}>
            Envoyer
          </Bouton>
        </div>
      </form>
    </div>
  );
}
