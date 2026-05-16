// Domaine badges : règles d'octroi automatique.
// Appelé après les événements métier clés (émission certificat,
// dépôt livrable, etc.) pour scanner et octroyer les badges
// que l'étudiant vient de débloquer.

import { prisma } from "@/lib/prisma";

interface RegleBadge {
  code: string;
  // Renvoie true si l'étudiant remplit la condition de ce badge.
  evaluer: (etudiantId: string) => Promise<boolean>;
}

const REGLES: RegleBadge[] = [
  {
    code: "PREMIER_PROJET",
    async evaluer(etudiantId) {
      const n = await prisma.membreEquipe.count({
        where: { etudiantId, equipe: { projet: { statut: { in: ["TERMINE", "CERTIFIE"] } } } },
      });
      return n >= 1;
    },
  },
  {
    code: "PREMIER_CERTIFICAT",
    async evaluer(etudiantId) {
      const n = await prisma.certificat.count({ where: { etudiantId, statut: "VALIDE" } });
      return n >= 1;
    },
  },
  {
    code: "MENTOR_FAVORI",
    async evaluer(etudiantId) {
      const n = await prisma.recommandation.count({ where: { etudiantId } });
      return n >= 1;
    },
  },
  {
    code: "LIVRABLE_PARFAIT",
    async evaluer(etudiantId) {
      // Au moins un feedback noté 5/5 sur un livrable de l'étudiant.
      const feedback = await prisma.feedback.findFirst({
        where: {
          note: 5,
          livrable: { deposePar: { etudiant: { id: etudiantId } } },
        },
      });
      return feedback !== null;
    },
  },
  {
    code: "POLYVALENT",
    async evaluer(etudiantId) {
      // 3 projets terminés dans 3 catégories différentes.
      const equipes = await prisma.membreEquipe.findMany({
        where: { etudiantId, equipe: { projet: { statut: { in: ["TERMINE", "CERTIFIE"] } } } },
        select: { equipe: { select: { projet: { select: { categorie: true } } } } },
      });
      const cats = new Set(equipes.map((e) => e.equipe.projet.categorie));
      return cats.size >= 3;
    },
  },
  {
    code: "PIONNIER",
    async evaluer(etudiantId) {
      // Membre des 100 premiers étudiants inscrits.
      const etudiant = await prisma.etudiant.findUnique({
        where: { id: etudiantId },
        select: { creeLe: true },
      });
      if (!etudiant) return false;
      const rang = await prisma.etudiant.count({ where: { creeLe: { lt: etudiant.creeLe } } });
      return rang < 100;
    },
  },
  {
    code: "PARRAIN_5",
    async evaluer() {
      // Logique de parrainage non implémentée (V1.4). Stub : toujours false.
      return false;
    },
  },
  {
    code: "MARATHON_30J",
    async evaluer() {
      // Calcul de streak (30 jours consécutifs de contributions).
      // Heuristique simple à implémenter quand on aura assez de données.
      return false;
    },
  },
];

interface ResultatScan {
  octroyes: string[];      // codes des badges nouvellement obtenus
  totalEvalues: number;
}

// Scanne toutes les règles pour un étudiant et octroie les badges manquants.
// Ne lève jamais : retourne les codes des badges débloqués.
export async function scannerEtOctroyerBadges(etudiantId: string): Promise<ResultatScan> {
  const dejaObtenus = await prisma.badgeEtudiant.findMany({
    where: { etudiantId },
    select: { badgeId: true },
  });
  const idsObtenus = new Set(dejaObtenus.map((b) => b.badgeId));

  const tousLesBadges = await prisma.badge.findMany({ select: { id: true, code: true } });
  const indexParCode = new Map(tousLesBadges.map((b) => [b.code, b.id]));

  const octroyes: string[] = [];

  for (const regle of REGLES) {
    const badgeId = indexParCode.get(regle.code);
    if (!badgeId) continue;
    if (idsObtenus.has(badgeId)) continue;
    try {
      const ok = await regle.evaluer(etudiantId);
      if (!ok) continue;
      await prisma.badgeEtudiant.create({
        data: { etudiantId, badgeId },
      });
      octroyes.push(regle.code);
    } catch {
      // best-effort : on continue avec les autres règles
    }
  }

  return { octroyes, totalEvalues: REGLES.length };
}
