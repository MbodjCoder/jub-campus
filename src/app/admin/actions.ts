"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Garde-fou : seul un admin ou super-admin peut exécuter ces actions.
async function exigerAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }
  return session;
}

// ─────────────────────────────────────────────────────────────
// Validation entreprises
// ─────────────────────────────────────────────────────────────

const schemaDecisionEntreprise = z.object({
  entrepriseId: z.string().cuid(),
  decision: z.enum(["VALIDEE", "REJETEE"]),
  motifRejet: z.string().max(500).optional(),
});

export async function deciderEntreprise(formData: FormData): Promise<void> {
  const session = await exigerAdmin();
  const parsed = schemaDecisionEntreprise.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  await prisma.entreprise.update({
    where: { id: parsed.data.entrepriseId },
    data: {
      statutValidation: parsed.data.decision,
      motifRejet: parsed.data.decision === "REJETEE" ? (parsed.data.motifRejet ?? null) : null,
      valideeLe: parsed.data.decision === "VALIDEE" ? new Date() : null,
    },
  });

  await prisma.journalAudit.create({
    data: {
      acteurId: session.user.id,
      action: parsed.data.decision === "VALIDEE" ? "ENTREPRISE.VALIDEE" : "ENTREPRISE.REJETEE",
      ressourceType: "Entreprise",
      ressourceId: parsed.data.entrepriseId,
      metadonnees: { motifRejet: parsed.data.motifRejet ?? null },
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/entreprises");
}

// ─────────────────────────────────────────────────────────────
// Modération projets
// ─────────────────────────────────────────────────────────────

const schemaDecisionProjet = z.object({
  projetId: z.string().cuid(),
  decision: z.enum(["PUBLIE", "REJETE"]),
  motifRejet: z.string().max(500).optional(),
});

export async function deciderProjet(formData: FormData): Promise<void> {
  const session = await exigerAdmin();
  const parsed = schemaDecisionProjet.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  if (parsed.data.decision === "PUBLIE") {
    await prisma.projet.update({
      where: { id: parsed.data.projetId },
      data: {
        statut: "PUBLIE",
        publieLe: new Date(),
        motifRejet: null,
      },
    });
  } else {
    await prisma.projet.update({
      where: { id: parsed.data.projetId },
      data: {
        statut: "BROUILLON",
        motifRejet: parsed.data.motifRejet ?? "Non conforme aux critères JUB.",
      },
    });
  }

  await prisma.journalAudit.create({
    data: {
      acteurId: session.user.id,
      action: parsed.data.decision === "PUBLIE" ? "PROJET.PUBLIE" : "PROJET.REJETE",
      ressourceType: "Projet",
      ressourceId: parsed.data.projetId,
      metadonnees: { motifRejet: parsed.data.motifRejet ?? null },
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/projets");
  revalidatePath("/projets");
}

// ─────────────────────────────────────────────────────────────
// Révocation certificat
// ─────────────────────────────────────────────────────────────

export async function revoquerCertificat(formData: FormData): Promise<void> {
  const session = await exigerAdmin();
  const certificatId = String(formData.get("certificatId") ?? "");
  const motif = String(formData.get("motif") ?? "Révoqué par l'administration.");
  if (!certificatId) return;

  const cert = await prisma.certificat.update({
    where: { id: certificatId },
    data: { statut: "REVOQUE", motifRevocation: motif },
  });

  await prisma.journalAudit.create({
    data: {
      acteurId: session.user.id,
      action: "CERTIFICAT.REVOQUE",
      ressourceType: "Certificat",
      ressourceId: certificatId,
      metadonnees: { motif, numeroPublic: cert.numeroPublic },
    },
  });

  revalidatePath("/admin");
  revalidatePath(`/v/${cert.numeroPublic}`);
}

// ─────────────────────────────────────────────────────────────
// Signalements
// ─────────────────────────────────────────────────────────────

export async function fermerSignalement(formData: FormData): Promise<void> {
  const session = await exigerAdmin();
  const signalementId = String(formData.get("signalementId") ?? "");
  const note = String(formData.get("note") ?? "");
  const resolu = formData.get("resolu") === "on";
  if (!signalementId) return;

  await prisma.signalement.update({
    where: { id: signalementId },
    data: {
      statut: resolu ? "RESOLU" : "REJETE",
      resolutionNote: note || null,
      resoluLe: new Date(),
    },
  });

  await prisma.journalAudit.create({
    data: {
      acteurId: session.user.id,
      action: resolu ? "SIGNALEMENT.RESOLU" : "SIGNALEMENT.REJETE",
      ressourceType: "Signalement",
      ressourceId: signalementId,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/signalements");
}
