"use server";

// Actions ops : paie des retraits (envoi Wave, réconciliation, marquage
// manuel pour Orange Money).

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { envoyerRetraitWave, reconcilierRetrait } from "@/domaine/paie";
import { journaliser } from "@/domaine/audit";
import { creerNotification } from "@/domaine/notifications";
import { formaterMontantFcfa } from "@/lib/utils";

async function exigerAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") redirect("/");
  return session;
}

async function notifierTalentPaye(retraitId: string) {
  const retrait = await prisma.retrait.findUnique({
    where: { id: retraitId },
    select: {
      statut: true,
      montantFcfa: true,
      etudiant: { select: { utilisateurId: true } },
    },
  });
  if (retrait?.statut === "PAYE") {
    await creerNotification({
      destinataireId: retrait.etudiant.utilisateurId,
      type: "SYSTEME",
      titre: `Retrait payé : ${formaterMontantFcfa(retrait.montantFcfa)}`,
      contenu: "Ton retrait a été envoyé sur ton compte mobile money.",
      lien: "/app/portefeuille",
    });
  }
}

export async function payerRetrait(retraitId: string) {
  const session = await exigerAdmin();
  const r = await envoyerRetraitWave(retraitId, session.user.id);
  if (r.succes) await notifierTalentPaye(retraitId);
  revalidatePath("/admin/paie");
  return r;
}

/** Envoie tous les retraits Wave au statut DEMANDE, séquentiellement. */
export async function payerTousLesRetraits() {
  const session = await exigerAdmin();
  const demandes = await prisma.retrait.findMany({
    where: { statut: "DEMANDE", methode: "WAVE" },
    orderBy: { creeLe: "asc" },
    select: { id: true },
  });

  let payes = 0;
  let erreurs = 0;
  for (const d of demandes) {
    const r = await envoyerRetraitWave(d.id, session.user.id);
    if (r.succes) {
      payes += 1;
      await notifierTalentPaye(d.id);
    } else {
      erreurs += 1;
    }
  }

  revalidatePath("/admin/paie");
  return { succes: true as const, payes, erreurs, total: demandes.length };
}

export async function reconcilierRetraits() {
  const session = await exigerAdmin();
  const enCours = await prisma.retrait.findMany({
    where: { statut: "EN_COURS" },
    select: { id: true },
  });
  for (const r of enCours) {
    const statut = await reconcilierRetrait(r.id, session.user.id);
    if (statut === "PAYE") await notifierTalentPaye(r.id);
  }
  revalidatePath("/admin/paie");
  return { succes: true as const, verifies: enCours.length };
}

/**
 * Marque un retrait comme payé manuellement (Orange Money : versement
 * fait hors plateforme, l'ops confirme ici).
 */
export async function marquerPayeManuellement(retraitId: string) {
  const session = await exigerAdmin();
  const retrait = await prisma.retrait.findUnique({
    where: { id: retraitId },
    select: { statut: true },
  });
  if (!retrait || retrait.statut !== "DEMANDE") return { succes: false as const };

  await prisma.retrait.update({
    where: { id: retraitId },
    data: { statut: "PAYE", referenceExterne: "MANUEL", finaliseLe: new Date() },
  });
  await journaliser({
    acteurId: session.user.id,
    action: "RETRAIT_PAYE_MANUEL",
    ressourceType: "Retrait",
    ressourceId: retraitId,
  });
  await notifierTalentPaye(retraitId);
  revalidatePath("/admin/paie");
  return { succes: true as const };
}
