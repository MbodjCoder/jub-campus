import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { Bouton } from "@/composants/ui/bouton";
import { Champ } from "@/composants/ui/champ";
import { fermerSignalement } from "../actions";
import { formaterDate } from "@/lib/utils";

export const metadata = { title: "Admin · Signalements" };
export const dynamic = "force-dynamic";

export default async function PageAdminSignalements() {
  const signalements = await prisma.signalement.findMany({
    orderBy: [{ statut: "asc" }, { creeLe: "desc" }],
    take: 100,
    include: { rapporteur: { select: { email: true, nomComplet: true } } },
  });

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Signalements</h1>
        <p className="text-texte-discret">{signalements.length} signalement{signalements.length > 1 ? "s" : ""}.</p>
      </header>

      <div className="space-y-3">
        {signalements.length === 0 ? (
          <Carte><CorpsCarte className="text-center py-10 text-sm text-texte-discret">Aucun signalement.</CorpsCarte></Carte>
        ) : signalements.map((s) => (
          <Carte key={s.id}>
            <EnteteCarte className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <TitreCarte className="text-base">{s.motif}</TitreCarte>
                <p className="text-xs text-texte-discret">
                  Sur {s.ressourceType} #{s.ressourceId.slice(0, 8)} · signalé par {s.rapporteur.nomComplet ?? s.rapporteur.email} · {formaterDate(s.creeLe)}
                </p>
              </div>
              <Insigne ton={
                s.statut === "OUVERT" ? "rouge" :
                s.statut === "EN_COURS" ? "orange" :
                s.statut === "RESOLU" ? "vert" : "neutre"
              }>
                {s.statut}
              </Insigne>
            </EnteteCarte>
            {s.description ? <CorpsCarte className="text-sm italic text-texte-discret">« {s.description} »</CorpsCarte> : null}
            {s.statut === "OUVERT" ? (
              <CorpsCarte>
                <form action={fermerSignalement} className="flex flex-wrap items-center gap-2">
                  <input type="hidden" name="signalementId" value={s.id} />
                  <Champ name="note" placeholder="Note de résolution" className="max-w-xs" />
                  <label className="inline-flex items-center gap-1.5 text-xs">
                    <input type="checkbox" name="resolu" defaultChecked />
                    Résolu (sinon : rejeté)
                  </label>
                  <Bouton apparence="primaire" type="submit">Clôturer</Bouton>
                </form>
              </CorpsCarte>
            ) : s.resolutionNote ? (
              <CorpsCarte className="text-xs text-texte-discret">Note : {s.resolutionNote}</CorpsCarte>
            ) : null}
          </Carte>
        ))}
      </div>
    </>
  );
}
