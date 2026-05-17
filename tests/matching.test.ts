import { describe, it, expect } from "vitest";
import {
  calculerScoreMatching,
  type EtudiantAvecCompetences,
  type ProjetAvecCompetences,
} from "@/domaine/matching";

const etudiant = (p: Partial<EtudiantAvecCompetences> = {}): EtudiantAvecCompetences => ({
  niveau: "L3",
  disponibilite: "DISPONIBLE",
  scoreJub: 200,
  filiere: "Informatique",
  competences: [],
  ...p,
});

const projet = (p: Partial<ProjetAvecCompetences> = {}): ProjetAvecCompetences => ({
  niveau: "INTERMEDIAIRE",
  categorie: "WEB",
  competencesRequises: [],
  ...p,
});

describe("calculerScoreMatching", () => {
  it("retourne un score borné 0–100", () => {
    const r = calculerScoreMatching(etudiant(), projet());
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(100);
  });

  it("récompense le recouvrement de compétences", () => {
    const requises = [
      { competenceId: "c1", niveauRequis: 1 },
      { competenceId: "c2", niveauRequis: 1 },
    ];
    const sansComp = calculerScoreMatching(etudiant(), projet({ competencesRequises: requises }));
    const avecComp = calculerScoreMatching(
      etudiant({
        competences: [
          { competenceId: "c1", niveau: 3, niveauValide: 3 },
          { competenceId: "c2", niveau: 3, niveauValide: 3 },
        ],
      }),
      projet({ competencesRequises: requises }),
    );
    expect(avecComp.details.competences).toBeGreaterThan(sansComp.details.competences);
  });

  it("pénalise un étudiant sous-niveau", () => {
    const fort = calculerScoreMatching(etudiant({ niveau: "M2" }), projet({ niveau: "EXPERT_ETUDIANT" }));
    const faible = calculerScoreMatching(etudiant({ niveau: "L1" }), projet({ niveau: "EXPERT_ETUDIANT" }));
    expect(faible.details.niveau).toBeLessThan(fort.details.niveau);
  });

  it("valorise la disponibilité", () => {
    const dispo = calculerScoreMatching(etudiant({ disponibilite: "DISPONIBLE" }), projet());
    const indispo = calculerScoreMatching(etudiant({ disponibilite: "INDISPONIBLE" }), projet());
    expect(dispo.details.disponibilite).toBeGreaterThan(indispo.details.disponibilite);
  });
});
