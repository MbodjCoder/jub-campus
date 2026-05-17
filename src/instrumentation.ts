// Point d'entrée d'instrumentation Next.js — exécuté une fois au démarrage.
// Valide l'environnement tôt (échec rapide et lisible).

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("@/lib/env");
  }
}
