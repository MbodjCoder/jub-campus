// Constantes métier JUB Campus.

export const NOM_PRODUIT = "JUB Campus";
export const TAGLINE = "L'expérience pro qui change tout.";
export const TAGLINE_LONGUE =
  "Travaille sur de vrais projets, prouve tes compétences, accède à de meilleures opportunités.";

// Libellés UI pour les énumérations Prisma.
export const LIBELLES_ROLE = {
  ETUDIANT: "Étudiant",
  ENTREPRISE: "Entreprise",
  MENTOR: "Mentor",
  SPONSOR: "Sponsor",
  ADMIN: "Administrateur",
  SUPER_ADMIN: "Super administrateur",
} as const;

export const LIBELLES_NIVEAU_ETUDE = {
  L1: "Licence 1",
  L2: "Licence 2",
  L3: "Licence 3",
  M1: "Master 1",
  M2: "Master 2",
  DOCTORAT: "Doctorat",
} as const;

export const LIBELLES_NIVEAU_PROJET = {
  DEBUTANT: "Débutant",
  INTERMEDIAIRE: "Intermédiaire",
  AVANCE: "Avancé",
  EXPERT_ETUDIANT: "Expert étudiant",
  PRO_JUNIOR: "Pro junior",
} as const;

export const LIBELLES_CATEGORIE = {
  INFORMATIQUE: "Informatique",
  DATA: "Data",
  IA: "Intelligence artificielle",
  WEB: "Développement web",
  MOBILE: "Développement mobile",
  UI_UX: "UI/UX design",
  MARKETING: "Marketing digital",
  COMMUNICATION: "Communication",
  GESTION: "Gestion",
  FINANCE: "Finance",
  COMPTABILITE: "Comptabilité",
  DROIT: "Droit",
  REDACTION: "Rédaction",
  TRADUCTION: "Traduction",
  RECHERCHE: "Recherche documentaire",
  AGRICULTURE: "Agriculture",
  SANTE: "Santé",
  EDUCATION: "Éducation",
  ENVIRONNEMENT: "Environnement",
  SOCIOLOGIE: "Sociologie",
  GEOGRAPHIE: "Géographie",
  ENTREPRENEURIAT: "Entrepreneuriat",
  ADMINISTRATION: "Administration",
  ANNOTATION_DONNEES: "Annotation de données",
  ENQUETE_TERRAIN: "Enquêtes terrain",
} as const;

export const LIBELLES_MODE_REMUNERATION = {
  APPRENTISSAGE: "Apprentissage certifiant",
  PRIME: "Avec prime",
  REMUNERE: "Rémunéré",
  SPONSORISE: "Sponsorisé",
} as const;

export const COULEURS_MODE_REMUNERATION = {
  APPRENTISSAGE: "bg-emerald-100 text-emerald-900 border-emerald-200",
  PRIME: "bg-amber-100 text-amber-900 border-amber-200",
  REMUNERE: "bg-violet-100 text-violet-900 border-violet-200",
  SPONSORISE: "bg-sky-100 text-sky-900 border-sky-200",
} as const;

export const LIBELLES_DISPONIBILITE = {
  DISPONIBLE: "Disponible",
  PARTIEL: "Temps partiel",
  INDISPONIBLE: "Indisponible",
} as const;

export const LIBELLES_STATUT_PROJET = {
  BROUILLON: "Brouillon",
  EN_VALIDATION: "En validation",
  PUBLIE: "Publié",
  CANDIDATURES_OUVERTES: "Candidatures ouvertes",
  EQUIPE_EN_CONSTITUTION: "Équipe en constitution",
  EN_COURS: "En cours",
  EN_REVISION: "En révision",
  TERMINE: "Terminé",
  CERTIFIE: "Certifié",
  ANNULE: "Annulé",
  ARCHIVE: "Archivé",
} as const;

// Universités sénégalaises principales (référentiel de départ).
export const UNIVERSITES_SENEGAL = [
  { nom: "Université Gaston Berger", acronyme: "UGB", ville: "Saint-Louis", publique: true, domaine: "ugb.edu.sn" },
  { nom: "Université Cheikh Anta Diop", acronyme: "UCAD", ville: "Dakar", publique: true, domaine: "ucad.edu.sn" },
  { nom: "Université Alioune Diop", acronyme: "UADB", ville: "Bambey", publique: true, domaine: "uadb.edu.sn" },
  { nom: "Université Assane Seck", acronyme: "UASZ", ville: "Ziguinchor", publique: true, domaine: "univ-zig.sn" },
  { nom: "Université Iba Der Thiam", acronyme: "UIDT", ville: "Thiès", publique: true, domaine: "univ-thies.sn" },
  { nom: "Université du Sine Saloum El Hadji Ibrahima Niass", acronyme: "USSEIN", ville: "Kaolack", publique: true, domaine: "ussein.sn" },
  { nom: "Université Virtuelle du Sénégal", acronyme: "UVS", ville: "Dakar", publique: true, domaine: "uvs.sn" },
] as const;
