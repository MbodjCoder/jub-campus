// Singleton Prisma Client avec adaptateur node-postgres (Prisma 7).
// En dev, on stocke sur globalThis pour éviter la multiplication
// des connexions à chaque hot-reload.

import "server-only"; // empêche tout import accidentel côté client
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { env } from "@/lib/env";

declare global {
  var prismaClientGlobal: PrismaClient | undefined;
}

function creerClientPrisma(): PrismaClient {
  const adaptateur = new PrismaPg({ connectionString: env.DATABASE_URL });
  return new PrismaClient({ adapter: adaptateur });
}

export const prisma = globalThis.prismaClientGlobal ?? creerClientPrisma();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaClientGlobal = prisma;
}
