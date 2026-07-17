import { cn } from "@/lib/utils";

// Squelette de chargement — blocs shimmer pendant les Suspense/loading.
export function Squelette({ className }: { className?: string }) {
  return <div aria-hidden className={cn("squelette h-4 w-full", className)} />;
}

/** Ligne de liste squelette (vignette + deux lignes de texte). */
export function SqueletteLigne({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center gap-4 p-4", className)}>
      <div className="squelette h-12 w-12 shrink-0 rounded-[10px]" />
      <div className="flex-1 space-y-2">
        <div className="squelette h-3 w-1/3" />
        <div className="squelette h-4 w-2/3" />
      </div>
    </div>
  );
}

/** Carte squelette (pour grilles de tuiles/statistiques). */
export function SqueletteCarte({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("carte space-y-3 p-4", className)}>
      <div className="squelette h-3 w-1/3" />
      <div className="squelette h-7 w-1/2" />
      <div className="squelette h-3 w-2/3" />
    </div>
  );
}
