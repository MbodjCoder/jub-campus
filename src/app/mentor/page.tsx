import { Carte, CorpsCarte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";

export default function TableauMentor() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Espace mentor</h1>
        <p className="text-texte-discret">Encadrement, feedbacks, évaluations.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-4">
        <Stat libelle="Projets encadrés" valeur="0" />
        <Stat libelle="Étudiants suivis" valeur="0" />
        <Stat libelle="Livrables à corriger" valeur="0" />
        <Stat libelle="Évaluations à faire" valeur="0" />
      </div>

      <Carte className="mt-10">
        <EnteteCarte>
          <TitreCarte>Bienvenue sur JUB Campus</TitreCarte>
        </EnteteCarte>
        <CorpsCarte className="space-y-3 text-sm text-texte-discret">
          <p>Ton compte mentor est <Insigne ton="jaune">EN VÉRIFICATION</Insigne>. L&apos;équipe JUB te recontacte sous 48h.</p>
          <p>Une fois validé, tu pourras proposer un projet ou rejoindre l&apos;encadrement d&apos;un projet existant.</p>
        </CorpsCarte>
      </Carte>
    </div>
  );
}

function Stat({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <Carte>
      <CorpsCarte>
        <p className="text-xs uppercase tracking-wider text-texte-discret">{libelle}</p>
        <p className="text-2xl font-bold">{valeur}</p>
      </CorpsCarte>
    </Carte>
  );
}
