import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Carte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { FormulaireInscriptionMentor } from "@/composants/auth/formulaire-inscription-mentor";
import { urlsParRole } from "@/lib/role";

export const metadata = { title: "Devenir mentor" };

export default async function PageInscriptionMentor() {
  const session = await auth();
  if (session?.user?.id) {
    redirect(urlsParRole(session.user.role).espace);
  }
  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <Link href="/inscription" className="text-sm text-jub-orange-600 hover:underline">← Changer de profil</Link>
      </div>
      <Carte>
        <EnteteCarte>
          <TitreCarte>Devenir mentor / professeur</TitreCarte>
          <DescriptionCarte>
            Les mentors encadrent des équipes, donnent du feedback, valident des compétences.
            Ton compte est vérifié avant ton premier encadrement.
          </DescriptionCarte>
        </EnteteCarte>
        <FormulaireInscriptionMentor />
      </Carte>
    </section>
  );
}
