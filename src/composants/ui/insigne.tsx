import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const variantesInsigne = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      ton: {
        neutre: "bg-jub-pierre-100 text-jub-pierre-700 border-jub-pierre-200",
        vert:   "bg-jub-vert-100 text-jub-vert-900 border-jub-vert-200",
        jaune:  "bg-amber-100 text-amber-900 border-amber-200",
        bleu:   "bg-sky-100 text-sky-900 border-sky-200",
        violet: "bg-violet-100 text-violet-900 border-violet-200",
        rouge:  "bg-red-100 text-red-900 border-red-200",
        sombre: "bg-jub-vert-950 text-white border-jub-vert-950",
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
