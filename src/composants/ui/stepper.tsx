import { Fragment } from "react";
import { cn } from "@/lib/utils";

// Stepper horizontal — parcours guidé (brief client, onboarding).
// `etapeActive` est un index 0-based ; les étapes précédentes sont « faites ».
export function Stepper({
  etapes,
  etapeActive,
  className,
}: {
  etapes: readonly string[];
  etapeActive: number;
  className?: string;
}) {
  return (
    <ol className={cn("stepper list-none p-0 m-0", className)} aria-label="Progression">
      {etapes.map((libelle, i) => {
        const faite = i < etapeActive;
        const active = i === etapeActive;
        return (
          <Fragment key={libelle}>
            {i > 0 ? <span aria-hidden className="stepper-trait" /> : null}
            <li
              className={cn(
                "stepper-etape",
                active && "stepper-etape--active",
                faite && "stepper-etape--faite",
              )}
              aria-current={active ? "step" : undefined}
            >
              <span aria-hidden className="stepper-pastille">
                {faite ? "✓" : i + 1}
              </span>
              <span
                className={cn(
                  "truncate text-[13px]",
                  active ? "font-semibold text-texte" : "text-texte-discret",
                  // Sur mobile, seul le libellé de l'étape active est affiché.
                  !active && "hide-sm",
                )}
              >
                {libelle}
              </span>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
