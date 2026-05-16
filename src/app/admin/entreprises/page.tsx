import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { Bouton } from "@/composants/ui/bouton";
import { Champ } from "@/composants/ui/champ";
import { deciderEntreprise } from "../actions";
import { formaterDate } from "@/lib/utils";

export const metadata = { title: "Admin · Entreprises" };
export const dynamic = "force-dynamic";

export default async function PageAdminEntreprises() {
  const entreprises = await prisma.entreprise.findMany({
    orderBy: [{ statutValidation: "asc" }, { creeLe: "desc" }],
    include: { utilisateur: { select: { email: true } } },
  });

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Entreprises</h1>
        <p className="text-texte-discret">{entreprises.length} compte{entreprises.length > 1 ? "s" : ""} partenaire{entreprises.length > 1 ? "s" : ""}.</p>
      </header>

      <div className="space-y-3">
        {entreprises.length === 0 ? (
          <Carte><CorpsCarte className="text-center py-10 text-sm text-texte-discret">Aucune entreprise inscrite.</CorpsCarte></Carte>
        ) : entreprises.map((e) => (
          <Carte key={e.id}>
            <EnteteCarte className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <TitreCarte className="text-base">{e.raisonSociale}</TitreCarte>
                <p className="text-xs text-texte-discret">
                  {e.utilisateur.email} · {e.secteur} · {e.ville ?? "—"} · inscrit le {formaterDate(e.creeLe)}
                </p>
              </div>
              <Insigne ton={
                e.statutValidation === "VALIDEE" ? "vert" :
                e.statutValidation === "REJETEE" ? "rouge" : "orange"
              }>
                {e.statutValidation}
              </Insigne>
            </EnteteCarte>
            {e.statutValidation === "EN_ATTENTE" ? (
              <CorpsCarte className="space-y-3">
                <div className="text-sm text-texte-discret">
                  <p>NINEA : {e.ninea ?? "—"} · RCCM : {e.rccm ?? "—"}</p>
                  {e.description ? <p className="mt-2 italic">« {e.description} »</p> : null}
                </div>
                <form action={deciderEntreprise} className="flex flex-wrap items-center gap-2">
                  <input type="hidden" name="entrepriseId" value={e.id} />
                  <Champ name="motifRejet" placeholder="Motif (si rejet)" className="max-w-xs" />
                  <Bouton apparence="primaire" type="submit" name="decision" value="VALIDEE">Valider</Bouton>
                  <Bouton apparence="danger" type="submit" name="decision" value="REJETEE">Rejeter</Bouton>
                </form>
              </CorpsCarte>
            ) : null}
            {e.statutValidation === "REJETEE" && e.motifRejet ? (
              <CorpsCarte className="text-sm text-red-700 italic">Motif : {e.motifRejet}</CorpsCarte>
            ) : null}
          </Carte>
        ))}
      </div>
    </>
  );
}
