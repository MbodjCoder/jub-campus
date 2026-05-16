-- CreateIndex
CREATE INDEX "Notification_destinataireId_creeLe_idx" ON "Notification"("destinataireId", "creeLe");

-- CreateIndex
CREATE INDEX "Projet_statut_visibilite_publieLe_idx" ON "Projet"("statut", "visibilite", "publieLe");
