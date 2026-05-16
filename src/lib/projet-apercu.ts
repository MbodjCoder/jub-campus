// Transforme un projet Prisma en aperçu pour les lignes de job de la maquette.

import { LIBELLES_CATEGORIE } from "@/lib/constantes";
import { imageProjet } from "@/lib/medias";
import type { ProjetApercu } from "@/composants/maquette/lignes-job";

interface ProjetSource {
  slug: string;
  titre: string;
  categorie: string;
  dureeJours: number;
  montantFcfa: number | null;
  imageCouvertureUrl?: string | null;
  entreprise?: { raisonSociale: string } | null;
  matchScore?: number | null;
}

export function versApercu(p: ProjetSource): ProjetApercu {
  return {
    slug: p.slug,
    titre: p.titre,
    image: imageProjet(p),
    organisation: p.entreprise?.raisonSociale ?? "JUB Campus",
    categorieLibelle:
      LIBELLES_CATEGORIE[p.categorie as keyof typeof LIBELLES_CATEGORIE] ?? p.categorie,
    duree: p.dureeJours,
    montant: p.montantFcfa,
    matchScore: p.matchScore ?? null,
  };
}

// Champs Prisma à sélectionner pour construire un aperçu.
export const SELECT_APERCU = {
  slug: true,
  titre: true,
  categorie: true,
  dureeJours: true,
  montantFcfa: true,
  imageCouvertureUrl: true,
  entreprise: { select: { raisonSociale: true } },
} as const;
