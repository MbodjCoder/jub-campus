import Link from "next/link";
import { Carte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { FormulaireInscriptionEtudiant } from "@/composants/auth/formulaire-inscription-etudiant";

export const metadata = { title: "Inscription étudiant" };

export default function PageInscriptionEtudiant() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <Link href="/inscription" className="text-sm text-jub-vert-700 hover:underline">← Changer de profil</Link>
      </div>
      <Carte>
        <EnteteCarte>
          <TitreCarte>Crée ton compte étudiant</TitreCarte>
          <DescriptionCarte>
            Informations de base. Tu pourras compléter ton profil (compétences, bio, liens) ensuite.
          </DescriptionCarte>
        </EnteteCarte>
        <FormulaireInscriptionEtudiant />
      </Carte>
      <p className="mt-6 text-center text-sm text-texte-discret">
        Déjà inscrit ? <Link href="/connexion" className="text-jub-vert-700 hover:underline">Connecte-toi</Link>
      </p>
    </section>
  );
}
