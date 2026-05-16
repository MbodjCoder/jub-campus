// Helpers de matching pour les pages : charge l'étudiant connecté (compétences)
// et calcule les scores. Renvoie null si l'utilisateur n'est pas un étudiant.

import { prisma } from "@/lib/prisma";
import { calculerScoreMatching, type EtudiantAvecCompetences, type ProjetAvecCompetences } from "@/domaine/matching";

export async function chargerEtudiantMatching(
  utilisateurId: string | undefined | null,
): Promise<EtudiantAvecCompetences | null> {
  if (!utilisateurId) return null;
  const e = await prisma.etudiant.findUnique({
    where: { utilisateurId },
    select: {
      niveau: true,
      disponibilite: true,
      scoreJub: true,
      filiere: true,
      competences: { select: { competenceId: true, niveau: true, niveauValide: true } },
    },
  });
  return e;
}

// Score 0-100 pour un projet, ou null si pas d'étudiant connecté.
export function scoreMatch(
  etudiant: EtudiantAvecCompetences | null,
  projet: ProjetAvecCompetences,
): number | null {
  if (!etudiant) return null;
  return calculerScoreMatching(etudiant, projet).score;
}
