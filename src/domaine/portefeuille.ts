// Domaine du portefeuille talent (mode agence).
//
// Invariant central : le solde d'un portefeuille est TOUJOURS la somme de
// ses transactions. Toute variation de solde s'accompagne, dans la même
// transaction SQL, de l'écriture d'une TransactionPortefeuille.
//
// Deux opérations d'écriture :
// - crediterGainTache : gain crédité à la validation d'une tâche payée.
//   Garde-fous : tâche payée, assignée, non déjà créditée (verrou applicatif
//   `crediteeLe` + contrainte unique [portefeuilleId, tacheId] en base).
// - demanderRetrait : débit immédiat (réservation) + création d'une demande
//   avec clé d'idempotence, consommée plus tard par l'API Wave Payout.
//   Un échec de paiement recrédite via annulerRetrait.

import "server-only";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import type { MethodePaiement } from "@/generated/prisma/enums";
import {
  verifierDemandeRetrait,
  normaliserNumeroSenegalais,
  type ErreurRetrait,
} from "@/domaine/regles-portefeuille";

// ── Écritures (transactions SQL) ───────────────────────────────

export type ResultatCredit =
  | { succes: true; nouveauSolde: number }
  | { succes: false; raison: "TACHE_INTROUVABLE" | "TACHE_NON_PAYEE" | "TACHE_NON_ASSIGNEE" | "DEJA_CREDITEE" };

/**
 * Crédite le gain d'une tâche validée sur le portefeuille du talent assigné.
 * Idempotent : un second appel renvoie DEJA_CREDITEE sans double crédit.
 */
export async function crediterGainTache(tacheId: string): Promise<ResultatCredit> {
  return prisma.$transaction(async (tx) => {
    const tache = await tx.tache.findUnique({
      where: { id: tacheId },
      select: {
        montantFcfa: true,
        crediteeLe: true,
        assigneeId: true,
        titre: true,
        projet: { select: { titre: true } },
      },
    });
    if (!tache) return { succes: false, raison: "TACHE_INTROUVABLE" as const };
    if (tache.crediteeLe) return { succes: false, raison: "DEJA_CREDITEE" as const };
    if (!tache.montantFcfa || tache.montantFcfa <= 0)
      return { succes: false, raison: "TACHE_NON_PAYEE" as const };
    if (!tache.assigneeId) return { succes: false, raison: "TACHE_NON_ASSIGNEE" as const };

    const portefeuille = await tx.portefeuille.upsert({
      where: { etudiantId: tache.assigneeId },
      create: { etudiantId: tache.assigneeId },
      update: {},
      select: { id: true },
    });

    // La contrainte unique [portefeuilleId, tacheId] fait échouer toute la
    // transaction en cas de course : jamais de double crédit.
    await tx.transactionPortefeuille.create({
      data: {
        portefeuilleId: portefeuille.id,
        montantFcfa: tache.montantFcfa,
        type: "GAIN_TACHE",
        libelle: `Tâche validée : ${tache.titre} (${tache.projet.titre})`,
        tacheId,
      },
    });
    const maj = await tx.portefeuille.update({
      where: { id: portefeuille.id },
      data: { soldeFcfa: { increment: tache.montantFcfa } },
      select: { soldeFcfa: true },
    });
    await tx.tache.update({ where: { id: tacheId }, data: { crediteeLe: new Date() } });

    return { succes: true as const, nouveauSolde: maj.soldeFcfa };
  });
}

export type ResultatRetrait =
  | { succes: true; retraitId: string; nouveauSolde: number }
  | { succes: false; raison: ErreurRetrait | "PORTEFEUILLE_INTROUVABLE" };

/**
 * Demande de retrait : débite le solde immédiatement (réservation) et crée
 * la demande avec sa clé d'idempotence Wave. L'envoi réel est fait par
 * l'équipe ops (validation humaine tant que les volumes sont faibles).
 */
export async function demanderRetrait(
  etudiantId: string,
  montantFcfa: number,
  methode: MethodePaiement,
  numeroTelephone: string,
): Promise<ResultatRetrait> {
  return prisma.$transaction(async (tx) => {
    const portefeuille = await tx.portefeuille.findUnique({
      where: { etudiantId },
      select: { id: true, soldeFcfa: true },
    });
    if (!portefeuille) return { succes: false, raison: "PORTEFEUILLE_INTROUVABLE" as const };

    const erreur = verifierDemandeRetrait(portefeuille.soldeFcfa, montantFcfa, numeroTelephone);
    if (erreur) return { succes: false, raison: erreur };

    const retrait = await tx.retrait.create({
      data: {
        etudiantId,
        montantFcfa,
        methode,
        numeroTelephone: normaliserNumeroSenegalais(numeroTelephone),
        cleIdempotence: `ret_${nanoid(24)}`,
      },
      select: { id: true },
    });
    await tx.transactionPortefeuille.create({
      data: {
        portefeuilleId: portefeuille.id,
        montantFcfa: -montantFcfa,
        type: "RETRAIT",
        libelle: `Retrait ${methode} demandé`,
        retraitId: retrait.id,
      },
    });
    const maj = await tx.portefeuille.update({
      where: { id: portefeuille.id },
      data: { soldeFcfa: { decrement: montantFcfa } },
      select: { soldeFcfa: true },
    });

    return { succes: true as const, retraitId: retrait.id, nouveauSolde: maj.soldeFcfa };
  });
}

/**
 * Annule un retrait non finalisé (échec Wave ou annulation talent) :
 * recrédite le solde et journalise la transaction inverse.
 */
export async function annulerRetrait(retraitId: string, motif: string): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const retrait = await tx.retrait.findUnique({
      where: { id: retraitId },
      select: {
        montantFcfa: true,
        statut: true,
        etudiant: { select: { portefeuille: { select: { id: true } } } },
      },
    });
    const portefeuilleId = retrait?.etudiant.portefeuille?.id;
    if (!retrait || !portefeuilleId) return false;
    if (retrait.statut === "PAYE" || retrait.statut === "ANNULE") return false;

    await tx.retrait.update({
      where: { id: retraitId },
      data: { statut: "ANNULE", motifEchec: motif, finaliseLe: new Date() },
    });
    await tx.transactionPortefeuille.create({
      data: {
        portefeuilleId,
        montantFcfa: retrait.montantFcfa,
        type: "AJUSTEMENT",
        libelle: `Retrait annulé : ${motif}`,
        retraitId,
      },
    });
    await tx.portefeuille.update({
      where: { id: portefeuilleId },
      data: { soldeFcfa: { increment: retrait.montantFcfa } },
    });
    return true;
  });
}
