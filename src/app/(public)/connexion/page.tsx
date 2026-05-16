import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Carte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { FormulaireConnexion } from "@/composants/auth/formulaire-connexion";
import { urlsParRole } from "@/lib/role";

export const metadata = { title: "Connexion" };

export default async function PageConnexion() {
  const session = await auth();
  if (session?.user?.id) {
    redirect(urlsParRole(session.user.role).espace);
  }
  return (
    <section className="mx-auto flex min-h-[calc(100vh-200px)] max-w-md items-center px-4 py-12 sm:px-6">
      <Carte className="w-full">
        <EnteteCarte>
          <TitreCarte>Connexion</TitreCarte>
          <DescriptionCarte>Ravi de te revoir.</DescriptionCarte>
        </EnteteCarte>
        <FormulaireConnexion />
        <div className="border-t border-bordure bg-jub-pierre-50 p-5 text-center text-sm">
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="font-medium text-jub-orange-600 hover:underline">
            Crée-le en 3 minutes
          </Link>
        </div>
      </Carte>
    </section>
  );
}
