-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ETUDIANT', 'ENTREPRISE', 'MENTOR', 'SPONSOR', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "NiveauEtude" AS ENUM ('L1', 'L2', 'L3', 'M1', 'M2', 'DOCTORAT');

-- CreateEnum
CREATE TYPE "Disponibilite" AS ENUM ('DISPONIBLE', 'PARTIEL', 'INDISPONIBLE');

-- CreateEnum
CREATE TYPE "TailleEntreprise" AS ENUM ('TRES_PETITE', 'PETITE', 'MOYENNE', 'GRANDE');

-- CreateEnum
CREATE TYPE "TypeMentor" AS ENUM ('PROFESSEUR', 'PROFESSIONNEL', 'ALUMNI', 'EXPERT_INVITE');

-- CreateEnum
CREATE TYPE "StatutValidation" AS ENUM ('EN_ATTENTE', 'VALIDEE', 'REJETEE');

-- CreateEnum
CREATE TYPE "SourceProjet" AS ENUM ('JUB_INTERNE', 'ENTREPRISE', 'ACADEMIQUE', 'ETUDIANT', 'SPONSORISE', 'MINI_MISSION', 'CHALLENGE');

-- CreateEnum
CREATE TYPE "CategorieProjet" AS ENUM ('INFORMATIQUE', 'DATA', 'IA', 'WEB', 'MOBILE', 'UI_UX', 'MARKETING', 'COMMUNICATION', 'GESTION', 'FINANCE', 'COMPTABILITE', 'DROIT', 'REDACTION', 'TRADUCTION', 'RECHERCHE', 'AGRICULTURE', 'SANTE', 'EDUCATION', 'ENVIRONNEMENT', 'SOCIOLOGIE', 'GEOGRAPHIE', 'ENTREPRENEURIAT', 'ADMINISTRATION', 'ANNOTATION_DONNEES', 'ENQUETE_TERRAIN');

-- CreateEnum
CREATE TYPE "NiveauProjet" AS ENUM ('DEBUTANT', 'INTERMEDIAIRE', 'AVANCE', 'EXPERT_ETUDIANT', 'PRO_JUNIOR');

-- CreateEnum
CREATE TYPE "ModeRemuneration" AS ENUM ('APPRENTISSAGE', 'PRIME', 'REMUNERE', 'SPONSORISE');

-- CreateEnum
CREATE TYPE "StatutProjet" AS ENUM ('BROUILLON', 'EN_VALIDATION', 'PUBLIE', 'CANDIDATURES_OUVERTES', 'EQUIPE_EN_CONSTITUTION', 'EN_COURS', 'EN_REVISION', 'TERMINE', 'CERTIFIE', 'ANNULE', 'ARCHIVE');

-- CreateEnum
CREATE TYPE "Visibilite" AS ENUM ('PUBLIQUE', 'UNIVERSITE', 'PRIVEE');

-- CreateEnum
CREATE TYPE "StatutCandidature" AS ENUM ('EN_ATTENTE', 'ACCEPTEE', 'REFUSEE', 'RETIREE');

-- CreateEnum
CREATE TYPE "StatutTache" AS ENUM ('A_FAIRE', 'EN_COURS', 'EN_REVUE', 'TERMINEE');

-- CreateEnum
CREATE TYPE "Priorite" AS ENUM ('BASSE', 'NORMALE', 'HAUTE', 'URGENTE');

-- CreateEnum
CREATE TYPE "StatutLivrable" AS ENUM ('EN_REVUE', 'VALIDE', 'A_CORRIGER', 'REJETE');

