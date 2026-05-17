import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

// Tests unitaires — logique métier pure (pas de base, pas de DOM).
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
});
