// Client Supabase Storage — côté serveur uniquement.
//
// AUCUN import (même `import type`) du paquet @supabase/storage-js au
// niveau module : il n'est référencé que dans l'import dynamique de
// stockageSupabase(). Le paquet est donc totalement absent du graphe de
// modules évalué pendant la phase « collect page data » du build.
//
// Deux buckets — modèle « mixte » :
//   • public  → photos de profil (déjà publiques sur le portfolio)
//   • privé   → livrables, certificats (accès via URL signée temporaire)

import { env } from "./env";

export const SUPABASE_ACTIF = Boolean(env.SUPABASE_URL && env.SUPABASE_CLE_SERVICE);

export const BUCKET_PUBLIC = env.SUPABASE_BUCKET_PUBLIC ?? "medias-public";
export const BUCKET_PRIVE = env.SUPABASE_BUCKET_PRIVE ?? "medias-prive";

// Interface minimale du client Storage — limitée aux opérations utilisées.
// Évite toute dépendance de type vers @supabase/storage-js.
export interface ClientStockage {
  from(bucket: string): {
    upload(
      chemin: string,
      corps: Buffer,
      options: { contentType: string; upsert: boolean },
    ): Promise<{ error: { message: string } | null }>;
    createSignedUrl(
      chemin: string,
      expireEnSecondes: number,
    ): Promise<{ data: { signedUrl: string } | null; error: { message: string } | null }>;
    getPublicUrl(chemin: string): { data: { publicUrl: string } };
  };
}

let client: ClientStockage | null = null;

// Client paresseux — le paquet n'est importé qu'au premier appel réel.
// La clé service donne les droits complets : jamais exposée au client.
export async function stockageSupabase(): Promise<ClientStockage> {
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
    }) as unknown as ClientStockage;
  }
  return client;
}
