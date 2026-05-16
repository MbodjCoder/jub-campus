"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { emettreCertificat } from "@/domaine/certificats";

// ─────────────────────────────────────────────────────────────
// Garde-fou : récupère l'utilisateur connecté.
// ─────────────────────────────────────────────────────────────
async function exigerSession() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");
  return session;
}

// Vérifie que l'utilisateur a le droit d'agir sur ce projet
// (membre d'équipe, mentor du projet, ou admin).
async function verifierAccesProjet(projetId: string, utilisateurId: string) {
  const projet = await prisma.projet.findUnique({
    where: { id: projetId },
    include: {
      equipe: { include: { membres: { include: { etudiant: true } } } },
      mentorPrincipal: true,
    },
  });
  if (!projet) return null;

  const utilisateur = await prisma.utilisateur.findUnique({
    where: { id: utilisateurId },
    include: { etudiant: true, mentor: true },
  });
  if (!utilisateur) return null;

  if (utilisateur.role === "ADMIN" || utilisateur.role === "SUPER_ADMIN") return projet;

  const estMembre = projet.equipe?.membres.some(
    (m) => m.etudiantId === utilisateur.etudiant?.id,
  );
  const estMentor = projet.mentorPrincipalId === utilisateur.mentor?.id;

  if (!estMembre && !estMentor) return null;
  return projet;
}

// ─────────────────────────────────────────────────────────────
// Création / déplacement de tâche
// ─────────────────────────────────────────────────────────────

const schemaCreerTache = z.object({
  projetId: z.string().cuid(),
  titre: z.string().min(2).max(120),
  description: z.string().max(2000).optional(),
  priorite: z.enum(["BASSE", "NORMALE", "HAUTE", "URGENTE"]).default("NORMALE"),
  assigneeId: z.string().cuid().optional().or(z.literal("")),
  echeance: z.string().optional(),
});

export async function creerTache(formData: FormData) {
  const session = await exigerSession();
  const parsed = schemaCreerTache.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { succes: false, message: "Champs invalides." };
  }
  const projet = await verifierAccesProjet(parsed.data.projetId, session.user.id);
  if (!projet) return { succes: false, message: "Accès refusé." };

  await prisma.tache.create({
    data: {
      projetId: parsed.data.projetId,
      titre: parsed.data.titre,
      description: parsed.data.description || null,
      priorite: parsed.data.priorite,
      assigneeId: parsed.data.assigneeId || null,
      echeance: parsed.data.echeance ? new Date(parsed.data.echeance) : null,
    },
  });

  revalidatePath(`/app/projet/${parsed.data.projetId}`);
  return { succes: true };
}

export async function deplacerTache(tacheId: string, nouveauStatut: string) {
  const session = await exigerSession();
  const tache = await prisma.tache.findUnique({ where: { id: tacheId }, select: { projetId: true } });
  if (!tache) return { succes: false };
  const projet = await verifierAccesProjet(tache.projetId, session.user.id);
  if (!projet) return { succes: false };

  const statuts = ["A_FAIRE", "EN_COURS", "EN_REVUE", "TERMINEE"] as const;
  if (!statuts.includes(nouveauStatut as (typeof statuts)[number])) return { succes: false };

  await prisma.tache.update({
    where: { id: tacheId },
    data: {
      statut: nouveauStatut as (typeof statuts)[number],
      termineeLe: nouveauStatut === "TERMINEE" ? new Date() : null,
    },
  });

  revalidatePath(`/app/projet/${tache.projetId}`);
  return { succes: true };
}

// ─────────────────────────────────────────────────────────────
// Dépôt de livrable
// ─────────────────────────────────────────────────────────────

const schemaDeposerLivrable = z.object({
  projetId: z.string().cuid(),
  titre: z.string().min(2).max(160),
  description: z.string().max(2000).optional(),
  fichierUrl: z.string().url("URL invalide."),
  tacheId: z.string().cuid().optional().or(z.literal("")),
});

export async function deposerLivrable(formData: FormData) {
  const session = await exigerSession();
  const parsed = schemaDeposerLivrable.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { succes: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }
  const projet = await verifierAccesProjet(parsed.data.projetId, session.user.id);
  if (!projet) return { succes: false, message: "Accès refusé." };

  // Type MIME deviné depuis l'extension de l'URL (best-effort).
  const url = parsed.data.fichierUrl;
  const ext = url.split(".").pop()?.toLowerCase() ?? "";
  const mimeMap: Record<string, string> = {
    pdf: "application/pdf",
    zip: "application/zip",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    mp4: "video/mp4",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  };
  const typeMime = mimeMap[ext] ?? "application/octet-stream";

  await prisma.livrable.create({
    data: {
      projetId: parsed.data.projetId,
      titre: parsed.data.titre,
      description: parsed.data.description || null,
      fichierUrl: url,
      typeMime,
      tacheId: parsed.data.tacheId || null,
      deposeParId: session.user.id,
    },
  });

  revalidatePath(`/app/projet/${parsed.data.projetId}`);
  return { succes: true };
}

// ─────────────────────────────────────────────────────────────
// Feedback sur livrable
// ─────────────────────────────────────────────────────────────

