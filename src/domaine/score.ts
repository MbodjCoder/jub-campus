// Domaine du Score JUB et de la validation des compétences.
// Le score n'est jamais saisi à la main : il se recalcule à partir
// des preuves réelles (certificats + badges).

import "server-only";
import { prisma } from "@/lib/prisma";

// Points par rareté de badge.
const POINTS_RARETE: Record<string, number> = {
  COMMUN: 20,
  RARE: 50,
  EPIQUE: 100,
  LEGENDAIRE: 200,
};

// Points d'un certificat : socle 80 + bonus proportionnel au score final.
function pointsCertificat(scoreFinal: number): number {
  return Math.round(80 + Math.max(0, Math.min(10, scoreFinal)) * 12);
}

// Recalcule et persiste le Score JUB d'un étudiant depuis ses preuves.
export async function recalculerScoreJub(etudiantId: string): Promise<number> {
  const [certificats, badges] = await Promise.all([
    prisma.certificat.findMany({
      where: { etudiantId, statut: "VALIDE" },
      select: { scoreFinal: true },
    }),
    prisma.badgeEtudiant.findMany({
      where: { etudiantId },
      select: { badge: { select: { rarete: true } } },
    }),
  ]);

  const ptsCertificats = certificats.reduce((s, c) => s + pointsCertificat(c.scoreFinal), 0);
  const ptsBadges = badges.reduce((s, b) => s + (POINTS_RARETE[b.badge.rarete] ?? 0), 0);
  const score = ptsCertificats + ptsBadges;

  await prisma.etudiant.update({ where: { id: etudiantId }, data: { scoreJub: score } });
  return score;
}

// Marque comme « validées » les compétences attestées par un certificat :
// niveauValide passe au moins au niveau réellement possédé.
export async function validerCompetences(etudiantId: string, noms: string[]): Promise<void> {
  const propres = noms.map((n) => n.trim()).filter(Boolean);
  if (propres.length === 0) return;

  const competences = await prisma.competence.findMany({
    where: { OR: propres.map((nom) => ({ nom: { equals: nom, mode: "insensitive" as const } })) },
    select: { id: true },
  });

  for (const c of competences) {
    const lien = await prisma.competenceEtudiant.findUnique({
      where: { etudiantId_competenceId: { etudiantId, competenceId: c.id } },
      select: { niveau: true, niveauValide: true },
    });
    if (!lien) continue;
    const nouveau = Math.max(lien.niveauValide ?? 0, lien.niveau);
    if (nouveau !== lien.niveauValide) {
      await prisma.competenceEtudiant.update({
        where: { etudiantId_competenceId: { etudiantId, competenceId: c.id } },
        data: { niveauValide: nouveau },
      });
    }
  }
}
