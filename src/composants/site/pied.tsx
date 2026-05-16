import Link from "next/link";

// Pied de page : logo identique à la pilule de l'en-tête (cercle orange
// + centre sage), liens organisés par persona, mentions légales.
export function PiedSite() {
  return (
    <footer className="border-t border-bordure bg-fond-eleve">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-jub-orange-500 shadow-md shadow-jub-orange-500/30">
              <span className="block h-3 w-3 rounded-full bg-jub-sage-500" />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-jub-orange-500">JUB</span>
            <span className="text-sm font-semibold text-jub-sage-700">Campus</span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-texte-discret">
            La plateforme sénégalaise de stages par projets, certification vérifiable
            et insertion professionnelle.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-jub-sage-700">Étudiants</h4>
          <ul className="space-y-2.5 text-sm text-texte-discret">
            <li><Link href="/projets" className="transition-colors hover:text-jub-orange-600">Trouver un projet</Link></li>
            <li><Link href="/inscription/etudiant" className="transition-colors hover:text-jub-orange-600">Créer un compte</Link></li>
            <li><Link href="/classements" className="transition-colors hover:text-jub-orange-600">Classements</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-jub-sage-700">Entreprises &amp; mentors</h4>
          <ul className="space-y-2.5 text-sm text-texte-discret">
            <li><Link href="/entreprises" className="transition-colors hover:text-jub-orange-600">Publier un projet</Link></li>
            <li><Link href="/programmes" className="transition-colors hover:text-jub-orange-600">Programmes sponsorisés</Link></li>
            <li><Link href="/inscription/mentor" className="transition-colors hover:text-jub-orange-600">Devenir mentor</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-jub-sage-700">JUB Campus</h4>
          <ul className="space-y-2.5 text-sm text-texte-discret">
            <li><Link href="/a-propos" className="transition-colors hover:text-jub-orange-600">À propos</Link></li>
            <li><Link href="/contact" className="transition-colors hover:text-jub-orange-600">Contact</Link></li>
            <li><Link href="/cgu" className="transition-colors hover:text-jub-orange-600">CGU</Link></li>
            <li><Link href="/confidentialite" className="transition-colors hover:text-jub-orange-600">Confidentialité</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-bordure">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-texte-discret sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} JUB Campus · Saint-Louis du Sénégal</span>
          <span className="italic">Construit pour les étudiants. Validé par les pros.</span>
        </div>
      </div>
    </footer>
  );
}
