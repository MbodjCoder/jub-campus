import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte, EnteteCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { Bouton } from "@/composants/ui/bouton";
import { Champ } from "@/composants/ui/champ";
import { deciderProjet } from "../actions";
import { LIBELLES_CATEGORIE, LIBELLES_NIVEAU_PROJET, LIBELLES_MODE_REMUNERATION, LIBELLES_STATUT_PROJET } from "@/lib/constantes";
import { formaterDate } from "@/lib/utils";

export const metadata = { title: "Admin · Projets" };
export const dynamic = "force-dynamic";

export default async function PageAdminProjets() {
  const projets = await prisma.projet.findMany({
    orderBy: [{ statut: "asc" }, { creeLe: "desc" }],
    take: 50,
    include: { entreprise: { select: { raisonSociale: true } } },
  });

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Projets</h1>
        <p className="text-texte-discret">{projets.length} dernier{projets.length > 1 ? "s" : ""} projet{projets.length > 1 ? "s" : ""}.</p>
      </header>

      <div className="space-y-3">
        {projets.length === 0 ? (
          <Carte><CorpsCarte className="text-center py-10 text-sm text-texte-discret">Aucun projet.</CorpsCarte></Carte>
        ) : projets.map((p) => (
          <Carte key={p.id}>
            <EnteteCarte className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <Link href={`/projets/${p.slug}`} className="font-medium hover:text-jub-orange-600 hover:underline">
                  {p.titre}
                </Link>
                <p className="text-xs text-texte-discret">
                  {p.entreprise?.raisonSociale ?? "JUB Campus"} · {LIBELLES_CATEGORIE[p.categorie]} · {LIBELLES_NIVEAU_PROJET[p.niveau]} · {LIBELLES_MODE_REMUNERATION[p.modeRemuneration]} · créé le {formaterDate(p.creeLe)}
                </p>
              </div>
              <Insigne ton={
                p.statut === "EN_VALIDATION" ? "orange" :
                p.statut === "PUBLIE" ? "vert" :
                p.statut === "BROUILLON" ? "neutre" : "sage"
              }>
                {LIBELLES_STATUT_PROJET[p.statut]}
              </Insigne>
            </EnteteCarte>
            {p.statut === "EN_VALIDATION" ? (
              <CorpsCarte className="space-y-3">
                <p className="text-sm italic text-texte-discret">« {p.resume} »</p>
                <form action={deciderProjet} className="flex flex-wrap items-center gap-2">
                  <input type="hidden" name="projetId" value={p.id} />
                  <Champ name="motifRejet" placeholder="Motif (si rejet)" className="max-w-xs" />
                  <Bouton apparence="primaire" type="submit" name="decision" value="PUBLIE">Publier</Bouton>
                  <Bouton apparence="danger" type="submit" name="decision" value="REJETE">Rejeter</Bouton>
                </form>
              </CorpsCarte>
            ) : null}
          </Carte>
        ))}
      </div>
    </>
  );
}
