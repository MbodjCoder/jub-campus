import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Carte({ className, ...reste }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-bordure bg-fond-eleve shadow-sm overflow-hidden",
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
  return <div className={cn("p-5 border-t border-bordure bg-jub-pierre-50", className)} {...reste} />;
}

export function TitreCarte({ className, ...reste }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold text-texte tracking-tight", className)} {...reste} />;
}

export function DescriptionCarte({ className, ...reste }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-texte-discret mt-1", className)} {...reste} />;
}
