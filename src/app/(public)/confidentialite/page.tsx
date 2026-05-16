export const metadata = { title: "Politique de confidentialité" };

export default function PageConfidentialite() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Politique de confidentialité</h1>
      <p className="mt-1 text-sm text-texte-discret">Version brouillon · Dernière mise à jour : 2026-05-13</p>

      <div className="prose prose-sm mt-8 max-w-none space-y-6 text-texte">
        <section>
          <h2 className="text-xl font-semibold">Données collectées</h2>
          <ul className="list-disc pl-6">
            <li>Identité : prénom, nom, photo (optionnelle), date de naissance (optionnelle).</li>
            <li>Coordonnées : email, téléphone (optionnel).</li>
            <li>Données académiques : université, niveau, filière, compétences.</li>
            <li>Données de projet : candidatures, livrables, évaluations, certificats.</li>
            <li>Données techniques : adresse IP, navigateur, cookies essentiels d&apos;authentification.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Finalités</h2>
          <ul className="list-disc pl-6">
            <li>Fournir le service (matching, candidatures, certification).</li>
            <li>Communiquer (notifications, emails transactionnels).</li>
            <li>Mesurer l&apos;impact (statistiques anonymisées par université).</li>
            <li>Lutter contre la fraude et l&apos;abus.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Partage</h2>
          <p>Le portfolio public est visible par toute personne ayant le lien (sauf désactivation explicite). Aucune donnée personnelle n&apos;est vendue à des tiers.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Vos droits</h2>
          <p>Accès, rectification, effacement, opposition. Envoie un email à <strong>privacy@jubcampus.sn</strong>.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Conservation</h2>
          <p>Les données sont conservées tant que le compte est actif. Les certificats émis restent vérifiables 5 ans après suppression du compte (intégrité du système de preuves).</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Hébergement</h2>
          <p>Données stockées en Europe (Frankfurt / Paris). Conformité Loi sénégalaise sur les données personnelles (Loi n° 2008-12 + CDP).</p>
        </section>
        <p className="text-sm text-texte-discret">Document en cours de revue par la CDP du Sénégal.</p>
      </div>
    </article>
  );
}
