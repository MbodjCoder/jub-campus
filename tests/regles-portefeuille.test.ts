import { describe, it, expect } from "vitest";
import {
  verifierDemandeRetrait,
  estNumeroSenegalais,
  normaliserNumeroSenegalais,
  sommeTransactions,
  repartirEnveloppe,
  RETRAIT_MINIMUM_FCFA,
} from "@/domaine/regles-portefeuille";

const TEL = "77 123 45 67";

describe("verifierDemandeRetrait", () => {
  it("accepte un retrait valide", () => {
    expect(verifierDemandeRetrait(10_000, 5_000, TEL)).toBeNull();
  });
  it("accepte le retrait de tout le solde", () => {
    expect(verifierDemandeRetrait(5_000, 5_000, TEL)).toBeNull();
  });
  it("refuse un montant nul, négatif ou non entier", () => {
    expect(verifierDemandeRetrait(10_000, 0, TEL)).toBe("MONTANT_INVALIDE");
    expect(verifierDemandeRetrait(10_000, -500, TEL)).toBe("MONTANT_INVALIDE");
    expect(verifierDemandeRetrait(10_000, 1500.5, TEL)).toBe("MONTANT_INVALIDE");
  });
  it("refuse sous le minimum", () => {
    expect(verifierDemandeRetrait(10_000, RETRAIT_MINIMUM_FCFA - 1, TEL)).toBe("SOUS_LE_MINIMUM");
  });
  it("refuse au-delà du solde", () => {
    expect(verifierDemandeRetrait(4_999, 5_000, TEL)).toBe("SOLDE_INSUFFISANT");
  });
  it("refuse un numéro invalide", () => {
    expect(verifierDemandeRetrait(10_000, 5_000, "33 123 45 67")).toBe("TELEPHONE_INVALIDE");
  });
});

describe("estNumeroSenegalais", () => {
  it("accepte les préfixes mobiles 70/75/76/77/78", () => {
    for (const p of ["70", "75", "76", "77", "78"]) {
      expect(estNumeroSenegalais(`${p}1234567`)).toBe(true);
    }
  });
  it("accepte formats espacés, +221 et 00221", () => {
    expect(estNumeroSenegalais("77 123 45 67")).toBe(true);
    expect(estNumeroSenegalais("+221771234567")).toBe(true);
    expect(estNumeroSenegalais("00221 77 123 45 67")).toBe(true);
    expect(estNumeroSenegalais("77-123-45-67")).toBe(true);
  });
  it("refuse fixes, longueurs fausses, préfixes inconnus", () => {
    expect(estNumeroSenegalais("338234567")).toBe(false);
    expect(estNumeroSenegalais("7712345")).toBe(false);
    expect(estNumeroSenegalais("771234567890")).toBe(false);
    expect(estNumeroSenegalais("791234567")).toBe(false);
    expect(estNumeroSenegalais("")).toBe(false);
  });
});

describe("normaliserNumeroSenegalais", () => {
  it("ajoute le préfixe international", () => {
    expect(normaliserNumeroSenegalais("77 123 45 67")).toBe("+221771234567");
  });
  it("convertit 00221 en +221", () => {
    expect(normaliserNumeroSenegalais("00221771234567")).toBe("+221771234567");
  });
  it("laisse +221 tel quel", () => {
    expect(normaliserNumeroSenegalais("+221771234567")).toBe("+221771234567");
  });
});

describe("sommeTransactions", () => {
  it("somme crédits et débits", () => {
    expect(
      sommeTransactions([{ montantFcfa: 5000 }, { montantFcfa: -2000 }, { montantFcfa: 300 }]),
    ).toBe(3300);
  });
  it("liste vide = 0", () => {
    expect(sommeTransactions([])).toBe(0);
  });
});

describe("repartirEnveloppe", () => {
  it("répartit au prorata sans perdre un franc", () => {
    const parts = repartirEnveloppe(10_000, [1, 1, 1]);
    expect(parts.reduce((s, p) => s + p, 0)).toBe(10_000);
    // 3334 + 3333 + 3333
    expect(Math.max(...parts) - Math.min(...parts)).toBeLessThanOrEqual(1);
  });
  it("respecte les poids", () => {
    expect(repartirEnveloppe(9_000, [2, 1])).toEqual([6_000, 3_000]);
  });
  it("la somme est exacte quels que soient les restes", () => {
    const parts = repartirEnveloppe(100, [3, 3, 3, 3, 3, 3, 3]);
    expect(parts.reduce((s, p) => s + p, 0)).toBe(100);
  });
  it("poids négatifs ou nuls traités comme zéro", () => {
    expect(repartirEnveloppe(1000, [-5, 0, 10])).toEqual([0, 0, 1000]);
  });
  it("enveloppe nulle ou aucune tâche = zéros", () => {
    expect(repartirEnveloppe(0, [1, 2])).toEqual([0, 0]);
    expect(repartirEnveloppe(1000, [])).toEqual([]);
  });
});
