"use server";

// Actions ops : construction des missions (mode agence).
// Créer la mission, la découper en tâches tarifées, répartir l'enveloppe,
// assigner les talents. Réservé admin / super-admin.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugifier } from "@/lib/utils";
import { repartirEnveloppe } from "@/domaine/regles-portefeuille";
import { journaliser } from "@/domaine/audit";
import { nanoid } from "nanoid";

async function exigerAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }
  return session;
}

// ─────────────────────────────────────────────────────────────
// Création d'une mission
// ─────────────────────────────────────────────────────────────

const schemaMission = z.object({
  titre: z.string().min(4).max(160),
  resume: z.string().min(10).max(600),
  categorie: z.enum(["ENQUETE_TERRAIN", "ANNOTATION_DONNEES", "RECHERCHE", "REDACTION", "DATA", "AUTRE"]).catch("AUTRE"),
  clientId: z.string().cuid().optional().or(z.literal("")),
  briefId: z.string().cuid().optional().or(z.literal("")),
  montantClientFcfa: z.coerce.number().int().positive(),
  enveloppeTalentsFcfa: z.coerce.number().int().positive(),
  dureeJours: z.coerce.number().int().min(1).max(365),
  placesMax: z.coerce.number().int().min(1).max(50).default(1),
});

export async function creerMission(formData: FormData) {
  const session = await exigerAdmin();
  const parsed = schemaMission.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { succes: false as const, message: "Formulaire invalide." };
  }
  const d = parsed.data;
  if (d.enveloppeTalentsFcfa > d.montantClientFcfa) {
    return {
      succes: false as const,
      message: "L'enveloppe talents ne peut pas dépasser le montant client (marge négative).",
    };
  }

  // Catégorie mission → catégorie projet existante la plus proche.
  const CATEGORIE: Record<string, "ENQUETE_TERRAIN" | "ANNOTATION_DONNEES" | "RECHERCHE" | "REDACTION" | "DATA"> = {
    ENQUETE_TERRAIN: "ENQUETE_TERRAIN",
    ANNOTATION_DONNEES: "ANNOTATION_DONNEES",
    RECHERCHE: "RECHERCHE",
    REDACTION: "REDACTION",
    DATA: "DATA",
    AUTRE: "RECHERCHE",
  };

  const mission = await prisma.projet.create({
    data: {
      slug: `${slugifier(d.titre)}-${nanoid(6).toLowerCase()}`,
      titre: d.titre,
      resume: d.resume,
      description: d.resume,
      source: "JUB_INTERNE",
      categorie: CATEGORIE[d.categorie],
      niveau: "INTERMEDIAIRE",
      modeRemuneration: "REMUNERE",
      montantFcfa: d.enveloppeTalentsFcfa,
      montantClientFcfa: d.montantClientFcfa,
      enveloppeTalentsFcfa: d.enveloppeTalentsFcfa,
      dureeJours: d.dureeJours,
      placesMax: d.placesMax,
      statut: "EN_COURS",
      visibilite: "PRIVEE",
      publieParId: session.user.id,
      entrepriseId: d.clientId || null,
      equipe: { create: {} },
    },
    select: { id: true },
  });

  if (d.briefId) {
    await prisma.brief.update({
      where: { id: d.briefId },
      data: { statut: "ACCEPTE", projetId: mission.id },
    });
  }

  await journaliser({
    acteurId: session.user.id,
    action: "MISSION_CREEE",
    ressourceType: "Projet",
    ressourceId: mission.id,
    metadonnees: { montantClientFcfa: d.montantClientFcfa, enveloppeTalentsFcfa: d.enveloppeTalentsFcfa },
  });

  revalidatePath("/admin/missions");
  redirect(`/admin/missions/${mission.id}`);
}

// ─────────────────────────────────────────────────────────────
// Tâches tarifées
// ─────────────────────────────────────────────────────────────

const schemaTache = z.object({
  projetId: z.string().cuid(),
  titre: z.string().min(2).max(160),
  montantFcfa: z.coerce.number().int().min(0),
  assigneeId: z.string().cuid().optional().or(z.literal("")),
  echeance: z.string().optional().or(z.literal("")),
});

