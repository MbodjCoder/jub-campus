// Confirmation d'adresse email via lien reçu par email.

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { consommerJeton } from "@/domaine/jetons";
import { Bouton } from "@/composants/maquette/primitifs";
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
    <main className="fadein" style={{ padding: "48px 20px 64px", maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 52,
          height: 52,
          borderRadius: 999,
          background: ok ? "var(--orange-500)" : "color-mix(in oklab, var(--danger) 14%, transparent)",
          color: ok ? "var(--sage-950)" : "var(--danger)",
        }}
      >
        {ok ? <Icon.Check size={26} /> : <Icon.X size={26} />}
      </div>
      <h1 style={{ marginTop: 16, fontSize: "clamp(1.5rem, 3.5vw, 2rem)", fontWeight: 600, letterSpacing: "-0.025em" }}>
        {ok ? "Email confirmé" : "Lien invalide ou expiré"}
      </h1>
      <p className="t-small" style={{ marginTop: 8 }}>
        {ok
          ? "Ton adresse email est vérifiée. Ton compte est pleinement activé."
          : "Ce lien de vérification n'est plus valide. Reconnecte-toi pour en recevoir un nouveau."}
      </p>
      <div style={{ marginTop: 22 }}>
        <Bouton as={Link} href="/connexion" variant="accent">
          Aller à la connexion
        </Bouton>
      </div>
    </main>
  );
}
