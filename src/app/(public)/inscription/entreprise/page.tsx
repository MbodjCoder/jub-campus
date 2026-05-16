import Link from "next/link";
import { Carte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { FormulaireInscriptionEntreprise } from "@/composants/auth/formulaire-inscription-entreprise";

export const metadata = { title: "Inscription entreprise" };

export default function PageInscriptionEntreprise() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <Link href="/inscription" className="text-sm text-jub-vert-700 hover:underline">← Changer de profil</Link>
      </div>
      <Carte>
        <EnteteCarte>
          <TitreCarte>Inscription entreprise / organisation</TitreCarte>
          <DescriptionCarte>
            Ton compte sera validé manuellement sous 48h ouvrées (vérification NINEA + email pro).
            Tu pourras publier ton premier projet juste après validation.
          </DescriptionCarte>
        </EnteteCarte>
        <FormulaireInscriptionEntreprise />
      </Carte>
    </section>
  );
}
