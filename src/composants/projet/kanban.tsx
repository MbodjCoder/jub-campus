"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Circle, CircleDot, Eye, GripVertical, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { deplacerTache } from "@/app/app/projet/[id]/actions";
import { formaterDate } from "@/lib/utils";

type StatutTache = "A_FAIRE" | "EN_COURS" | "EN_REVUE" | "TERMINEE";

interface Tache {
  id: string;
  titre: string;
  description: string | null;
  statut: StatutTache;
  priorite: "BASSE" | "NORMALE" | "HAUTE" | "URGENTE";
  echeance: Date | null;
  assignee?: { id: string; prenom: string; nom: string } | null;
}

const COLONNES: Array<{ statut: StatutTache; libelle: string; icone: React.ComponentType<{ className?: string }> }> = [
  { statut: "A_FAIRE",  libelle: "À faire",   icone: Circle },
  { statut: "EN_COURS", libelle: "En cours",  icone: CircleDot },
  { statut: "EN_REVUE", libelle: "En revue",  icone: Eye },
  { statut: "TERMINEE", libelle: "Terminée",  icone: CheckCircle2 },
];

const COULEURS_PRIORITE: Record<Tache["priorite"], string> = {
  BASSE:   "bg-jub-sage-100 text-jub-sage-700",
  NORMALE: "bg-jub-sage-50 text-jub-sage-700",
  HAUTE:   "bg-jub-orange-100 text-jub-orange-700",
  URGENTE: "bg-red-100 text-red-700",
};

export function Kanban({ taches }: { taches: Tache[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {COLONNES.map((col) => {
        const tachesColonne = taches.filter((t) => t.statut === col.statut);
        const Icone = col.icone;
        return (
          <section
            key={col.statut}
            className="flex min-h-[200px] flex-col rounded-2xl border border-bordure bg-jub-pierre-100/40 p-3"
          >
            <header className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Icone className="h-4 w-4 text-jub-sage-700" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-jub-sage-700">
                  {col.libelle}
                </h3>
              </div>
              <span className="rounded-full bg-jub-sage-200 px-2 py-0.5 text-xs font-bold text-jub-sage-900">
                {tachesColonne.length}
              </span>
            </header>

            <div className="flex flex-1 flex-col gap-2.5">
              {tachesColonne.length === 0 ? (
                <p className="rounded-lg border border-dashed border-jub-sage-200 px-3 py-6 text-center text-xs text-texte-discret">
                  Aucune tâche.
                </p>
              ) : (
                tachesColonne.map((t) => <CarteTache key={t.id} tache={t} />)
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function CarteTache({ tache }: { tache: Tache }) {
  const [enCours, demarrer] = useTransition();
  const [statutCourant, setStatutCourant] = useState(tache.statut);

  function handleChange(nouveau: StatutTache) {
    setStatutCourant(nouveau);
    demarrer(async () => {
      await deplacerTache(tache.id, nouveau);
    });
  }

  return (
    <article
      className={cn(
        "group relative rounded-xl border border-bordure bg-fond-eleve p-3 shadow-sm transition-all hover:border-jub-orange-300 hover:shadow-md",
        enCours && "opacity-60",
      )}
    >
      <div className="flex items-start gap-2">
        <GripVertical
          aria-hidden
          className="mt-0.5 h-4 w-4 shrink-0 text-jub-pierre-300 group-hover:text-jub-sage-500"
        />
        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium leading-snug">{tache.titre}</p>
          {tache.description ? (
            <p className="line-clamp-2 text-xs text-texte-discret">{tache.description}</p>
          ) : null}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                COULEURS_PRIORITE[tache.priorite],
              )}
            >
              {tache.priorite}
            </span>
            {tache.echeance ? (
              <span className="inline-flex items-center gap-1 text-[10px] text-texte-discret">
                <Calendar className="h-3 w-3" />
                {formaterDate(tache.echeance)}
              </span>
            ) : null}
            {tache.assignee ? (
              <span
                className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-jub-orange-500 text-[10px] font-bold text-white"
                title={`${tache.assignee.prenom} ${tache.assignee.nom}`}
              >
                {tache.assignee.prenom[0]}{tache.assignee.nom[0]}
              </span>
            ) : null}
          </div>

          <select
            value={statutCourant}
            disabled={enCours}
            onChange={(e) => handleChange(e.target.value as StatutTache)}
            className="mt-1 w-full rounded-md border border-bordure bg-fond px-2 py-1 text-[11px] text-jub-sage-700 transition-colors hover:border-jub-orange-300 focus:outline-none focus:ring-2 focus:ring-jub-orange-300"
          >
            {COLONNES.map((c) => (
              <option key={c.statut} value={c.statut}>Déplacer → {c.libelle}</option>
            ))}
          </select>
        </div>
      </div>
    </article>
  );
}
