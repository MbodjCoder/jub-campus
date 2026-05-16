import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { LIBELLES_NIVEAU_ETUDE } from "@/lib/constantes";

export const metadata = { title: "Étudiants suivis" };
export const dynamic = "force-dynamic";

export default async function PageMentorEtudiants() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion?suivant=/mentor/etudiants");

  const mentor = await prisma.mentor.findUnique({
    where: { utilisateurId: session.user.id },
    select: { id: true },
  });
  if (!mentor) return <p>Profil introuvable.</p>;

  const etudiants = await prisma.etudiant.findMany({
    where: {
      membreEquipes: {
        some: { equipe: { projet: { mentorPrincipalId: mentor.id } } },
      },
    },
    include: { universite: true },
    distinct: ["id"],
  });

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Étudiants suivis</h1>
        <p className="text-sm text-texte-discret">{etudiants.length} étudiant{etudiants.length > 1 ? "s" : ""} dans tes équipes.</p>
      </header>

      {etudiants.length === 0 ? (
        <Carte><CorpsCarte className="py-12 text-center text-sm text-texte-discret">Aucun étudiant suivi.</CorpsCarte></Carte>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {etudiants.map((e) => (
            <Link key={e.id} href={`/u/${e.slug}`} className="block group">
              <Carte className="h-full transition-all group-hover:border-jub-orange-400 group-hover:shadow-md">
                <CorpsCarte className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{e.prenom} {e.nom}</p>
                    <p className="text-xs text-texte-discret">
                      {LIBELLES_NIVEAU_ETUDE[e.niveau]} · {e.universite.acronyme}
                    </p>
                  </div>
                  <Insigne ton="sage">Score {e.scoreJub}</Insigne>
                </CorpsCarte>
              </Carte>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
