// Confirmation d'adresse email via lien reçu par email.

import { prisma } from "@/lib/prisma";
import { consommerJeton } from "@/domaine/jetons";
import { LienBouton } from "@/composants/ui/lien-bouton";
import { Icon } from "@/composants/maquette/icones";

export const metadata = { title: "Vérification de l'email" };
export const dynamic = "force-dynamic";

type Params = Promise<{ email?: string; jeton?: string }>;

export default async function PageVerifierEmail({ searchParams }: { searchParams: Params }) {
  const sp = await searchParams;
  const email = (sp.email ?? "").toLowerCase().trim();
  const jeton = sp.jeton ?? "";

  let ok = false;
  if (email && jeton) {
    ok = await consommerJeton("email", email, jeton);
    if (ok) {
      await prisma.utilisateur.updateMany({
        where: { email },
        data: { emailVerifieLe: new Date() },
      });
    }
  }

  return (
    <main className="fadein mx-auto max-w-[480px] px-5 pb-16 pt-12 text-center">
      <div
        className={
          ok
            ? "inline-flex h-[52px] w-[52px] items-center justify-center rounded-full bg-orange-500 text-sage-950"
            : "inline-flex h-[52px] w-[52px] items-center justify-center rounded-full bg-danger/15 text-danger"
        }
      >
        {ok ? <Icon.Check size={26} /> : <Icon.X size={26} />}
      </div>
      <h1 className="mt-4 text-[clamp(1.5rem,3.5vw,2rem)] font-semibold tracking-[-0.025em]">
        {ok ? "Email confirmé" : "Lien invalide ou expiré"}
      </h1>
      <p className="t-small mt-2">
        {ok
          ? "Ton adresse email est vérifiée. Ton compte est pleinement activé."
          : "Ce lien de vérification n'est plus valide. Reconnecte-toi pour en recevoir un nouveau."}
      </p>
      <div className="mt-[22px]">
        <LienBouton href="/connexion" apparence="accent">
          Aller à la connexion
        </LienBouton>
      </div>
    </main>
  );
}
