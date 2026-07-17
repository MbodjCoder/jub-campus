"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { emettreCertificat, urlPdfCertificat, urlVerification } from "@/domaine/certificats";
import { scannerEtOctroyerBadges } from "@/domaine/badges";
import {
  envoyerEmail,
  emailCertificatEmis,
  emailFeedbackRecu,
  emailEvaluationRecue,
} from "@/lib/email";
import { env } from "@/lib/env";
import { crediterGainTache } from "@/domaine/portefeuille";
import { creerNotification } from "@/domaine/notifications";
import { formaterMontantFcfa } from "@/lib/utils";

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
    include: { etudiant: true, mentor: true, entreprise: true },
  });
  if (!utilisateur) return null;

  if (utilisateur.role === "ADMIN" || utilisateur.role === "SUPER_ADMIN") return projet;

  const estMembre = projet.equipe?.membres.some(
    (m) => m.etudiantId === utilisateur.etudiant?.id,
  );
  const estMentor = projet.mentorPrincipalId === utilisateur.mentor?.id;
  // L'entreprise propriétaire du projet a aussi accès (suivi + évaluation).
  const estEntreprise =
    utilisateur.entreprise != null && projet.entrepriseId === utilisateur.entreprise.id;

  if (!estMembre && !estMentor && !estEntreprise) return null;
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

  // L'assigné doit être un membre de l'équipe du projet.
  if (parsed.data.assigneeId) {
    const membreOk =
      projet.equipe?.membres.some((m) => m.etudiantId === parsed.data.assigneeId) ?? false;
    if (!membreOk) {
      return { succes: false, message: "L'étudiant assigné n'appartient pas à l'équipe." };
    }
  }

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
  // Soit un fichier hébergé localement (/uploads/...) via l'API d'upload,
  // soit une URL absolue externe (Drive, Figma, GitHub, etc.).
  fichierUrl: z
    .string()
    .min(1, "Fichier requis.")
    .refine(
      (s) => s.startsWith("/uploads/") || /^https?:\/\//.test(s),
      { message: "URL ou chemin de fichier invalide." },
    ),
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

  // Notification email à l'auteur du livrable (asynchrone, ne bloque pas).
  const livrableComplet = await prisma.livrable.findUnique({
    where: { id: parsed.data.livrableId },
    include: { deposePar: true },
  });
  const auteurFeedback = await prisma.utilisateur.findUnique({
    where: { id: session.user.id },
    select: { nomComplet: true },
  });
  if (livrableComplet?.deposePar.email && livrableComplet.deposePar.id !== session.user.id) {
    await envoyerEmail(
      emailFeedbackRecu({
        destinataire: livrableComplet.deposePar.email,
        prenomDestinataire: livrableComplet.deposePar.nomComplet?.split(" ")[0] ?? "—",
        livrableTitre: livrableComplet.titre,
        auteurNom: auteurFeedback?.nomComplet ?? "Un mentor",
        apercu: parsed.data.contenu.slice(0, 200),
        urlProjet: `${env.URL_PUBLIQUE ?? "http://localhost:3000"}/app/projet/${livrable.projetId}`,
      }),
    );
  }

  revalidatePath(`/app/projet/${livrable.projetId}`);
  return { succes: true };
}

// ─────────────────────────────────────────────────────────────
// Évaluation multi-source (mentor / entreprise / pair / auto)
// ─────────────────────────────────────────────────────────────

// Pondération des 10 critères (somme = 100).
export const PONDERATION_EVAL = {
  qualiteLivrable: 20,
  respectDelais: 10,
  communication: 10,
  autonomie: 8,
  collaboration: 10,
  creativite: 7,
  rigueur: 10,
  resolutionProb: 10,
  professionnalisme: 5,
  contributionReelle: 10,
} as const;

const critereInt = z.coerce.number().int().min(1).max(10);

