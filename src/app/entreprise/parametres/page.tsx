import { Bouton } from "@/composants/ui/bouton";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";

export const metadata = { title: "Paramètres" };

export default function PageEntrepriseParametres() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-sm text-texte-discret">Sécurité, facturation, équipe.</p>
      </header>

      <div className="space-y-4">
        <Carte>
          <EnteteCarte>
            <TitreCarte>Sécurité</TitreCarte>
            <DescriptionCarte>Mot de passe et sessions actives.</DescriptionCarte>
          </EnteteCarte>
          <CorpsCarte>
            <Bouton apparence="contour">Changer le mot de passe</Bouton>
          </CorpsCarte>
        </Carte>

        <Carte>
          <EnteteCarte>
            <TitreCarte>Facturation</TitreCarte>
            <DescriptionCarte>Plan, factures, mode de paiement.</DescriptionCarte>
          </EnteteCarte>
          <CorpsCarte className="text-sm text-texte-discret">
            Pas encore d&apos;abonnement actif. Module facturation V1.4.
          </CorpsCarte>
        </Carte>

        <Carte className="border-red-200">
          <EnteteCarte className="border-red-200 bg-red-50">
            <TitreCarte className="text-red-900">Zone dangereuse</TitreCarte>
          </EnteteCarte>
          <CorpsCarte>
            <Bouton apparence="danger">Supprimer le compte entreprise</Bouton>
          </CorpsCarte>
        </Carte>
      </div>
    </>
  );
}
