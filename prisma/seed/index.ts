// Seed JUB Campus.
// Lance : `pnpm bdd:semer`.
// Idempotent : utilise upsert sur les clés uniques.

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { config as chargerDotenv } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "../../src/generated/prisma/client";

for (const fichier of [".env.local", ".env"]) {
  const chemin = resolve(process.cwd(), fichier);
  if (existsSync(chemin)) chargerDotenv({ path: chemin, override: false });
}

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

  await semerComptesEtProjets();

  console.log("✓ Seed terminé.");
}

// ─────────────────────────────────────────────────────────────
// Comptes de démonstration + projets — pour tester l'app localement.
// Mot de passe commun : « campus123 ».
// ─────────────────────────────────────────────────────────────
async function semerComptesEtProjets() {
  const motDePasseHash = bcrypt.hashSync("campus123", 10);
  const ugb = await prisma.universite.findUniqueOrThrow({ where: { acronyme: "UGB" } });

  // ── Admin ────────────────────────────────────────────────
  await prisma.utilisateur.upsert({
    where: { email: "admin@jubcampus.sn" },
    update: { motDePasseHash, role: "ADMIN" },
    create: {
      email: "admin@jubcampus.sn", motDePasseHash, role: "ADMIN",
      nomComplet: "Admin JUB", emailVerifieLe: new Date(),
    },
  });

  // ── Mentor ───────────────────────────────────────────────
  const uMentor = await prisma.utilisateur.upsert({
    where: { email: "mentor@jubcampus.sn" },
    update: { motDePasseHash, role: "MENTOR" },
    create: {
      email: "mentor@jubcampus.sn", motDePasseHash, role: "MENTOR",
      nomComplet: "Awa Diallo", emailVerifieLe: new Date(),
    },
  });
  await prisma.mentor.upsert({
    where: { utilisateurId: uMentor.id },
    update: {},
    create: {
      utilisateurId: uMentor.id, prenom: "Awa", nom: "Diallo",
      type: "PROFESSIONNEL", universiteId: ugb.id,
      titreOuPoste: "Lead Developer @ Orange Digital Center",
      specialites: ["Next.js", "Architecture logicielle", "Mentorat"],
      biographie: "10 ans d'expérience en développement web. Passionnée par la transmission.",
      estVerifie: true,
    },
  });

  // ── Étudiants ────────────────────────────────────────────
  const ETUDIANTS = [
    { email: "etudiant@jubcampus.sn", prenom: "Mamadou", nom: "Ndiaye", niveau: "L3" as const,
      filiere: "Informatique", bio: "Étudiant en L3 MAI, curieux de tout ce qui touche au web." },
    { email: "fatou@jubcampus.sn", prenom: "Fatou", nom: "Sarr", niveau: "M1" as const,
      filiere: "Data Science", bio: "Passionnée de données et d'IA appliquée à l'agriculture." },
  ];
  for (const e of ETUDIANTS) {
    const u = await prisma.utilisateur.upsert({
      where: { email: e.email },
      update: { motDePasseHash, role: "ETUDIANT" },
      create: {
        email: e.email, motDePasseHash, role: "ETUDIANT",
        nomComplet: `${e.prenom} ${e.nom}`, emailVerifieLe: new Date(),
      },
    });
    await prisma.etudiant.upsert({
      where: { utilisateurId: u.id },
      update: {},
      create: {
        utilisateurId: u.id, prenom: e.prenom, nom: e.nom,
        slug: slugifier(`${e.prenom}-${e.nom}`),
        universiteId: ugb.id, niveau: e.niveau, filiere: e.filiere,
        biographie: e.bio, disponibilite: "DISPONIBLE",
      },
    });
  }

  // ── Entreprise (validée) ─────────────────────────────────
  const uEntreprise = await prisma.utilisateur.upsert({
    where: { email: "entreprise@jubcampus.sn" },
    update: { motDePasseHash, role: "ENTREPRISE" },
    create: {
      email: "entreprise@jubcampus.sn", motDePasseHash, role: "ENTREPRISE",
      nomComplet: "Sénégal Digital", emailVerifieLe: new Date(),
    },
  });
  const entreprise = await prisma.entreprise.upsert({
    where: { utilisateurId: uEntreprise.id },
    update: { statutValidation: "VALIDEE" },
    create: {
      utilisateurId: uEntreprise.id, raisonSociale: "Sénégal Digital",
      slug: "senegal-digital", secteur: "Numérique", taille: "PETITE",
      ville: "Dakar", siteWeb: "https://senegaldigital.sn",
      description: "Studio de développement web et mobile basé à Dakar.",
      statutValidation: "VALIDEE", valideeLe: new Date(),
    },
  });

  // ── Projets de démonstration ─────────────────────────────
  const PROJETS = [
    { titre: "Refonte du site vitrine d'une coopérative agricole",
      resume: "Concevoir et développer un nouveau site vitrine moderne pour une coopérative de Saint-Louis.",
      description: "La coopérative agricole de la vallée souhaite un site vitrine moderne, responsive et multilingue (français/wolof). Tu travailleras sur la maquette, le développement front-end avec Next.js et l'intégration de contenu.\n\nLivrables attendus : maquette Figma, site déployé, documentation.",
      categorie: "WEB" as const, niveau: "INTERMEDIAIRE" as const,
      modeRemuneration: "REMUNERE" as const, montantFcfa: 150000, dureeJours: 30, placesMax: 3 },
    { titre: "Tableau de bord d'analyse des ventes",
      resume: "Construire un dashboard interactif pour visualiser les données de ventes mensuelles.",
      description: "Une PME de distribution cherche à mieux comprendre ses ventes. Le projet consiste à nettoyer les données, créer des indicateurs clés et concevoir un tableau de bord Power BI ou web.\n\nCompétences : SQL, Power BI ou React, analyse de données.",
      categorie: "DATA" as const, niveau: "INTERMEDIAIRE" as const,
      modeRemuneration: "PRIME" as const, montantFcfa: 75000, dureeJours: 21, placesMax: 2 },
    { titre: "Campagne de communication digitale pour un événement étudiant",
      resume: "Imaginer et déployer la stratégie de communication d'un hackathon universitaire.",
      description: "L'UGB organise son premier hackathon. Tu seras en charge de la stratégie réseaux sociaux, des visuels et du calendrier éditorial.\n\nUn projet idéal pour développer ton portfolio en communication digitale.",
      categorie: "COMMUNICATION" as const, niveau: "DEBUTANT" as const,
      modeRemuneration: "APPRENTISSAGE" as const, montantFcfa: null, dureeJours: 14, placesMax: 4 },
  ];
  for (const p of PROJETS) {
    const slug = slugifier(p.titre);
    await prisma.projet.upsert({
      where: { slug },
      update: {},
      create: {
        slug, titre: p.titre, resume: p.resume, description: p.description,
        source: "ENTREPRISE", categorie: p.categorie, niveau: p.niveau,
        modeRemuneration: p.modeRemuneration, montantFcfa: p.montantFcfa,
        dureeJours: p.dureeJours, placesMax: p.placesMax,
        statut: "CANDIDATURES_OUVERTES", visibilite: "PUBLIQUE",
        publieLe: new Date(), publieParId: uEntreprise.id, entrepriseId: entreprise.id,
      },
    });
  }
  console.log(`  ${ETUDIANTS.length + 3} comptes démo + ${PROJETS.length} projets OK`);
}

semer()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
