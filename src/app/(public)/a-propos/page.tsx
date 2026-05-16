import Link from "next/link";
import { Bouton } from "@/composants/ui/bouton";
import { Insigne } from "@/composants/ui/insigne";

export default function PageAPropos() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Insigne ton="vert">À propos</Insigne>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
        Construit à Saint-Louis.<br /> Pour tout le Sénégal.
      </h1>
      <div className="mt-10 space-y-6 text-lg leading-relaxed text-texte-discret">
        <p>
          Beaucoup d&apos;étudiants sénégalais cherchent un stage et n&apos;en trouvent pas.
          À l&apos;UGB, le problème est encore plus aigu : la fac est loin de Dakar, peu d&apos;entreprises
          recrutent à Saint-Louis, et le réseau familial ne profite pas à tout le monde.
        </p>
        <p>
          <strong className="text-texte">JUB Campus</strong> a été pensé pour réparer cette injustice.
          Pas en multipliant les offres de stage — il y en a déjà trop peu — mais en créant
          une alternative : <strong className="text-texte">des projets réels, encadrés, certifiés.</strong>
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
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/inscription/etudiant"><Bouton apparence="accent">Rejoindre la cohorte pilote</Bouton></Link>
        <Link href="/contact"><Bouton apparence="contour">Nous contacter</Bouton></Link>
      </div>
    </section>
  );
}
