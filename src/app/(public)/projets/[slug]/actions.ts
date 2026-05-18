"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { creerNotification } from "@/domaine/notifications";
import { limiterDebit } from "@/lib/rate-limit";

const schemaCandidature = z.object({
  projetId: z.string().cuid(),
  lettre: z.string().min(200, "Lettre trop courte (200 caractères minimum).").max(1500),
});

interface Resultat {
  succes: boolean;
  message?: string;
}

export async function soumettreCandidature(formData: FormData): Promise<Resultat> {
  const session = await auth();
  if (!session?.user?.id) {
    return { succes: false, message: "Connecte-toi pour postuler." };
  }

  // Anti-spam : 15 candidatures / heure par utilisateur.
  const limite = limiterDebit(`candidature:${session.user.id}`, 15, 3_600_000);
  if (!limite.autorise) {
    return { succes: false, message: "Trop de candidatures envoyées. Réessaie plus tard." };
  }

  const parsed = schemaCandidature.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { succes: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  const etudiant = await prisma.etudiant.findUnique({
    where: { utilisateurId: session.user.id },
    select: { id: true, prenom: true, nom: true },
  });
  if (!etudiant) return { succes: false, message: "Seuls les étudiants peuvent postuler." };

  const projet = await prisma.projet.findUnique({
    where: { id: parsed.data.projetId },
    select: {
      id: true, titre: true, slug: true, publieParId: true,
      statut: true, placesMax: true,
      equipe: { select: { membres: { select: { etudiantId: true } } } },
    },
  });
  if (!projet) return { succes: false, message: "Projet introuvable." };

  if (!["PUBLIE", "CANDIDATURES_OUVERTES", "EQUIPE_EN_CONSTITUTION"].includes(projet.statut)) {
    return { succes: false, message: "Les candidatures ne sont pas ouvertes sur ce projet." };
  }

  const placesRestantes = projet.placesMax - (projet.equipe?.membres.length ?? 0);
  if (placesRestantes <= 0) return { succes: false, message: "Plus de place disponible." };

  // Doublon ?
  const existante = await prisma.candidature.findUnique({
    where: { projetId_etudiantId: { projetId: projet.id, etudiantId: etudiant.id } },
    select: { id: true },
  });
  if (existante) return { succes: false, message: "Tu as déjà postulé sur ce projet." };

  const candidature = await prisma.candidature.create({
    data: {
      projetId: projet.id,
      etudiantId: etudiant.id,
      lettre: parsed.data.lettre,
      statut: "EN_ATTENTE",
    },
  });

  // Notifier le publisher
  await creerNotification({
    destinataireId: projet.publieParId,
    type: "CANDIDATURE_RECUE",
    titre: "Nouvelle candidature reçue",
    contenu: `${etudiant.prenom} ${etudiant.nom} a postulé sur « ${projet.titre} ».`,
    lien: "/entreprise/candidatures",
  });

  await prisma.journalAudit.create({
    data: {
      acteurId: session.user.id,
      action: "CANDIDATURE.SOUMISE",
      ressourceType: "Candidature",
      ressourceId: candidature.id,
      metadonnees: { projetSlug: projet.slug },
    },
  });

  revalidatePath(`/projets/${projet.slug}`);
  revalidatePath("/app/mes-projets");
  revalidatePath("/entreprise/candidatures");

  return { succes: true };
}

const schemaPartenariat = z.object({
  projetId: z.string().cuid(),
  typeContribution: z.enum(["FINANCEMENT", "CO_REALISATION", "RECRUTEMENT", "MENTORAT", "DIFFUSION"]),
  message: z.string().min(80, "Explique la proposition en 80 caractères minimum.").max(1500),
});

export async function soumettreDemandePartenariat(formData: FormData): Promise<Resultat> {
  const session = await auth();
  if (!session?.user?.id) {
    return { succes: false, message: "Connecte-toi pour proposer un partenariat." };
  }
  if (session.user.role !== "ENTREPRISE") {
    return { succes: false, message: "Seules les entreprises peuvent proposer un partenariat." };
  }

  const limite = limiterDebit(`partenariat:${session.user.id}`, 8, 3_600_000);
  if (!limite.autorise) {
    return { succes: false, message: "Trop de demandes envoyées. Réessaie plus tard." };
  }

  const parsed = schemaPartenariat.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { succes: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  const [entreprise, projet] = await Promise.all([
    prisma.entreprise.findUnique({
      where: { utilisateurId: session.user.id },
      select: { id: true, raisonSociale: true, statutValidation: true },
    }),
    prisma.projet.findUnique({
      where: { id: parsed.data.projetId },
      select: { id: true, titre: true, slug: true, publieParId: true, entrepriseId: true, statut: true },
    }),
  ]);
  if (!entreprise) return { succes: false, message: "Profil entreprise introuvable." };
  if (entreprise.statutValidation !== "VALIDEE") {
    return { succes: false, message: "Ton compte entreprise doit être validé avant de proposer un partenariat." };
  }
  if (!projet) return { succes: false, message: "Projet introuvable." };
  if (projet.entrepriseId === entreprise.id) {
    return { succes: false, message: "Tu gères déjà ce projet." };
  }
  if (!["PUBLIE", "CANDIDATURES_OUVERTES", "EQUIPE_EN_CONSTITUTION", "EN_COURS"].includes(projet.statut)) {
    return { succes: false, message: "Ce projet n'accepte pas de partenariat pour le moment." };
  }

  try {
    const existante = await prisma.demandePartenariat.findUnique({
      where: {
        projetId_entrepriseId: {
          projetId: projet.id,
          entrepriseId: entreprise.id,
        },
      },
      select: { id: true, statut: true },
    });
    if (existante?.statut === "EN_ATTENTE") {
      return { succes: false, message: "Une demande est déjà en attente sur ce projet." };
    }
    if (existante?.statut === "ACCEPTEE") {
      return { succes: false, message: "Ton entreprise est déjà partenaire de ce projet." };
    }

    const demande = existante
      ? await prisma.demandePartenariat.update({
          where: { id: existante.id },
          data: {
            typeContribution: parsed.data.typeContribution,
            message: parsed.data.message,
            statut: "EN_ATTENTE",
            reponse: null,
            reponduLe: null,
          },
        })
      : await prisma.demandePartenariat.create({
          data: {
            projetId: projet.id,
            entrepriseId: entreprise.id,
            typeContribution: parsed.data.typeContribution,
            message: parsed.data.message,
          },
        });

    await creerNotification({
      destinataireId: projet.publieParId,
      type: "DEMANDE_PARTENARIAT_RECUE",
      titre: "Nouvelle proposition de partenariat",
      contenu: `${entreprise.raisonSociale} souhaite contribuer au projet « ${projet.titre} ».`,
      lien: "/entreprise/partenariats",
    });

    await prisma.journalAudit.create({
      data: {
        acteurId: session.user.id,
        action: "PARTENARIAT.DEMANDE_SOUMISE",
        ressourceType: "DemandePartenariat",
        ressourceId: demande.id,
        metadonnees: { projetId: projet.id, projetSlug: projet.slug },
      },
    });
  } catch {
    return {
      succes: false,
      message: "L'envoi de la demande a échoué. Réessaie dans un instant.",
    };
  }

  revalidatePath(`/projets/${projet.slug}`);
  revalidatePath("/entreprise/partenariats");
  return { succes: true };
}
