// Règles pures du portefeuille — aucune dépendance base/serveur,
// importables dans les tests et les composants client (affichage).

/** Montant minimal d'un retrait (frais fixes Wave amortis en dessous). */
export const RETRAIT_MINIMUM_FCFA = 1000;

export type ErreurRetrait =
  | "MONTANT_INVALIDE"
  | "SOUS_LE_MINIMUM"
  | "SOLDE_INSUFFISANT"
  | "TELEPHONE_INVALIDE";

/** Valide une demande de retrait. Renvoie null si acceptable. */
export function verifierDemandeRetrait(
  soldeFcfa: number,
  montantFcfa: number,
  numeroTelephone: string,
): ErreurRetrait | null {
  if (!Number.isInteger(montantFcfa) || montantFcfa <= 0) return "MONTANT_INVALIDE";
  if (montantFcfa < RETRAIT_MINIMUM_FCFA) return "SOUS_LE_MINIMUM";
  if (montantFcfa > soldeFcfa) return "SOLDE_INSUFFISANT";
  if (!estNumeroSenegalais(numeroTelephone)) return "TELEPHONE_INVALIDE";
  return null;
}

/** Numéro mobile sénégalais : 7X XXX XX XX, préfixe international optionnel. */
export function estNumeroSenegalais(numero: string): boolean {
  const propre = numero.replace(/[\s.-]/g, "");
  return /^(?:\+221|00221)?7[05678]\d{7}$/.test(propre);
}

/** Normalise vers le format attendu par les API de paiement (+2217XXXXXXXX). */
export function normaliserNumeroSenegalais(numero: string): string {
  const propre = numero.replace(/[\s.-]/g, "").replace(/^00221/, "+221");
  return propre.startsWith("+221") ? propre : `+221${propre}`;
}

/** Somme d'une liste de transactions — sert à vérifier l'invariant de solde. */
export function sommeTransactions(transactions: { montantFcfa: number }[]): number {
  return transactions.reduce((s, t) => s + t.montantFcfa, 0);
}

/**
 * Répartit l'enveloppe talents d'une mission entre tâches, au prorata de
 * poids entiers, sans perdre un franc : les restes de division vont aux
 * premières tâches (méthode des plus forts restes simplifiée).
 */
export function repartirEnveloppe(enveloppeFcfa: number, poids: number[]): number[] {
  if (enveloppeFcfa <= 0 || poids.length === 0) return poids.map(() => 0);
  const total = poids.reduce((s, p) => s + Math.max(0, p), 0);
  if (total <= 0) return poids.map(() => 0);

  const bruts = poids.map((p) => (Math.max(0, p) / total) * enveloppeFcfa);
  const bases = bruts.map(Math.floor);
  let reste = enveloppeFcfa - bases.reduce((s, b) => s + b, 0);

  // Distribue le reste aux plus forts restes décimaux.
  const ordres = bruts
    .map((b, i) => ({ i, frac: b - Math.floor(b) }))
    .sort((a, b) => b.frac - a.frac);
  for (const { i } of ordres) {
    if (reste <= 0) break;
    bases[i] += 1;
    reste -= 1;
  }
  return bases;
}
