// Client Supabase — accès Storage côté serveur uniquement.
// Utilise la clé service (droits complets) : ne jamais l'exposer au client.
//
// Deux buckets — modèle « mixte » :
//   • public  → photos de profil (déjà publiques sur le portfolio)
//   • privé   → livrables, certificats (accès via URL signée temporaire)

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

export const SUPABASE_ACTIF = Boolean(env.SUPABASE_URL && env.SUPABASE_CLE_SERVICE);

export const BUCKET_PUBLIC = env.SUPABASE_BUCKET_PUBLIC ?? "medias-public";
export const BUCKET_PRIVE = env.SUPABASE_BUCKET_PRIVE ?? "medias-prive";

let client: SupabaseClient | null = null;

// Client paresseux — créé au premier appel, réutilisé ensuite.
export function supabase(): SupabaseClient {
  if (!SUPABASE_ACTIF) {
    throw new Error("Supabase non configuré (SUPABASE_URL / SUPABASE_CLE_SERVICE).");
  }
  if (!client) {
    client = createClient(env.SUPABASE_URL!, env.SUPABASE_CLE_SERVICE!, {
      auth: { persistSession: false },
    });
  }
  return client;
}
