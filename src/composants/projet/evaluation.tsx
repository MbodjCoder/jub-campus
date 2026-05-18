"use client";

import { useState, useTransition } from "react";
import { Star, Award, ChevronDown, ChevronUp } from "lucide-react";
import { Bouton } from "@/composants/ui/bouton";
import { ChampEtiquete, Selecteur, ZoneTexte } from "@/composants/ui/champ";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { cn } from "@/lib/utils";
import { soumettreEvaluation } from "@/app/app/projet/[id]/actions";

type Source = "MENTOR" | "ENTREPRISE" | "PAIR" | "AUTO" | "ADMIN";

interface Membre {
  id: string;
  prenom: string;
  nom: string;
}

interface Evaluation {
  id: string;
  source: Source;
  scoreGlobal: number;
  qualiteLivrable: number;
  respectDelais: number;
  communication: number;
  autonomie: number;
  collaboration: number;
  creativite: number;
  rigueur: number;
  resolutionProb: number;
  professionnalisme: number;
  contributionReelle: number;
  appreciation: string | null;
  creeLe: Date;
  etudiantId: string;
}

const LIBELLES_SOURCE: Record<Source, { libelle: string; ton: "vert" | "orange" | "bleu" | "violet" | "neutre" }> = {
  MENTOR:     { libelle: "Mentor",       ton: "vert" },
  ENTREPRISE: { libelle: "Entreprise",   ton: "violet" },
  PAIR:       { libelle: "Pair",         ton: "bleu" },
  AUTO:       { libelle: "Auto-éval",    ton: "neutre" },
  ADMIN:      { libelle: "Admin",        ton: "orange" },
};

const CRITERES = [
  { cle: "qualiteLivrable",    libelle: "Qualité du livrable",    poids: 20 },
  { cle: "respectDelais",      libelle: "Respect des délais",     poids: 10 },
  { cle: "communication",      libelle: "Communication",          poids: 10 },
  { cle: "autonomie",          libelle: "Autonomie",              poids: 8 },
  { cle: "collaboration",      libelle: "Collaboration",          poids: 10 },
  { cle: "creativite",         libelle: "Créativité",             poids: 7 },
  { cle: "rigueur",            libelle: "Rigueur",                poids: 10 },
  { cle: "resolutionProb",     libelle: "Résolution problème",    poids: 10 },
  { cle: "professionnalisme",  libelle: "Professionnalisme",      poids: 5 },
  { cle: "contributionReelle", libelle: "Contribution réelle",    poids: 10 },
] as const;

// ─────────────────────────────────────────────────────────────
// Section principale : agrégat + liste + formulaires
// ─────────────────────────────────────────────────────────────

