import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Tuile KPI — libellé eyebrow, valeur en grand, indication discrète.
// Utilisée sur les dashboards (talent, client, ops).
export function StatTuile({
  libelle,
  valeur,
  indication,
  icone,
  className,
}: {
  libelle: string;
  valeur: ReactNode;
  indication?: ReactNode;
  icone?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("carte p-4", className)}>
      {icone ? <div className="mb-1.5 text-sage-600">{icone}</div> : null}
      <div className="t-eyebrow mb-1">{libelle}</div>
      <div className="text-2xl font-semibold tracking-tight t-mono">{valeur}</div>
      {indication ? <div className="t-xs t-discret mt-0.5">{indication}</div> : null}
    </div>
  );
}
