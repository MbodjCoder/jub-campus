import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Insigne / pill / pastille — palette stricte JUB (sage + orange) en priorité.
// Les tons jaune/bleu/violet/rouge restent pour les statuts (succès,
// info, état projet…) mais le ton "vert" pointe sur le sage de marque.
const variantesInsigne = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      ton: {
        neutre: "bg-jub-pierre-100 text-jub-pierre-700 border-jub-pierre-200",
        vert:   "bg-jub-sage-100 text-jub-sage-900 border-jub-sage-200",
        sage:   "bg-jub-sage-100 text-jub-sage-900 border-jub-sage-200",
        orange: "bg-jub-orange-100 text-jub-orange-700 border-jub-orange-200",
        jaune:  "bg-jub-orange-100 text-jub-orange-700 border-jub-orange-200",
        bleu:   "bg-sky-100 text-sky-900 border-sky-200",
        violet: "bg-violet-100 text-violet-900 border-violet-200",
        rouge:  "bg-red-100 text-red-900 border-red-200",
        succes: "bg-emerald-100 text-emerald-900 border-emerald-200",
        sombre: "bg-jub-sage-950 text-jub-orange-500 border-jub-sage-950",
      },
    },
    defaultVariants: { ton: "neutre" },
  },
);

export interface ProprietesInsigne
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof variantesInsigne> {}

export function Insigne({ className, ton, ...reste }: ProprietesInsigne) {
  return <span className={cn(variantesInsigne({ ton }), className)} {...reste} />;
}
