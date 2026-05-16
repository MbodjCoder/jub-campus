import Link from "next/link";
import Image from "next/image";
import { Bouton } from "@/composants/ui/bouton";
import { Carte, CorpsCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";

export const metadata = { title: "Pour les entreprises" };

const valeurs = [
  {
    titre: "Sourcing à coût quasi nul",
    desc: "Tu vois les étudiants travailler en conditions réelles. Tu choisis sur preuves, pas sur CV.",
    chiffre: "0 FCFA",
    sub: "première offre découverte",
  },
  {
    titre: "Image de marque employeur",
    desc: "Les meilleurs étudiants du Sénégal voient ton nom à côté de tes projets et de leurs certificats.",
    chiffre: "+5 univ.",
    sub: "exposition fin d'année 1",
  },
  {
    titre: "Productivité immédiate",
    desc: "Tes projets avancent pendant que tu sources. Une équipe de 3 étudiants encadrés livre en 4-6 semaines.",
    chiffre: "4-6 sem.",
    sub: "durée projet typique",
  },
];

const offres = [
  {
    nom: "Découverte",
    prix: "Gratuit",
    pour: "Tester JUB Campus avec un premier projet.",
    inclus: ["1 projet ouvert / mois", "Accès aux candidatures", "Espace projet complet", "Évaluation et certificat délivré"],
    cta: "Commencer",
  },
  {
    nom: "Pro",
    prix: "49 000 FCFA / mois",
    pour: "PME et scale-ups qui sourcent régulièrement.",
    inclus: ["10 projets ouverts / mois", "Accès aux portfolios premium", "Mise en avant du logo sur le site", "Support prioritaire"],
    cta: "Demander une démo",
    populaire: true,
  },
  {
    nom: "Entreprise",
    prix: "Sur devis",
    pour: "Grandes entreprises, programmes structurés, sponsoring.",
    inclus: ["Projets illimités", "API et branding personnalisé", "Programme sponsorisé dédié", "Account manager dédié"],
    cta: "Nous contacter",
  },
];

export default function PageEntreprises() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-bordure">
        <Image
          src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=2400&q=85"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/90 via-jub-vert-950/85 to-jub-vert-900/60" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
          <Insigne ton="jaune">Pour les entreprises</Insigne>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Tes futurs talents,<br />
            <span className="bg-gradient-to-r from-jub-jaune-400 to-jub-jaune-500 bg-clip-text text-transparent">
              déjà en train de travailler pour toi.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/85">
            Publie un projet, vois les étudiants livrer en conditions réelles, recrute
            les meilleurs sur preuves. Pas sur CV.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/inscription/entreprise">
              <Bouton apparence="accent" taille="lg" className="shadow-2xl shadow-jub-jaune-500/30">Publier un projet</Bouton>
            </Link>
            <Link href="/contact">
              <Bouton apparence="contour" taille="lg" className="border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20">
                Parler à l&apos;équipe
              </Bouton>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-12 max-w-2xl">
          <Insigne ton="violet">Pourquoi JUB Campus ?</Insigne>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Trois bénéfices concrets, mesurables.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {valeurs.map((v) => (
            <Carte key={v.titre} className="relative overflow-hidden">
              <CorpsCarte className="space-y-3">
                <p className="text-4xl font-bold tracking-tight text-jub-vert-900">{v.chiffre}</p>
                <p className="text-xs uppercase tracking-wider text-texte-discret">{v.sub}</p>
                <TitreCarte className="text-base">{v.titre}</TitreCarte>
                <DescriptionCarte>{v.desc}</DescriptionCarte>
              </CorpsCarte>
              <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-jub-vert-50" />
            </Carte>
          ))}
        </div>
      </section>

      <section className="border-y border-bordure bg-fond-eleve py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 max-w-2xl">
            <Insigne ton="vert">Tarifs partenaires</Insigne>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Démarre gratuit. Évolue à ton rythme.
            </h2>
            <p className="mt-3 text-texte-discret">
              Pas de frais cachés. Les étudiants ne paient jamais — toi non plus si tu débutes.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {offres.map((o) => (
              <Carte
                key={o.nom}
                className={o.populaire ? "relative scale-[1.02] border-jub-vert-700 shadow-xl ring-1 ring-jub-vert-700" : "relative"}
              >
                {o.populaire ? (
                  <span className="absolute -top-3 left-6 inline-flex items-center rounded-full bg-jub-jaune-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-jub-vert-950">
                    Populaire
                  </span>
                ) : null}
                <CorpsCarte className="space-y-5">
                  <TitreCarte>{o.nom}</TitreCarte>
                  <p className="text-3xl font-bold tracking-tight">{o.prix}</p>
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
