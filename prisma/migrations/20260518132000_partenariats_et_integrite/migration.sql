-- AlterEnum
ALTER TYPE "TypeNotification" ADD VALUE 'DEMANDE_PARTENARIAT_RECUE';
ALTER TYPE "TypeNotification" ADD VALUE 'DEMANDE_PARTENARIAT_ACCEPTEE';
ALTER TYPE "TypeNotification" ADD VALUE 'DEMANDE_PARTENARIAT_REFUSEE';

-- CreateEnum
CREATE TYPE "TypePartenariat" AS ENUM ('FINANCEMENT', 'CO_REALISATION', 'RECRUTEMENT', 'MENTORAT', 'DIFFUSION');

-- CreateEnum
CREATE TYPE "StatutPartenariat" AS ENUM ('EN_ATTENTE', 'ACCEPTEE', 'REFUSEE', 'ANNULEE');

-- CreateTable
CREATE TABLE "DemandePartenariat" (
    "id" TEXT NOT NULL,
    "projetId" TEXT NOT NULL,
    "entrepriseId" TEXT NOT NULL,
    "typeContribution" "TypePartenariat" NOT NULL,
    "message" TEXT NOT NULL,
    "statut" "StatutPartenariat" NOT NULL DEFAULT 'EN_ATTENTE',
    "reponse" TEXT,
    "reponduLe" TIMESTAMP(3),
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemandePartenariat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartenaireProjet" (
    "projetId" TEXT NOT NULL,
    "entrepriseId" TEXT NOT NULL,
    "typeContribution" "TypePartenariat" NOT NULL,
    "accepteLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartenaireProjet_pkey" PRIMARY KEY ("projetId","entrepriseId")
);

-- CreateIndex
CREATE UNIQUE INDEX "DemandePartenariat_projetId_entrepriseId_key" ON "DemandePartenariat"("projetId", "entrepriseId");

-- CreateIndex
CREATE INDEX "DemandePartenariat_statut_idx" ON "DemandePartenariat"("statut");

-- CreateIndex
CREATE INDEX "DemandePartenariat_entrepriseId_idx" ON "DemandePartenariat"("entrepriseId");

-- CreateIndex
CREATE INDEX "PartenaireProjet_entrepriseId_idx" ON "PartenaireProjet"("entrepriseId");

-- CreateIndex
CREATE INDEX "Projet_mentorPrincipalId_idx" ON "Projet"("mentorPrincipalId");

-- CreateIndex
CREATE INDEX "Projet_publieParId_idx" ON "Projet"("publieParId");

-- AlterTable
ALTER TABLE "Projet" ADD COLUMN "universiteId" TEXT;

-- CreateIndex
CREATE INDEX "Projet_universiteId_idx" ON "Projet"("universiteId");

-- CreateIndex
CREATE INDEX "MembreEquipe_etudiantId_idx" ON "MembreEquipe"("etudiantId");

-- CreateIndex
CREATE INDEX "Evaluation_evaluateurId_idx" ON "Evaluation"("evaluateurId");

-- AddForeignKey
ALTER TABLE "Projet" ADD CONSTRAINT "Projet_publieParId_fkey" FOREIGN KEY ("publieParId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projet" ADD CONSTRAINT "Projet_universiteId_fkey" FOREIGN KEY ("universiteId") REFERENCES "Universite"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandePartenariat" ADD CONSTRAINT "DemandePartenariat_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandePartenariat" ADD CONSTRAINT "DemandePartenariat_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartenaireProjet" ADD CONSTRAINT "PartenaireProjet_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartenaireProjet" ADD CONSTRAINT "PartenaireProjet_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
