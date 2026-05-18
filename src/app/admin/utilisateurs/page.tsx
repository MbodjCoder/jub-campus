import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { formaterDate } from "@/lib/utils";

export const metadata = { title: "Admin · Utilisateurs" };
export const dynamic = "force-dynamic";

export default async function PageAdminUtilisateurs() {
  const utilisateurs = await prisma.utilisateur.findMany({
    orderBy: { creeLe: "desc" },
    take: 100,
    include: { etudiant: true, entreprise: true, mentor: true },
  });

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Utilisateurs</h1>
        <p className="text-texte-discret">{utilisateurs.length} dernier{utilisateurs.length > 1 ? "s" : ""}.</p>
      </header>

      <Carte>
        <CorpsCarte className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-jub-pierre-100 text-left text-xs uppercase tracking-wider text-texte-discret">
              <tr>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Nom</th>
                <th className="px-4 py-2">Rôle</th>
                <th className="px-4 py-2">Inscrit le</th>
                <th className="px-4 py-2">Dernière connexion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bordure">
              {utilisateurs.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-2 font-mono text-xs">{u.email}</td>
                  <td className="px-4 py-2">{u.nomComplet ?? "—"}</td>
                  <td className="px-4 py-2"><Insigne ton="sage">{u.role}</Insigne></td>
                  <td className="px-4 py-2 text-xs text-texte-discret">{formaterDate(u.creeLe)}</td>
                  <td className="px-4 py-2 text-xs text-texte-discret">{u.derniereConnexionLe ? formaterDate(u.derniereConnexionLe) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CorpsCarte>
      </Carte>
    </>
  );
}
