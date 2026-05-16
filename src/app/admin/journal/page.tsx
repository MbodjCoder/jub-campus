import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { formaterDate } from "@/lib/utils";

export const metadata = { title: "Admin · Journal d'audit" };
export const dynamic = "force-dynamic";

export default async function PageAdminJournal() {
  const journal = await prisma.journalAudit.findMany({
    orderBy: { creeLe: "desc" },
    take: 200,
    include: { acteur: { select: { email: true, nomComplet: true } } },
  });

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Journal d&apos;audit</h1>
        <p className="text-texte-discret">{journal.length} dernière{journal.length > 1 ? "s" : ""} entrée{journal.length > 1 ? "s" : ""}.</p>
      </header>

      <Carte>
        <CorpsCarte className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-jub-pierre-100 text-left text-xs uppercase tracking-wider text-texte-discret">
              <tr>
                <th className="px-4 py-2">Action</th>
                <th className="px-4 py-2">Ressource</th>
                <th className="px-4 py-2">Acteur</th>
                <th className="px-4 py-2">Quand</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bordure">
              {journal.map((j) => (
                <tr key={j.id}>
                  <td className="px-4 py-2"><Insigne ton="sage">{j.action}</Insigne></td>
                  <td className="px-4 py-2 font-mono text-xs">{j.ressourceType} · {j.ressourceId.slice(0, 12)}</td>
                  <td className="px-4 py-2 text-xs">{j.acteur?.nomComplet ?? j.acteur?.email ?? "système"}</td>
                  <td className="px-4 py-2 text-xs text-texte-discret">{formaterDate(j.creeLe)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CorpsCarte>
      </Carte>
    </>
  );
}
