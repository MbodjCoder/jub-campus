import "server-only";

import { prisma } from "@/lib/prisma";
import type { Role, Visibilite } from "@/generated/prisma/client";

export interface ContexteAccesProjet {
  utilisateurId: string;
  role: Role;
  etudiantId: string | null;
  universiteId: string | null;
  mentorId: string | null;
  entrepriseId: string | null;
}

export async function chargerContexteAccesProjet(
  utilisateurId: string,
): Promise<ContexteAccesProjet | null> {
  const utilisateur = await prisma.utilisateur.findUnique({
    where: { id: utilisateurId },
    select: {
      id: true,
      role: true,
      etudiant: { select: { id: true, universiteId: true } },
      mentor: { select: { id: true } },
      entreprise: { select: { id: true } },
    },
  });

  if (!utilisateur) return null;
  return {
    utilisateurId: utilisateur.id,
    role: utilisateur.role,
    etudiantId: utilisateur.etudiant?.id ?? null,
    universiteId: utilisateur.etudiant?.universiteId ?? null,
    mentorId: utilisateur.mentor?.id ?? null,
    entrepriseId: utilisateur.entreprise?.id ?? null,
  };
}

export function estAdmin(role: Role | null | undefined): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function utilisateurPeutAccederProjet(
  projet: {
    publieParId: string;
    entrepriseId: string | null;
    mentorPrincipalId: string | null;
    equipe: { membres: { etudiantId: string }[] } | null;
  },
  contexte: ContexteAccesProjet,
): boolean {
  if (estAdmin(contexte.role)) return true;
  if (projet.publieParId === contexte.utilisateurId) return true;
  if (projet.entrepriseId && projet.entrepriseId === contexte.entrepriseId) return true;
  if (projet.mentorPrincipalId && projet.mentorPrincipalId === contexte.mentorId) return true;
  return Boolean(
    contexte.etudiantId &&
      projet.equipe?.membres.some((m) => m.etudiantId === contexte.etudiantId),
  );
}

export function projetEstVisiblePubliquement(
  visibilite: Visibilite,
  statut: string,
): boolean {
  const statutsCaches = new Set(["BROUILLON", "EN_VALIDATION", "ANNULE", "ARCHIVE"]);
  return visibilite === "PUBLIQUE" && !statutsCaches.has(statut);
}

export function projetEstVisiblePourUniversite(
  visibilite: Visibilite,
  statut: string,
  universiteProjetId: string | null,
  universiteUtilisateurId: string | null,
): boolean {
  const statutsCaches = new Set(["BROUILLON", "EN_VALIDATION", "ANNULE", "ARCHIVE"]);
  return (
    visibilite === "UNIVERSITE" &&
    !statutsCaches.has(statut) &&
    universiteProjetId != null &&
    universiteProjetId === universiteUtilisateurId
  );
}
