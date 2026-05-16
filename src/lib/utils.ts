import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Combine des classes Tailwind en gérant les conflits.
export function cn(...entrees: ClassValue[]): string {
  return twMerge(clsx(entrees));
}

// Formate un montant en francs CFA selon les conventions sénégalaises.
export function formaterMontantFcfa(montant: number | null | undefined): string {
  if (montant === null || montant === undefined) return "Non rémunéré";
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 })
    .format(montant) + " FCFA";
}

// Formate une date au format jour mois année en français.
export function formaterDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

// Formate une durée en jours vers une chaîne lisible (3 sem, 2 mois, ...).
export function formaterDureeJours(jours: number): string {
  if (jours < 7) return `${jours} jour${jours > 1 ? "s" : ""}`;
  if (jours < 31) {
    const semaines = Math.round(jours / 7);
    return `${semaines} semaine${semaines > 1 ? "s" : ""}`;
  }
  const mois = Math.round(jours / 30);
  return `${mois} mois`;
}

// Génère un slug URL-safe à partir d'une chaîne.
export function slugifier(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

// Tronque un texte à n caractères en ajoutant une ellipse.
export function tronquer(texte: string, n: number): string {
  if (texte.length <= n) return texte;
  return texte.slice(0, n - 1).trimEnd() + "…";
}
