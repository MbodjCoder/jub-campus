// Seed JUB Campus.
// Lance : `pnpm bdd:semer`.
// Idempotent : utilise upsert sur les clés uniques.

import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "../../src/generated/prisma/client";

const urlBdd = process.env.DATABASE_URL;
if (!urlBdd) {
  console.error("DATABASE_URL manquant — copie .env.example vers .env.local.");
  process.exit(1);
}

const adaptateur = new PrismaPg({ connectionString: urlBdd });
const prisma = new PrismaClient({ adapter: adaptateur });

const UNIVERSITES = [
  { nom: "Université Gaston Berger", acronyme: "UGB", ville: "Saint-Louis", publique: true, domaine: "ugb.edu.sn",
    departements: ["Mathématiques Appliquées et Informatique", "Sciences Économiques et Gestion", "Lettres et Sciences Humaines", "Sciences Agronomiques", "Sciences Juridiques et Politiques"] },
  { nom: "Université Cheikh Anta Diop", acronyme: "UCAD", ville: "Dakar", publique: true, domaine: "ucad.edu.sn",
    departements: ["FST", "FSEG", "FLSH", "FMPO", "FASEG"] },
  { nom: "Université Alioune Diop", acronyme: "UADB", ville: "Bambey", publique: true, domaine: "uadb.edu.sn", departements: [] },
  { nom: "Université Assane Seck", acronyme: "UASZ", ville: "Ziguinchor", publique: true, domaine: "univ-zig.sn", departements: [] },
  { nom: "Université Iba Der Thiam", acronyme: "UIDT", ville: "Thiès", publique: true, domaine: "univ-thies.sn", departements: [] },
  { nom: "Université du Sine Saloum El Hadji Ibrahima Niass", acronyme: "USSEIN", ville: "Kaolack", publique: true, domaine: "ussein.sn", departements: [] },
  { nom: "Université Virtuelle du Sénégal", acronyme: "UVS", ville: "Dakar", publique: true, domaine: "uvs.sn", departements: [] },
];

const COMPETENCES: Array<{ nom: string; categorie: string }> = [
  // Tech
  { nom: "JavaScript", categorie: "Tech" }, { nom: "TypeScript", categorie: "Tech" },
  { nom: "Python", categorie: "Tech" }, { nom: "Java", categorie: "Tech" },
  { nom: "Next.js", categorie: "Tech" }, { nom: "React", categorie: "Tech" },
  { nom: "Node.js", categorie: "Tech" }, { nom: "PostgreSQL", categorie: "Tech" },
  { nom: "MongoDB", categorie: "Tech" }, { nom: "Docker", categorie: "Tech" },
  { nom: "Git", categorie: "Tech" }, { nom: "REST API", categorie: "Tech" },
  // Data / IA
  { nom: "Pandas", categorie: "Data" }, { nom: "Scikit-learn", categorie: "Data" },
  { nom: "Power BI", categorie: "Data" }, { nom: "SQL", categorie: "Data" },
  { nom: "Annotation de données", categorie: "Data" },
  // Design
  { nom: "Figma", categorie: "Design" }, { nom: "UX recherche", categorie: "Design" },
  { nom: "Adobe Illustrator", categorie: "Design" }, { nom: "Canva", categorie: "Design" },
  // Marketing / Communication
  { nom: "Réseaux sociaux", categorie: "Marketing" }, { nom: "Copywriting", categorie: "Marketing" },
  { nom: "SEO", categorie: "Marketing" }, { nom: "Photographie", categorie: "Marketing" },
  // Gestion
  { nom: "Gestion de projet", categorie: "Gestion" }, { nom: "Excel avancé", categorie: "Gestion" },
  { nom: "Comptabilité", categorie: "Gestion" }, { nom: "Analyse financière", categorie: "Gestion" },
  // Soft skills
  { nom: "Travail en équipe", categorie: "Soft" }, { nom: "Communication écrite", categorie: "Soft" },
  { nom: "Rigueur", categorie: "Soft" }, { nom: "Autonomie", categorie: "Soft" },
  { nom: "Résolution de problème", categorie: "Soft" },
  // Recherche / Terrain
  { nom: "Enquête terrain", categorie: "Terrain" }, { nom: "Wolof", categorie: "Terrain" },
  { nom: "Rédaction académique", categorie: "Terrain" },
];

const BADGES = [
  { code: "PREMIER_PROJET", nom: "Premier projet", description: "Tu as terminé ton tout premier projet.", rarete: "COMMUN", critere: "1 projet terminé" },
  { code: "LIVRABLE_PARFAIT", nom: "Livrable parfait", description: "Un livrable a obtenu 10/10.", rarete: "RARE", critere: "Note livrable = 10" },
  { code: "MARATHON_30J", nom: "Marathon 30 jours", description: "Tu as livré 30 jours d'affilée.", rarete: "EPIQUE", critere: "30 jours de contributions consécutives" },
  { code: "MENTOR_FAVORI", nom: "Mentor favori", description: "Un mentor t'a recommandé.", rarete: "RARE", critere: "1 recommandation reçue" },
  { code: "POLYVALENT", nom: "Polyvalent", description: "Projets dans 3 catégories différentes.", rarete: "RARE", critere: "3 catégories distinctes" },
  { code: "TOP_10_UGB", nom: "Top 10 UGB", description: "Classé dans le top 10 UGB sur ton domaine.", rarete: "EPIQUE", critere: "Top 10 classement universitaire" },
  { code: "PIONNIER", nom: "Pionnier", description: "Membre des 100 premiers étudiants JUB Campus.", rarete: "LEGENDAIRE", critere: "Inscrit avant 100 utilisateurs" },
  { code: "AMBASSADEUR", nom: "Ambassadeur", description: "Tu animes JUB sur ton campus.", rarete: "EPIQUE", critere: "Statut ambassadeur officiel" },
  { code: "PARRAIN_5", nom: "Parrain x5", description: "5 étudiants se sont inscrits via ton parrainage.", rarete: "RARE", critere: "5 filleuls confirmés" },
  { code: "PREMIER_CERTIFICAT", nom: "Certifié", description: "Premier certificat décroché.", rarete: "COMMUN", critere: "1 certificat délivré" },
] as const;

function slugifier(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function semer() {
  console.log("Semis JUB Campus…");

  // Universités + départements
  for (const u of UNIVERSITES) {
    const univ = await prisma.universite.upsert({
      where: { acronyme: u.acronyme },
      update: {},
      create: {
        nom: u.nom, acronyme: u.acronyme, ville: u.ville,
        estPublique: u.publique, domaineEmail: u.domaine,
      },
    });
    for (const nomDept of u.departements) {
      await prisma.departement.upsert({
        where: { universiteId_nom: { universiteId: univ.id, nom: nomDept } },
        update: {},
        create: { universiteId: univ.id, nom: nomDept },
      });
    }
  }
  console.log(`  ${UNIVERSITES.length} universités + départements OK`);

  // Compétences
  for (const c of COMPETENCES) {
    await prisma.competence.upsert({
      where: { nom: c.nom },
      update: { categorie: c.categorie },
      create: { nom: c.nom, slug: slugifier(c.nom), categorie: c.categorie },
    });
  }
  console.log(`  ${COMPETENCES.length} compétences OK`);

  // Badges
  for (const b of BADGES) {
    await prisma.badge.upsert({
      where: { code: b.code },
      update: { nom: b.nom, description: b.description, rarete: b.rarete, critere: b.critere },
      create: b,
    });
  }
  console.log(`  ${BADGES.length} badges OK`);

  console.log("✓ Seed terminé.");
}

semer()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
