import Link from "next/link";
import { Bouton } from "@/composants/ui/bouton";
import { Champ, ChampEtiquete } from "@/composants/ui/champ";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";

export default function PageConnexion() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-200px)] max-w-md items-center px-4 py-12 sm:px-6">
      <Carte className="w-full">
        <EnteteCarte>
          <TitreCarte>Connexion</TitreCarte>
          <DescriptionCarte>Ravi de te revoir.</DescriptionCarte>
        </EnteteCarte>
        <form action="/api/auth/callback/credentials" method="post">
          <CorpsCarte className="space-y-4">
            <ChampEtiquete libelle="Email" pour="email">
              <Champ id="email" name="email" type="email" required autoComplete="email" />
            </ChampEtiquete>
            <ChampEtiquete libelle="Mot de passe" pour="motDePasse">
              <Champ id="motDePasse" name="motDePasse" type="password" required autoComplete="current-password" />
            </ChampEtiquete>
            <Bouton apparence="primaire" taille="lg" pleineLargeur type="submit">Se connecter</Bouton>
            <div className="flex items-center gap-2 text-xs text-texte-discret">
              <span className="h-px flex-1 bg-bordure" />
              <span>OU</span>
              <span className="h-px flex-1 bg-bordure" />
            </div>
            <Bouton apparence="contour" pleineLargeur type="button" formAction="/api/auth/signin/google">
              Continuer avec Google
            </Bouton>
          </CorpsCarte>
        </form>
        <div className="border-t border-bordure bg-jub-pierre-50 p-5 text-center text-sm">
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="font-medium text-jub-vert-700 hover:underline">
            Crée-le en 3 minutes
          </Link>
        </div>
      </Carte>
    </section>
  );
}
