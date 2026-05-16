import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import Link from "next/link";

export const metadata = { title: "Mes projets" };

export default async function PageMesProjets() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const etudiant = await prisma.etudiant.findUnique({
    where: { utilisateurId: session.user.id },
    include: {
      membreEquipes: {
        include: { equipe: { include: { projet: true } } },
        orderBy: { rejointLe: "desc" },
      },
    },
  });

  const equipes = etudiant?.membreEquipes ?? [];

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Mes projets</h1>
        <p className="text-texte-discret">{equipes.length} projet(s) en cours ou terminé(s).</p>
      </header>

      {equipes.length === 0 ? (
        <Carte>
          <CorpsCarte className="text-center py-12 text-texte-discret">
            <p>Tu n&apos;as pas encore rejoint d&apos;équipe.</p>
            <Link href="/projets" className="mt-3 inline-block font-medium text-jub-vert-700 hover:underline">
              Postuler à un projet →
            </Link>
          </CorpsCarte>
        </Carte>
      ) : (
        <div className="space-y-3">
          {equipes.map((m) => (
            <Carte key={m.equipeId}>
              <CorpsCarte className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{m.equipe.projet.titre}</p>
                  <p className="text-xs text-texte-discret">{m.roleEquipe}</p>
                </div>
                <Insigne ton={m.equipe.projet.statut === "TERMINE" || m.equipe.projet.statut === "CERTIFIE" ? "vert" : "bleu"}>
                  {m.equipe.projet.statut.replace(/_/g, " ")}
                </Insigne>
              </CorpsCarte>
            </Carte>
          ))}
        </div>
      )}
    </>
  );
}
