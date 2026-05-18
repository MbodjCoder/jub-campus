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
import { creerJeton, identifiantJeton } from "@/domaine/jetons";
import { envoyerEmail, emailVerification } from "@/lib/email";
import { limiterDebit } from "@/lib/rate-limit";
import { env } from "@/lib/env";

// Crée un jeton puis n'en conserve la trace que si l'email est réellement
// parti. Un jeton impossible à recevoir serait une dette invisible pour
// l'utilisateur et un faux sentiment de sécurité pour la plateforme.
async function envoyerVerification(email: string, prenom: string): Promise<boolean> {
  try {
    const jeton = await creerJeton("email", email);
    const base = env.URL_PUBLIQUE ?? "http://localhost:3000";
    const url = `${base}/verifier-email?email=${encodeURIComponent(email)}&jeton=${jeton}`;
    const envoi = await envoyerEmail(emailVerification({ destinataire: email, prenom, url }));
    if (!envoi.succes || envoi.modeLog) {
      await prisma.jetonVerification.deleteMany({
        where: { identifiant: identifiantJeton("email", email) },
      });
      return false;
    }
    return true;
  } catch {
    await prisma.jetonVerification.deleteMany({
      where: { identifiant: identifiantJeton("email", email) },
    }).catch(() => undefined);
    return false;
  }
}

// Finalise l'inscription. Si Resend est configuré : envoie l'email de
// vérification (le compte reste à vérifier). Sinon : aucune infrastructure
// email n'existe — on active directement le compte plutôt que de le laisser
// bloqué et inutilisable. Dès que Resend est branché, la vraie vérification
// reprend automatiquement. Retourne le paramètre de redirection.
async function finaliserInscription(email: string, prenom: string): Promise<string> {
  if (!env.RESEND_CLE_API) {
    await prisma.utilisateur.update({
      where: { email },
      data: { emailVerifieLe: new Date() },
    });
    return "compte-actif";
  }
  const envoye = await envoyerVerification(email, prenom);
  return envoye ? "verification-envoyee" : "email-indisponible";
}

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

  redirect(`/connexion?inscription=${await finaliserInscription(d.email, d.prenom)}`);
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

  redirect(`/connexion?inscription=${await finaliserInscription(d.email, d.raisonSociale)}`);
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

  redirect(`/connexion?inscription=${await finaliserInscription(d.email, d.prenom)}`);
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

  const utilisateur = await prisma.utilisateur.findUnique({
    where: { email },
    select: { emailVerifieLe: true, role: true },
  });
  if (utilisateur && !utilisateur.emailVerifieLe) {
    return {
      succes: false,
      message: "Confirme d'abord ton adresse email avant de te connecter.",
    };
  }

  try {
    await signIn("credentials", { email, motDePasse, redirect: false });
  } catch {
    return { succes: false, message: "Email ou mot de passe incorrect." };
  }
  switch (utilisateur?.role) {
    case "ENTREPRISE": redirect("/entreprise");
    case "MENTOR":     redirect("/mentor");
    case "ADMIN":
    case "SUPER_ADMIN": redirect("/admin");
    default:           redirect("/app");
  }
}

export async function renvoyerVerification(
  _etat: ResultatAction | null,
  formData: FormData,
): Promise<ResultatAction> {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  if (!email) return { succes: false, message: "Email requis." };
  if (!limiterDebit(`verification-email:${email}`, 3, 3_600_000).autorise) {
    return { succes: false, message: "Trop de demandes. Réessaie plus tard." };
  }

  const utilisateur = await prisma.utilisateur.findUnique({
    where: { email },
    select: { nomComplet: true, emailVerifieLe: true },
  });
  if (utilisateur && !utilisateur.emailVerifieLe) {
    const prenom = utilisateur.nomComplet?.split(" ")[0] ?? "";
    await envoyerVerification(email, prenom);
  }

  // Réponse uniforme pour ne pas exposer l'existence des comptes.
  return {
    succes: true,
    message: "Si un compte non vérifié existe, un nouvel email vient d'être demandé.",
  };
}

export async function seDeconnecter() {
  const { signOut } = await import("@/auth");
  await signOut({ redirect: false });
  redirect("/");
}
