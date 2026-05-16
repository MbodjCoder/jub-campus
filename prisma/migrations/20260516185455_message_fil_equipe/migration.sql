-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_destinataireId_fkey";

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "destinataireId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Message_projetId_creeLe_idx" ON "Message"("projetId", "creeLe");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES "Utilisateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;
