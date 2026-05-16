import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { LIBELLES_NIVEAU_ETUDE } from "@/lib/constantes";

export const metadata = { title: "Talents recommandés" };
export const dynamic = "force-dynamic";

export default async function PageEntrepriseTalents() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion?suivant=/entreprise/talents");

  // Top 20 étudiants par scoreJub, visibles publiquement.
  const talents = await prisma.etudiant.findMany({
    where: { estPublic: true },
    orderBy: { scoreJub: "desc" },
    take: 20,
    include: {
      universite: true,
      certificats: { where: { statut: "VALIDE" }, select: { id: true } },
      competences: {
        take: 4,
        include: { competence: { select: { nom: true } } },
      },
    },
  });

  return (
    <>
      <header className="mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-jub-orange-500" />
          <h1 className="text-2xl font-bold tracking-tight">Talents recommandés</h1>
        </div>
        <p className="text-sm text-texte-discret">Top 20 étudiants par score JUB. Le matching IA arrive en V1.4.</p>
      </header>

      {talents.length === 0 ? (
        <Carte>
          <CorpsCarte className="py-12 text-center text-sm text-texte-discret">
            Pas encore de talent à recommander. Reviens dans quelques jours.
          </CorpsCarte>
        </Carte>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {talents.map((e) => (
            <Link key={e.id} href={`/u/${e.slug}`} className="block group">
              <Carte className="h-full transition-all group-hover:border-jub-orange-400 group-hover:shadow-md">
                <CorpsCarte className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{e.prenom} {e.nom}</p>
                      <p className="text-xs text-texte-discret">
                        {LIBELLES_NIVEAU_ETUDE[e.niveau]} · {e.universite.acronyme}
                      </p>
                    </div>
                    <span className="rounded-full bg-jub-sage-500 px-2.5 py-1 font-mono text-xs font-bold text-jub-orange-500">
                      {e.scoreJub}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {e.competences.map((c) => (
                      <Insigne key={c.competenceId} ton="sage">{c.competence.nom}</Insigne>
                    ))}
                  </div>
                  <p className="text-xs text-texte-discret">
                    {e.certificats.length} certificat{e.certificats.length > 1 ? "s" : ""} vérifié{e.certificats.length > 1 ? "s" : ""}
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
