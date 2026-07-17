import { cn } from "@/lib/utils";

// Logo JUB — repose sur les classes `.logo-*` de globals.css. Zéro style inline.
type TailleLogo = "md" | "lg" | "xl";

const CLASSE_PASTILLE: Record<TailleLogo, string> = {
  md: "logo-pastille",
  lg: "logo-pastille logo-pastille--lg",
  xl: "logo-pastille logo-pastille--xl",
};

const CLASSE_MOT: Record<TailleLogo, string> = {
  md: "text-base",
  lg: "text-[22px]",
  xl: "text-3xl",
};

export function Logo({
  taille = "md",
  mot = true,
  blanc = false,
  className,
}: {
  taille?: TailleLogo;
  mot?: boolean;
  blanc?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("logo-cadre", className)}>
      <span className={cn(CLASSE_PASTILLE[taille], blanc && "logo-pastille--blanc")} />
      {mot ? <span className={cn("logo-mot", CLASSE_MOT[taille])}>JUB</span> : null}
    </span>
  );
}
