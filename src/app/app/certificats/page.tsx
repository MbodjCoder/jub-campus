import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { formaterDate } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "Mes certificats" };

export default async function PageMesCertificats() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const etudiant = await prisma.etudiant.findUnique({
    where: { utilisateurId: session.user.id },
    include: {
      certificats: {
        include: { projet: true },
        orderBy: { emisLe: "desc" },
      },
    },
  });

  const certificats = etudiant?.certificats ?? [];

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Mes certificats</h1>
        <p className="text-texte-discret">{certificats.length} certificat(s) obtenu(s).</p>
      </header>

      {certificats.length === 0 ? (
        <Carte>
          <CorpsCarte className="text-center py-12 text-texte-discret">
            <p>Pas encore de certificat. Termine un projet pour en obtenir un.</p>
          </CorpsCarte>
        </Carte>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {certificats.map((c) => (
            <Link key={c.id} href={`/v/${c.numeroPublic}`} className="block">
              <Carte className="transition-all hover:border-jub-vert-500 hover:shadow-md">
                <CorpsCarte className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Insigne ton={c.statut === "VALIDE" ? "vert" : "rouge"}>{c.statut}</Insigne>
                    <span className="font-mono text-xs text-texte-discret">{c.numeroPublic}</span>
                  </div>
                  <p className="font-medium">{c.projet.titre}</p>
                  <p className="text-xs text-texte-discret">
                    Score {c.scoreFinal.toFixed(1)}/10 · Émis {formaterDate(c.emisLe)}
                  </p>
                </CorpsCarte>
              </Carte>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
