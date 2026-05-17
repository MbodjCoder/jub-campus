import { describe, it, expect } from "vitest";
import { slugifier, formaterDureeJours, formaterMontantFcfa, tronquer } from "@/lib/utils";
import { fmt } from "@/composants/maquette/format";

describe("slugifier", () => {
  it("normalise accents, espaces et casse", () => {
    expect(slugifier("Développement Web")).toBe("developpement-web");
    expect(slugifier("  Éàü  ")).toBe("eau");
  });
  it("ne laisse ni tiret en tête ni en fin", () => {
    expect(slugifier("--Test!!")).toBe("test");
  });
});

describe("formaterDureeJours", () => {
  it("jours, semaines, mois", () => {
    expect(formaterDureeJours(3)).toBe("3 jours");
    expect(formaterDureeJours(14)).toBe("2 semaines");
    expect(formaterDureeJours(60)).toBe("2 mois");
  });
});

describe("formaterMontantFcfa", () => {
  it("formate avec séparateur et devise", () => {
    expect(formaterMontantFcfa(150000)).toContain("FCFA");
    expect(formaterMontantFcfa(null)).toBe("Non rémunéré");
  });
});

describe("tronquer", () => {
  it("coupe au-delà de n caractères", () => {
    expect(tronquer("abcdef", 4)).toHaveLength(4);
    expect(tronquer("abc", 10)).toBe("abc");
  });
});

describe("fmt (maquette)", () => {
  it("fcfa null → null, sinon chaîne FCFA", () => {
    expect(fmt.fcfa(null)).toBeNull();
    expect(fmt.fcfa(50000)).toContain("FCFA");
  });
  it("duree : jours / semaines / mois", () => {
    expect(fmt.duree(10)).toBe("10 jours");
    expect(fmt.duree(21)).toBe("3 semaines");
    expect(fmt.duree(90)).toBe("3 mois");
  });
});