const schemaEvaluation = z.object({
  projetId: z.string().cuid(),
  etudiantId: z.string().cuid(),
  source: z.enum(["MENTOR", "ENTREPRISE", "PAIR", "AUTO", "ADMIN"]),
  qualiteLivrable: critereInt,
  respectDelais: critereInt,
  communication: critereInt,
  autonomie: critereInt,
  collaboration: critereInt,
  creativite: critereInt,
  rigueur: critereInt,
  resolutionProb: critereInt,
  professionnalisme: critereInt,
  contributionReelle: critereInt,
  appreciation: z.string().max(2000).optional(),
});

export async function soumettreEvaluation(formData: FormData) {
  const session = await exigerSession();
  const raw = Object.fromEntries(formData);
  const parsed = schemaEvaluation.safeParse(raw);
  if (!parsed.success) {
    return { succes: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }
  const projet = await verifierAccesProjet(parsed.data.projetId, session.user.id);
  if (!projet) return { succes: false, message: "Accès refusé." };

  // L'étudiant évalué doit être un membre réel de l'équipe du projet.
  const cibleEstMembre =
    projet.equipe?.membres.some((m) => m.etudiantId === parsed.data.etudiantId) ?? false;
  if (!cibleEstMembre) {
    return { succes: false, message: "L'étudiant évalué n'appartient pas à l'équipe de ce projet." };
  }

  // Vérifier la cohérence rôle ↔ source : seul un mentor peut évaluer comme MENTOR,
  // une entreprise comme ENTREPRISE, etc.
  const utilisateur = await prisma.utilisateur.findUnique({
    where: { id: session.user.id },
    include: { etudiant: true, mentor: true, entreprise: true },
  });
  if (!utilisateur) return { succes: false, message: "Utilisateur introuvable." };

  const d = parsed.data;
  switch (d.source) {
    case "MENTOR":
      if (!utilisateur.mentor && utilisateur.role !== "ADMIN" && utilisateur.role !== "SUPER_ADMIN")
        return { succes: false, message: "Source MENTOR réservée aux mentors." };
      break;
    case "ENTREPRISE":
      if (!utilisateur.entreprise && utilisateur.role !== "ADMIN" && utilisateur.role !== "SUPER_ADMIN")
        return { succes: false, message: "Source ENTREPRISE réservée aux entreprises." };
      break;
    case "AUTO":
      if (utilisateur.etudiant?.id !== d.etudiantId)
        return { succes: false, message: "L'auto-évaluation ne peut viser que toi-même." };
      break;
    case "PAIR":
      if (!utilisateur.etudiant)
        return { succes: false, message: "Évaluation par les pairs réservée aux étudiants." };
      if (utilisateur.etudiant.id === d.etudiantId)
        return { succes: false, message: "Tu ne peux pas t'auto-évaluer comme PAIR." };
      break;
    case "ADMIN":
      if (utilisateur.role !== "ADMIN" && utilisateur.role !== "SUPER_ADMIN")
        return { succes: false, message: "Source ADMIN réservée aux admins." };
      break;
  }

  // Calcul de la moyenne pondérée (sur 10).
  const scoreGlobal =
    (d.qualiteLivrable    * PONDERATION_EVAL.qualiteLivrable    +
     d.respectDelais      * PONDERATION_EVAL.respectDelais      +
     d.communication      * PONDERATION_EVAL.communication      +
     d.autonomie          * PONDERATION_EVAL.autonomie          +
     d.collaboration      * PONDERATION_EVAL.collaboration      +
     d.creativite         * PONDERATION_EVAL.creativite         +
     d.rigueur            * PONDERATION_EVAL.rigueur            +
     d.resolutionProb     * PONDERATION_EVAL.resolutionProb     +
     d.professionnalisme  * PONDERATION_EVAL.professionnalisme  +
     d.contributionReelle * PONDERATION_EVAL.contributionReelle) / 100;

  try {
    await prisma.evaluation.upsert({
      where: {
        projetId_etudiantId_source_evaluateurId: {
          projetId: d.projetId,
          etudiantId: d.etudiantId,
          source: d.source,
          evaluateurId: session.user.id,
        },
      },
      update: {
        qualiteLivrable: d.qualiteLivrable,
        respectDelais: d.respectDelais,
        communication: d.communication,
        autonomie: d.autonomie,
        collaboration: d.collaboration,
        creativite: d.creativite,
        rigueur: d.rigueur,
        resolutionProb: d.resolutionProb,
        professionnalisme: d.professionnalisme,
        contributionReelle: d.contributionReelle,
        appreciation: d.appreciation ?? null,
        scoreGlobal,
      },
      create: {
        projetId: d.projetId,
        etudiantId: d.etudiantId,
        source: d.source,
        evaluateurId: session.user.id,
        qualiteLivrable: d.qualiteLivrable,
        respectDelais: d.respectDelais,
        communication: d.communication,
        autonomie: d.autonomie,
        collaboration: d.collaboration,
        creativite: d.creativite,
        rigueur: d.rigueur,
        resolutionProb: d.resolutionProb,
        professionnalisme: d.professionnalisme,
        contributionReelle: d.contributionReelle,
        appreciation: d.appreciation ?? null,
        scoreGlobal,
      },
    });
  } catch {
    return { succes: false, message: "Impossible d'enregistrer l'évaluation." };
  }

  // Notification email à l'étudiant évalué (sauf auto-évaluation).
  if (d.source !== "AUTO") {
    const etudiantCible = await prisma.etudiant.findUnique({
      where: { id: d.etudiantId },
      include: { utilisateur: { select: { email: true } } },
    });
    const projetComplet = await prisma.projet.findUnique({
      where: { id: d.projetId },
      select: { titre: true },
    });
    if (etudiantCible?.utilisateur.email && projetComplet) {
      await envoyerEmail(
        emailEvaluationRecue({
          destinataire: etudiantCible.utilisateur.email,
          prenomDestinataire: etudiantCible.prenom,
          projetTitre: projetComplet.titre,
          source: d.source,
          scoreGlobal,
          urlProjet: `${env.URL_PUBLIQUE ?? "http://localhost:3000"}/app/projet/${d.projetId}`,
        }),
      );
    }
  }

  revalidatePath(`/app/projet/${d.projetId}`);
  return { succes: true, scoreGlobal };
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

  // SÉCURITÉ : l'émission « démo » contournerait l'évaluation réelle.
  // Réservée aux admins (ou activée explicitement hors production).
  const role = session.user.role;
  const estAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
  const demoAutorisee = env.AUTORISER_CERTIFICAT_DEMO === "true";
  if (!estAdmin && !demoAutorisee) {
    return {
      succes: false,
      message: "L'émission d'un certificat passe par l'évaluation et la validation d'un mentor.",
    };
  }

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

  // Octroi automatique de badges (best-effort, ne bloque rien).
  await scannerEtOctroyerBadges(etudiant.id).catch(() => undefined);

  // Email "certificat émis" à l'étudiant.
  const utilisateurEtudiant = await prisma.utilisateur.findUnique({
    where: { id: session.user.id },
    select: { email: true, nomComplet: true },
  });
  if (utilisateurEtudiant?.email) {
    await envoyerEmail(
      emailCertificatEmis({
        destinataire: utilisateurEtudiant.email,
        prenom: etudiant.prenom,
        projetTitre: projet.titre,
        numeroPublic: cert.numeroPublic,
        scoreFinal,
        urlVerification: urlVerification(cert.numeroPublic),
        urlPdf: urlPdfCertificat(cert.numeroPublic),
      }),
    );
  }

  revalidatePath(`/app/projet/${projetId}`);
  revalidatePath(`/app/certificats`);
  revalidatePath(`/v/${cert.numeroPublic}`);

  return { succes: true, numeroPublic: cert.numeroPublic };
}

// ─────────────────────────────────────────────────────────────
// Fil de discussion d'équipe (messages projet)
// ─────────────────────────────────────────────────────────────

const schemaMessageProjet = z.object({
  projetId: z.string().cuid(),
  contenu: z.string().min(1, "Message vide.").max(2000),
});

export async function posterMessageProjet(formData: FormData) {
  const session = await exigerSession();
  const parsed = schemaMessageProjet.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { succes: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }
  const projet = await verifierAccesProjet(parsed.data.projetId, session.user.id);
  if (!projet) return { succes: false, message: "Accès refusé." };

  await prisma.message.create({
    data: {
      expediteurId: session.user.id,
      projetId: parsed.data.projetId,
      contenu: parsed.data.contenu,
    },
  });

  revalidatePath(`/app/projet/${parsed.data.projetId}`);
  return { succes: true };
}

// Vérifie que l'utilisateur est habilité à VALIDER un travail sur ce projet :
// mentor du projet, entreprise propriétaire, ou admin. Jamais un étudiant.
async function exigerValidateur(projetId: string, utilisateurId: string) {
  const projet = await prisma.projet.findUnique({
    where: { id: projetId },
    select: { id: true, mentorPrincipalId: true, entrepriseId: true },
  });
  if (!projet) return null;

  const u = await prisma.utilisateur.findUnique({
    where: { id: utilisateurId },
    select: {
      role: true,
      mentor: { select: { id: true } },
      entreprise: { select: { id: true } },
    },
  });
  if (!u) return null;

  if (u.role === "ADMIN" || u.role === "SUPER_ADMIN") return projet;
  if (u.mentor && projet.mentorPrincipalId === u.mentor.id) return projet;
  if (u.entreprise && projet.entrepriseId === u.entreprise.id) return projet;
  return null;
}

// Changer le statut d'un livrable — réservé mentor / entreprise / admin.
// Un étudiant ne peut JAMAIS valider son propre travail.
export async function changerStatutLivrable(livrableId: string, statut: string) {
  const session = await exigerSession();
  const livrable = await prisma.livrable.findUnique({
    where: { id: livrableId },
    select: { projetId: true, tacheId: true },
  });
  if (!livrable) return { succes: false };
  const projet = await exigerValidateur(livrable.projetId, session.user.id);
  if (!projet) return { succes: false, message: "Seul un mentor ou l'entreprise peut valider un livrable." };

  const statuts = ["EN_REVUE", "VALIDE", "A_CORRIGER", "REJETE"] as const;
  if (!statuts.includes(statut as (typeof statuts)[number])) return { succes: false };

  await prisma.livrable.update({
    where: { id: livrableId },
    data: { statut: statut as (typeof statuts)[number] },
  });

  // Mode agence : la validation QC d'un livrable rattaché à une tâche
  // payée termine la tâche et crédite le gain sur le portefeuille du
  // talent. crediterGainTache est idempotent (jamais de double crédit).
  if (statut === "VALIDE" && livrable.tacheId) {
    await prisma.tache.update({
      where: { id: livrable.tacheId },
      data: { statut: "TERMINEE", termineeLe: new Date() },
    });
    const credit = await crediterGainTache(livrable.tacheId);
    if (credit.succes) {
      const tache = await prisma.tache.findUnique({
        where: { id: livrable.tacheId },
        select: {
          montantFcfa: true,
          assignee: { select: { utilisateurId: true } },
        },
      });
      if (tache?.assignee) {
        await creerNotification({
          destinataireId: tache.assignee.utilisateurId,
          type: "SYSTEME",
          titre: `Gain crédité : ${formaterMontantFcfa(tache.montantFcfa ?? 0)}`,
          contenu: "Ton livrable a été validé. Le gain est disponible dans ton portefeuille.",
          lien: "/app/portefeuille",
        });
      }
    }
  }

  revalidatePath(`/app/projet/${livrable.projetId}`);
  return { succes: true };
}
