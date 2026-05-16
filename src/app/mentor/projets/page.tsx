import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { LIBELLES_STATUT_PROJET } from "@/lib/constantes";

export const metadata = { title: "Projets encadrés" };
export const dynamic = "force-dynamic";

export default async function PageMentorProjets() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion?suivant=/mentor/projets");

  const mentor = await prisma.mentor.findUnique({
    where: { utilisateurId: session.user.id },
    include: {
      projetsEncadres: {
        include: { equipe: { include: { membres: true } } },
        orderBy: { creeLe: "desc" },
      },
    },
  });
  if (!mentor) return <p>Profil introuvable.</p>;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Projets encadrés</h1>
        <p className="text-sm text-texte-discret">{mentor.projetsEncadres.length} projet{mentor.projetsEncadres.length > 1 ? "s" : ""}.</p>
      </header>

      {mentor.projetsEncadres.length === 0 ? (
        <Carte><CorpsCarte className="py-12 text-center text-sm text-texte-discret">Pas encore de projet encadré.</CorpsCarte></Carte>
      ) : (
        <div className="space-y-3">
          {mentor.projetsEncadres.map((p) => (
            <Link key={p.id} href={`/app/projet/${p.id}`} className="block group">
              <Carte className="transition-all group-hover:border-jub-orange-400 group-hover:shadow-md">
                <CorpsCarte className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{p.titre}</p>
                    <p className="text-xs text-texte-discret">
                      Équipe de {p.equipe?.membres.length ?? 0}
                    </p>
                  </div>
                  <Insigne ton="sage">{LIBELLES_STATUT_PROJET[p.statut]}</Insigne>
                </CorpsCarte>
              </Carte>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
