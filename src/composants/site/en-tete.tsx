import Link from "next/link";
import { Bouton } from "@/composants/ui/bouton";

const lienActifBase = "text-sm text-texte-discret hover:text-texte transition-colors";

export function EnTeteSite() {
  return (
    <header className="sticky top-0 z-40 border-b border-bordure bg-fond/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-jub-vert-900 text-white font-bold">J</span>
          <span className="font-semibold tracking-tight">JUB <span className="text-jub-vert-700">Campus</span></span>
        </Link>
        <nav className="hidden gap-7 md:flex">
          <Link href="/projets" className={lienActifBase}>Projets</Link>
          <Link href="/comment-ca-marche" className={lienActifBase}>Comment ça marche</Link>
          <Link href="/entreprises" className={lienActifBase}>Pour les entreprises</Link>
          <Link href="/a-propos" className={lienActifBase}>À propos</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/connexion" className="hidden text-sm font-medium text-texte hover:text-jub-vert-700 sm:inline">
            Connexion
          </Link>
          <Link href="/inscription">
            <Bouton apparence="accent" taille="sm">Commencer</Bouton>
          </Link>
        </div>
      </div>
    </header>
  );
}
