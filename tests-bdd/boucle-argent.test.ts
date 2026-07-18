// Test d'intégration — boucle argent complète contre la base réelle :
// crédit de tâche (idempotent) → demande de retrait (débit-réservation)
// → envoi Wave (simulation) → PAYE. Vérifie l'invariant
// « solde = somme des transactions » à chaque étape.

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { crediterGainTache, demanderRetrait } from "@/domaine/portefeuille";
import { envoyerRetraitWave } from "@/domaine/paie";
import { sommeTransactions } from "@/domaine/regles-portefeuille";

const marqueur = `test-${nanoid(8).toLowerCase()}`;
let utilisateurId: string;
let etudiantId: string;
let projetId: string;
let tacheId: string;

async function soldeEtTransactions() {
  const p = await prisma.portefeuille.findUnique({
    where: { etudiantId },
    select: { soldeFcfa: true, transactions: { select: { montantFcfa: true } } },
  });
  return { solde: p?.soldeFcfa ?? 0, transactions: p?.transactions ?? [] };
}

beforeAll(async () => {
  const universite = await prisma.universite.findFirst({ select: { id: true } });
  if (!universite) throw new Error("Base non seedée : lancer pnpm bdd:semer.");

  const utilisateur = await prisma.utilisateur.create({
    data: {
      email: `${marqueur}@test.jub`,
      nomComplet: "Talent Test",
      etudiant: {
        create: {
          prenom: "Talent",
          nom: "Test",
          slug: marqueur,
          universiteId: universite.id,
          niveau: "L3",
        },
      },
    },
    select: { id: true, etudiant: { select: { id: true } } },
  });
  utilisateurId = utilisateur.id;
  etudiantId = utilisateur.etudiant!.id;

  const projet = await prisma.projet.create({
    data: {
      slug: `${marqueur}-mission`,
      titre: "Mission de test",
      resume: "Boucle argent",
      description: "Boucle argent",
      source: "JUB_INTERNE",
      categorie: "ENQUETE_TERRAIN",
      niveau: "INTERMEDIAIRE",
      modeRemuneration: "REMUNERE",
      montantClientFcfa: 100_000,
      enveloppeTalentsFcfa: 60_000,
      dureeJours: 10,
      statut: "EN_COURS",
      visibilite: "PRIVEE",
      publieParId: utilisateurId,
      equipe: { create: { membres: { create: { etudiantId, roleEquipe: "Talent" } } } },
    },
    select: { id: true },
  });
  projetId = projet.id;

  const tache = await prisma.tache.create({
    data: { projetId, titre: "Zone test — 50 questionnaires", montantFcfa: 5_000, assigneeId: etudiantId },
    select: { id: true },
  });
  tacheId = tache.id;
});

afterAll(async () => {
  // Ordre : retraits (FK Restrict sur Etudiant) puis projet puis utilisateur.
  await prisma.retrait.deleteMany({ where: { etudiantId } });
  await prisma.projet.deleteMany({ where: { id: projetId } });
  await prisma.utilisateur.deleteMany({ where: { id: utilisateurId } });
  await prisma.$disconnect();
});

describe("boucle argent (intégration)", () => {
  it("crédite le gain à la validation de la tâche", async () => {
    const r = await crediterGainTache(tacheId);
    expect(r).toEqual({ succes: true, nouveauSolde: 5_000 });

    const { solde, transactions } = await soldeEtTransactions();
    expect(solde).toBe(5_000);
    expect(sommeTransactions(transactions)).toBe(solde);
  });

  it("refuse le double crédit (idempotence)", async () => {
    const r = await crediterGainTache(tacheId);
    expect(r).toEqual({ succes: false, raison: "DEJA_CREDITEE" });

    const { solde } = await soldeEtTransactions();
    expect(solde).toBe(5_000);
  });

  it("réserve le montant à la demande de retrait", async () => {
    const r = await demanderRetrait(etudiantId, 5_000, "WAVE", "77 123 45 67");
    expect(r.succes).toBe(true);

    const { solde, transactions } = await soldeEtTransactions();
    expect(solde).toBe(0);
    expect(sommeTransactions(transactions)).toBe(0);
  });

  it("refuse un retrait au-delà du solde", async () => {
    const r = await demanderRetrait(etudiantId, 1_000, "WAVE", "77 123 45 67");
    expect(r).toEqual({ succes: false, raison: "SOLDE_INSUFFISANT" });
  });

  it("paie le retrait via Wave (simulation) → PAYE", async () => {
    const retrait = await prisma.retrait.findFirstOrThrow({
      where: { etudiantId },
      select: { id: true, numeroTelephone: true },
    });
    // Le numéro a été normalisé au format international à la demande.
    expect(retrait.numeroTelephone).toBe("+221771234567");

    const r = await envoyerRetraitWave(retrait.id, utilisateurId);
    expect(r).toEqual({ succes: true, statut: "PAYE" });

    const apres = await prisma.retrait.findUniqueOrThrow({
      where: { id: retrait.id },
      select: { statut: true, referenceExterne: true, finaliseLe: true },
    });
    expect(apres.statut).toBe("PAYE");
    expect(apres.referenceExterne).toMatch(/^sim_/);
    expect(apres.finaliseLe).not.toBeNull();
  });

  it("l'invariant solde = somme des transactions tient en fin de parcours", async () => {
    const { solde, transactions } = await soldeEtTransactions();
    expect(sommeTransactions(transactions)).toBe(solde);
  });
});
