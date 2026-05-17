// Validation des variables d'environnement au démarrage.
// Échec rapide et explicite si une variable critique manque ou est invalide,
// plutôt qu'une erreur obscure au premier accès base / auth.

import { z } from "zod";

const schema = z.object({
  // Critiques — l'app ne peut pas fonctionner sans.
  DATABASE_URL: z.string().min(1, "DATABASE_URL manquant.").url("DATABASE_URL invalide."),
  AUTH_SECRET: z.string().min(16, "AUTH_SECRET trop court (16+ caractères)."),

  // Optionnelles — dégradation gracieuse si absentes.
  URL_PUBLIQUE: z.string().url().optional(),
  RESEND_CLE_API: z.string().optional(),
  EMAIL_EXPEDITEUR: z.string().optional(),
  EMAIL_CONTACT: z.string().optional(),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
});

export type Env = z.infer<typeof schema>;

function valider(): Env {
  const r = schema.safeParse(process.env);
  if (!r.success) {
    const details = r.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Variables d'environnement invalides :\n${details}`);
  }
  return r.data;
}

export const env = valider();
