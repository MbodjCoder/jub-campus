import { Bouton } from "@/composants/ui/bouton";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";

export const metadata = { title: "Paramètres mentor" };

export default function PageMentorParametres() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-sm text-texte-discret">Sécurité, préférences d&apos;encadrement.</p>
      </header>

      <div className="space-y-4">
        <Carte>
          <EnteteCarte>
            <TitreCarte>Sécurité</TitreCarte>
            <DescriptionCarte>Mot de passe et sessions.</DescriptionCarte>
          </EnteteCarte>
          <CorpsCarte>
            <Bouton apparence="contour">Changer le mot de passe</Bouton>
          </CorpsCarte>
        </Carte>

        <Carte>
          <EnteteCarte>
            <TitreCarte>Disponibilité</TitreCarte>
            <DescriptionCarte>Nombre d&apos;équipes que tu peux encadrer en parallèle.</DescriptionCarte>
          </EnteteCarte>
          <CorpsCarte className="text-sm text-texte-discret">
            Configuration fine de la charge mentor — V1.4.
          </CorpsCarte>
        </Carte>

        <Carte className="border-red-200">
          <EnteteCarte className="border-red-200 bg-red-50">
            <TitreCarte className="text-red-900">Zone dangereuse</TitreCarte>
          </EnteteCarte>
          <CorpsCarte>
            <Bouton apparence="danger">Supprimer mon compte mentor</Bouton>
          </CorpsCarte>
        </Carte>
      </div>
    </>
  );
}
