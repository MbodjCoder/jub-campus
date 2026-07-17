import { cn } from "@/lib/utils";

// Barre de progression — la largeur est la seule valeur réellement
// dynamique : style inline autorisé sur ce point précis.
export function BarreProgression({
  valeur,
  max = 100,
  accent = false,
  etiquette,
  className,
}: {
  valeur: number;
  max?: number;
  accent?: boolean;
  /** Libellé accessible (ex. « Progression de la mission »). */
  etiquette?: string;
  className?: string;
}) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (valeur / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={etiquette}
      className={cn("barre-prog", accent && "barre-prog--accent", className)}
    >
      {/* eslint-disable-next-line react/forbid-dom-props -- largeur réellement dynamique */}
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}
