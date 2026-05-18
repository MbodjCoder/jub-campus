import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Carte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { FormulaireConnexion } from "@/composants/auth/formulaire-connexion";
import { urlsParRole } from "@/lib/role";

export const metadata = { title: "Connexion" };

export default async function PageConnexion({
  searchParams,
}: {
  searchParams: Promise<{ inscription?: string }>;
}) {
  const session = await auth();
  if (session?.user?.id) {
    redirect(urlsParRole(session.user.role).espace);
  }
  const { inscription } = await searchParams;
  return (
    <section className="mx-auto flex min-h-[calc(100vh-200px)] max-w-md items-center px-4 py-12 sm:px-6">
      <Carte className="w-full">
        <EnteteCarte>
          <TitreCarte>Connexion</TitreCarte>
          <DescriptionCarte>Ravi de te revoir.</DescriptionCarte>
        </EnteteCarte>
        {inscription === "verification-envoyee" ? (
          <p className="mx-5 mt-5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            Compte créé. Vérifie ta boîte mail pour activer ton accès.
          </p>
        ) : null}
        {inscription === "email-indisponible" ? (
          <p className="mx-5 mt-5 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
            Compte créé, mais l&apos;email d&apos;activation n&apos;a pas pu partir. Réessaie via le formulaire ci-dessous.
          </p>
        ) : null}
        <FormulaireConnexion />
        <div className="space-y-2 border-t border-bordure p-5 text-center text-sm">
          <p>
            <Link href="/mot-de-passe-oublie" className="font-medium text-orange-600 hover:underline">
              Mot de passe oublié ?
            </Link>
          </p>
          <p>
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="font-medium text-orange-600 hover:underline">
              Crée-le en 3 minutes
            </Link>
          </p>
        </div>
      </Carte>
    </section>
  );
}
