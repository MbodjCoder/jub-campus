import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

// Tests d'intégration contre la VRAIE base Postgres locale (port 5433).
// Lancement : pnpm test:bdd — exclus du `pnpm test` unitaire (CI sans base
// configurée pour ces scénarios). Wave est forcé en mode simulation.
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests-bdd/**/*.test.ts"],
    setupFiles: ["tests-bdd/setup.ts"],
    // Séquentiel : les scénarios partagent la même base.
    fileParallelism: false,
    env: {
      WAVE_SIMULATION: "true",
      WAVE_CLE_API: "",
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      // Neutralise le garde "server-only" (valide dans Next, bloquant sous vitest).
      "server-only": resolve(__dirname, "tests-bdd/stub-server-only.ts"),
    },
  },
});
