// Validation des variables d'environnement au démarrage.
// Échec rapide et explicite si une variable critique manque ou est invalide,
// plutôt qu'une erreur obscure au premier accès base / auth.

import { z } from "zod";

const schema = z.object({
  // Critiques — l'app ne peut pas fonctionner sans.
  DATABASE_URL: z.string().min(1, "DATABASE_URL manquant.").url("DATABASE_URL invalide."),
  AUTH_SECRET: z.string().min(16, "AUTH_SECRET trop court (16+ caractères)."),

  // Optionnelles — dégradation gracieuse si absentes ou mal formées.
  // Volontairement non strictes (pas de .url()) : une intégration
  // optionnelle mal configurée ne doit JAMAIS faire échouer le build
  // ni le démarrage de toute la plateforme.
  URL_PUBLIQUE: z.string().optional(),
  AUTH_URL: z.string().optional(),
  RESEND_CLE_API: z.string().optional(),
  EMAIL_EXPEDITEUR: z.string().optional(),
  EMAIL_CONTACT: z.string().optional(),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),

  // Stockage fichiers — Supabase Storage si présent, sinon disque local.
  SUPABASE_URL: z.string().optional(),
  SUPABASE_CLE_SERVICE: z.string().optional(),
  SUPABASE_BUCKET_PUBLIC: z.string().optional(),
  SUPABASE_BUCKET_PRIVE: z.string().optional(),
  AUTORISER_CERTIFICAT_DEMO: z.enum(["true", "false"]).optional(),
  JUB_ENV: z.enum(["development", "preview", "production"]).optional(),
});

export type Env = z.infer<typeof schema>;

function valider(): Env {
  const r = schema.safeParse(process.env);
  if (!r.success) {
    const details = r.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Variables d'environnement invalides :\n${details}`);
  }
  const donnees = r.data;
  const erreurs: string[] = [];
  const productionReelle =
    process.env.VERCEL_ENV === "production" || donnees.JUB_ENV === "production";

  const googlePartiel = Boolean(donnees.AUTH_GOOGLE_ID) !== Boolean(donnees.AUTH_GOOGLE_SECRET);
  if (googlePartiel) {
    erreurs.push("AUTH_GOOGLE_ID et AUTH_GOOGLE_SECRET doivent être définis ensemble.");
  }

  const supabase = [
    donnees.SUPABASE_URL,
    donnees.SUPABASE_CLE_SERVICE,
    donnees.SUPABASE_BUCKET_PUBLIC,
    donnees.SUPABASE_BUCKET_PRIVE,
  ];
  const nbSupabase = supabase.filter(Boolean).length;
  if (nbSupabase > 0 && nbSupabase < supabase.length) {
    erreurs.push("La configuration Supabase doit être complète ou entièrement absente.");
  }

  if (productionReelle) {
    if (!donnees.URL_PUBLIQUE) erreurs.push("URL_PUBLIQUE est obligatoire en production.");
    if (!donnees.RESEND_CLE_API) erreurs.push("RESEND_CLE_API est obligatoire en production.");
    if (!donnees.EMAIL_EXPEDITEUR) erreurs.push("EMAIL_EXPEDITEUR est obligatoire en production.");
    if (nbSupabase !== supabase.length) {
      erreurs.push("Supabase Storage est obligatoire en production pour éviter le stockage éphémère local.");
    }
    if (donnees.URL_PUBLIQUE?.startsWith("http://localhost")) {
      erreurs.push("URL_PUBLIQUE ne peut pas pointer vers localhost en production.");
    }
    if (donnees.AUTORISER_CERTIFICAT_DEMO === "true") {
      erreurs.push("AUTORISER_CERTIFICAT_DEMO doit rester désactivé en production.");
    }
  }

  if (erreurs.length > 0) {
    throw new Error(`Variables d'environnement incohérentes :\n${erreurs.map((e) => `  - ${e}`).join("\n")}`);
  }

  return donnees;
}

export const env = valider();
