// Middleware Edge-safe : RBAC par groupe de routes.
// N'utilise PAS Prisma. La config Edge se contente d'évaluer le JWT.

import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { configAuthEdge } from "@/auth.config";

const { auth } = NextAuth(configAuthEdge);

type RoleAttendu = "ETUDIANT" | "ENTREPRISE" | "MENTOR" | "SPONSOR" | "ADMIN" | "SUPER_ADMIN";

const ROUTES_PUBLIQUES: RegExp[] = [
  /^\/$/,
  /^\/a-propos$/,
  /^\/comment-ca-marche$/,
  /^\/contact$/,
  /^\/cgu$/,
  /^\/confidentialite$/,
  /^\/projets/,
  /^\/entreprises$/,
  /^\/programmes/,
  /^\/classements$/,
  /^\/temoignages$/,
  /^\/inscription/,
  /^\/connexion$/,
  /^\/verifier$/,
  /^\/u\//,
  /^\/v\//,
  /^\/api\/auth\//,
];

const REGLES_ROLES: Array<{ regex: RegExp; roles: RoleAttendu[] }> = [
  { regex: /^\/app/,        roles: ["ETUDIANT"] },
  { regex: /^\/entreprise(?!s)/, roles: ["ENTREPRISE", "ADMIN", "SUPER_ADMIN"] },
  { regex: /^\/mentor/,     roles: ["MENTOR", "ADMIN", "SUPER_ADMIN"] },
  { regex: /^\/admin/,      roles: ["ADMIN", "SUPER_ADMIN"] },
  { regex: /^\/sponsor/,    roles: ["SPONSOR", "ADMIN", "SUPER_ADMIN"] },
];

function estPublique(chemin: string): boolean {
  return ROUTES_PUBLIQUES.some((re) => re.test(chemin));
}

export default auth((req) => {
  const chemin = req.nextUrl.pathname;
  if (estPublique(chemin)) return NextResponse.next();

  if (!req.auth) {
    const url = new URL("/connexion", req.url);
    url.searchParams.set("suivant", chemin);
    return NextResponse.redirect(url);
  }

  const role = req.auth.user?.role as RoleAttendu | undefined;
  const regle = REGLES_ROLES.find((r) => r.regex.test(chemin));
  if (regle && (!role || !regle.roles.includes(role))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)"],
};
