export const metadata = { title: "Conditions générales d'utilisation" };

export default function PageCGU() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Conditions générales d&apos;utilisation</h1>
      <p className="mt-1 text-sm text-texte-discret">Version brouillon · Dernière mise à jour : 2026-05-13</p>

      <div className="prose prose-sm mt-8 max-w-none space-y-6 text-texte">
        <section>
          <h2 className="text-xl font-semibold">1. Objet</h2>
          <p>JUB Campus est une plateforme sénégalaise de stages par projets, certification et insertion professionnelle pour étudiants. Ces CGU régissent l&apos;utilisation du service.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">2. Inscription et compte</h2>
          <p>L&apos;inscription est gratuite pour les étudiants. Les entreprises peuvent être amenées à payer un abonnement (cf. /entreprises). Toute inscription requiert un email valide.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">3. Engagement étudiant</h2>
          <p>En postulant à un projet, l&apos;étudiant s&apos;engage moralement à livrer ce qui est attendu dans les délais. L&apos;abandon répété de projets peut entraîner une suspension.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">4. Engagement entreprise</h2>
          <p>L&apos;entreprise s&apos;engage à respecter le mode de rémunération annoncé et à fournir un environnement de travail respectueux. Aucune exploitation tolérée.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">5. Certificats</h2>
          <p>Les certificats sont vérifiables publiquement et possèdent un hash d&apos;intégrité. La falsification est interdite et passible de poursuites.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">6. Données personnelles</h2>
          <p>Cf. <a href="/confidentialite" className="text-jub-vert-700 underline">politique de confidentialité</a>.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">7. Modification</h2>
          <p>Les présentes CGU peuvent être modifiées. La version applicable est celle en vigueur à la date d&apos;utilisation. Les utilisateurs sont notifiés par email pour les changements substantiels.</p>
        </section>
        <p className="text-sm text-texte-discret">Ce document est un brouillon. La version finalisée sera revue par un conseil juridique sénégalais avant le lancement public.</p>
      </div>
    </article>
  );
}
