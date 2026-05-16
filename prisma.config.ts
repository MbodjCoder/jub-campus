// Configuration Prisma 7 (remplace url= dans schema.prisma).
// Charge .env.local en priorité (utilisé par Next.js) puis .env en repli.
import { config as chargerDotenv } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "prisma/config";

const racine = process.cwd();
for (const fichier of [".env.local", ".env"]) {
  const chemin = resolve(racine, fichier);
  if (existsSync(chemin)) chargerDotenv({ path: chemin, override: false });
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env["DATABASE_URL"] },
});
