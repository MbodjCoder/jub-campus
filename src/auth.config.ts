// Configuration Auth.js Edge-safe (utilisée par middleware.ts).
// PAS d'import Prisma / bcryptjs / Node API : doit tourner dans Edge Runtime.

import type { NextAuthConfig } from "next-auth";

export const configAuthEdge = {
  session: { strategy: "jwt" },
  pages: { signIn: "/connexion" },
  trustHost: true,
  providers: [], // les vrais providers sont ajoutés dans auth.ts (runtime Node)
  callbacks: {
    authorized({ auth }) {
      return Boolean(auth?.user);
    },
  },
} satisfies NextAuthConfig;
