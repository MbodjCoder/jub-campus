import { z } from "zod";

const motDePasseFort = z.string()
  .min(8, "Au moins 8 caractères.")
  .max(120, "Maximum 120 caractères.");

const emailNorme = z.string().email("Email invalide.").toLowerCase().trim();

export const schemaInscriptionEtudiant = z.object({
  prenom: z.string().min(2, "Trop court."),
  nom: z.string().min(2, "Trop court."),
  email: emailNorme,
  motDePasse: motDePasseFort,
  universite: z.string().min(2),
  niveau: z.enum(["L1", "L2", "L3", "M1", "M2", "DOCTORAT"]),
  filiere: z.string().optional(),
  cgu: z.literal("on", { message: "Tu dois accepter les CGU." }),
});

export const schemaInscriptionEntreprise = z.object({
  raisonSociale: z.string().min(2),
  secteur: z.string().min(2),
  taille: z.enum(["TRES_PETITE", "PETITE", "MOYENNE", "GRANDE"]),
  ninea: z.string().optional(),
  rccm: z.string().optional(),
  siteWeb: z.string().url().or(z.literal("")).optional(),
  email: emailNorme,
  motDePasse: motDePasseFort,
  description: z.string().optional(),
});

export const schemaInscriptionMentor = z.object({
  prenom: z.string().min(2),
  nom: z.string().min(2),
  email: emailNorme,
  motDePasse: motDePasseFort,
  type: z.enum(["PROFESSEUR", "PROFESSIONNEL", "ALUMNI", "EXPERT_INVITE"]),
  universite: z.string().optional(),
  titreOuPoste: z.string().optional(),
  specialites: z.string().min(2),
  biographie: z.string().optional(),
});

export const schemaConnexion = z.object({
  email: emailNorme,
  motDePasse: z.string().min(1, "Mot de passe requis."),
});

export type DonneesInscriptionEtudiant = z.infer<typeof schemaInscriptionEtudiant>;
export type DonneesInscriptionEntreprise = z.infer<typeof schemaInscriptionEntreprise>;
export type DonneesInscriptionMentor = z.infer<typeof schemaInscriptionMentor>;
