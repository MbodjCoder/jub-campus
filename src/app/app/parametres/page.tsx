import { Carte, CorpsCarte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { Bouton } from "@/composants/ui/bouton";

export const metadata = { title: "Paramètres" };

export default function PageParametres() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-texte-discret">Sécurité, notifications, confidentialité.</p>
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
            <TitreCarte>Visibilité du portfolio</TitreCarte>
            <DescriptionCarte>Choisis qui peut voir ton portfolio public.</DescriptionCarte>
          </EnteteCarte>
          <CorpsCarte>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <span className="text-sm">Mon portfolio est visible par toute personne ayant le lien.</span>
            </label>
          </CorpsCarte>
        </Carte>

        <Carte className="border-red-200">
          <EnteteCarte className="bg-red-50 border-red-200">
            <TitreCarte className="text-red-900">Zone dangereuse</TitreCarte>
          </EnteteCarte>
          <CorpsCarte>
            <Bouton apparence="danger">Supprimer mon compte</Bouton>
          </CorpsCarte>
        </Carte>
      </div>
    </>
  );
}