-- CreateEnum
CREATE TYPE "SourceEvaluation" AS ENUM ('MENTOR', 'ENTREPRISE', 'PAIR', 'AUTO', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatutCertificat" AS ENUM ('VALIDE', 'REVOQUE', 'EXPIRE', 'EN_VERIFICATION');

-- CreateEnum
CREATE TYPE "Rarete" AS ENUM ('COMMUN', 'RARE', 'EPIQUE', 'LEGENDAIRE');

-- CreateEnum
CREATE TYPE "TypeSponsor" AS ENUM ('ENTREPRISE', 'ONG', 'INSTITUTION', 'FONDATION');

-- CreateEnum
CREATE TYPE "MethodePaiement" AS ENUM ('WAVE', 'ORANGE_MONEY', 'VIREMENT', 'STRIPE');

-- CreateEnum
CREATE TYPE "StatutPaiement" AS ENUM ('INITIE', 'EN_COURS', 'REUSSI', 'ECHEC', 'REMBOURSE');

-- CreateEnum
CREATE TYPE "TypeNotification" AS ENUM ('CANDIDATURE_RECUE', 'CANDIDATURE_ACCEPTEE', 'CANDIDATURE_REFUSEE', 'LIVRABLE_DEPOSE', 'LIVRABLE_FEEDBACK', 'PROJET_VALIDE', 'CERTIFICAT_DELIVRE', 'EVALUATION_REQUISE', 'MESSAGE_RECU', 'TACHE_ASSIGNEE', 'PROJET_PUBLIE', 'SYSTEME');

-- CreateEnum
CREATE TYPE "StatutSignalement" AS ENUM ('OUVERT', 'EN_COURS', 'RESOLU', 'REJETE');

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasseHash" TEXT,
    "nomComplet" TEXT,
    "imageUrl" TEXT,
    "role" "Role" NOT NULL DEFAULT 'ETUDIANT',
    "emailVerifieLe" TIMESTAMP(3),
    "derniereConnexionLe" TIMESTAMP(3),
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compte" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "fournisseur" TEXT NOT NULL,
    "fournisseurCompteId" TEXT NOT NULL,
    "refreshToken" TEXT,
    "accessToken" TEXT,
    "expiresAt" INTEGER,
    "tokenType" TEXT,
    "scope" TEXT,
    "idToken" TEXT,
    "sessionState" TEXT,

    CONSTRAINT "Compte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "jetonSession" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "expireLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JetonVerification" (
    "identifiant" TEXT NOT NULL,
    "jeton" TEXT NOT NULL,
    "expireLe" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Etudiant" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "telephone" TEXT,
    "universiteId" TEXT NOT NULL,
    "departementId" TEXT,
    "niveau" "NiveauEtude" NOT NULL,
    "filiere" TEXT,
    "biographie" TEXT,
    "disponibilite" "Disponibilite" NOT NULL DEFAULT 'DISPONIBLE',
    "langues" TEXT[] DEFAULT ARRAY['francais']::TEXT[],
    "liens" JSONB,
    "scoreJub" INTEGER NOT NULL DEFAULT 0,
    "estPublic" BOOLEAN NOT NULL DEFAULT true,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Etudiant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entreprise" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "raisonSociale" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "ninea" TEXT,
    "rccm" TEXT,
    "secteur" TEXT NOT NULL,
    "taille" "TailleEntreprise" NOT NULL,
    "siteWeb" TEXT,
    "ville" TEXT,
    "description" TEXT,
    "statutValidation" "StatutValidation" NOT NULL DEFAULT 'EN_ATTENTE',
    "motifRejet" TEXT,
    "valideeLe" TIMESTAMP(3),
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entreprise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mentor" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "type" "TypeMentor" NOT NULL,
    "universiteId" TEXT,
    "titreOuPoste" TEXT,
    "specialites" TEXT[],
    "biographie" TEXT,
    "liens" JSONB,
    "estVerifie" BOOLEAN NOT NULL DEFAULT false,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mentor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sponsor" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "TypeSponsor" NOT NULL,
    "logoUrl" TEXT,
    "siteWeb" TEXT,
    "description" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Universite" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "acronyme" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "estPublique" BOOLEAN NOT NULL,
    "domaineEmail" TEXT,
    "logoUrl" TEXT,
    "siteWeb" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Universite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Departement" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "acronyme" TEXT,
    "universiteId" TEXT NOT NULL,

    CONSTRAINT "Departement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Competence" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "iconeUrl" TEXT,

    CONSTRAINT "Competence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetenceEtudiant" (
    "etudiantId" TEXT NOT NULL,
    "competenceId" TEXT NOT NULL,
    "niveau" INTEGER NOT NULL,
    "niveauValide" INTEGER,
    "ajouteLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompetenceEtudiant_pkey" PRIMARY KEY ("etudiantId","competenceId")
);

-- CreateTable
CREATE TABLE "Projet" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "resume" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageCouvertureUrl" TEXT,
    "source" "SourceProjet" NOT NULL,
    "categorie" "CategorieProjet" NOT NULL,
    "niveau" "NiveauProjet" NOT NULL,
    "modeRemuneration" "ModeRemuneration" NOT NULL,
    "montantFcfa" INTEGER,
    "dureeJours" INTEGER NOT NULL,
    "placesMax" INTEGER NOT NULL DEFAULT 1,
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),
    "statut" "StatutProjet" NOT NULL DEFAULT 'BROUILLON',
    "visibilite" "Visibilite" NOT NULL DEFAULT 'PUBLIQUE',
    "publieParId" TEXT NOT NULL,
    "entrepriseId" TEXT,
    "mentorPrincipalId" TEXT,
    "sponsorId" TEXT,
    "programmeId" TEXT,
    "motifRejet" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publieLe" TIMESTAMP(3),
    "termineLe" TIMESTAMP(3),
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Projet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetenceProjet" (
    "projetId" TEXT NOT NULL,
    "competenceId" TEXT NOT NULL,
    "niveauRequis" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "CompetenceProjet_pkey" PRIMARY KEY ("projetId","competenceId")
);

