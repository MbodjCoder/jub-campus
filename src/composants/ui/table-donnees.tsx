import { type HTMLAttributes, type TableHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Table de données — le conteneur défile horizontalement sur mobile,
// la page ne déborde jamais (architecture de confinement).
export function TableDefilante({ className, ...reste }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("table-defilante", className)} {...reste} />;
}

export function TableDonnees({ className, ...reste }: TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cn("table-donnees", className)} {...reste} />;
}
