import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Insigne (pilule / chip) — repose sur les classes `.pilule*` de globals.css.
type Ton = "neutre" | "vert" | "sage" | "orange" | "jaune" | "bleu" | "violet" | "rouge" | "succes" | "sombre";

const CLASSE_TON: Record<Ton, string> = {
  neutre: "pilule--neutre",
  vert: "pilule--vert",
  succes: "pilule--vert",
  sage: "pilule--sage",
  sombre: "pilule--sage",
  orange: "pilule--orange",
  jaune: "pilule--orange",
  rouge: "pilule--rouge",
  bleu: "",
  violet: "",
};

export interface ProprietesInsigne extends HTMLAttributes<HTMLSpanElement> {
  ton?: Ton;
}

export function Insigne({ className, ton = "neutre", ...reste }: ProprietesInsigne) {
  return <span className={cn("pilule", CLASSE_TON[ton], className)} {...reste} />;
}
