// Client Supabase Storage — côté serveur uniquement.
//
// @supabase/storage-js est chargé PARESSEUSEMENT (import dynamique dans
// stockageSupabase()). Il ne fait donc pas partie du graphe de modules
// évalué au build : la phase « collect page data » de Next ne l'exécute
// jamais, ce qui évite tout échec de build lié au paquet.
//
// Deux buckets — modèle « mixte » :
//   • public  → photos de profil (déjà publiques sur le portfolio)
//   • privé   → livrables, certificats (accès via URL signée temporaire)

import type { StorageClient } from "@supabase/storage-js";
import { env } from "./env";

export const SUPABASE_ACTIF = Boolean(env.SUPABASE_URL && env.SUPABASE_CLE_SERVICE);

export const BUCKET_PUBLIC = env.SUPABASE_BUCKET_PUBLIC ?? "medias-public";
export const BUCKET_PRIVE = env.SUPABASE_BUCKET_PRIVE ?? "medias-prive";

let client: StorageClient | null = null;

// Client paresseux — le paquet n'est importé qu'au premier appel réel.
// La clé service donne les droits complets : jamais exposée au client.
export async function stockageSupabase(): Promise<StorageClient> {
  if (!SUPABASE_ACTIF) {
    throw new Error("Supabase non configuré (SUPABASE_URL / SUPABASE_CLE_SERVICE).");
  }
  if (!client) {
    const { StorageClient } = await import("@supabase/storage-js");
    const cle = env.SUPABASE_CLE_SERVICE!;
    const base = env.SUPABASE_URL!.replace(/\/+$/, "");
    client = new StorageClient(`${base}/storage/v1`, {
      apikey: cle,
      Authorization: `Bearer ${cle}`,
    });
  }
  return client;
}
