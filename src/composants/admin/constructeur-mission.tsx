"use client";

// Constructeur de mission (ops) — ajout de tâches tarifées, répartition
// de l'enveloppe, ajout de talents, suppression de tâches non payées.

import { useState, useTransition } from "react";
import { Bouton } from "@/composants/ui/bouton";
import { Icon } from "@/composants/maquette/icones";
import {
  ajouterTacheMission,
  ajouterTalentMission,
  repartirEnveloppeMission,
  supprimerTacheMission,
} from "@/app/admin/missions/actions";

export function FormulaireAjoutTache({
  projetId,
  membres,
}: {
  projetId: string;
  membres: { etudiantId: string; nom: string }[];
}) {
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, demarrer] = useTransition();

  function soumettre(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("projetId", projetId);
    demarrer(async () => {
      const r = await ajouterTacheMission(fd);
      if (r.succes) form.reset();
      else setErreur(r.message ?? "Erreur.");
    });
  }

  return (
    <form onSubmit={soumettre} className="grid gap-2.5">
      <div className="grid gap-2.5 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <input className="champ" name="titre" required minLength={2} maxLength={160}
          placeholder="Ex. Zone Nord — 50 questionnaires" />
        <input className="champ t-mono" name="montantFcfa" type="number" min={0} step={100}
          placeholder="Gain FCFA (0 = à répartir)" />
      </div>
      <div className="grid gap-2.5 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto]">
        <select className="champ" name="assigneeId" defaultValue="">
          <option value="">— Non assignée —</option>
          {membres.map((m) => (
            <option key={m.etudiantId} value={m.etudiantId}>{m.nom}</option>
          ))}
        </select>
        <input className="champ" name="echeance" type="date" />
        <Bouton apparence="primaire" type="submit" disabled={enCours}>
          <Icon.Plus size={14} /> Ajouter
        </Bouton>
      </div>
      {erreur ? (
        <p className="m-0 rounded-lg bg-danger/10 px-3 py-2 text-[13px] text-danger">{erreur}</p>
      ) : null}
    </form>
  );
}

export function FormulaireAjoutTalent({ projetId }: { projetId: string }) {
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, demarrer] = useTransition();

  function soumettre(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("projetId", projetId);
    demarrer(async () => {
      const r = await ajouterTalentMission(fd);
      if (r.succes) form.reset();
      else setErreur(r.message ?? "Erreur.");
    });
  }

  return (
    <form onSubmit={soumettre} className="grid gap-2.5">
      <div className="flex gap-2.5">
        <input className="champ flex-1" name="talent" required
          placeholder="Slug du portfolio ou email du talent" />
        <Bouton apparence="contour" type="submit" disabled={enCours}>
          <Icon.Plus size={14} /> Ajouter
        </Bouton>
      </div>
      {erreur ? (
        <p className="m-0 rounded-lg bg-danger/10 px-3 py-2 text-[13px] text-danger">{erreur}</p>
      ) : null}
    </form>
  );
}

export function BoutonRepartirEnveloppe({ projetId }: { projetId: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [enCours, demarrer] = useTransition();
  return (
    <span className="inline-flex items-center gap-2">
      <Bouton
        apparence="contour"
        taille="sm"
        disabled={enCours}
        onClick={() =>
          demarrer(async () => {
            const r = await repartirEnveloppeMission(projetId);
            setMessage(r.succes ? null : (r.message ?? "Erreur."));
          })
        }
      >
        {enCours ? "…" : "Répartir l'enveloppe restante"}
      </Bouton>
      {message ? <span className="t-xs text-danger">{message}</span> : null}
    </span>
  );
}

export function BoutonSupprimerTache({ tacheId }: { tacheId: string }) {
  const [enCours, demarrer] = useTransition();
  return (
    <button
      className="cursor-pointer border-0 bg-transparent p-1 text-sage-400 hover:text-danger disabled:opacity-50"
      title="Supprimer la tâche"
      aria-label="Supprimer la tâche"
      disabled={enCours}
      onClick={() => demarrer(async () => void (await supprimerTacheMission(tacheId)))}
    >
      <Icon.X size={14} />
    </button>
  );
}
