import Link from "next/link";
import { redirect } from "next/navigation";
import { GraduationCap, Building2, BookOpen } from "lucide-react";
import { auth } from "@/auth";
import { Carte, CorpsCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { urlsParRole } from "@/lib/role";

const profils = [
  {
    href: "/inscription/etudiant",
    ton: "vert" as const,
    icone: GraduationCap,
    titre: "Je suis étudiant",
    sous: "Trouve un projet, prouve tes compétences, construis ton portfolio.",
    chip: "Gratuit à vie",
  },
  {
    href: "/inscription/entreprise",
    ton: "orange" as const,
    icone: Building2,
    titre: "Je représente une entreprise",
    sous: "Publie un projet, sélectionne des étudiants, recrute sur preuves.",
    chip: "Validation manuelle",
  },
  {
    href: "/inscription/mentor",
    ton: "sage" as const,
    icone: BookOpen,
    titre: "Je suis professeur ou mentor",
    sous: "Encadre des équipes, valide les compétences, recommande des talents.",
    chip: "Email institutionnel privilégié",
  },
];

export default async function PageChoixInscription() {
  const session = await auth();
  if (session?.user?.id) {
    redirect(urlsParRole(session.user.role).espace);
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Crée ton compte JUB Campus</h1>
        <p className="mt-2 text-texte-discret">Trois minutes. Pas de carte bancaire. Jamais.</p>
      </div>
      <div className="grid gap-4">
        {profils.map((p) => {
          const Icone = p.icone;
          return (
            <Link key={p.href} href={p.href} className="block group">
              <Carte className="transition-all group-hover:-translate-y-0.5 group-hover:border-jub-orange-400 group-hover:shadow-md">
                <CorpsCarte className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-jub-sage-500 text-jub-orange-500">
                    <Icone className="h-6 w-6" />
                  </span>
                  <div className="flex-1">
                    <Insigne ton={p.ton}>{p.chip}</Insigne>
                    <TitreCarte className="mt-2">{p.titre}</TitreCarte>
                    <DescriptionCarte>{p.sous}</DescriptionCarte>
                  </div>
                  <span aria-hidden className="text-2xl text-texte-discret transition-transform group-hover:translate-x-1">→</span>
                </CorpsCarte>
              </Carte>
            </Link>
          );
        })}
      </div>
      <p className="mt-10 text-center text-sm text-texte-discret">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="font-medium text-jub-orange-600 hover:underline">
          Connecte-toi
        </Link>
      </p>
    </section>
  );
}
