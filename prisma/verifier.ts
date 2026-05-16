// Script de vérification rapide de la base de données.
// Usage : pnpm tsx prisma/verifier.ts

import { PrismaPg } from "@prisma/adapter-pg";
import { config as charger } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";

async function principal() {
  for (const f of [".env.local", ".env"]) {
    const c = resolve(process.cwd(), f);
    if (existsSync(c)) charger({ path: c, override: false });
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });

  const [universites, departements, competences, badges, utilisateurs, etudiants, entreprises, mentors] = await Promise.all([
    prisma.universite.count(),
    prisma.departement.count(),
    prisma.competence.count(),
    prisma.badge.count(),
    prisma.utilisateur.count(),
    prisma.etudiant.count(),
    prisma.entreprise.count(),
    prisma.mentor.count(),
  ]);

  console.log("État de la base de données JUB Campus");
  console.table({ universites, departements, competences, badges, utilisateurs, etudiants, entreprises, mentors });

  if (utilisateurs > 0) {
    const derniers = await prisma.utilisateur.findMany({
      orderBy: { creeLe: "desc" },
      take: 5,
      select: { email: true, role: true, creeLe: true },
    });
    console.log("\nDerniers inscrits :");
    console.table(derniers);
  }

  await prisma.$disconnect();
}

principal().catch((e) => { console.error(e); process.exit(1); });
