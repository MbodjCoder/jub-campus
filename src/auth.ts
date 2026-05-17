// Configuration complète Auth.js v5 (runtime Node).
// Étend la configuration Edge-safe avec les providers nécessitant
// Prisma + bcryptjs (interdits dans Edge Runtime).

import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcryptjs from "bcryptjs";
import { configAuthEdge } from "@/auth.config";
import { schemaConnexion } from "@/lib/zod/inscription";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/generated/prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }
  interface User {
    role?: Role;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...configAuthEdge,
  providers: [
    Credentials({
      name: "Email + mot de passe",
      credentials: {
        email: { label: "Email", type: "email" },
        motDePasse: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const parsed = schemaConnexion.safeParse(credentials);
        if (!parsed.success) return null;
        const utilisateur = await prisma.utilisateur.findUnique({
          where: { email: parsed.data.email },
        });
        if (!utilisateur?.motDePasseHash) return null;
        const valide = await bcryptjs.compare(parsed.data.motDePasse, utilisateur.motDePasseHash);
        if (!valide) return null;
        await prisma.utilisateur.update({
          where: { id: utilisateur.id },
          data: { derniereConnexionLe: new Date() },
        });
        return {
          id: utilisateur.id,
          email: utilisateur.email,
          name: utilisateur.nomComplet ?? utilisateur.email,
          image: utilisateur.imageUrl,
          role: utilisateur.role,
        };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      // Pas de liaison automatique par email (risque de détournement de
      // compte). Le rapprochement est géré explicitement via signIn.
    }),
  ],
  callbacks: {
    ...configAuthEdge.callbacks,
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) return true;
      const existant = await prisma.utilisateur.findUnique({ where: { email: user.email } });
      if (existant) {
        await prisma.utilisateur.update({
          where: { id: existant.id },
          data: {
            derniereConnexionLe: new Date(),
            imageUrl: user.image ?? existant.imageUrl,
          },
        });
        return true;
      }
      await prisma.utilisateur.create({
        data: {
          email: user.email,
          nomComplet: user.name ?? user.email,
          imageUrl: user.image,
          emailVerifieLe: new Date(),
          role: "ETUDIANT",
        },
      });
      return true;
    },
    async jwt({ token, user }) {
      const t = token as typeof token & { role?: Role; utilisateurId?: string };
      if (user) {
        t.role = user.role;
        t.utilisateurId = user.id;
      } else if (t.email && !t.role) {
        const u = await prisma.utilisateur.findUnique({ where: { email: t.email } });
        if (u) {
          t.role = u.role;
          t.utilisateurId = u.id;
        }
      }
      return t;
    },
    async session({ session, token }) {
      const t = token as typeof token & { role?: Role; utilisateurId?: string };
      if (t.utilisateurId) session.user.id = t.utilisateurId;
      if (t.role) session.user.role = t.role;
      return session;
    },
  },
});
