import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { formaterDate } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "Mes candidatures" };

export default async function PageMesCandidatures() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const etudiant = await prisma.etudiant.findUnique({
    where: { utilisateurId: session.user.id },
    include: {
      candidatures: {
        include: { projet: { include: { entreprise: true } } },
        orderBy: { creeLe: "desc" },
      },
    },
  });

  const candidatures = etudiant?.candidatures ?? [];

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Mes candidatures</h1>
        <p className="text-texte-discret">{candidatures.length} candidature(s) déposée(s).</p>
      </header>

      {candidatures.length === 0 ? (
        <Carte>
          <CorpsCarte className="text-center py-12 text-texte-discret">
            <p>Aucune candidature pour le moment.</p>
            <Link href="/projets" className="mt-3 inline-block font-medium text-jub-vert-700 hover:underline">
              Parcourir les projets ouverts →
            </Link>
          </CorpsCarte>
        </Carte>
      ) : (
        <div className="space-y-3">
          {candidatures.map((c) => (
            <Carte key={c.id}>
              <CorpsCarte className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{c.projet.titre}</p>
                  <p className="text-xs text-texte-discret">
                    {c.projet.entreprise?.raisonSociale ?? "JUB Campus"} · postulé le {formaterDate(c.creeLe)}
                  </p>
                </div>
                <Insigne
                  ton={
                    c.statut === "ACCEPTEE" ? "vert" :
                    c.statut === "REFUSEE" ? "rouge" :
                    c.statut === "RETIREE" ? "neutre" : "jaune"
                  }
                >
                  {c.statut.replace("_", " ")}
                </Insigne>
              </CorpsCarte>
            </Carte>
          ))}
        </div>
      )}
    </>
  );
}
