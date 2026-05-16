import Link from "next/link";
import { redirect } from "next/navigation";
import { Paperclip } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { formaterDate } from "@/lib/utils";

export const metadata = { title: "Livrables à corriger" };
export const dynamic = "force-dynamic";

export default async function PageMentorCorrections() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion?suivant=/mentor/corrections");

  const mentor = await prisma.mentor.findUnique({
    where: { utilisateurId: session.user.id },
    select: { id: true },
  });
  if (!mentor) return <p>Profil introuvable.</p>;

  const livrables = await prisma.livrable.findMany({
    where: {
      projet: { mentorPrincipalId: mentor.id },
      statut: "EN_REVUE",
    },
    orderBy: { deposeLe: "asc" },
    include: {
      projet: { select: { id: true, titre: true } },
      deposePar: { select: { nomComplet: true } },
    },
  });

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Livrables à corriger</h1>
        <p className="text-sm text-texte-discret">{livrables.length} en attente de revue.</p>
      </header>

      {livrables.length === 0 ? (
        <Carte><CorpsCarte className="py-12 text-center text-sm text-texte-discret">Aucun livrable en attente. Tu es à jour 👏</CorpsCarte></Carte>
      ) : (
        <div className="space-y-3">
          {livrables.map((l) => (
            <Link key={l.id} href={`/app/projet/${l.projet.id}`} className="block group">
              <Carte className="transition-all group-hover:border-jub-orange-400 group-hover:shadow-md">
                <CorpsCarte className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-jub-sage-100 text-jub-sage-700">
                      <Paperclip className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-medium">{l.titre}</p>
                      <p className="text-xs text-texte-discret">
                        {l.projet.titre} · par {l.deposePar.nomComplet ?? "—"} · {formaterDate(l.deposeLe)}
                      </p>
                    </div>
                  </div>
                  <Insigne ton="orange">EN REVUE</Insigne>
                </CorpsCarte>
              </Carte>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
