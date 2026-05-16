import Link from "next/link";
import { redirect } from "next/navigation";
import { FolderKanban, Users, FileCheck, Star } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { LIBELLES_STATUT_PROJET } from "@/lib/constantes";

export const metadata = { title: "Espace mentor" };
export const dynamic = "force-dynamic";

export default async function TableauMentor() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion?suivant=/mentor");

  const mentor = await prisma.mentor.findUnique({
    where: { utilisateurId: session.user.id },
    include: {
      projetsEncadres: {
        include: {
          equipe: { include: { membres: true } },
          livrables: { select: { statut: true } },
          evaluations: { where: { evaluateurId: session.user.id }, select: { id: true } },
        },
      },
    },
  });
  if (!mentor) return <p>Profil mentor introuvable.</p>;

  const nbProjets = mentor.projetsEncadres.length;
  const nbEtudiants = mentor.projetsEncadres.reduce(
    (s, p) => s + (p.equipe?.membres.length ?? 0), 0,
  );
  const nbLivrablesACorr = mentor.projetsEncadres.reduce(
    (s, p) => s + p.livrables.filter((l) => l.statut === "EN_REVUE").length, 0,
  );
  const nbEvalFaites = mentor.projetsEncadres.reduce(
    (s, p) => s + p.evaluations.length, 0,
  );

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Bienvenue, {mentor.prenom}
        </h1>
        <p className="text-sm text-texte-discret">
          Compte{" "}
          <Insigne ton={mentor.estVerifie ? "vert" : "orange"}>
            {mentor.estVerifie ? "VÉRIFIÉ" : "EN VÉRIFICATION"}
          </Insigne>
        </p>
      </header>

      {!mentor.estVerifie ? (
        <Carte className="mb-8 border-jub-orange-300 bg-jub-orange-50/60">
          <CorpsCarte className="text-sm">
            <p className="font-medium">Ton compte mentor est en cours de vérification.</p>
            <p className="mt-1 text-texte-discret">
              L&apos;équipe JUB Campus contrôle ton email institutionnel et tes spécialités.
              Tu pourras encadrer des équipes dès la validation.
            </p>
          </CorpsCarte>
        </Carte>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-4">
        <Stat icone={FolderKanban} libelle="Projets encadrés" valeur={nbProjets} />
        <Stat icone={Users} libelle="Étudiants suivis" valeur={nbEtudiants} />
        <Stat icone={FileCheck} libelle="Livrables à corriger" valeur={nbLivrablesACorr} />
        <Stat icone={Star} libelle="Évaluations faites" valeur={nbEvalFaites} />
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-texte-discret">Mes projets encadrés</h2>
        {mentor.projetsEncadres.length === 0 ? (
          <Carte><CorpsCarte className="py-10 text-center text-sm text-texte-discret">Pas encore de projet encadré.</CorpsCarte></Carte>
        ) : (
          <div className="space-y-3">
            {mentor.projetsEncadres.map((p) => (
              <Link key={p.id} href={`/app/projet/${p.id}`} className="block group">
                <Carte className="transition-all group-hover:border-jub-orange-400 group-hover:shadow-md">
                  <CorpsCarte className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{p.titre}</p>
                      <p className="text-xs text-texte-discret">
                        Équipe de {p.equipe?.membres.length ?? 0} ·{" "}
                        {p.livrables.length} livrable{p.livrables.length > 1 ? "s" : ""}
                      </p>
                    </div>
                    <Insigne ton="sage">{LIBELLES_STATUT_PROJET[p.statut]}</Insigne>
                  </CorpsCarte>
                </Carte>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function Stat({ icone: Icone, libelle, valeur }: { icone: React.ComponentType<{ className?: string }>; libelle: string; valeur: number }) {
  return (
    <Carte>
      <CorpsCarte className="space-y-1">
        <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-texte-discret">
          <Icone className="h-3.5 w-3.5" /> {libelle}
        </p>
        <p className="text-3xl font-bold">{valeur}</p>
      </CorpsCarte>
    </Carte>
  );
}
