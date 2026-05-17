// Singleton Prisma Client avec adaptateur node-postgres (Prisma 7).
// En dev, on stocke sur globalThis pour éviter la multiplication
// des connexions à chaque hot-reload.

import "server-only"; // empêche tout import accidentel côté client
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaClientGlobal: PrismaClient | undefined;
}

function creerClientPrisma(): PrismaClient {
  const urlBdd = process.env.DATABASE_URL;
  if (!urlBdd) {
    throw new Error("DATABASE_URL manquant dans l'environnement.");
  }
  const adaptateur = new PrismaPg({ connectionString: urlBdd });
  return new PrismaClient({ adapter: adaptateur });
}

export const prisma = globalThis.prismaClientGlobal ?? creerClientPrisma();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaClientGlobal = prisma;
}
