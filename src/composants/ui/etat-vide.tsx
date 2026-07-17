import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

// État vide — jamais de page blanche : icône, message, action.
// Convention du projet : « pas de faux parcours silencieux ».
export function EtatVide({
  icone,
  titre,
  description,
  action,
  className,
}: {
  icone?: ReactNode;
  titre: string;
  description?: string;
  /** CTA optionnel (LienBouton ou Bouton). */
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("carte flex flex-col items-center justify-center gap-3 px-6 py-14 text-center", className)}>
      {icone ? (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-50 text-sage-600">
          {icone}
        </div>
      ) : null}
      <div>
        <p className="t-h3 m-0">{titre}</p>
        {description ? <p className="t-small mx-auto mt-1 mb-0 max-w-sm">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
