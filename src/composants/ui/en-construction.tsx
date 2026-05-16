import Link from "next/link";
import { Bouton } from "@/composants/ui/bouton";
import { Insigne } from "@/composants/ui/insigne";

interface ProprietesEnConstruction {
  titre: string;
  description: string;
  phase?: string;
  retourHref?: string;
  retourLibelle?: string;
}

// Bloc générique pour pages bientôt disponibles.
export function EnConstruction({
  titre, description, phase, retourHref = "/", retourLibelle = "Retour à l'accueil",
}: ProprietesEnConstruction) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      {phase ? <Insigne ton="jaune">{phase}</Insigne> : null}
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{titre}</h1>
      <p className="mt-3 max-w-lg text-texte-discret">{description}</p>
      <Link href={retourHref} className="mt-8">
        <Bouton apparence="primaire">{retourLibelle}</Bouton>
      </Link>
    </section>
  );
}
