import Link from "next/link";
import Image from "next/image";
import { Bouton } from "@/composants/ui/bouton";
import { Carte, CorpsCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";

export const metadata = { title: "À propos" };

const valeursFond = [
  { mot: "Justice", desc: "Le même droit à une expérience pro pour tout étudiant, peu importe son réseau ou sa ville." },
  { mot: "Preuves", desc: "Les compétences se prouvent par des projets livrés, pas par des diplômes affichés." },
  { mot: "Local", desc: "Construit à Saint-Louis pour le Sénégal, pas dupliqué d'un modèle étranger." },
];

export default function PageAPropos() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-bordure">
        <Image
          src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=2400&q=85"
          alt="Étudiants africains"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-jub-sage-950/95 via-jub-sage-900/75 to-jub-sage-700/30" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
          <Insigne ton="jaune">À propos</Insigne>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Construit à Saint-Louis.<br />
            <span className="bg-gradient-to-r from-jub-jaune-400 to-jub-jaune-500 bg-clip-text text-transparent">
              Pour tout le Sénégal.
            </span>
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="space-y-6 text-lg leading-relaxed text-texte">
          <p>
            Beaucoup d&apos;étudiants sénégalais cherchent un stage et n&apos;en trouvent pas.
            À l&apos;UGB, le problème est encore plus aigu : la fac est loin de Dakar, peu d&apos;entreprises
            recrutent à Saint-Louis, et le réseau familial ne profite pas à tout le monde.
          </p>
          <p>
            <strong className="text-jub-vert-900">JUB Campus</strong> a été pensé pour réparer cette injustice.
            Pas en multipliant les offres de stage — il y en a déjà trop peu — mais en créant
            une alternative concrète : <strong className="text-jub-vert-900">des projets réels, encadrés, certifiés.</strong>
          </p>
          <p>
            Un étudiant qui termine un projet sur JUB Campus repart avec une preuve concrète :
            un certificat vérifiable publiquement, un portfolio à jour, et — souvent — un contact
            chez l&apos;entreprise qui a publié le projet.
          </p>
          <p>
            On démarre avec une cohorte pilote à l&apos;UGB. L&apos;ambition à 3 ans : devenir
            l&apos;infrastructure de référence de l&apos;insertion professionnelle universitaire au Sénégal.
          </p>
        </div>
      </section>

      <section className="border-y border-bordure bg-fond-eleve py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-10 max-w-2xl">
            <Insigne ton="vert">Nos trois valeurs</Insigne>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Ce qui nous tient.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {valeursFond.map((v) => (
              <Carte key={v.mot}>
                <CorpsCarte className="space-y-2">
                  <p className="text-3xl font-bold tracking-tight text-jub-vert-900">{v.mot}.</p>
                  <p className="text-sm text-texte-discret">{v.desc}</p>
                </CorpsCarte>
              </Carte>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight">Rejoins la cohorte pilote.</h2>
        <p className="mt-2 text-texte-discret">100 étudiants, 10 projets, 5 partenaires — le démarrage.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/inscription/etudiant"><Bouton apparence="accent" taille="lg">Créer mon compte</Bouton></Link>
          <Link href="/contact"><Bouton apparence="contour" taille="lg">Nous contacter</Bouton></Link>
        </div>
      </section>
    </>
  );
}
