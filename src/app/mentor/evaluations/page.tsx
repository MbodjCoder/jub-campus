import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { formaterDate } from "@/lib/utils";

export const metadata = { title: "Évaluations" };
export const dynamic = "force-dynamic";

export default async function PageMentorEvaluations() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion?suivant=/mentor/evaluations");

  const mentor = await prisma.mentor.findUnique({
    where: { utilisateurId: session.user.id },
    select: { id: true },
  });
  if (!mentor) return <p>Profil introuvable.</p>;

  const evaluations = await prisma.evaluation.findMany({
    where: {
      evaluateurId: session.user.id,
      projet: { mentorPrincipalId: mentor.id },
    },
    orderBy: { creeLe: "desc" },
    take: 50,
    include: {
      etudiant: true,
      projet: { select: { id: true, titre: true } },
    },
  });

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Mes évaluations</h1>
        <p className="text-sm text-texte-discret">{evaluations.length} évaluation{evaluations.length > 1 ? "s" : ""} soumise{evaluations.length > 1 ? "s" : ""}.</p>
      </header>

      {evaluations.length === 0 ? (
        <Carte><CorpsCarte className="py-12 text-center text-sm text-texte-discret">Aucune évaluation soumise pour l&apos;instant.</CorpsCarte></Carte>
      ) : (
        <div className="space-y-3">
          {evaluations.map((e) => (
            <Link key={e.id} href={`/app/projet/${e.projet.id}`} className="block group">
              <Carte className="transition-all group-hover:border-jub-orange-400 group-hover:shadow-md">
                <CorpsCarte className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{e.etudiant.prenom} {e.etudiant.nom}</p>
                    <p className="text-xs text-texte-discret">{e.projet.titre} · {formaterDate(e.creeLe)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Insigne ton="sage">{e.source}</Insigne>
                    <span className="font-mono text-base font-bold text-jub-orange-600">{e.scoreGlobal.toFixed(1)}/10</span>
                  </div>
                </CorpsCarte>
              </Carte>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
