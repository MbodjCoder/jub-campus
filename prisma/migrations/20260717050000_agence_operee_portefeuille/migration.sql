-- CreateEnum
CREATE TYPE "TypeMission" AS ENUM ('ENQUETE_TERRAIN', 'ANNOTATION', 'ETUDE', 'REDACTION', 'AUTRE');

-- CreateEnum
CREATE TYPE "StatutBrief" AS ENUM ('RECU', 'EN_QUALIFICATION', 'DEVIS_ENVOYE', 'ACCEPTE', 'PERDU');

-- CreateEnum
CREATE TYPE "TypeTransaction" AS ENUM ('GAIN_TACHE', 'RETRAIT', 'AJUSTEMENT', 'BONUS');

-- CreateEnum
CREATE TYPE "StatutRetrait" AS ENUM ('DEMANDE', 'EN_COURS', 'PAYE', 'ECHEC', 'ANNULE');

-- AlterTable
ALTER TABLE "Projet" ADD COLUMN     "montantClientFcfa" INTEGER,
ADD COLUMN     "enveloppeTalentsFcfa" INTEGER,
ADD COLUMN     "chefMissionId" TEXT;

-- AlterTable
ALTER TABLE "Tache" ADD COLUMN     "montantFcfa" INTEGER,
ADD COLUMN     "crediteeLe" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Brief" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "typeMission" "TypeMission" NOT NULL,
    "titre" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "budgetIndicatifFcfa" INTEGER,
    "statut" "StatutBrief" NOT NULL DEFAULT 'RECU',
    "devisUrl" TEXT,
    "motifPerte" TEXT,
    "projetId" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brief_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Portefeuille" (
    "id" TEXT NOT NULL,
    "etudiantId" TEXT NOT NULL,
    "soldeFcfa" INTEGER NOT NULL DEFAULT 0,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Portefeuille_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionPortefeuille" (
    "id" TEXT NOT NULL,
    "portefeuilleId" TEXT NOT NULL,
    "montantFcfa" INTEGER NOT NULL,
    "type" "TypeTransaction" NOT NULL,
    "libelle" TEXT NOT NULL,
    "tacheId" TEXT,
    "retraitId" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionPortefeuille_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Retrait" (
    "id" TEXT NOT NULL,
    "etudiantId" TEXT NOT NULL,
    "montantFcfa" INTEGER NOT NULL,
    "methode" "MethodePaiement" NOT NULL,
    "numeroTelephone" TEXT NOT NULL,
    "statut" "StatutRetrait" NOT NULL DEFAULT 'DEMANDE',
    "cleIdempotence" TEXT NOT NULL,
    "referenceExterne" TEXT,
    "motifEchec" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finaliseLe" TIMESTAMP(3),

    CONSTRAINT "Retrait_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Brief_projetId_key" ON "Brief"("projetId");

-- CreateIndex
CREATE INDEX "Brief_statut_idx" ON "Brief"("statut");

-- CreateIndex
CREATE INDEX "Brief_clientId_idx" ON "Brief"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Portefeuille_etudiantId_key" ON "Portefeuille"("etudiantId");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionPortefeuille_portefeuilleId_tacheId_key" ON "TransactionPortefeuille"("portefeuilleId", "tacheId");

-- CreateIndex
CREATE INDEX "TransactionPortefeuille_portefeuilleId_creeLe_idx" ON "TransactionPortefeuille"("portefeuilleId", "creeLe");

-- CreateIndex
CREATE UNIQUE INDEX "Retrait_cleIdempotence_key" ON "Retrait"("cleIdempotence");

-- CreateIndex
CREATE INDEX "Retrait_etudiantId_idx" ON "Retrait"("etudiantId");

-- CreateIndex
CREATE INDEX "Retrait_statut_idx" ON "Retrait"("statut");

-- AddForeignKey
ALTER TABLE "Brief" ADD CONSTRAINT "Brief_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Entreprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brief" ADD CONSTRAINT "Brief_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portefeuille" ADD CONSTRAINT "Portefeuille_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "Etudiant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionPortefeuille" ADD CONSTRAINT "TransactionPortefeuille_portefeuilleId_fkey" FOREIGN KEY ("portefeuilleId") REFERENCES "Portefeuille"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionPortefeuille" ADD CONSTRAINT "TransactionPortefeuille_tacheId_fkey" FOREIGN KEY ("tacheId") REFERENCES "Tache"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionPortefeuille" ADD CONSTRAINT "TransactionPortefeuille_retraitId_fkey" FOREIGN KEY ("retraitId") REFERENCES "Retrait"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Retrait" ADD CONSTRAINT "Retrait_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "Etudiant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
