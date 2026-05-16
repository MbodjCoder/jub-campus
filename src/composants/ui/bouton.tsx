import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const variantesBouton = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 ring-offset-fond active:scale-[0.98]",
  {
    variants: {
      apparence: {
        primaire:
          "bg-jub-vert-900 text-white hover:bg-jub-vert-700 shadow-sm shadow-jub-vert-900/20",
        accent:
          "bg-jub-jaune-500 text-jub-vert-950 hover:bg-jub-jaune-400 shadow-sm font-semibold",
        contour:
          "border border-bordure bg-fond-eleve text-texte hover:bg-jub-pierre-100",
        fantome:
          "text-texte hover:bg-jub-pierre-100",
        lien:
          "text-jub-vert-900 underline-offset-4 hover:underline px-0 h-auto",
        danger:
          "bg-red-600 text-white hover:bg-red-700",
      },
      taille: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icone: "h-10 w-10",
      },
      pleineLargeur: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      apparence: "primaire",
      taille: "md",
      pleineLargeur: false,
    },
  },
);

export interface ProprietesBouton
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variantesBouton> {
  chargement?: boolean;
}

export const Bouton = forwardRef<HTMLButtonElement, ProprietesBouton>(
  function Bouton(
    { className, apparence, taille, pleineLargeur, chargement, children, disabled, ...reste },
    ref,
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || chargement}
        className={cn(variantesBouton({ apparence, taille, pleineLargeur }), className)}
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