export async function ajouterTacheMission(formData: FormData) {
  await exigerAdmin();
  const parsed = schemaTache.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { succes: false as const, message: "Formulaire invalide." };
  const d = parsed.data;

  const mission = await prisma.projet.findUnique({
    where: { id: d.projetId },
    select: {
      enveloppeTalentsFcfa: true,
      taches: { select: { montantFcfa: true, crediteeLe: true } },
      equipe: { select: { membres: { select: { etudiantId: true } } } },
    },
  });
  if (!mission) return { succes: false as const, message: "Mission introuvable." };

  // Le total des tâches ne dépasse jamais l'enveloppe.
  const dejaAlloue = mission.taches.reduce((s, t) => s + (t.montantFcfa ?? 0), 0);
  if (mission.enveloppeTalentsFcfa != null && dejaAlloue + d.montantFcfa > mission.enveloppeTalentsFcfa) {
    return {
      succes: false as const,
      message: `Enveloppe dépassée : ${dejaAlloue + d.montantFcfa} > ${mission.enveloppeTalentsFcfa} FCFA.`,
    };
  }

  if (d.assigneeId) {
    const membre = mission.equipe?.membres.some((m) => m.etudiantId === d.assigneeId) ?? false;
    if (!membre) return { succes: false as const, message: "Le talent assigné n'est pas dans l'équipe." };
  }

  await prisma.tache.create({
    data: {
      projetId: d.projetId,
      titre: d.titre,
      montantFcfa: d.montantFcfa > 0 ? d.montantFcfa : null,
      assigneeId: d.assigneeId || null,
      echeance: d.echeance ? new Date(d.echeance) : null,
    },
  });

  revalidatePath(`/admin/missions/${d.projetId}`);
  return { succes: true as const };
}

/**
 * Répartit l'enveloppe talents restante entre les tâches non créditées,
 * au prorata égal (poids 1 chacune), sans perdre un franc.
 * Les tâches déjà créditées gardent leur montant.
 */
export async function repartirEnveloppeMission(projetId: string) {
  const session = await exigerAdmin();

  const mission = await prisma.projet.findUnique({
    where: { id: projetId },
    select: {
      enveloppeTalentsFcfa: true,
      taches: { select: { id: true, montantFcfa: true, crediteeLe: true }, orderBy: { creeLe: "asc" } },
    },
  });
  if (!mission?.enveloppeTalentsFcfa) return { succes: false as const, message: "Pas d'enveloppe définie." };

  const creditees = mission.taches.filter((t) => t.crediteeLe);
  const modifiables = mission.taches.filter((t) => !t.crediteeLe);
  if (modifiables.length === 0) return { succes: false as const, message: "Aucune tâche modifiable." };

  const dejaVerse = creditees.reduce((s, t) => s + (t.montantFcfa ?? 0), 0);
  const restant = mission.enveloppeTalentsFcfa - dejaVerse;
  if (restant <= 0) return { succes: false as const, message: "Enveloppe déjà consommée." };

  const parts = repartirEnveloppe(restant, modifiables.map(() => 1));
  await prisma.$transaction(
    modifiables.map((t, i) =>
      prisma.tache.update({ where: { id: t.id }, data: { montantFcfa: parts[i] || null } }),
    ),
  );

  await journaliser({
    acteurId: session.user.id,
    action: "ENVELOPPE_REPARTIE",
    ressourceType: "Projet",
    ressourceId: projetId,
    metadonnees: { restant, nbTaches: modifiables.length },
  });

  revalidatePath(`/admin/missions/${projetId}`);
  return { succes: true as const };
}

export async function supprimerTacheMission(tacheId: string) {
  await exigerAdmin();
  const tache = await prisma.tache.findUnique({
    where: { id: tacheId },
    select: { projetId: true, crediteeLe: true },
  });
  if (!tache) return { succes: false as const };
  if (tache.crediteeLe) {
    return { succes: false as const, message: "Tâche déjà payée : suppression impossible." };
  }
  await prisma.tache.delete({ where: { id: tacheId } });
  revalidatePath(`/admin/missions/${tache.projetId}`);
  return { succes: true as const };
}

// ─────────────────────────────────────────────────────────────
// Équipe de mission (ops assigne directement, sans candidature)
// ─────────────────────────────────────────────────────────────

export async function ajouterTalentMission(formData: FormData) {
  await exigerAdmin();
  const projetId = String(formData.get("projetId") ?? "");
  const slugOuEmail = String(formData.get("talent") ?? "").trim().toLowerCase();
  if (!projetId || !slugOuEmail) return { succes: false as const, message: "Champs manquants." };

  const etudiant = await prisma.etudiant.findFirst({
    where: {
      OR: [
        { slug: slugOuEmail },
        { utilisateur: { email: slugOuEmail } },
      ],
    },
    select: { id: true, prenom: true, nom: true },
  });
  if (!etudiant) return { succes: false as const, message: "Talent introuvable (slug ou email)." };

  const equipe = await prisma.equipe.upsert({
    where: { projetId },
    create: { projetId },
    update: {},
    select: { id: true },
  });

  await prisma.membreEquipe.upsert({
    where: { equipeId_etudiantId: { equipeId: equipe.id, etudiantId: etudiant.id } },
    create: { equipeId: equipe.id, etudiantId: etudiant.id, roleEquipe: "Talent" },
    update: {},
  });

  revalidatePath(`/admin/missions/${projetId}`);
  return { succes: true as const };
}
