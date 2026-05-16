/* JUB Campus · Helpers de formatage — port 1:1 de la maquette (components.jsx). */

export const fmt = {
  fcfa: (n: number | null | undefined): string | null =>
    n == null ? null : `${n.toLocaleString("fr-FR").replace(/,/g, " ")} FCFA`,
  duree: (jours: number | null | undefined): string | null => {
    if (jours == null) return null;
    if (jours < 14) return `${jours} jours`;
    if (jours < 60) return `${Math.round(jours / 7)} semaines`;
    return `${Math.round(jours / 30)} mois`;
  },
  date: (d: Date | string): string =>
    new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
  dateCourt: (d: Date | string): string =>
    new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
  ilYa: (d: Date | string): string => {
    const diff = (Date.now() - new Date(d).getTime()) / 86400000;
    if (diff < 1) return "aujourd'hui";
    if (diff < 2) return "hier";
    if (diff < 7) return `il y a ${Math.floor(diff)} j`;
    if (diff < 30) return `il y a ${Math.floor(diff / 7)} sem`;
    return `il y a ${Math.floor(diff / 30)} mois`;
  },
};

export const STATUTS_PROJET: Record<string, string> = {
  PUBLIE: "Publié",
  CANDIDATURES_OUVERTES: "Candidatures ouvertes",
  EQUIPE_EN_CONSTITUTION: "Équipe en formation",
  EN_COURS: "En cours",
  EN_REVISION: "En révision",
  TERMINE: "Terminé",
  CERTIFIE: "Certifié",
};
