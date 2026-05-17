// Couche d'autorisation centralisée — point unique pour les règles
// d'accès (RBAC). À utiliser dans les layouts, pages et server actions.

import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { Role } from "@/generated/prisma/client";

export interface SessionUtilisateur {
  id: string;
  role: Role;
  nom: string | null;
  email: string | null;
  image: string | null;
}

const ROLES_ADMIN: Role[] = ["ADMIN", "SUPER_ADMIN"];

export function estAdmin(role: Role | undefined | null): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

// Exige une session ; redirige vers /connexion sinon.
export async function exigerConnexion(suivant?: string): Promise<SessionUtilisateur> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/connexion${suivant ? `?suivant=${encodeURIComponent(suivant)}` : ""}`);
  }
  return {
    id: session.user.id,
    role: session.user.role,
    nom: session.user.name ?? null,
    email: session.user.email ?? null,
    image: session.user.image ?? null,
  };
}

// Exige un des rôles donnés (les admins passent toujours).
export async function exigerRole(roles: Role[], suivant?: string): Promise<SessionUtilisateur> {
  const u = await exigerConnexion(suivant);
  if (!roles.includes(u.role) && !estAdmin(u.role)) redirect("/");
  return u;
}

export const exigerEtudiant = (suivant?: string) => exigerRole(["ETUDIANT"], suivant);
export const exigerEntreprise = (suivant?: string) => exigerRole(["ENTREPRISE"], suivant);
export const exigerMentor = (suivant?: string) => exigerRole(["MENTOR"], suivant);
export const exigerAdmin = (suivant?: string) => exigerRole(ROLES_ADMIN, suivant);

// Variante sans redirection, pour les server actions : retourne null.
export async function sessionOuNull(): Promise<SessionUtilisateur | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return {
    id: session.user.id,
    role: session.user.role,
    nom: session.user.name ?? null,
    email: session.user.email ?? null,
    image: session.user.image ?? null,
  };
}
