"use client";

// Formulaire de création de mission (ops). La marge se calcule en direct.

import { useState, useTransition } from "react";
import { Bouton } from "@/composants/ui/bouton";
import { formaterMontantFcfa } from "@/lib/utils";
import { creerMission } from "@/app/admin/missions/actions";

const TYPES = [
  { v: "ENQUETE_TERRAIN", l: "Enquête terrain" },
  { v: "ANNOTATION_DONNEES", l: "Annotation de données" },
  { v: "RECHERCHE", l: "Étude / recherche" },
  { v: "REDACTION", l: "Rédaction" },
  { v: "DATA", l: "Data" },
] as const;

export function FormulaireMission({
  clients,
  briefs,
}: {
  clients: { id: string; raisonSociale: string }[];
  briefs: { id: string; titre: string }[];
}) {
  const [montantClient, setMontantClient] = useState("");
  const [enveloppe, setEnveloppe] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, demarrer] = useTransition();

  const mc = Number(montantClient) || 0;
  const env = Number(enveloppe) || 0;
  const marge = mc - env;
  const margePct = mc > 0 ? Math.round((marge / mc) * 100) : 0;

  function soumettre(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur(null);
    const fd = new FormData(e.currentTarget);
    demarrer(async () => {
      // creerMission redirige vers le constructeur en cas de succès.
      const r = await creerMission(fd);
      if (r && !r.succes) setErreur(r.message);
    });
  }

  return (
    <form onSubmit={soumettre} className="grid gap-4">
      <label className="grid gap-1">
        <span className="text-xs font-semibold">Titre de la mission</span>
        <input className="champ" name="titre" required minLength={4} maxLength={160}
          placeholder="Enquête satisfaction — 400 ménages, Saint-Louis" />
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-semibold">Résumé (visible par les talents assignés)</span>
        <textarea className="champ champ--ta" name="resume" rows={3} required minLength={10} maxLength={600}
          placeholder="Objectif, zone, méthode, volumes attendus…" />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-xs font-semibold">Type</span>
          <select className="champ" name="categorie">
            {TYPES.map((t) => (
              <option key={t.v} value={t.v}>{t.l}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-semibold">Client (optionnel)</span>
          <select className="champ" name="clientId" defaultValue="">
            <option value="">— Client direct / hors plateforme —</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.raisonSociale}</option>
            ))}
          </select>
        </label>
      </div>

      {briefs.length > 0 ? (
        <label className="grid gap-1">
          <span className="text-xs font-semibold">Brief d&apos;origine (optionnel)</span>
          <select className="champ" name="briefId" defaultValue="">
            <option value="">— Aucun —</option>
            {briefs.map((b) => (
              <option key={b.id} value={b.id}>{b.titre}</option>
            ))}
          </select>
        </label>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="grid gap-1">
          <span className="text-xs font-semibold">Montant client (FCFA)</span>
          <input className="champ t-mono" name="montantClientFcfa" type="number" min={1} required
            value={montantClient} onChange={(e) => setMontantClient(e.target.value)} placeholder="2000000" />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-semibold">Enveloppe talents (FCFA)</span>
          <input className="champ t-mono" name="enveloppeTalentsFcfa" type="number" min={1} required
            value={enveloppe} onChange={(e) => setEnveloppe(e.target.value)} placeholder="1300000" />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-semibold">Durée (jours)</span>
          <input className="champ t-mono" name="dureeJours" type="number" min={1} max={365} required placeholder="30" />
        </label>
      </div>

      {mc > 0 && env > 0 ? (
        <div
          className={
            marge >= 0
              ? "rounded-xl border border-bordure bg-fond-eleve px-4 py-3"
              : "rounded-xl border border-danger/30 bg-danger/10 px-4 py-3"
          }
        >
          <span className="t-small">
            Marge JUB : <strong className="t-mono">{formaterMontantFcfa(marge)}</strong> ({margePct} %)
            {marge < 0 ? " — enveloppe supérieure au montant client !" : null}
          </span>
        </div>
      ) : null}

      <label className="grid max-w-[200px] gap-1">
        <span className="text-xs font-semibold">Places max</span>
        <input className="champ t-mono" name="placesMax" type="number" min={1} max={50} defaultValue={5} />
      </label>

      {erreur ? (
        <p className="m-0 rounded-lg bg-danger/10 px-3 py-2 text-[13px] text-danger">{erreur}</p>
      ) : null}

      <div className="flex justify-end">
        <Bouton apparence="accent" type="submit" disabled={enCours || marge < 0}>
          {enCours ? "Création…" : "Créer la mission"}
        </Bouton>
      </div>
    </form>
  );
}