-- CreateTable
CREATE TABLE "Candidature" (
    "id" TEXT NOT NULL,
    "projetId" TEXT NOT NULL,
    "etudiantId" TEXT NOT NULL,
    "lettre" TEXT NOT NULL,
    "cvUrl" TEXT,
    "scoreMatching" INTEGER,
    "statut" "StatutCandidature" NOT NULL DEFAULT 'EN_ATTENTE',
    "motifReponse" TEXT,
    "reponduLe" TIMESTAMP(3),
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipe" (
    "id" TEXT NOT NULL,
    "projetId" TEXT NOT NULL,
    "nom" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Equipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembreEquipe" (
    "equipeId" TEXT NOT NULL,
    "etudiantId" TEXT NOT NULL,
    "roleEquipe" TEXT NOT NULL,
    "contributionPourcent" INTEGER,
    "rejointLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MembreEquipe_pkey" PRIMARY KEY ("equipeId","etudiantId")
);

-- CreateTable
CREATE TABLE "Tache" (
    "id" TEXT NOT NULL,
    "projetId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "assigneeId" TEXT,
    "statut" "StatutTache" NOT NULL DEFAULT 'A_FAIRE',
    "priorite" "Priorite" NOT NULL DEFAULT 'NORMALE',
    "echeance" TIMESTAMP(3),
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "termineeLe" TIMESTAMP(3),
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Livrable" (
    "id" TEXT NOT NULL,
    "projetId" TEXT NOT NULL,
    "tacheId" TEXT,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "fichierUrl" TEXT NOT NULL,
    "typeMime" TEXT NOT NULL,
    "tailleOctets" INTEGER,
    "deposeParId" TEXT NOT NULL,
    "statut" "StatutLivrable" NOT NULL DEFAULT 'EN_REVUE',
    "deposeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Livrable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "livrableId" TEXT NOT NULL,
    "auteurId" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "note" INTEGER,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" TEXT NOT NULL,
    "projetId" TEXT NOT NULL,
    "etudiantId" TEXT NOT NULL,
    "source" "SourceEvaluation" NOT NULL,
    "evaluateurId" TEXT NOT NULL,
    "qualiteLivrable" INTEGER NOT NULL,
    "respectDelais" INTEGER NOT NULL,
    "communication" INTEGER NOT NULL,
    "autonomie" INTEGER NOT NULL,
    "collaboration" INTEGER NOT NULL,
    "creativite" INTEGER NOT NULL,
    "rigueur" INTEGER NOT NULL,
    "resolutionProb" INTEGER NOT NULL,
    "professionnalisme" INTEGER NOT NULL,
    "contributionReelle" INTEGER NOT NULL,
    "appreciation" TEXT,
    "scoreGlobal" DOUBLE PRECISION NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificat" (
    "id" TEXT NOT NULL,
    "numeroPublic" TEXT NOT NULL,
    "etudiantId" TEXT NOT NULL,
    "projetId" TEXT NOT NULL,
    "roleJoue" TEXT NOT NULL,
    "periodeDebut" TIMESTAMP(3) NOT NULL,
    "periodeFin" TIMESTAMP(3) NOT NULL,
    "dureeJours" INTEGER NOT NULL,
    "competencesValidees" TEXT[],
    "livrablesIds" TEXT[],
    "scoreFinal" DOUBLE PRECISION NOT NULL,
    "appreciation" TEXT NOT NULL,
    "mentorNom" TEXT NOT NULL,
    "organisationNom" TEXT,
    "pdfUrl" TEXT,
    "qrCodeUrl" TEXT,
    "hashIntegrite" TEXT NOT NULL,
    "statut" "StatutCertificat" NOT NULL DEFAULT 'VALIDE',
    "motifRevocation" TEXT,
    "emisLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certificat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationCertificat" (
    "id" TEXT NOT NULL,
    "certificatId" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "origine" TEXT,
    "verifieLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationCertificat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconeUrl" TEXT,
    "rarete" "Rarete" NOT NULL,
    "critere" TEXT NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BadgeEtudiant" (
    "etudiantId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "obtenuLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BadgeEtudiant_pkey" PRIMARY KEY ("etudiantId","badgeId")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL,
    "etudiantId" TEXT NOT NULL,
    "estPublic" BOOLEAN NOT NULL DEFAULT true,
    "theme" TEXT NOT NULL DEFAULT 'defaut',
    "vuesPubliques" INTEGER NOT NULL DEFAULT 0,
    "miseAJourLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommandation" (
    "id" TEXT NOT NULL,
    "etudiantId" TEXT NOT NULL,
    "mentorId" TEXT,
    "auteurNom" TEXT NOT NULL,
    "auteurTitre" TEXT,
    "contenu" TEXT NOT NULL,
    "estPublique" BOOLEAN NOT NULL DEFAULT true,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recommandation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Programme" (
    "id" TEXT NOT NULL,
    "sponsorId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "budgetFcfa" INTEGER NOT NULL,
    "thematique" TEXT NOT NULL,
    "description" TEXT,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Programme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paiement" (
    "id" TEXT NOT NULL,
    "beneficiaireId" TEXT NOT NULL,
    "payeurId" TEXT,
    "projetId" TEXT,
    "montantFcfa" INTEGER NOT NULL,
    "methode" "MethodePaiement" NOT NULL,
    "statut" "StatutPaiement" NOT NULL DEFAULT 'INITIE',
    "referenceExterne" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finaliseLe" TIMESTAMP(3),

    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "destinataireId" TEXT NOT NULL,
    "type" "TypeNotification" NOT NULL,
    "titre" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "lien" TEXT,
    "lue" BOOLEAN NOT NULL DEFAULT false,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "expediteurId" TEXT NOT NULL,
    "destinataireId" TEXT NOT NULL,
    "projetId" TEXT,
    "contenu" TEXT NOT NULL,
    "lu" BOOLEAN NOT NULL DEFAULT false,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Signalement" (
    "id" TEXT NOT NULL,
    "ressourceType" TEXT NOT NULL,
    "ressourceId" TEXT NOT NULL,
    "rapporteurId" TEXT NOT NULL,
    "motif" TEXT NOT NULL,
    "description" TEXT,
    "statut" "StatutSignalement" NOT NULL DEFAULT 'OUVERT',
    "resoluLe" TIMESTAMP(3),
    "resolutionNote" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Signalement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalAudit" (
    "id" TEXT NOT NULL,
    "acteurId" TEXT,
    "action" TEXT NOT NULL,
    "ressourceType" TEXT NOT NULL,
    "ressourceId" TEXT NOT NULL,
    "metadonnees" JSONB,
    "ip" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JournalAudit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE INDEX "Utilisateur_role_idx" ON "Utilisateur"("role");

-- CreateIndex
CREATE INDEX "Compte_utilisateurId_idx" ON "Compte"("utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "Compte_fournisseur_fournisseurCompteId_key" ON "Compte"("fournisseur", "fournisseurCompteId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_jetonSession_key" ON "Session"("jetonSession");

-- CreateIndex
CREATE INDEX "Session_utilisateurId_idx" ON "Session"("utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "JetonVerification_jeton_key" ON "JetonVerification"("jeton");

-- CreateIndex
CREATE UNIQUE INDEX "JetonVerification_identifiant_jeton_key" ON "JetonVerification"("identifiant", "jeton");

-- CreateIndex
CREATE UNIQUE INDEX "Etudiant_utilisateurId_key" ON "Etudiant"("utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "Etudiant_slug_key" ON "Etudiant"("slug");

-- CreateIndex
CREATE INDEX "Etudiant_universiteId_idx" ON "Etudiant"("universiteId");

-- CreateIndex
CREATE INDEX "Etudiant_scoreJub_idx" ON "Etudiant"("scoreJub");

-- CreateIndex
CREATE INDEX "Etudiant_estPublic_idx" ON "Etudiant"("estPublic");

-- CreateIndex
CREATE UNIQUE INDEX "Entreprise_utilisateurId_key" ON "Entreprise"("utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "Entreprise_slug_key" ON "Entreprise"("slug");

-- CreateIndex
CREATE INDEX "Entreprise_statutValidation_idx" ON "Entreprise"("statutValidation");

-- CreateIndex
CREATE UNIQUE INDEX "Mentor_utilisateurId_key" ON "Mentor"("utilisateurId");

-- CreateIndex
CREATE INDEX "Mentor_estVerifie_idx" ON "Mentor"("estVerifie");

-- CreateIndex
CREATE UNIQUE INDEX "Sponsor_utilisateurId_key" ON "Sponsor"("utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "Sponsor_slug_key" ON "Sponsor"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Universite_nom_key" ON "Universite"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Universite_acronyme_key" ON "Universite"("acronyme");

-- CreateIndex
CREATE UNIQUE INDEX "Departement_universiteId_nom_key" ON "Departement"("universiteId", "nom");

-- CreateIndex
CREATE UNIQUE INDEX "Competence_nom_key" ON "Competence"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Competence_slug_key" ON "Competence"("slug");

-- CreateIndex
CREATE INDEX "Competence_categorie_idx" ON "Competence"("categorie");

-- CreateIndex
CREATE UNIQUE INDEX "Projet_slug_key" ON "Projet"("slug");

-- CreateIndex
CREATE INDEX "Projet_statut_idx" ON "Projet"("statut");

-- CreateIndex
CREATE INDEX "Projet_categorie_niveau_idx" ON "Projet"("categorie", "niveau");

-- CreateIndex
CREATE INDEX "Projet_source_idx" ON "Projet"("source");

-- CreateIndex
CREATE INDEX "Projet_entrepriseId_idx" ON "Projet"("entrepriseId");

-- CreateIndex
CREATE INDEX "Candidature_statut_idx" ON "Candidature"("statut");

-- CreateIndex
CREATE INDEX "Candidature_etudiantId_idx" ON "Candidature"("etudiantId");

-- CreateIndex
CREATE UNIQUE INDEX "Candidature_projetId_etudiantId_key" ON "Candidature"("projetId", "etudiantId");

-- CreateIndex
CREATE UNIQUE INDEX "Equipe_projetId_key" ON "Equipe"("projetId");

-- CreateIndex
CREATE INDEX "Tache_projetId_statut_idx" ON "Tache"("projetId", "statut");

-- CreateIndex
CREATE INDEX "Livrable_projetId_statut_idx" ON "Livrable"("projetId", "statut");

-- CreateIndex
CREATE INDEX "Feedback_livrableId_idx" ON "Feedback"("livrableId");

-- CreateIndex
CREATE INDEX "Evaluation_etudiantId_idx" ON "Evaluation"("etudiantId");

-- CreateIndex
CREATE UNIQUE INDEX "Evaluation_projetId_etudiantId_source_evaluateurId_key" ON "Evaluation"("projetId", "etudiantId", "source", "evaluateurId");

-- CreateIndex
CREATE UNIQUE INDEX "Certificat_numeroPublic_key" ON "Certificat"("numeroPublic");

-- CreateIndex
CREATE INDEX "Certificat_etudiantId_idx" ON "Certificat"("etudiantId");

-- CreateIndex
CREATE INDEX "Certificat_statut_idx" ON "Certificat"("statut");

-- CreateIndex
CREATE INDEX "VerificationCertificat_certificatId_idx" ON "VerificationCertificat"("certificatId");

-- CreateIndex
CREATE UNIQUE INDEX "Badge_code_key" ON "Badge"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_etudiantId_key" ON "Portfolio"("etudiantId");

-- CreateIndex
CREATE UNIQUE INDEX "Programme_slug_key" ON "Programme"("slug");

-- CreateIndex
CREATE INDEX "Paiement_beneficiaireId_idx" ON "Paiement"("beneficiaireId");

-- CreateIndex
CREATE INDEX "Paiement_statut_idx" ON "Paiement"("statut");

-- CreateIndex
CREATE INDEX "Notification_destinataireId_lue_idx" ON "Notification"("destinataireId", "lue");

-- CreateIndex
CREATE INDEX "Message_destinataireId_lu_idx" ON "Message"("destinataireId", "lu");

-- CreateIndex
CREATE INDEX "Message_expediteurId_idx" ON "Message"("expediteurId");

-- CreateIndex
CREATE INDEX "Signalement_statut_idx" ON "Signalement"("statut");

-- CreateIndex
CREATE INDEX "Signalement_ressourceType_ressourceId_idx" ON "Signalement"("ressourceType", "ressourceId");

-- CreateIndex
CREATE INDEX "JournalAudit_action_idx" ON "JournalAudit"("action");

-- CreateIndex
CREATE INDEX "JournalAudit_ressourceType_ressourceId_idx" ON "JournalAudit"("ressourceType", "ressourceId");

-- CreateIndex
CREATE INDEX "JournalAudit_creeLe_idx" ON "JournalAudit"("creeLe");

-- AddForeignKey
ALTER TABLE "Compte" ADD CONSTRAINT "Compte_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etudiant" ADD CONSTRAINT "Etudiant_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etudiant" ADD CONSTRAINT "Etudiant_universiteId_fkey" FOREIGN KEY ("universiteId") REFERENCES "Universite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etudiant" ADD CONSTRAINT "Etudiant_departementId_fkey" FOREIGN KEY ("departementId") REFERENCES "Departement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entreprise" ADD CONSTRAINT "Entreprise_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentor" ADD CONSTRAINT "Mentor_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentor" ADD CONSTRAINT "Mentor_universiteId_fkey" FOREIGN KEY ("universiteId") REFERENCES "Universite"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sponsor" ADD CONSTRAINT "Sponsor_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departement" ADD CONSTRAINT "Departement_universiteId_fkey" FOREIGN KEY ("universiteId") REFERENCES "Universite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetenceEtudiant" ADD CONSTRAINT "CompetenceEtudiant_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "Etudiant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetenceEtudiant" ADD CONSTRAINT "CompetenceEtudiant_competenceId_fkey" FOREIGN KEY ("competenceId") REFERENCES "Competence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projet" ADD CONSTRAINT "Projet_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projet" ADD CONSTRAINT "Projet_mentorPrincipalId_fkey" FOREIGN KEY ("mentorPrincipalId") REFERENCES "Mentor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projet" ADD CONSTRAINT "Projet_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projet" ADD CONSTRAINT "Projet_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetenceProjet" ADD CONSTRAINT "CompetenceProjet_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetenceProjet" ADD CONSTRAINT "CompetenceProjet_competenceId_fkey" FOREIGN KEY ("competenceId") REFERENCES "Competence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidature" ADD CONSTRAINT "Candidature_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidature" ADD CONSTRAINT "Candidature_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "Etudiant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipe" ADD CONSTRAINT "Equipe_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembreEquipe" ADD CONSTRAINT "MembreEquipe_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "Equipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembreEquipe" ADD CONSTRAINT "MembreEquipe_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "Etudiant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tache" ADD CONSTRAINT "Tache_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tache" ADD CONSTRAINT "Tache_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "Etudiant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livrable" ADD CONSTRAINT "Livrable_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livrable" ADD CONSTRAINT "Livrable_tacheId_fkey" FOREIGN KEY ("tacheId") REFERENCES "Tache"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livrable" ADD CONSTRAINT "Livrable_deposeParId_fkey" FOREIGN KEY ("deposeParId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_livrableId_fkey" FOREIGN KEY ("livrableId") REFERENCES "Livrable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "Etudiant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_evaluateurId_fkey" FOREIGN KEY ("evaluateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificat" ADD CONSTRAINT "Certificat_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "Etudiant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificat" ADD CONSTRAINT "Certificat_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationCertificat" ADD CONSTRAINT "VerificationCertificat_certificatId_fkey" FOREIGN KEY ("certificatId") REFERENCES "Certificat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeEtudiant" ADD CONSTRAINT "BadgeEtudiant_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "Etudiant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeEtudiant" ADD CONSTRAINT "BadgeEtudiant_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "Etudiant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommandation" ADD CONSTRAINT "Recommandation_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "Etudiant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommandation" ADD CONSTRAINT "Recommandation_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Programme" ADD CONSTRAINT "Programme_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_expediteurId_fkey" FOREIGN KEY ("expediteurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signalement" ADD CONSTRAINT "Signalement_rapporteurId_fkey" FOREIGN KEY ("rapporteurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalAudit" ADD CONSTRAINT "JournalAudit_acteurId_fkey" FOREIGN KEY ("acteurId") REFERENCES "Utilisateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;
