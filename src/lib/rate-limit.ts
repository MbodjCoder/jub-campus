// Limiteur de débit en mémoire (fenêtre fixe).
// Suffisant pour une instance unique ; pour un déploiement multi-instances,
// remplacer le Map par Upstash Redis (même interface).

import "server-only";

interface Fenetre {
  compte: number;
  expire: number;
}

const fenetres = new Map<string, Fenetre>();

// Purge périodique des entrées expirées (évite la fuite mémoire).
let dernierNettoyage = 0;
function nettoyer(maintenant: number) {
  if (maintenant - dernierNettoyage < 60_000) return;
  dernierNettoyage = maintenant;
  for (const [cle, f] of fenetres) {
    if (f.expire < maintenant) fenetres.delete(cle);
  }
}

export interface ResultatLimite {
  autorise: boolean;
  /** Secondes avant réinitialisation (si bloqué). */
  reessayerDans: number;
}

// Autorise au plus `max` actions par `fenetreMs` pour une clé donnée.
export function limiterDebit(cle: string, max: number, fenetreMs: number): ResultatLimite {
  const maintenant = Date.now();
  nettoyer(maintenant);

  const f = fenetres.get(cle);
  if (!f || f.expire < maintenant) {
    fenetres.set(cle, { compte: 1, expire: maintenant + fenetreMs });
    return { autorise: true, reessayerDans: 0 };
  }
  if (f.compte >= max) {
    return { autorise: false, reessayerDans: Math.ceil((f.expire - maintenant) / 1000) };
  }
  f.compte++;
  return { autorise: true, reessayerDans: 0 };
}
