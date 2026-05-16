import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { trierProjetsPourEtudiant } from "@/domaine/matching";
import {
  LIBELLES_CATEGORIE,
  LIBELLES_NIVEAU_PROJET,
  LIBELLES_MODE_REMUNERATION,
  COULEURS_MODE_REMUNERATION,
} from "@/lib/constantes";
import { formaterDureeJours, formaterMontantFcfa } from "@/lib/utils";

export const metadata = { title: "Projets recommandés" };
export const dynamic = "force-dynamic";

export default async function PageProjetsRecommandes() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const etudiant = await prisma.etudiant.findUnique({
    where: { utilisateurId: session.user.id },
    include: { competences: { include: { competence: true } } },
  });
  if (!etudiant) redirect("/app/profil");

  const projetsCandidatables = await prisma.projet.findMany({
    where: {
      statut: { in: ["PUBLIE", "CANDIDATURES_OUVERTES", "EQUIPE_EN_CONSTITUTION"] },
      visibilite: { in: ["PUBLIQUE", "UNIVERSITE"] },
    },
    include: {
      competencesRequises: { include: { competence: true } },
      entreprise: { select: { raisonSociale: true } },
    },
    take: 50,
  });

  const ranked = trierProjetsPourEtudiant(etudiant, projetsCandidatables).slice(0, 10);

  return (
    <>
      <header className="mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-jub-orange-500" />
          <h1 className="text-2xl font-bold tracking-tight">Projets recommandés pour toi</h1>
        </div>
        <p className="text-texte-discret">
          Classement déterministe basé sur tes compétences, ton niveau, ta disponibilité et ton score JUB.
        </p>
      </header>

      {ranked.length === 0 ? (
        <Carte>
          <CorpsCarte className="text-center py-12 text-sm text-texte-discret">
            Pas encore de projet ouvert. Reviens dans quelques jours.
          </CorpsCarte>
        </Carte>
      ) : (
        <div className="space-y-3">
          {ranked.map(({ projet, score }) => (
            <Link key={projet.id} href={`/projets/${projet.slug}`} className="block group">
              <Carte className="transition-all group-hover:border-jub-orange-400 group-hover:shadow-md">
                <CorpsCarte className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="font-medium truncate">{projet.titre}</p>
                    <p className="text-xs text-texte-discret">
                      {projet.entreprise?.raisonSociale ?? "JUB Campus"} ·{" "}
                      {LIBELLES_CATEGORIE[projet.categorie]} ·{" "}
                      {LIBELLES_NIVEAU_PROJET[projet.niveau]} ·{" "}
                      {formaterDureeJours(projet.dureeJours)}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${COULEURS_MODE_REMUNERATION[projet.modeRemuneration]}`}>
                        {LIBELLES_MODE_REMUNERATION[projet.modeRemuneration]}
                      </span>
                      {projet.montantFcfa ? (
                        <span className="text-xs font-medium text-texte">{formaterMontantFcfa(projet.montantFcfa)}</span>
                      ) : null}
                    </div>
                  </div>
                  <PastilleScore score={score} />
                </CorpsCarte>
              </Carte>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

function PastilleScore({ score }: { score: number }) {
  const ton =
    score >= 80 ? "bg-jub-orange-500 text-jub-sage-950" :
    score >= 60 ? "bg-jub-sage-500 text-jub-orange-500" :
    "bg-jub-sage-200 text-jub-sage-900";
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl px-3 py-2 shadow-sm ${ton}`}>
      <span className="font-mono text-xl font-bold leading-none">{score}</span>
      <span className="text-[9px] uppercase tracking-wider opacity-80">match</span>
    </div>
  );
}
