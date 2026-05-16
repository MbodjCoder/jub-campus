import { Carte, CorpsCarte, EnteteCarte, TitreCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";

export default function TableauAdmin() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Administration JUB Campus</h1>
        <p className="text-texte-discret">Vue d&apos;ensemble plateforme.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat libelle="Étudiants" valeur="0" delta="cohorte 0 — pilote" />
        <Stat libelle="Entreprises validées" valeur="0" delta="" />
        <Stat libelle="Projets en validation" valeur="0" delta="" />
        <Stat libelle="Certificats émis" valeur="0" delta="" />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Carte>
          <EnteteCarte><TitreCarte>File de modération</TitreCarte></EnteteCarte>
          <CorpsCarte className="text-sm text-texte-discret">
            Aucun projet en attente. Quand des entreprises publieront, ils apparaîtront ici.
          </CorpsCarte>
        </Carte>
        <Carte>
          <EnteteCarte><TitreCarte>Signalements ouverts</TitreCarte></EnteteCarte>
          <CorpsCarte className="text-sm text-texte-discret">
            Aucun signalement. <Insigne ton="vert">RAS</Insigne>
          </CorpsCarte>
        </Carte>
      </div>
    </div>
  );
}

function Stat({ libelle, valeur, delta }: { libelle: string; valeur: string; delta?: string }) {
  return (
    <Carte>
      <CorpsCarte className="space-y-1">
        <p className="text-xs uppercase tracking-wider text-texte-discret">{libelle}</p>
        <p className="text-2xl font-bold">{valeur}</p>
        {delta ? <p className="text-xs text-texte-discret">{delta}</p> : null}
      </CorpsCarte>
    </Carte>
  );
}
