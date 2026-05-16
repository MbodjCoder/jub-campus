import Link from "next/link";
import { Carte, CorpsCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";

const profils = [
  {
    href: "/inscription/etudiant",
    ton: "vert" as const,
    titre: "Je suis étudiant",
    sous: "Trouve un projet, prouve tes compétences, construis ton portfolio.",
    chip: "Gratuit à vie",
  },
  {
    href: "/inscription/entreprise",
    ton: "violet" as const,
    titre: "Je représente une entreprise",
    sous: "Publie un projet, sélectionne des étudiants, recrute sur preuves.",
    chip: "Validation manuelle",
  },
  {
    href: "/inscription/mentor",
    ton: "bleu" as const,
    titre: "Je suis professeur ou mentor",
    sous: "Encadre des équipes, valide les compétences, recommande des talents.",
    chip: "Email institutionnel privilégié",
  },
];

export default function PageChoixInscription() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Crée ton compte JUB Campus</h1>
        <p className="mt-2 text-texte-discret">Trois minutes. Pas de carte bancaire. Jamais.</p>
      </div>
      <div className="grid gap-4">
        {profils.map((p) => (
          <Link key={p.href} href={p.href} className="block">
            <Carte className="transition-all hover:border-jub-vert-500 hover:shadow-md">
              <CorpsCarte className="flex items-start gap-4">
                <div className="flex-1">
                  <Insigne ton={p.ton}>{p.chip}</Insigne>
                  <TitreCarte className="mt-2">{p.titre}</TitreCarte>
                  <DescriptionCarte>{p.sous}</DescriptionCarte>
                </div>
                <span aria-hidden className="text-2xl text-texte-discret">→</span>
              </CorpsCarte>
            </Carte>
          </Link>
        ))}
      </div>
      <p className="mt-10 text-center text-sm text-texte-discret">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="font-medium text-jub-vert-700 hover:underline">
          Connecte-toi
        </Link>
      </p>
    </section>
  );
}
