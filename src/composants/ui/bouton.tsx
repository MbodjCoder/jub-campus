import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Bouton — repose sur les classes statiques `.btn*` de globals.css.
// Aucun style calculé au runtime : la classe est résolue à la compilation.
type Apparence = "primaire" | "accent" | "contour" | "fantome" | "sombre" | "lien" | "danger";
type Taille = "sm" | "md" | "lg" | "xl" | "icone";

const CLASSE_APPARENCE: Record<Apparence, string> = {
  primaire: "btn--primaire",
  accent: "btn--accent",
  contour: "btn--contour",
  fantome: "btn--fantome",
  sombre: "btn--sombre",
  lien: "btn--lien",
  danger: "btn--danger",
};

const CLASSE_TAILLE: Record<Taille, string> = {
  sm: "btn--sm",
  md: "",
  lg: "btn--lg",
  xl: "btn--xl",
  icone: "btn--icone",
};

export interface ProprietesBouton extends ButtonHTMLAttributes<HTMLButtonElement> {
  apparence?: Apparence;
  taille?: Taille;
  pleineLargeur?: boolean;
  chargement?: boolean;
}

export const Bouton = forwardRef<HTMLButtonElement, ProprietesBouton>(
  function Bouton(
    { className, apparence = "primaire", taille = "md", pleineLargeur, chargement, children, disabled, ...reste },
    ref,
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || chargement}
        className={cn(
          "btn",
          CLASSE_APPARENCE[apparence],
          CLASSE_TAILLE[taille],
          pleineLargeur && "w-full",
          className,
        )}
        {...reste}
      >
        {chargement ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  },
);
