import Link from "next/link";
import { Bouton } from "@/composants/ui/bouton";

export default function PageIntrouvable() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-6xl font-bold text-jub-vert-900">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page introuvable</h1>
      <p className="mt-2 text-texte-discret">
        Le contenu que tu cherches n&apos;existe pas (ou plus). Pas de panique.
      </p>
      <Link href="/" className="mt-6">
        <Bouton apparence="primaire">Retour à l&apos;accueil</Bouton>
      </Link>
    </main>
  );
}
