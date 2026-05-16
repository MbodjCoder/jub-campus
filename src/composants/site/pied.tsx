import Link from "next/link";

export function PiedSite() {
  return (
    <footer className="border-t border-bordure bg-fond-eleve">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-jub-vert-900 text-white font-bold">J</span>
            <span className="font-semibold tracking-tight">JUB Campus</span>
          </div>
          <p className="text-sm text-texte-discret max-w-xs">
            La plateforme sénégalaise de stages par projets, certification et insertion professionnelle.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Étudiants</h4>
          <ul className="space-y-2 text-sm text-texte-discret">
            <li><Link href="/projets" className="hover:text-texte">Trouver un projet</Link></li>
            <li><Link href="/inscription/etudiant" className="hover:text-texte">Créer un compte</Link></li>
            <li><Link href="/classements" className="hover:text-texte">Classements</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Entreprises & mentors</h4>
          <ul className="space-y-2 text-sm text-texte-discret">
            <li><Link href="/entreprises" className="hover:text-texte">Publier un projet</Link></li>
            <li><Link href="/programmes" className="hover:text-texte">Programmes sponsorisés</Link></li>
            <li><Link href="/inscription/mentor" className="hover:text-texte">Devenir mentor</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">JUB Campus</h4>
          <ul className="space-y-2 text-sm text-texte-discret">
            <li><Link href="/a-propos" className="hover:text-texte">À propos</Link></li>
            <li><Link href="/contact" className="hover:text-texte">Contact</Link></li>
            <li><Link href="/cgu" className="hover:text-texte">CGU</Link></li>
            <li><Link href="/confidentialite" className="hover:text-texte">Confidentialité</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-bordure">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-texte-discret sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} JUB Campus · Saint-Louis du Sénégal</span>
          <span>Construit pour les étudiants. Validé par les pros.</span>
        </div>
      </div>
    </footer>
  );
}
