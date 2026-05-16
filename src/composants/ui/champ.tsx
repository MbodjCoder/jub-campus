import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const stylesBase =
  "w-full rounded-md border border-bordure bg-fond-eleve px-3 py-2 text-sm text-texte placeholder:text-texte-discret focus:border-jub-vert-700 focus:outline-none focus:ring-2 focus:ring-jub-vert-700/20 disabled:opacity-60 transition-colors";

export const Champ = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Champ({ className, ...reste }, ref) {
    return <input ref={ref} className={cn(stylesBase, "h-10", className)} {...reste} />;
  },
);

export const ZoneTexte = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function ZoneTexte({ className, rows = 5, ...reste }, ref) {
    return <textarea ref={ref} rows={rows} className={cn(stylesBase, "min-h-24 resize-y", className)} {...reste} />;
  },
);

export const Selecteur = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Selecteur({ className, children, ...reste }, ref) {
    return (
      <select ref={ref} className={cn(stylesBase, "h-10 pr-9 appearance-none bg-no-repeat bg-[right_0.6rem_center] bg-[length:18px] bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2378716c%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%226 9 12 15 18 9%22/></svg>')]", className)} {...reste}>
        {children}
      </select>
    );
  },
);

interface ProprietesEtiquette {
  libelle: string;
  pour?: string;
  optionnel?: boolean;
  aide?: string;
  erreur?: string;
  children: React.ReactNode;
}

export function ChampEtiquete({ libelle, pour, optionnel, aide, erreur, children }: ProprietesEtiquette) {
  return (
    <label htmlFor={pour} className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-texte">
        {libelle}
        {optionnel ? <span className="text-texte-discret font-normal"> (optionnel)</span> : null}
      </span>
      {children}
      {erreur ? (
        <span className="text-xs text-alerte">{erreur}</span>
      ) : aide ? (
        <span className="text-xs text-texte-discret">{aide}</span>
      ) : null}
    </label>
  );
}
