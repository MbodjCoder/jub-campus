"use client";

import { useState, useTransition } from "react";
import {
  DndContext, DragOverlay, useDraggable, useDroppable,
  PointerSensor, useSensor, useSensors,
  type DragEndEvent, type DragStartEvent,
} from "@dnd-kit/core";
import {
  CheckCircle2, Circle, CircleDot, Eye, GripVertical, Calendar,
} from "lucide-react";
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
  // Optimistic local state pour un drop fluide : on déplace immédiatement
  // dans l'état local, puis on appelle la server action en arrière-plan.
  const [tachesLocales, setTachesLocales] = useState<Tache[]>(taches);
  const [tacheActive, setTacheActive] = useState<Tache | null>(null);
  const [, demarrer] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function gererDebut(e: DragStartEvent) {
    const t = tachesLocales.find((x) => x.id === e.active.id);
    if (t) setTacheActive(t);
  }

  function gererFin(e: DragEndEvent) {
    setTacheActive(null);
    if (!e.over) return;
    const tacheId = String(e.active.id);
    const nouveauStatut = String(e.over.id) as StatutTache;

    const courante = tachesLocales.find((t) => t.id === tacheId);
    if (!courante || courante.statut === nouveauStatut) return;

    // Mise à jour optimiste
    setTachesLocales((prev) =>
      prev.map((t) => (t.id === tacheId ? { ...t, statut: nouveauStatut } : t)),
    );
    demarrer(async () => {
      const r = await deplacerTache(tacheId, nouveauStatut);
      if (!r.succes) {
        // Rollback en cas d'échec
        setTachesLocales((prev) =>
          prev.map((t) => (t.id === tacheId ? { ...t, statut: courante.statut } : t)),
        );
      }
    });
  }

  return (
    <DndContext sensors={sensors} onDragStart={gererDebut} onDragEnd={gererFin}>
      <div className="grid gap-4 lg:grid-cols-4">
        {COLONNES.map((col) => {
          const tachesColonne = tachesLocales.filter((t) => t.statut === col.statut);
          return (
            <ColonneKanban
              key={col.statut}
              statut={col.statut}
              libelle={col.libelle}
              icone={col.icone}
              taches={tachesColonne}
            />
          );
        })}
      </div>

      <DragOverlay>
        {tacheActive ? <CarteTache tache={tacheActive} survol /> : null}
      </DragOverlay>
    </DndContext>
  );
}

// ─────────────────────────────────────────────────────────────
// Colonne droppable
// ─────────────────────────────────────────────────────────────

function ColonneKanban({
  statut, libelle, icone: Icone, taches,
}: {
  statut: StatutTache;
  libelle: string;
  icone: React.ComponentType<{ className?: string }>;
  taches: Tache[];
}) {
  const { isOver, setNodeRef } = useDroppable({ id: statut });

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "flex min-h-[200px] flex-col rounded-2xl border p-3 transition-colors",
        isOver
          ? "border-jub-orange-500 bg-jub-orange-50"
          : "border-bordure bg-jub-pierre-100/40",
      )}
    >
      <header className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Icone className="h-4 w-4 text-jub-sage-700" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-jub-sage-700">{libelle}</h3>
        </div>
        <span className="rounded-full bg-jub-sage-200 px-2 py-0.5 text-xs font-bold text-jub-sage-900">
          {taches.length}
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-2.5">
        {taches.length === 0 ? (
          <p className="rounded-lg border border-dashed border-jub-sage-200 px-3 py-6 text-center text-xs text-texte-discret">
            {isOver ? "Dépose ici" : "Aucune tâche."}
          </p>
        ) : (
          taches.map((t) => <CarteTacheDraggable key={t.id} tache={t} />)
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Carte draggable (wrapper) + carte de rendu pur
// ─────────────────────────────────────────────────────────────

function CarteTacheDraggable({ tache }: { tache: Tache }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: tache.id });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "cursor-grab touch-none active:cursor-grabbing",
        isDragging && "opacity-30",
      )}
    >
      <CarteTache tache={tache} />
    </div>
  );
}

function CarteTache({ tache, survol = false }: { tache: Tache; survol?: boolean }) {
  return (
    <article
      className={cn(
        "group relative rounded-xl border border-bordure bg-fond-eleve p-3 shadow-sm transition-all",
        survol ? "rotate-2 shadow-2xl ring-2 ring-jub-orange-500" : "hover:border-jub-orange-300 hover:shadow-md",
      )}
    >
      <div className="flex items-start gap-2">
        <GripVertical aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-jub-pierre-300 group-hover:text-jub-sage-500" />
        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium leading-snug">{tache.titre}</p>
          {tache.description ? (
            <p className="line-clamp-2 text-xs text-texte-discret">{tache.description}</p>
          ) : null}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", COULEURS_PRIORITE[tache.priorite])}>
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
        </div>
      </div>
    </article>
  );
}
