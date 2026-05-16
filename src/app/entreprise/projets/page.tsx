import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { Bouton } from "@/composants/ui/bouton";
import { LIBELLES_STATUT_PROJET, LIBELLES_CATEGORIE, LIBELLES_NIVEAU_PROJET } from "@/lib/constantes";
import { formaterDate, formaterDureeJours } from "@/lib/utils";

export const metadata = { title: "Mes projets" };
export const dynamic = "force-dynamic";

export default async function PageEntrepriseProjets() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion?suivant=/entreprise/projets");

  const entreprise = await prisma.entreprise.findUnique({
    where: { utilisateurId: session.user.id },
    include: {
      projetsPublies: {
        orderBy: { creeLe: "desc" },
        include: { candidatures: true },
      },
    },
  });
  if (!entreprise) return <p>Profil introuvable.</p>;

  return (
    <>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mes projets</h1>
          <p className="text-sm text-texte-discret">{entreprise.projetsPublies.length} projet{entreprise.projetsPublies.length > 1 ? "s" : ""}.</p>
        </div>
        <Link href="/entreprise/publier">
          <Bouton apparence="accent"><Plus className="h-4 w-4" /> Nouveau projet</Bouton>
        </Link>
      </header>

      {entreprise.projetsPublies.length === 0 ? (
        <Carte>
          <CorpsCarte className="py-12 text-center text-sm text-texte-discret">
            Aucun projet publié.
          </CorpsCarte>
        </Carte>
      ) : (
        <div className="space-y-3">
          {entreprise.projetsPublies.map((p) => (
            <Carte key={p.id}>
              <CorpsCarte className="space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <Link href={`/projets/${p.slug}`} className="font-medium hover:text-jub-orange-600 hover:underline">
                    {p.titre}
                  </Link>
                  <Insigne ton={
                    p.statut === "EN_COURS" || p.statut === "CERTIFIE" ? "vert" :
                    p.statut === "EN_VALIDATION" ? "orange" :
                    p.statut === "BROUILLON" ? "neutre" : "sage"
                  }>
                    {LIBELLES_STATUT_PROJET[p.statut]}
                  </Insigne>
                </div>
                <p className="text-xs text-texte-discret">
                  {LIBELLES_CATEGORIE[p.categorie]} · {LIBELLES_NIVEAU_PROJET[p.niveau]} ·{" "}
                  {formaterDureeJours(p.dureeJours)} · {p.placesMax} place{p.placesMax > 1 ? "s" : ""} ·{" "}
                  créé {formaterDate(p.creeLe)}
                </p>
                <div className="text-xs text-texte-discret">
                  {p.candidatures.length} candidature{p.candidatures.length > 1 ? "s" : ""} ·{" "}
                  {p.candidatures.filter((c) => c.statut === "ACCEPTEE").length} acceptée{p.candidatures.filter((c) => c.statut === "ACCEPTEE").length > 1 ? "s" : ""}
                </div>
              </CorpsCarte>
            </Carte>
          ))}
        </div>
      )}
    </>
  );
}
