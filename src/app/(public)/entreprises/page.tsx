import Link from "next/link";
import { Bouton } from "@/composants/ui/bouton";
import { Carte, CorpsCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";

const valeurs = [
  {
    titre: "Sourcing à coût quasi nul",
    desc: "Tu vois les étudiants travailler en conditions réelles. Tu choisis sur preuves, pas sur CV.",
  },
  {
    titre: "Image de marque employeur",
    desc: "Les meilleurs étudiants du Sénégal voient ton nom à côté de tes projets.",
  },
  {
    titre: "Productivité immédiate",
    desc: "Tes projets avancent pendant que tu sources. Une équipe de 3 étudiants encadrés livre en 4-6 semaines.",
  },
];

const offres = [
  {
    nom: "Découverte",
    prix: "Gratuit",
    pour: "Tester JUB Campus avec un premier projet.",
    inclus: ["1 projet ouvert / mois", "Accès aux candidatures", "Espace projet complet", "Évaluation et certificat"],
    cta: "Commencer",
  },
  {
    nom: "Pro",
    prix: "49 000 FCFA / mois",
    pour: "PME et scale-ups qui sourcent régulièrement.",
    inclus: ["10 projets ouverts / mois", "Accès aux portfolios premium", "Mise en avant du logo", "Support prioritaire"],
    cta: "Demander une démo",
    populaire: true,
  },
  {
    nom: "Entreprise",
    prix: "Sur devis",
    pour: "Grandes entreprises, programmes structurés, sponsoring.",
    inclus: ["Projets illimités", "API & branding personnalisé", "Programme sponsorisé dédié", "Account manager"],
    cta: "Nous contacter",
  },
];

export default function PageEntreprises() {
  return (
    <>
      <section className="border-b border-bordure bg-gradient-to-b from-jub-vert-50 to-fond">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <Insigne ton="violet">Pour les entreprises</Insigne>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Tes futurs talents,<br /><span className="text-jub-vert-700">déjà en train de travailler pour toi.</span>
          </h1>
          <p className="mt-4 text-lg text-texte-discret">
            Publie un projet, vois les étudiants livrer, recrute en confiance.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/inscription/entreprise"><Bouton apparence="accent" taille="lg">Publier un projet</Bouton></Link>
            <Link href="/contact"><Bouton apparence="contour" taille="lg">Parler à l&apos;équipe</Bouton></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {valeurs.map((v) => (
            <Carte key={v.titre}>
              <CorpsCarte className="space-y-2">
                <TitreCarte className="text-base">{v.titre}</TitreCarte>
                <DescriptionCarte>{v.desc}</DescriptionCarte>
              </CorpsCarte>
            </Carte>
          ))}
        </div>
      </section>

      <section className="border-y border-bordure bg-fond-eleve py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 max-w-2xl">
            <Insigne ton="vert">Tarifs partenaires</Insigne>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Démarre gratuit. Évolue à ton rythme.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {offres.map((o) => (
              <Carte key={o.nom} className={o.populaire ? "border-jub-vert-700 ring-1 ring-jub-vert-700" : ""}>
                <CorpsCarte className="space-y-4">
                  <div className="flex items-center justify-between">
                    <TitreCarte>{o.nom}</TitreCarte>
                    {o.populaire ? <Insigne ton="jaune">Populaire</Insigne> : null}
                  </div>
                  <p className="text-2xl font-bold">{o.prix}</p>
                  <DescriptionCarte>{o.pour}</DescriptionCarte>
                  <ul className="space-y-2 text-sm">
                    {o.inclus.map((i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-jub-vert-700">✓</span>
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/inscription/entreprise">
                    <Bouton apparence={o.populaire ? "primaire" : "contour"} pleineLargeur>{o.cta}</Bouton>
                  </Link>
                </CorpsCarte>
              </Carte>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
