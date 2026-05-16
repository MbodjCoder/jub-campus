import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type VarianteCarte = "defaut" | "plate" | "sombre";

interface ProprietesCarte extends HTMLAttributes<HTMLDivElement> {
  variante?: VarianteCarte;
}

export function Carte({ className, variante = "defaut", ...reste }: ProprietesCarte) {
  return (
    <div
      className={cn(
        "carte overflow-hidden",
        variante === "plate" && "carte--plate",
        variante === "sombre" && "carte--sombre",
        className,
      )}
      {...reste}
    />
  );
}

export function EnteteCarte({ className, ...reste }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 border-b border-bordure", className)} {...reste} />;
}

export function CorpsCarte({ className, ...reste }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...reste} />;
}

export function PiedCarte({ className, ...reste }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 border-t border-bordure", className)} {...reste} />;
}

export function TitreCarte({ className, ...reste }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("t-h3", className)} {...reste} />;
}

export function DescriptionCarte({ className, ...reste }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("t-small mt-1", className)} {...reste} />;
}
