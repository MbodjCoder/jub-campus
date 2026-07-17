// Ops — file de contrôle qualité : tous les livrables en revue.

import { prisma } from "@/lib/prisma";
import { formaterDate } from "@/lib/utils";
import { FileQC } from "@/composants/admin/file-qc";

export const metadata = { title: "Contrôle qualité" };
export const dynamic = "force-dynamic";

export default async function PageQC() {
  const livrables = await prisma.livrable.findMany({
    where: { statut: "EN_REVUE" },
    orderBy: { deposeLe: "asc" },
    take: 100,
    select: {
      id: true, titre: true, fichierUrl: true, deposeLe: true,
      deposePar: { select: { nomComplet: true, email: true } },
      projet: { select: { titre: true } },
      tache: { select: { montantFcfa: true, crediteeLe: true } },
    },
  });

  const pourClient = livrables.map((l) => ({
    id: l.id,
    titre: l.titre,
    fichierUrl: l.fichierUrl,
    deposeLe: formaterDate(l.deposeLe),
    auteur: l.deposePar.nomComplet ?? l.deposePar.email ?? "Inconnu",
    mission: l.projet.titre,
    gainFcfa: l.tache && !l.tache.crediteeLe ? l.tache.montantFcfa : null,
  }));

  return (
    <div className="fadein mx-auto max-w-[900px]">
      <h1 className="m-0 text-2xl font-semibold tracking-tight">Contrôle qualité</h1>
      <p className="t-small mt-1 mb-6">
        {pourClient.length} livrable{pourClient.length > 1 ? "s" : ""} en attente de revue.
        Valider un livrable lié à une tâche payée crédite automatiquement le talent.
      </p>
      <FileQC livrables={pourClient} />
    </div>
  );
}
