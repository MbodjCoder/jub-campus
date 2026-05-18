// Client Supabase — accès Storage côté serveur uniquement.
// Utilise la clé service (droits complets) : ne jamais l'exposer au client.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

export const SUPABASE_ACTIF = Boolean(env.SUPABASE_URL && env.SUPABASE_CLE_SERVICE);

export const BUCKET_MEDIAS = env.SUPABASE_BUCKET ?? "medias";

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
