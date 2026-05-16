// Helpers utilitaires pour adapter l'UI au rôle utilisateur.

import type { Role } from "@/generated/prisma/client";

interface UrlsRole {
  /** Espace principal (tableau de bord). */
  espace: string;
  /** Page profil. */
  profil: string;
  /** Page paramètres. */
  parametres: string;
  /** Le rôle a-t-il une page portfolio public ? */
  aPortfolio: boolean;
}

export const URLS_PAR_ROLE: Record<Role, UrlsRole> = {
  ETUDIANT: {
    espace: "/app",
    profil: "/app/profil",
    parametres: "/app/parametres",
    aPortfolio: true,
  },
  ENTREPRISE: {
    espace: "/entreprise",
    profil: "/entreprise/profil",
    parametres: "/entreprise/parametres",
    aPortfolio: false,
  },
  MENTOR: {
    espace: "/mentor",
    profil: "/mentor/profil",
    parametres: "/mentor/parametres",
    aPortfolio: false,
  },
  SPONSOR: {
    espace: "/sponsor",
    profil: "/sponsor/profil",
    parametres: "/sponsor/parametres",
    aPortfolio: false,
  },
  ADMIN: {
    espace: "/admin",
    profil: "/admin",
    parametres: "/admin",
    aPortfolio: false,
  },
  SUPER_ADMIN: {
    espace: "/admin",
    profil: "/admin",
    parametres: "/admin",
    aPortfolio: false,
  },
};

export const LIBELLES_ROLE: Record<Role, string> = {
  ETUDIANT: "Étudiant",
  ENTREPRISE: "Entreprise",
  MENTOR: "Mentor",
  SPONSOR: "Sponsor",
  ADMIN: "Administrateur",
  SUPER_ADMIN: "Super-admin",
};

export function urlsParRole(role: Role | undefined | null): UrlsRole {
  if (!role) return URLS_PAR_ROLE.ETUDIANT;
  return URLS_PAR_ROLE[role] ?? URLS_PAR_ROLE.ETUDIANT;
}

// Tire les initiales (max 2 caractères) d'un nom complet ou d'un email.
export function obtenirInitiales(nomOuEmail: string): string {
  const base = nomOuEmail.trim();
  if (!base) return "?";
  if (base.includes("@")) {
    return base.split("@")[0]!.slice(0, 2).toUpperCase();
  }
  const morceaux = base.split(/\s+/).filter(Boolean);
  if (morceaux.length === 0) return "?";
  if (morceaux.length === 1) return morceaux[0]!.slice(0, 2).toUpperCase();
  return (morceaux[0]![0]! + morceaux[morceaux.length - 1]![0]!).toUpperCase();
}
