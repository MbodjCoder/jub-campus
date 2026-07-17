import Link from "next/link";
import { type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Lien Next stylé comme un bouton — même vocabulaire visuel que <Bouton>,
// mais rend un <a> (navigation) au lieu d'un <button> (action).
type Apparence = "primaire" | "accent" | "contour" | "fantome" | "sombre" | "lien" | "verre";
type Taille = "sm" | "md" | "lg" | "xl";

const CLASSE_APPARENCE: Record<Apparence, string> = {
  primaire: "btn--primaire",
  accent: "btn--accent",
  contour: "btn--contour",
  fantome: "btn--fantome",
  sombre: "btn--sombre",
  lien: "btn--lien",
  // Verre dépoli sur photo (hero, CTA) — lisible sur fond sombre.
  verre: "bg-white/10 text-white border-white/25 backdrop-blur-md hover:bg-white/20",
};

const CLASSE_TAILLE: Record<Taille, string> = {
  sm: "btn--sm",
  md: "",
  lg: "btn--lg",
  xl: "btn--xl",
};

interface ProprietesLienBouton extends ComponentProps<typeof Link> {
  apparence?: Apparence;
  taille?: Taille;
  icone?: ReactNode;
  iconeDroite?: ReactNode;
}

export function LienBouton({
  apparence = "primaire",
  taille = "md",
  icone,
  iconeDroite,
  className,
  children,
  ...reste
}: ProprietesLienBouton) {
  return (
    <Link
      className={cn("btn", CLASSE_APPARENCE[apparence], CLASSE_TAILLE[taille], className)}
      {...reste}
    >
      {icone}
      {children}
      {iconeDroite}
    </Link>
  );
}