export function SectionEvaluation({
  projetId, evaluations, membres, sourcesDispos,
}: {
  projetId: string;
  evaluations: Evaluation[];
  membres: Membre[];
  /** Sources que l'utilisateur connecté est autorisé à soumettre. */
  sourcesDispos: Source[];
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold tracking-tight">Évaluations</h2>
        <Agregat evaluations={evaluations} />
      </div>

      {evaluations.length === 0 ? (
        <Carte>
          <CorpsCarte className="py-10 text-center text-sm text-texte-discret">
            Aucune évaluation pour l&apos;instant.
          </CorpsCarte>
        </Carte>
      ) : (
        <div className="space-y-3">
          {evaluations.map((e) => <CarteEvaluation key={e.id} evaluation={e} membres={membres} />)}
        </div>
      )}

      {sourcesDispos.length > 0 ? (
        <BoutonNouvelleEvaluation
          projetId={projetId}
          membres={membres}
          sourcesDispos={sourcesDispos}
        />
      ) : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Agrégat moyenne pondérée toutes sources
// ─────────────────────────────────────────────────────────────

function Agregat({ evaluations }: { evaluations: Evaluation[] }) {
  if (evaluations.length === 0) return null;
  const moy = evaluations.reduce((s, e) => s + e.scoreGlobal, 0) / evaluations.length;
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-jub-sage-500 px-4 py-2 shadow-md">
      <Award className="h-5 w-5 text-jub-orange-500" />
      <div className="text-right">
        <p className="text-[10px] uppercase tracking-wider text-jub-sage-100">Score moyen</p>
        <p className="font-mono text-xl font-bold text-jub-orange-500">
          {moy.toFixed(1)}<span className="text-sm text-jub-sage-100"> / 10</span>
        </p>
      </div>
      <span className="rounded-full bg-jub-sage-700 px-2 py-0.5 text-[10px] font-semibold text-jub-sage-100">
        {evaluations.length} éval{evaluations.length > 1 ? "s" : ""}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Carte évaluation (dépliable)
// ─────────────────────────────────────────────────────────────

function CarteEvaluation({ evaluation, membres }: { evaluation: Evaluation; membres: Membre[] }) {
  const [ouvert, setOuvert] = useState(false);
  const meta = LIBELLES_SOURCE[evaluation.source];
  const etudiantNom = membres.find((m) => m.id === evaluation.etudiantId);

  return (
    <Carte>
      <CorpsCarte className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Insigne ton={meta.ton}>{meta.libelle}</Insigne>
            {etudiantNom ? (
              <span className="text-sm font-medium">{etudiantNom.prenom} {etudiantNom.nom}</span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-jub-orange-600">
              {evaluation.scoreGlobal.toFixed(1)}
              <span className="text-xs text-texte-discret"> / 10</span>
            </span>
            <button
              onClick={() => setOuvert((v) => !v)}
              className="text-xs text-jub-sage-700 hover:text-jub-orange-600 inline-flex items-center gap-0.5"
            >
              {ouvert ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              Détails
            </button>
          </div>
        </div>

        {ouvert ? (
          <div className="space-y-2 border-t border-bordure pt-3">
            {CRITERES.map((c) => {
              const valeur = evaluation[c.cle] as number;
              return (
                <div key={c.cle} className="flex items-center gap-3">
                  <span className="w-44 shrink-0 text-xs text-texte-discret">
                    {c.libelle}{" "}
                    <span className="text-[10px] text-jub-sage-400">({c.poids}%)</span>
                  </span>
                  <BarreCritere valeur={valeur} />
                  <span className="w-10 text-right font-mono text-xs font-bold">{valeur}/10</span>
                </div>
              );
            })}
            {evaluation.appreciation ? (
              <p className="mt-3 rounded-md bg-jub-pierre-100 p-3 text-sm italic text-texte">
                « {evaluation.appreciation} »
              </p>
            ) : null}
          </div>
        ) : null}
      </CorpsCarte>
    </Carte>
  );
}

function BarreCritere({ valeur }: { valeur: number }) {
  const pourcent = (valeur / 10) * 100;
  const ton =
    valeur >= 8 ? "bg-emerald-500" :
    valeur >= 5 ? "bg-jub-orange-500" : "bg-red-500";
  return (
    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-jub-sage-100">
      <div className={cn("h-full rounded-full transition-all", ton)} style={{ width: `${pourcent}%` }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bouton + formulaire de nouvelle évaluation
// ─────────────────────────────────────────────────────────────

function BoutonNouvelleEvaluation({
  projetId, membres, sourcesDispos,
}: {
  projetId: string;
  membres: Membre[];
  sourcesDispos: Source[];
}) {
  const [ouvert, setOuvert] = useState(false);
  if (!ouvert) {
    return (
      <Bouton apparence="contour" onClick={() => setOuvert(true)}>
        <Star className="h-4 w-4" /> Soumettre une évaluation
      </Bouton>
    );
  }
  return (
    <FormulaireEvaluation
      projetId={projetId}
      membres={membres}
      sourcesDispos={sourcesDispos}
      onFerme={() => setOuvert(false)}
    />
  );
}

function FormulaireEvaluation({
  projetId, membres, sourcesDispos, onFerme,
}: {
  projetId: string;
  membres: Membre[];
  sourcesDispos: Source[];
  onFerme: () => void;
}) {
  const [enCours, demarrer] = useTransition();
  const [erreur, setErreur] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setErreur(null);
    demarrer(async () => {
      const r = await soumettreEvaluation(formData);
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
        <TitreCarte className="text-base">Nouvelle évaluation</TitreCarte>
      </EnteteCarte>
      <form action={handleSubmit}>
        <input type="hidden" name="projetId" value={projetId} />
        <CorpsCarte className="space-y-5">
          {erreur ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">{erreur}</p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <ChampEtiquete libelle="Étudiant évalué" pour="eval-etudiant">
              <Selecteur id="eval-etudiant" name="etudiantId" required>
                {membres.map((m) => (
                  <option key={m.id} value={m.id}>{m.prenom} {m.nom}</option>
                ))}
              </Selecteur>
            </ChampEtiquete>
            <ChampEtiquete libelle="Source" pour="eval-source">
              <Selecteur id="eval-source" name="source" required defaultValue={sourcesDispos[0]}>
                {sourcesDispos.map((s) => (
                  <option key={s} value={s}>{LIBELLES_SOURCE[s].libelle}</option>
                ))}
              </Selecteur>
            </ChampEtiquete>
          </div>

          <div className="space-y-3 rounded-lg border border-bordure bg-jub-pierre-100/40 p-4">
            <p className="text-xs uppercase tracking-wider text-texte-discret">
              Note chaque critère de 1 à 10. La pondération est appliquée automatiquement.
            </p>
            {CRITERES.map((c) => (
              <CritereSlider key={c.cle} cle={c.cle} libelle={c.libelle} poids={c.poids} />
            ))}
          </div>

          <ChampEtiquete libelle="Appréciation libre" pour="eval-appre" optionnel>
            <ZoneTexte id="eval-appre" name="appreciation" rows={3} placeholder="Forces, axes d'amélioration, faits marquants…" />
          </ChampEtiquete>
        </CorpsCarte>
        <div className="flex justify-end gap-2 border-t border-bordure bg-jub-pierre-50 p-4">
          <Bouton apparence="fantome" type="button" onClick={onFerme}>Annuler</Bouton>
          <Bouton apparence="primaire" type="submit" chargement={enCours}>Soumettre l&apos;évaluation</Bouton>
        </div>
      </form>
    </Carte>
  );
}

function CritereSlider({ cle, libelle, poids }: { cle: string; libelle: string; poids: number }) {
  const [valeur, setValeur] = useState(7);
  return (
    <div className="flex items-center gap-3">
      <label htmlFor={`crit-${cle}`} className="w-44 shrink-0 text-xs font-medium">
        {libelle} <span className="text-[10px] text-jub-sage-400">({poids}%)</span>
      </label>
      <input
        id={`crit-${cle}`}
        name={cle}
        type="range"
        min={1}
        max={10}
        step={1}
        value={valeur}
        onChange={(e) => setValeur(Number(e.target.value))}
        className="flex-1 accent-jub-orange-500"
      />
      <input
        type="number"
        min={1}
        max={10}
        value={valeur}
        onChange={(e) => setValeur(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
        className="h-8 w-14 rounded-md border border-bordure bg-fond-eleve px-2 text-center font-mono text-sm"
      />
    </div>
  );
}
