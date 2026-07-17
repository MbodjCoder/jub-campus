// Domaine de la paie (ops) : envoi réel des retraits via Wave Payout
// et réconciliation des statuts.
//
// Cycle de vie d'un retrait :
//   DEMANDE ──envoi──▶ EN_COURS ──réconciliation──▶ PAYE
//      │  ▲                │
//      │  └── erreur API ──┘ (reste DEMANDE, motifEchec renseigné, retentable :
//      │      la clé d'idempotence garantit zéro double paiement)
//      └──▶ ANNULE (talent/ops, recrédit)         EN_COURS ──▶ ECHEC (Wave
//           via annulerRetrait                     "failed", recrédit auto)
//
// L'argent est débité à la demande (réservation) : un retrait non PAYE
// finit toujours soit PAYE, soit recrédité (ECHEC/ANNULE).

import "server-only";
import { prisma } from "@/lib/prisma";
import { envoyerPayout, consulterPayout } from "@/lib/wave";
import { journaliser } from "@/domaine/audit";

export type ResultatEnvoi =
  | { succes: true; statut: "PAYE" | "EN_COURS" }
  | { succes: false; message: string };

/** Envoie un retrait DEMANDE vers Wave. Retentable sans double paiement. */
export async function envoyerRetraitWave(retraitId: string, acteurId: string): Promise<ResultatEnvoi> {
  const retrait = await prisma.retrait.findUnique({
    where: { id: retraitId },
    select: {
      statut: true,
      montantFcfa: true,
      numeroTelephone: true,
      cleIdempotence: true,
      methode: true,
      etudiant: { select: { prenom: true, nom: true } },
    },
  });
  if (!retrait) return { succes: false, message: "Retrait introuvable." };
  if (retrait.statut !== "DEMANDE") {
    return { succes: false, message: `Retrait au statut ${retrait.statut}, envoi impossible.` };
  }
  if (retrait.methode !== "WAVE") {
    return { succes: false, message: "Seuls les retraits Wave sont automatisés (Orange Money : manuel)." };
  }

  const r = await envoyerPayout({
    montantFcfa: retrait.montantFcfa,
    telephone: retrait.numeroTelephone,
    cleIdempotence: retrait.cleIdempotence,
    referenceInterne: retraitId,
    nomBeneficiaire: `${retrait.etudiant.prenom} ${retrait.etudiant.nom}`,
  });

  if (!r.ok) {
    // Échec d'appel : l'argent reste réservé, l'ops peut retenter.
    await prisma.retrait.update({
      where: { id: retraitId },
      data: { motifEchec: r.erreur },
    });
    await journaliser({
      acteurId,
      action: "RETRAIT_ENVOI_ERREUR",
      ressourceType: "Retrait",
      ressourceId: retraitId,
      metadonnees: { erreur: r.erreur },
    });
    return { succes: false, message: r.erreur };
  }

  const paye = r.statut === "succeeded";
  await prisma.retrait.update({
    where: { id: retraitId },
    data: {
      statut: paye ? "PAYE" : "EN_COURS",
      referenceExterne: r.idWave,
      motifEchec: null,
      finaliseLe: paye ? new Date() : null,
    },
  });
  await journaliser({
    acteurId,
    action: paye ? "RETRAIT_PAYE" : "RETRAIT_ENVOYE",
    ressourceType: "Retrait",
    ressourceId: retraitId,
    metadonnees: { idWave: r.idWave, montantFcfa: retrait.montantFcfa },
  });

  return { succes: true, statut: paye ? "PAYE" : "EN_COURS" };
}

/**
 * Réconcilie un retrait EN_COURS avec Wave. "failed"/"reversed" → ECHEC
 * + recrédit du portefeuille (transaction SQL).
 */
export async function reconcilierRetrait(retraitId: string, acteurId: string): Promise<string> {
  const retrait = await prisma.retrait.findUnique({
    where: { id: retraitId },
    select: { statut: true, referenceExterne: true },
  });
  if (!retrait || retrait.statut !== "EN_COURS" || !retrait.referenceExterne) {
    return retrait?.statut ?? "INTROUVABLE";
  }

  const statutWave = await consulterPayout(retrait.referenceExterne);

  if (statutWave === "succeeded") {
    await prisma.retrait.update({
      where: { id: retraitId },
      data: { statut: "PAYE", finaliseLe: new Date() },
    });
    await journaliser({ acteurId, action: "RETRAIT_PAYE", ressourceType: "Retrait", ressourceId: retraitId });
    return "PAYE";
  }

  if (statutWave === "failed" || statutWave === "reversed") {
    await prisma.$transaction(async (tx) => {
      const r = await tx.retrait.update({
        where: { id: retraitId },
        data: { statut: "ECHEC", motifEchec: `Wave : ${statutWave}`, finaliseLe: new Date() },
        select: {
          montantFcfa: true,
          etudiant: { select: { portefeuille: { select: { id: true } } } },
        },
      });
      const portefeuilleId = r.etudiant.portefeuille?.id;
      if (!portefeuilleId) return;
      await tx.transactionPortefeuille.create({
        data: {
          portefeuilleId,
          montantFcfa: r.montantFcfa,
          type: "AJUSTEMENT",
          libelle: `Retrait échoué chez Wave — montant recrédité`,
          retraitId,
        },
      });
      await tx.portefeuille.update({
        where: { id: portefeuilleId },
        data: { soldeFcfa: { increment: r.montantFcfa } },
      });
    });
    await journaliser({ acteurId, action: "RETRAIT_ECHEC_RECREDITE", ressourceType: "Retrait", ressourceId: retraitId });
    return "ECHEC";
  }

  return "EN_COURS";
}
