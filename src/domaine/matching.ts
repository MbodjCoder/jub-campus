// Domaine du matching étudiant ↔ projet.
// Phase 1 : pondération déterministe. Les embeddings sémantiques arrivent en V1.2.

import type { Etudiant, Projet, Competence, CompetenceProjet, CompetenceEtudiant } from "@/generated/prisma/client";

interface EtudiantAvecCompetences extends Etudiant {
  competences: (CompetenceEtudiant & { competence: Competence })[];
}

// Type "souple" : on contraint seulement les champs réellement lus par
// l'algorithme + on laisse passer toutes les relations supplémentaires
// que la page de consommation aurait fetché (entreprise, équipe, etc.).
type ProjetAvecCompetences = Projet & {
  competencesRequises: (CompetenceProjet & { competence: Competence })[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [autresRelations: string]: any;
};

// Ordre lexicographique pour comparer les niveaux de cursus.
const ORDRE_NIVEAUX = ["L1", "L2", "L3", "M1", "M2", "DOCTORAT"] as const;
type Niveau = (typeof ORDRE_NIVEAUX)[number];

// Conversion : NiveauProjet → niveau "minimum étudiant" attendu (approximatif).
const NIVEAU_MIN_PROJET: Record<string, number> = {
  DEBUTANT: 0,
  INTERMEDIAIRE: 1,
  AVANCE: 2,
  EXPERT_ETUDIANT: 3,
  PRO_JUNIOR: 4,
};

interface ResultatMatching {
  score: number;        // 0-100
  details: {
    competences: number; // 0-40 : recouvrement compétences
    niveau: number;      // 0-20 : adéquation niveau
    disponibilite: number; // 0-10
    qualiteEtudiant: number; // 0-15 basé sur scoreJub
    diversite: number;       // 0-15 : alignement catégorie ↔ filière
  };
}

// Calcule un score de matching entre un étudiant et un projet.
// Renvoie 0 si le projet n'est pas dans un état candidatable.
export function calculerScoreMatching(
  etudiant: EtudiantAvecCompetences,
  projet: ProjetAvecCompetences,
): ResultatMatching {
  // Compétences (40 pts) : pourcentage de compétences requises couvertes,
  // bonus si niveau possédé ≥ niveau requis.
  const requises = projet.competencesRequises;
  let scoreComp = 0;
  if (requises.length > 0) {
    let couvertes = 0;
    let bonusNiveau = 0;
    const compsEtud = new Map(
      etudiant.competences.map((c) => [c.competenceId, c.niveauValide ?? c.niveau]),
    );
    for (const r of requises) {
      const niveauEtud = compsEtud.get(r.competenceId);
      if (niveauEtud !== undefined) {
        couvertes++;
        if (niveauEtud >= r.niveauRequis) bonusNiveau += 0.5;
      }
    }
    scoreComp = (couvertes / requises.length) * 32 + bonusNiveau;
    scoreComp = Math.min(40, scoreComp);
  } else {
    // Aucune compétence imposée : on accorde 25/40 par défaut.
    scoreComp = 25;
  }

  // Adéquation niveau (20 pts).
  const idxEtud = ORDRE_NIVEAUX.indexOf(etudiant.niveau as Niveau);
  const niveauMinProjet = NIVEAU_MIN_PROJET[projet.niveau] ?? 0;
  let scoreNiveau = 20;
  if (idxEtud < niveauMinProjet) {
    // Sous-niveau : -4 par cran d'écart, plancher 4.
    scoreNiveau = Math.max(4, 20 - (niveauMinProjet - idxEtud) * 6);
  } else if (idxEtud > niveauMinProjet + 2) {
    // Sur-qualifié : léger malus pour signaler le mismatch.
    scoreNiveau = 14;
  }

  // Disponibilité (10 pts).
  const scoreDispo = etudiant.disponibilite === "DISPONIBLE"
    ? 10 : etudiant.disponibilite === "PARTIEL" ? 6 : 2;

  // Qualité étudiant (15 pts) : log normalisé du scoreJub.
  // 0 → 0 pts. 5000+ → 15 pts.
  const scoreQualite = Math.min(15, Math.round(Math.log10(Math.max(1, etudiant.scoreJub + 1)) * 4));

  // Diversité / alignement filière ↔ catégorie (15 pts).
  // Aligne ce qui est tech vers tech, etc. — table simple.
  const ALIAS_CAT_TECH = new Set([
    "INFORMATIQUE", "DATA", "IA", "WEB", "MOBILE", "UI_UX",
  ]);
  const ALIAS_FILIERE_TECH = ["info", "math", "data", "ia", "comput", "stat", "stm"];
  const filiereStr = (etudiant.filiere ?? "").toLowerCase();
  const filiereTech = ALIAS_FILIERE_TECH.some((m) => filiereStr.includes(m));
  let scoreDiversite = 10;
  if (ALIAS_CAT_TECH.has(projet.categorie)) {
    scoreDiversite = filiereTech ? 15 : 8;
  }

  const score = Math.round(scoreComp + scoreNiveau + scoreDispo + scoreQualite + scoreDiversite);

  return {
    score: Math.min(100, score),
    details: {
      competences: Math.round(scoreComp),
      niveau: Math.round(scoreNiveau),
      disponibilite: scoreDispo,
      qualiteEtudiant: scoreQualite,
      diversite: scoreDiversite,
    },
  };
}

// Trie une liste de projets pour un étudiant donné, du meilleur match au pire.
export function trierProjetsPourEtudiant(
  etudiant: EtudiantAvecCompetences,
  projets: ProjetAvecCompetences[],
): Array<{ projet: ProjetAvecCompetences; score: number }> {
  return projets
    .map((p) => ({ projet: p, score: calculerScoreMatching(etudiant, p).score }))
    .sort((a, b) => b.score - a.score);
}
