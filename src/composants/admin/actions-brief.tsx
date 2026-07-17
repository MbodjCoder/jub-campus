"use client";

// Transitions du pipeline briefs (ops) : qualifier, envoyer devis, perdre.

import { useState, useTransition } from "react";
import { Bouton } from "@/composants/ui/bouton";
import { FeuilleModale } from "@/composants/ui/feuille-modale";
import { changerStatutBrief } from "@/app/admin/briefs/actions";

export function ActionsBrief({ briefId, statut, titre }: { briefId: string; statut: string; titre: string }) {
  const [modale, setModale] = useState<"devis" | "perdu" | null>(null);
  const [devisUrl, setDevisUrl] = useState("");
  const [motif, setMotif] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, demarrer] = useTransition();

  function transitionner(nouveau: "EN_QUALIFICATION" | "DEVIS_ENVOYE" | "PERDU") {
    setErreur(null);
    const fd = new FormData();
    fd.set("briefId", briefId);
    fd.set("statut", nouveau);
    if (nouveau === "DEVIS_ENVOYE" && devisUrl) fd.set("devisUrl", devisUrl);
    if (nouveau === "PERDU") fd.set("motifPerte", motif);
    demarrer(async () => {
      const r = await changerStatutBrief(fd);
      if (r.succes) setModale(null);
      else setErreur(r.message ?? "Erreur.");
    });
  }

  return (
    <span className="flex flex-wrap items-center gap-1.5">
      {statut === "RECU" ? (
        <Bouton apparence="contour" taille="sm" disabled={enCours} onClick={() => transitionner("EN_QUALIFICATION")}>
          Qualifier
        </Bouton>
      ) : null}
      {statut === "RECU" || statut === "EN_QUALIFICATION" ? (
        <Bouton apparence="accent" taille="sm" onClick={() => setModale("devis")}>
          Envoyer devis
        </Bouton>
      ) : null}
      {statut !== "PERDU" && statut !== "ACCEPTE" ? (
        <Bouton apparence="fantome" taille="sm" onClick={() => setModale("perdu")}>
          Perdu
        </Bouton>
      ) : null}

      {modale === "devis" ? (
        <FeuilleModale onClose={() => setModale(null)} titre="Envoyer le devis" surTitre={titre} className="max-w-[440px]">
          <label className="grid gap-1">
            <span className="text-xs font-semibold">Lien du devis (PDF hébergé, optionnel)</span>
            <input className="champ" type="url" value={devisUrl}
              onChange={(e) => setDevisUrl(e.target.value)} placeholder="https://…" />
          </label>
          {erreur ? <p className="mt-2 mb-0 text-[13px] text-danger">{erreur}</p> : null}
          <div className="mt-4 flex justify-end gap-2.5">
            <Bouton apparence="fantome" onClick={() => setModale(null)}>Annuler</Bouton>
            <Bouton apparence="accent" disabled={enCours} onClick={() => transitionner("DEVIS_ENVOYE")}>
              {enCours ? "…" : "Confirmer l'envoi"}
            </Bouton>
          </div>
        </FeuilleModale>
      ) : null}

      {modale === "perdu" ? (
        <FeuilleModale onClose={() => setModale(null)} titre="Marquer comme perdu" surTitre={titre} className="max-w-[440px]">
          <label className="grid gap-1">
            <span className="text-xs font-semibold">Motif (interne)</span>
            <textarea className="champ champ--ta" rows={3} value={motif}
              onChange={(e) => setMotif(e.target.value)} placeholder="Budget insuffisant, sans réponse…" />
          </label>
          {erreur ? <p className="mt-2 mb-0 text-[13px] text-danger">{erreur}</p> : null}
          <div className="mt-4 flex justify-end gap-2.5">
            <Bouton apparence="fantome" onClick={() => setModale(null)}>Annuler</Bouton>
            <Bouton apparence="primaire" disabled={enCours} onClick={() => transitionner("PERDU")}>
              {enCours ? "…" : "Confirmer"}
            </Bouton>
          </div>
        </FeuilleModale>
      ) : null}
    </span>
  );
}
