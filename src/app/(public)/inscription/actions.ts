"use server";

import { redirect } from "next/navigation";
import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";
import {
  schemaInscriptionEtudiant,
  schemaInscriptionEntreprise,
  schemaInscriptionMentor,
} from "@/lib/zod/inscription";
import { slugifier } from "@/lib/utils";
import { nanoid } from "nanoid";

// Helper : extrait les champs d'un FormData en objet brut.
function extraire(formData: FormData): Record<string, string> {
  const objet: Record<string, string> = {};
  for (const [cle, valeur] of formData.entries()) {
    if (typeof valeur === "string") objet[cle] = valeur;
  }
  return objet;
}

interface ResultatAction {
  succes: boolean;
  erreurs?: Record<string, string>;
  message?: string;
}

// ─────────────────────────────────────────────────────────────
// Étudiant
// ─────────────────────────────────────────────────────────────

export async function inscrireEtudiant(_etat: ResultatAction | null, formData: FormData): Promise<ResultatAction> {
  const parsed = schemaInscriptionEtudiant.safeParse(extraire(formData));
  if (!parsed.success) {
    const erreurs: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const cle = String(issue.path[0] ?? "racine");
      erreurs[cle] = issue.message;
    }
    return { succes: false, erreurs };
  }
  const d = parsed.data;

  const existant = await prisma.utilisateur.findUnique({ where: { email: d.email } });
  if (existant) {
    return { succes: false, erreurs: { email: "Un compte existe déjà avec cet email." } };
  }

  const universite = await prisma.universite.findUnique({ where: { acronyme: d.universite } });
  if (!universite) {
    return { succes: false, erreurs: { universite: "Université inconnue." } };
  }

  const motDePasseHash = await bcryptjs.hash(d.motDePasse, 12);
  const slugBase = slugifier(`${d.prenom} ${d.nom}`);
  const slug = `${slugBase}-${nanoid(6).toLowerCase()}`;

  await prisma.utilisateur.create({
    data: {
      email: d.email,
      motDePasseHash,
      nomComplet: `${d.prenom} ${d.nom}`,
      role: "ETUDIANT",
      etudiant: {
        create: {
          prenom: d.prenom,
          nom: d.nom,
          slug,
          universiteId: universite.id,
          niveau: d.niveau,
          filiere: d.filiere ?? null,
        },
      },
    },
  });

  await signIn("credentials", {
    email: d.email,
    motDePasse: d.motDePasse,
    redirect: false,
  });
  redirect("/app");
}

// ─────────────────────────────────────────────────────────────
// Entreprise
// ─────────────────────────────────────────────────────────────

export async function inscrireEntreprise(_etat: ResultatAction | null, formData: FormData): Promise<ResultatAction> {
  const parsed = schemaInscriptionEntreprise.safeParse(extraire(formData));
  if (!parsed.success) {
    const erreurs: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const cle = String(issue.path[0] ?? "racine");
      erreurs[cle] = issue.message;
    }
    return { succes: false, erreurs };
  }
  const d = parsed.data;

  const existant = await prisma.utilisateur.findUnique({ where: { email: d.email } });
  if (existant) {
    return { succes: false, erreurs: { email: "Un compte existe déjà avec cet email." } };
  }

  const motDePasseHash = await bcryptjs.hash(d.motDePasse, 12);
  const slug = `${slugifier(d.raisonSociale)}-${nanoid(6).toLowerCase()}`;

  await prisma.utilisateur.create({
    data: {
      email: d.email,
      motDePasseHash,
      nomComplet: d.raisonSociale,
      role: "ENTREPRISE",
      entreprise: {
        create: {
          raisonSociale: d.raisonSociale,
          slug,
          secteur: d.secteur,
          taille: d.taille,
          ninea: d.ninea || null,
          rccm: d.rccm || null,
          siteWeb: d.siteWeb || null,
          description: d.description || null,
        },
      },
    },
  });

  await signIn("credentials", { email: d.email, motDePasse: d.motDePasse, redirect: false });
  redirect("/entreprise");
}

// ─────────────────────────────────────────────────────────────
// Mentor
// ─────────────────────────────────────────────────────────────

export async function inscrireMentor(_etat: ResultatAction | null, formData: FormData): Promise<ResultatAction> {
  const parsed = schemaInscriptionMentor.safeParse(extraire(formData));
  if (!parsed.success) {
    const erreurs: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const cle = String(issue.path[0] ?? "racine");
      erreurs[cle] = issue.message;
    }
    return { succes: false, erreurs };
  }
  const d = parsed.data;

  const existant = await prisma.utilisateur.findUnique({ where: { email: d.email } });
  if (existant) {
    return { succes: false, erreurs: { email: "Un compte existe déjà avec cet email." } };
  }

  const motDePasseHash = await bcryptjs.hash(d.motDePasse, 12);
  let universiteId: string | null = null;
  if (d.universite) {
    const u = await prisma.universite.findUnique({ where: { acronyme: d.universite } });
    universiteId = u?.id ?? null;
  }

  await prisma.utilisateur.create({
    data: {
      email: d.email,
      motDePasseHash,
      nomComplet: `${d.prenom} ${d.nom}`,
      role: "MENTOR",
      mentor: {
        create: {
          prenom: d.prenom,
          nom: d.nom,
          type: d.type,
          universiteId,
          titreOuPoste: d.titreOuPoste || null,
          specialites: d.specialites.split(",").map((s) => s.trim()).filter(Boolean),
          biographie: d.biographie || null,
        },
      },
    },
  });

  await signIn("credentials", { email: d.email, motDePasse: d.motDePasse, redirect: false });
  redirect("/mentor");
}

// ─────────────────────────────────────────────────────────────
// Connexion
// ─────────────────────────────────────────────────────────────

export async function seConnecter(_etat: ResultatAction | null, formData: FormData): Promise<ResultatAction> {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const motDePasse = String(formData.get("motDePasse") ?? "");
  if (!email || !motDePasse) {
    return { succes: false, message: "Email et mot de passe requis." };
  }
  try {
    await signIn("credentials", { email, motDePasse, redirect: false });
  } catch {
    return { succes: false, message: "Email ou mot de passe incorrect." };
  }
  const u = await prisma.utilisateur.findUnique({ where: { email } });
  switch (u?.role) {
    case "ENTREPRISE": redirect("/entreprise");
    case "MENTOR":     redirect("/mentor");
    case "ADMIN":
    case "SUPER_ADMIN": redirect("/admin");
    default:           redirect("/app");
  }
}

export async function seDeconnecter() {
  const { signOut } = await import("@/auth");
  await signOut({ redirect: false });
  redirect("/");
}
