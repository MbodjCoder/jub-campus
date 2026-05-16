import { cn } from "@/lib/utils";

type TailleLogo = "md" | "lg" | "xl";

const TAILLE_PASTILLE: Record<TailleLogo, string> = {
  md: "",
  lg: "logo-pastille--lg",
  xl: "logo-pastille--xl",
};

const TAILLE_MOT: Record<TailleLogo, number> = { md: 16, lg: 22, xl: 30 };

interface ProprietesLogo {
  taille?: TailleLogo;
  /** Affiche le mot « JUB » à côté de la pastille. */
  mot?: boolean;
  /** Variante claire (pastille blanche, mot blanc) — pour fonds sombres. */
  blanc?: boolean;
  className?: string;
}

/** Logo JUB — pastille orange + point sage, mot optionnel. */
export function Logo({ taille = "md", mot = true, blanc = false, className }: ProprietesLogo) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className={cn("logo-pastille", TAILLE_PASTILLE[taille], blanc && "logo-pastille--blanc")} />
      {mot ? (
        <span
          className="logo-mot"
          style={{ fontSize: TAILLE_MOT[taille], color: blanc ? "#fff" : "var(--orange-500)" }}
        >
          JUB
        </span>
      ) : null}
    </span>
  );
}
