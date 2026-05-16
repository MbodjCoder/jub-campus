import Link from "next/link";
import { Bouton } from "@/composants/ui/bouton";
import { Carte, CorpsCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";

export const metadata = { title: "Programmes sponsorisés" };

const programmesDemo = [
  {
    nom: "Agritech Vallée du Fleuve",
    sponsor: "Ministère de l'Agriculture + GIZ",
    budget: "5 M FCFA",
    projets: 10,
    statut: "EN_PREPARATION",
  },
  {
    nom: "Numérique Inclusif Saint-Louis",
    sponsor: "Orange Digital Center",
    budget: "3 M FCFA",
    projets: 6,
    statut: "OUVERT",
  },
];

export default function PageProgrammes() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <Insigne ton="bleu">Programmes sponsorisés</Insigne>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        Des cohortes thématiques, financées par des sponsors.
      </h1>
      <p className="mt-3 max-w-2xl text-texte-discret">
        Un sponsor finance un lot de projets sur une thématique (agritech, santé, climat…).
        JUB Campus orchestre la cohorte : sélection des étudiants, mentors, livrables, rapport d&apos;impact.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {programmesDemo.map((p) => (
          <Carte key={p.nom}>
            <CorpsCarte className="space-y-3">
              <div className="flex items-center justify-between">
                <Insigne ton={p.statut === "OUVERT" ? "vert" : "neutre"}>{p.statut}</Insigne>
                <span className="text-xs font-mono text-texte-discret">{p.projets} projets</span>
              </div>
              <TitreCarte>{p.nom}</TitreCarte>
              <DescriptionCarte>Sponsor : {p.sponsor}</DescriptionCarte>
              <p className="text-sm font-medium">Budget total : {p.budget}</p>
            </CorpsCarte>
          </Carte>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-bordure bg-fond-eleve p-6 text-center">
        <p className="text-sm text-texte-discret">Vous êtes une ONG, institution ou fondation ?</p>
        <h3 className="mt-1 text-xl font-semibold">Lancez votre programme avec JUB Campus.</h3>
        <Link href="/contact" className="mt-4 inline-block">
          <Bouton apparence="primaire">Nous contacter</Bouton>
        </Link>
      </div>
    </section>
  );
}
