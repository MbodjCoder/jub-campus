"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { nanoid } from "nanoid";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugifier } from "@/lib/utils";
import { creerNotification } from "@/domaine/notifications";

const schemaProfilEntreprise = z.object({
  raisonSociale: z.string().min(2).max(160),
  secteur: z.string().min(2).max(120),
  taille: z.enum(["TRES_PETITE", "PETITE", "MOYENNE", "GRANDE"]),
  ninea: z.string().max(60).optional(),
  rccm: z.string().max(60).optional(),
  ville: z.string().max(80).optional(),
  siteWeb: z.string().url().or(z.literal("")).optional(),
  description: z.string().max(2000).optional(),
});

export async function mettreAJourProfilEntreprise(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion?suivant=/entreprise/profil");
  if (session.user.role !== "ENTREPRISE" && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const parsed = schemaProfilEntreprise.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const d = parsed.data;

  await prisma.entreprise.update({
    where: { utilisateurId: session.user.id },
    data: {
      raisonSociale: d.raisonSociale,
      secteur: d.secteur,
      taille: d.taille,
      ninea: d.ninea || null,
      rccm: d.rccm || null,
      ville: d.ville || null,
      siteWeb: d.siteWeb || null,
      description: d.description || null,
    },
  });
  await prisma.utilisateur.update({
    where: { id: session.user.id },
    data: { nomComplet: d.raisonSociale },
  });

  revalidatePath("/entreprise");
  revalidatePath("/entreprise/profil");
}

// ─────────────────────────────────────────────────────────────
// Publication d'un projet par une entreprise
// ─────────────────────────────────────────────────────────────

const TOUTES_CATEGORIES = [
  "INFORMATIQUE", "DATA", "IA", "WEB", "MOBILE", "UI_UX",
  "MARKETING", "COMMUNICATION", "GESTION", "FINANCE", "COMPTABILITE",
  "DROIT", "REDACTION", "TRADUCTION", "RECHERCHE", "AGRICULTURE",
  "SANTE", "EDUCATION", "ENVIRONNEMENT", "SOCIOLOGIE", "GEOGRAPHIE",
  "ENTREPRENEURIAT", "ADMINISTRATION", "ANNOTATION_DONNEES", "ENQUETE_TERRAIN",
] as const;

const schemaPublierProjet = z.object({
  titre: z.string().min(5).max(160),
  resume: z.string().min(20).max(280),
  description: z.string().min(50).max(8000),
  categorie: z.enum(TOUTES_CATEGORIES),
  niveau: z.enum(["DEBUTANT", "INTERMEDIAIRE", "AVANCE", "EXPERT_ETUDIANT", "PRO_JUNIOR"]),
  dureeJours: z.coerce.number().int().min(3).max(365),
  placesMax: z.coerce.number().int().min(1).max(20),
  modeRemuneration: z.enum(["APPRENTISSAGE", "PRIME", "REMUNERE", "SPONSORISE"]),
  montantFcfa: z.coerce.number().int().min(0).optional(),
  competences: z.string().optional(),
});

export async function publierProjet(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion?suivant=/entreprise/publier");
  if (session.user.role !== "ENTREPRISE" && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const entreprise = await prisma.entreprise.findUnique({
    where: { utilisateurId: session.user.id },
    select: { id: true, statutValidation: true, raisonSociale: true },
  });
  if (!entreprise) redirect("/entreprise");
  if (entreprise.statutValidation !== "VALIDEE" && session.user.role === "ENTREPRISE") {
    redirect("/entreprise");
  }

  const parsed = schemaPublierProjet.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const d = parsed.data;

  // Lie les compétences existantes en base par leur slug normalisé.
  const nomsComp = (d.competences ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 20);
  const competencesEnBase = nomsComp.length > 0
    ? await prisma.competence.findMany({
        where: { OR: nomsComp.map((nom) => ({ nom: { equals: nom, mode: "insensitive" } })) },
        select: { id: true },
      })
    : [];

  const slug = `${slugifier(d.titre)}-${nanoid(6).toLowerCase()}`;

  const projet = await prisma.projet.create({
    data: {
      slug,
      titre: d.titre,
      resume: d.resume,
      description: d.description,
      source: "ENTREPRISE",
      categorie: d.categorie,
      niveau: d.niveau,
      modeRemuneration: d.modeRemuneration,
      montantFcfa: d.montantFcfa && d.montantFcfa > 0 ? d.montantFcfa : null,
      dureeJours: d.dureeJours,
      placesMax: d.placesMax,
      statut: "EN_VALIDATION",
      visibilite: "PUBLIQUE",
      publieParId: session.user.id,
      entrepriseId: entreprise.id,
      competencesRequises: competencesEnBase.length > 0 ? {
        create: competencesEnBase.map((c) => ({ competenceId: c.id, niveauRequis: 1 })),
      } : undefined,
    },
  });

  await prisma.journalAudit.create({
    data: {
      acteurId: session.user.id,
      action: "PROJET.CREE",
      ressourceType: "Projet",
      ressourceId: projet.id,
      metadonnees: { titre: projet.titre, slug: projet.slug },
    },
  });

  revalidatePath("/entreprise");
  revalidatePath("/entreprise/projets");
  revalidatePath("/admin/projets");
  redirect(`/entreprise/projets`);
}

// ─────────────────────────────────────────────────────────────
// Décision sur une candidature reçue
// ─────────────────────────────────────────────────────────────

const schemaDecisionCandidature = z.object({
  candidatureId: z.string().cuid(),
  decision: z.enum(["ACCEPTEE", "REFUSEE"]),
  motif: z.string().max(500).optional(),
});

export async function deciderCandidature(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");
  if (session.user.role !== "ENTREPRISE" && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const parsed = schemaDecisionCandidature.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const d = parsed.data;

  const candidature = await prisma.candidature.findUnique({
    where: { id: d.candidatureId },
    include: {
      etudiant: { select: { id: true, prenom: true, nom: true, utilisateurId: true } },
      projet: {
        select: {
          id: true, titre: true, slug: true, entrepriseId: true, placesMax: true,
          equipe: { include: { membres: true } },
        },
      },
    },
  });
  if (!candidature) return;

  // Vérifie que l'utilisateur est bien l'entreprise du projet (ou admin).
  if (session.user.role === "ENTREPRISE") {
    const monEntreprise = await prisma.entreprise.findUnique({
      where: { utilisateurId: session.user.id },
      select: { id: true },
    });
    if (!monEntreprise || monEntreprise.id !== candidature.projet.entrepriseId) {
      return;
    }
  }

  // Refus : simple mise à jour.
  if (d.decision === "REFUSEE") {
    await prisma.candidature.update({
      where: { id: candidature.id },
      data: { statut: "REFUSEE", motifReponse: d.motif ?? null, reponduLe: new Date() },
    });
  } else {
    // Acceptation : tout-ou-rien dans une transaction sérialisable —
    // empêche deux acceptations concurrentes de dépasser placesMax.
    let placeRefusee = false;
    try {
      await prisma.$transaction(
        async (tx) => {
          const equipe = await tx.equipe.upsert({
            where: { projetId: candidature.projet.id },
            create: { projetId: candidature.projet.id },
            update: {},
            select: { id: true },
          });
          // Comptage frais à l'intérieur de la transaction.
          const dejaMembre = await tx.membreEquipe.findUnique({
            where: { equipeId_etudiantId: { equipeId: equipe.id, etudiantId: candidature.etudiant.id } },
            select: { equipeId: true },
          });
          if (!dejaMembre) {
            const nbMembres = await tx.membreEquipe.count({ where: { equipeId: equipe.id } });
            if (nbMembres >= candidature.projet.placesMax) {
              placeRefusee = true;
              return; // équipe complète : on n'accepte pas
            }
            await tx.membreEquipe.create({
              data: { equipeId: equipe.id, etudiantId: candidature.etudiant.id, roleEquipe: "Contributeur" },
            });
          }
          await tx.candidature.update({
            where: { id: candidature.id },
            data: { statut: "ACCEPTEE", motifReponse: d.motif ?? null, reponduLe: new Date() },
          });
          await tx.projet.update({
            where: { id: candidature.projet.id },
            data: { statut: "EN_COURS" },
          });
        },
        { isolationLevel: "Serializable" },
      );
    } catch {
      return; // conflit de concurrence ou erreur : on n'altère rien
    }
    if (placeRefusee) return; // équipe pleine : aucune notification d'acceptation
  }

  await creerNotification({
    destinataireId: candidature.etudiant.utilisateurId,
    type: d.decision === "ACCEPTEE" ? "CANDIDATURE_ACCEPTEE" : "CANDIDATURE_REFUSEE",
    titre: d.decision === "ACCEPTEE"
      ? "🎉 Candidature acceptée"
      : "Candidature refusée",
    contenu: d.decision === "ACCEPTEE"
      ? `Tu as rejoint l'équipe de « ${candidature.projet.titre} ». Ouvre l'espace projet pour démarrer.`
      : `Sur « ${candidature.projet.titre} ». ${d.motif ? `Motif : ${d.motif}` : "Aucun motif précisé."}`,
    lien: d.decision === "ACCEPTEE"
      ? `/app/projet/${candidature.projet.id}`
      : `/app/candidatures`,
  });

  await prisma.journalAudit.create({
    data: {
      acteurId: session.user.id,
      action: d.decision === "ACCEPTEE" ? "CANDIDATURE.ACCEPTEE" : "CANDIDATURE.REFUSEE",
      ressourceType: "Candidature",
      ressourceId: candidature.id,
      metadonnees: { motif: d.motif ?? null },
    },
  });

  revalidatePath("/entreprise/candidatures");
  revalidatePath(`/projets/${candidature.projet.slug}`);
  revalidatePath("/app/candidatures");
  revalidatePath("/app/mes-projets");
}
