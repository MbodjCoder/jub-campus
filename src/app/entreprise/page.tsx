import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, FolderKanban, Inbox, FileCheck, Users } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { Bouton } from "@/composants/ui/bouton";
import { LIBELLES_STATUT_PROJET } from "@/lib/constantes";
import { formaterDate } from "@/lib/utils";

export const metadata = { title: "Espace entreprise" };
export const dynamic = "force-dynamic";

export default async function TableauEntreprise() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion?suivant=/entreprise");

  const entreprise = await prisma.entreprise.findUnique({
    where: { utilisateurId: session.user.id },
    include: {
      projetsPublies: {
        include: {
          candidatures: { select: { id: true, statut: true } },
          livrables: { select: { id: true, statut: true } },
        },
        orderBy: { creeLe: "desc" },
      },
    },
  });

  if (!entreprise) {
    return (
      <div className="py-12 text-center">
        <p className="text-texte-discret">Profil entreprise introuvable.</p>
      </div>
    );
  }

  const nbProjets = entreprise.projetsPublies.length;
  const nbProjetsActifs = entreprise.projetsPublies.filter((p) =>
    ["EN_COURS", "PUBLIE", "CANDIDATURES_OUVERTES", "EQUIPE_EN_CONSTITUTION"].includes(p.statut),
  ).length;
  const nbCandidaturesEnAttente = entreprise.projetsPublies.reduce(
    (s, p) => s + p.candidatures.filter((c) => c.statut === "EN_ATTENTE").length,
    0,
  );
  const nbLivrablesAValider = entreprise.projetsPublies.reduce(
    (s, p) => s + p.livrables.filter((l) => l.statut === "EN_REVUE").length,
    0,
  );

  return (
    <>
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bienvenue, {entreprise.raisonSociale}</h1>
          <p className="text-sm text-texte-discret">
            Compte{" "}
            <Insigne ton={
              entreprise.statutValidation === "VALIDEE" ? "vert" :
              entreprise.statutValidation === "REJETEE" ? "rouge" : "orange"
            }>{entreprise.statutValidation}</Insigne>
          </p>
        </div>
        {entreprise.statutValidation === "VALIDEE" ? (
          <Link href="/entreprise/publier">
            <Bouton apparence="accent"><Plus className="h-4 w-4" /> Publier un projet</Bouton>
          </Link>
        ) : null}
      </header>

      {entreprise.statutValidation === "EN_ATTENTE" ? (
        <Carte className="mb-8 border-jub-orange-300 bg-jub-orange-50/60">
          <CorpsCarte className="text-sm">
            <p className="font-medium">Ton compte est en attente de validation.</p>
            <p className="mt-1 text-texte-discret">
              L&apos;équipe JUB Campus vérifie ton NINEA et ton email pro sous 48h ouvrées.
              Tu pourras publier des projets dès que ton compte sera validé.
            </p>
          </CorpsCarte>
        </Carte>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-4">
        <Stat icone={FolderKanban} libelle="Projets actifs" valeur={nbProjetsActifs} />
        <Stat icone={Inbox} libelle="Candidatures à traiter" valeur={nbCandidaturesEnAttente} />
        <Stat icone={FileCheck} libelle="Livrables à valider" valeur={nbLivrablesAValider} />
        <Stat icone={Users} libelle="Projets publiés" valeur={nbProjets} />
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-texte-discret">Mes projets</h2>
        {entreprise.projetsPublies.length === 0 ? (
          <Carte>
            <CorpsCarte className="py-10 text-center text-sm text-texte-discret">
              Aucun projet publié pour l&apos;instant.
              {entreprise.statutValidation === "VALIDEE" ? (
                <Link href="/entreprise/publier" className="ml-1 text-jub-orange-600 hover:underline">
                  Publier le premier →
                </Link>
              ) : null}
            </CorpsCarte>
          </Carte>
        ) : (
          <div className="space-y-3">
            {entreprise.projetsPublies.slice(0, 8).map((p) => (
              <Carte key={p.id}>
                <CorpsCarte className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <Link href={`/projets/${p.slug}`} className="font-medium hover:text-jub-orange-600 hover:underline">
                      {p.titre}
                    </Link>
                    <p className="text-xs text-texte-discret">
                      {p.candidatures.length} candidature{p.candidatures.length > 1 ? "s" : ""} ·{" "}
                      {p.placesMax} place{p.placesMax > 1 ? "s" : ""} · créé le {formaterDate(p.creeLe)}
                    </p>
                  </div>
                  <Insigne ton={
                    p.statut === "EN_COURS" || p.statut === "CERTIFIE" ? "vert" :
                    p.statut === "EN_VALIDATION" ? "orange" :
                    p.statut === "BROUILLON" ? "neutre" : "sage"
                  }>
                    {LIBELLES_STATUT_PROJET[p.statut]}
                  </Insigne>
                </CorpsCarte>
              </Carte>
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
          <Icone className="h-3.5 w-3.5" />
          {libelle}
        </p>
        <p className="text-3xl font-bold">{valeur}</p>
      </CorpsCarte>
    </Carte>
  );
}
