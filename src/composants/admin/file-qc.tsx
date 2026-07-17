"use client";

// File de contrôle qualité — revue des livrables au clavier.
// ↑/↓ : naviguer · V : valider · C : à corriger · R : rejeter.
// La validation d'un livrable rattaché à une tâche payée déclenche le
// crédit du portefeuille (server action changerStatutLivrable).

import { useEffect, useRef, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Bouton } from "@/composants/ui/bouton";
import { Icon } from "@/composants/maquette/icones";
import { formaterMontantFcfa } from "@/lib/utils";
import { changerStatutLivrable } from "@/app/app/projet/[id]/actions";

export interface LivrableQC {
  id: string;
  titre: string;
  fichierUrl: string;
  deposeLe: string;
  auteur: string;
  mission: string;
  gainFcfa: number | null;
}

type Decision = "VALIDE" | "A_CORRIGER" | "REJETE";

const LIBELLE_DECISION: Record<Decision, string> = {
  VALIDE: "validé",
  A_CORRIGER: "à corriger",
  REJETE: "rejeté",
};

export function FileQC({ livrables: initiaux }: { livrables: LivrableQC[] }) {
  const [livrables, setLivrables] = useState(initiaux);
  const [curseur, setCurseur] = useState(0);
  const [dernier, setDernier] = useState<string | null>(null);
  const [enCours, demarrer] = useTransition();
  const refListe = useRef<HTMLDivElement>(null);

  function decider(index: number, decision: Decision) {
    const l = livrables[index];
    if (!l || enCours) return;
    demarrer(async () => {
      const r = await changerStatutLivrable(l.id, decision);
      if (r.succes) {
        setLivrables((prev) => prev.filter((x) => x.id !== l.id));
        setCurseur((c) => Math.max(0, Math.min(c, livrables.length - 2)));
        setDernier(
          `« ${l.titre} » ${LIBELLE_DECISION[decision]}` +
            (decision === "VALIDE" && l.gainFcfa ? ` — ${formaterMontantFcfa(l.gainFcfa)} crédités à ${l.auteur}` : ""),
        );
      }
    });
  }

  useEffect(() => {
    function surTouche(e: KeyboardEvent) {
      // Ne pas intercepter la saisie dans un champ.
      const cible = e.target as HTMLElement;
      if (cible.tagName === "INPUT" || cible.tagName === "TEXTAREA" || cible.tagName === "SELECT") return;

      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        setCurseur((c) => Math.min(c + 1, livrables.length - 1));
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        setCurseur((c) => Math.max(c - 1, 0));
      } else if (e.key === "v" || e.key === "V") {
        decider(curseur, "VALIDE");
      } else if (e.key === "c" || e.key === "C") {
        decider(curseur, "A_CORRIGER");
      } else if (e.key === "r" || e.key === "R") {
        decider(curseur, "REJETE");
      }
    }
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curseur, livrables, enCours]);

  if (livrables.length === 0) {
    return (
      <div className="carte p-12 text-center">
        <Icon.Check size={26} className="mx-auto text-succes" />
        <p className="t-small mt-3 mb-0">
          File vide — tous les livrables sont traités.
          {dernier ? <><br /><span className="t-xs t-discret">Dernier : {dernier}</span></> : null}
        </p>
      </div>
    );
  }

  return (
    <div>
      {dernier ? (
        <p className="t-xs mb-3 rounded-lg bg-sage-50 px-3 py-2 text-sage-700">{dernier}</p>
      ) : null}

      <div ref={refListe} className="liste-bordee">
        {livrables.map((l, i) => (
          <div
            key={l.id}
            onClick={() => setCurseur(i)}
            className={cn(
              "flex flex-wrap items-center gap-3 px-4 py-3.5",
              i === curseur ? "bg-white ring-2 ring-inset ring-sage-500" : "bg-fond-eleve",
            )}
          >
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{l.titre}</div>
              <div className="t-xs t-discret">
                {l.mission} · {l.auteur} · {l.deposeLe}
                {l.gainFcfa ? <> · gain <span className="t-mono font-semibold">{formaterMontantFcfa(l.gainFcfa)}</span></> : null}
              </div>
            </div>
            <a
              href={l.fichierUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="t-xs inline-flex items-center gap-1 font-semibold text-orange-600 no-underline"
              onClick={(e) => e.stopPropagation()}
            >
              <Icon.FileText size={13} /> Ouvrir
            </a>
            <span className="flex gap-1.5">
              <Bouton apparence="accent" taille="sm" disabled={enCours} onClick={() => decider(i, "VALIDE")}>
                <Icon.Check size={13} /> Valider
              </Bouton>
              <Bouton apparence="contour" taille="sm" disabled={enCours} onClick={() => decider(i, "A_CORRIGER")}>
                Corriger
              </Bouton>
              <Bouton apparence="fantome" taille="sm" disabled={enCours} onClick={() => decider(i, "REJETE")}>
                Rejeter
              </Bouton>
            </span>
          </div>
        ))}
      </div>

      <p className="t-xs t-discret mt-3">
        Clavier : <kbd>↑</kbd>/<kbd>↓</kbd> naviguer · <kbd>V</kbd> valider · <kbd>C</kbd> à corriger · <kbd>R</kbd> rejeter
      </p>
    </div>
  );
}
