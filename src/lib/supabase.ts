// Client Supabase Storage — côté serveur uniquement.
//
// On importe @supabase/storage-js (Storage seul) et non @supabase/supabase-js :
// ce dernier embarque le module Realtime qui référence `WebSocket` au niveau
// module — absent sur d'anciennes versions de Node et cause d'un échec de
// build. Storage-js n'a pas cette dépendance.
//
// Deux buckets — modèle « mixte » :
//   • public  → photos de profil (déjà publiques sur le portfolio)
//   • privé   → livrables, certificats (accès via URL signée temporaire)

import { StorageClient } from "@supabase/storage-js";
import { env } from "./env";

export const SUPABASE_ACTIF = Boolean(env.SUPABASE_URL && env.SUPABASE_CLE_SERVICE);

export const BUCKET_PUBLIC = env.SUPABASE_BUCKET_PUBLIC ?? "medias-public";
export const BUCKET_PRIVE = env.SUPABASE_BUCKET_PRIVE ?? "medias-prive";

let client: StorageClient | null = null;

// Client paresseux — créé au premier appel, réutilisé ensuite.
// La clé service donne les droits complets : jamais exposée au client.
export function stockageSupabase(): StorageClient {
  if (!SUPABASE_ACTIF) {
    throw new Error("Supabase non configuré (SUPABASE_URL / SUPABASE_CLE_SERVICE).");
  }
  if (!client) {
    const cle = env.SUPABASE_CLE_SERVICE!;
    const base = env.SUPABASE_URL!.replace(/\/+$/, "");
    client = new StorageClient(`${base}/storage/v1`, {
      apikey: cle,
      Authorization: `Bearer ${cle}`,
    });
  }
  return client;
}