const schemaFeedback = z.object({
  livrableId: z.string().cuid(),
  contenu: z.string().min(2).max(2000),
  note: z.coerce.number().int().min(1).max(5).optional(),
});

export async function ajouterFeedback(formData: FormData) {
  const session = await exigerSession();
  const raw = Object.fromEntries(formData);
  // note vide → undefined pour passer le coerce optionnel
  if (raw.note === "") delete (raw as Record<string, unknown>).note;
  const parsed = schemaFeedback.safeParse(raw);
  if (!parsed.success) {
    return { succes: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  const livrable = await prisma.livrable.findUnique({
    where: { id: parsed.data.livrableId },
    select: { projetId: true },
  });
  if (!livrable) return { succes: false, message: "Livrable introuvable." };
  const projet = await verifierAccesProjet(livrable.projetId, session.user.id);
  if (!projet) return { succes: false, message: "Accès refusé." };

  await prisma.feedback.create({
    data: {
      livrableId: parsed.data.livrableId,
      auteurId: session.user.id,
      contenu: parsed.data.contenu,
      note: parsed.data.note ?? null,
    },
  });

  revalidatePath(`/app/projet/${livrable.projetId}`);
  return { succes: true };
}

// ─────────────────────────────────────────────────────────────
// Émission certificat (démo : sur projets internes JUB)
// ─────────────────────────────────────────────────────────────

interface ResultatEmission {
  succes: boolean;
  message?: string;
  numeroPublic?: string;
}

export async function emettreCertificatDemo(projetId: string): Promise<ResultatEmission> {
  const session = await exigerSession();
  const projet = await verifierAccesProjet(projetId, session.user.id);
  if (!projet) return { succes: false, message: "Accès refusé." };
  if (projet.source !== "JUB_INTERNE") {
    return { succes: false, message: "L'émission auto est réservée aux projets internes JUB." };
  }

  const etudiant = await prisma.etudiant.findUnique({
    where: { utilisateurId: session.user.id },
  });
  if (!etudiant) return { succes: false, message: "Profil étudiant introuvable." };

  // Si un certificat existe déjà pour ce couple étudiant / projet, on renvoie son numéro.
  const existant = await prisma.certificat.findFirst({
    where: { etudiantId: etudiant.id, projetId },
  });
  if (existant) {
    return { succes: true, numeroPublic: existant.numeroPublic };
  }

  // Membre d'équipe : récupérer le rôle pour le certificat.
  const membre = await prisma.membreEquipe.findFirst({
    where: { etudiantId: etudiant.id, equipe: { projetId } },
  });

  // Livrables validés (pour les annexer au certificat).
  const livrablesValides = await prisma.livrable.findMany({
    where: { projetId, statut: "VALIDE" },
    select: { id: true },
  });

  // Score : moyenne des notes de feedback (sur 10), fallback 8.5.
  const feedbacks = await prisma.feedback.findMany({
    where: { livrable: { projetId }, note: { not: null } },
    select: { note: true },
  });
  const scoreFinal = feedbacks.length > 0
    ? Math.min(10, (feedbacks.reduce((s, f) => s + (f.note ?? 0), 0) / feedbacks.length) * 2)
    : 8.5;

  const cert = await emettreCertificat({
    etudiantId: etudiant.id,
    projetId,
    roleJoue: membre?.roleEquipe ?? "Contributeur",
    periodeDebut: projet.publieLe ?? projet.creeLe,
    periodeFin: new Date(),
    scoreFinal,
    competencesValidees: ["Next.js", "TypeScript", "Travail en équipe", "Autonomie"],
    livrablesIds: livrablesValides.map((l) => l.id),
    appreciation:
      "Excellent travail sur le projet de démonstration JUB Campus. " +
      "Engagement, rigueur et qualité des livrables au rendez-vous.",
    mentorNom: "JUB Campus",
    organisationNom: "JUB Campus",
  });

  // Marquer le projet comme CERTIFIE (état terminal positif).
  await prisma.projet.update({
    where: { id: projetId },
    data: { statut: "CERTIFIE", termineLe: new Date() },
  });

  revalidatePath(`/app/projet/${projetId}`);
  revalidatePath(`/app/certificats`);
  revalidatePath(`/v/${cert.numeroPublic}`);

  return { succes: true, numeroPublic: cert.numeroPublic };
}

// Changer le statut d'un livrable (mentor / entreprise uniquement
// idéalement — pour cette première version on autorise tout membre).
export async function changerStatutLivrable(livrableId: string, statut: string) {
  const session = await exigerSession();
  const livrable = await prisma.livrable.findUnique({
    where: { id: livrableId },
    select: { projetId: true },
  });
  if (!livrable) return { succes: false };
  const projet = await verifierAccesProjet(livrable.projetId, session.user.id);
  if (!projet) return { succes: false };

  const statuts = ["EN_REVUE", "VALIDE", "A_CORRIGER", "REJETE"] as const;
  if (!statuts.includes(statut as (typeof statuts)[number])) return { succes: false };

  await prisma.livrable.update({
    where: { id: livrableId },
    data: { statut: statut as (typeof statuts)[number] },
  });

  revalidatePath(`/app/projet/${livrable.projetId}`);
  return { succes: true };
}
