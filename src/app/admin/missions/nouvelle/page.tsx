// Ops — création d'une mission (mode agence).

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Icon } from "@/composants/maquette/icones";
import { FormulaireMission } from "@/composants/admin/formulaire-mission";

export const metadata = { title: "Nouvelle mission" };
export const dynamic = "force-dynamic";

export default async function PageNouvelleMission() {
  const [clients, briefs] = await Promise.all([
    prisma.entreprise.findMany({
      where: { statutValidation: "VALIDEE" },
      orderBy: { raisonSociale: "asc" },
      select: { id: true, raisonSociale: true },
    }),
    prisma.brief.findMany({
      where: { statut: { in: ["RECU", "EN_QUALIFICATION", "DEVIS_ENVOYE"] } },
      orderBy: { creeLe: "desc" },
      select: { id: true, titre: true },
    }),
  ]);

  return (
    <div className="fadein mx-auto max-w-[720px]">
      <Link href="/admin/missions" className="t-small inline-flex items-center gap-1 font-medium text-sage-600 no-underline">
        <Icon.ArrowLeft size={14} /> Missions
      </Link>
      <h1 className="mb-1 mt-3 text-2xl font-semibold tracking-tight">Nouvelle mission</h1>
      <p className="t-small mt-0 mb-6">
        Le client paie le montant total ; l&apos;enveloppe talents est répartie sur les tâches.
      </p>
      <FormulaireMission clients={clients} briefs={briefs} />
    </div>
  );
}
