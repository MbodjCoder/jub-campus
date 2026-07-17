// Client HTTP minimal pour l'API Wave Payout (https://docs.wave.com/payout).
//
// Trois modes, choisis par l'environnement :
// - WAVE_CLE_API défini      → appels réels à api.wave.com.
// - WAVE_SIMULATION="true"   → succès simulé (tests de bout en bout sans
//   compte Wave). Interdit en production (vérifié dans env.ts).
// - Rien                     → mode "non configuré" : tout envoi échoue
//   proprement avec un message explicite.
//
// Chaque envoi porte une clé d'idempotence (header `idempotency-key`) :
// rejouer la même requête ne déclenche jamais un second paiement.

import "server-only";
import { env } from "@/lib/env";

const BASE_URL = "https://api.wave.com";

export type ModeWave = "reel" | "simulation" | "non_configure";

export function modeWave(): ModeWave {
  if (env.WAVE_CLE_API) return "reel";
  if (env.WAVE_SIMULATION === "true") return "simulation";
  return "non_configure";
}

export interface DemandePayout {
  /** Montant reçu par le destinataire, en FCFA entiers. */
  montantFcfa: number;
  /** Numéro au format international (+2217XXXXXXXX). */
  telephone: string;
  /** Clé d'idempotence — stable pour un même retrait, quelle que soit la tentative. */
  cleIdempotence: string;
  /** Référence interne (id du retrait) visible dans le dashboard Wave. */
  referenceInterne: string;
  /** Nom du bénéficiaire (affichage Wave). */
  nomBeneficiaire?: string;
}

export type ResultatPayout =
  | { ok: true; idWave: string; statut: "processing" | "succeeded" }
  | { ok: false; erreur: string };

/** Envoie un payout unitaire. */
export async function envoyerPayout(d: DemandePayout): Promise<ResultatPayout> {
  const mode = modeWave();

  if (mode === "non_configure") {
    return { ok: false, erreur: "Wave non configuré (WAVE_CLE_API absent)." };
  }

  if (mode === "simulation") {
    return { ok: true, idWave: `sim_${d.cleIdempotence.slice(0, 12)}`, statut: "succeeded" };
  }

  try {
    const reponse = await fetch(`${BASE_URL}/v1/payout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.WAVE_CLE_API}`,
        "Content-Type": "application/json",
        "idempotency-key": d.cleIdempotence,
      },
      body: JSON.stringify({
        currency: "XOF",
        receive_amount: String(d.montantFcfa),
        mobile: d.telephone,
        name: d.nomBeneficiaire,
        client_reference: d.referenceInterne,
      }),
    });

    const corps = (await reponse.json().catch(() => ({}))) as {
      id?: string;
      status?: string;
      code?: string;
      message?: string;
    };

    if (!reponse.ok) {
      return {
        ok: false,
        erreur: `Wave ${reponse.status} : ${corps.code ?? ""} ${corps.message ?? "erreur inconnue"}`.trim(),
      };
    }
    if (!corps.id) {
      return { ok: false, erreur: "Réponse Wave sans identifiant de payout." };
    }
    return {
      ok: true,
      idWave: corps.id,
      statut: corps.status === "succeeded" ? "succeeded" : "processing",
    };
  } catch (e) {
    return { ok: false, erreur: `Réseau Wave injoignable : ${(e as Error).message}` };
  }
}

export type StatutPayoutWave = "processing" | "succeeded" | "failed" | "reversed" | "inconnu";

/** Interroge le statut d'un payout existant (réconciliation). */
export async function consulterPayout(idWave: string): Promise<StatutPayoutWave> {
  const mode = modeWave();
  if (mode === "non_configure") return "inconnu";
  if (mode === "simulation") return "succeeded";

  try {
    const reponse = await fetch(`${BASE_URL}/v1/payout/${encodeURIComponent(idWave)}`, {
      headers: { Authorization: `Bearer ${env.WAVE_CLE_API}` },
    });
    if (!reponse.ok) return "inconnu";
    const corps = (await reponse.json()) as { status?: string };
    if (corps.status === "succeeded") return "succeeded";
    if (corps.status === "failed") return "failed";
    if (corps.status === "reversed") return "reversed";
    if (corps.status === "processing") return "processing";
    return "inconnu";
  } catch {
    return "inconnu";
  }
}
