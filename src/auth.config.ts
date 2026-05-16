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
    // Expose rôle + id depuis le JWT déjà signé.
    // INDISPENSABLE dans la config Edge : le middleware (proxy.ts) lit
    // `req.auth.user.role` pour le RBAC. Sans ce callback ici, le rôle
    // serait absent côté Edge et toutes les routes protégées
    // redirigeraient vers « / ».
    session({ session, token }) {
      const t = token as typeof token & { role?: string; utilisateurId?: string };
      if (t.utilisateurId) session.user.id = t.utilisateurId;
      if (t.role) session.user.role = t.role as typeof session.user.role;
      return session;
    },
  },
} satisfies NextAuthConfig;
