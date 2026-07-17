"use client";

// Demande de réinitialisation de mot de passe.

import { useState, useTransition } from "react";
import Link from "next/link";
import { Bouton } from "@/composants/ui/bouton";
import { Icon } from "@/composants/maquette/icones";
import { demanderReset } from "./actions";

export default function PageMotDePasseOublie() {
  const [envoye, setEnvoye] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, demarrer] = useTransition();

  function soumettre(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur(null);
    const fd = new FormData(e.currentTarget);
    demarrer(async () => {
      const r = await demanderReset(fd);
      if (r.succes) setEnvoye(true);
      else setErreur(r.message ?? "Erreur.");
    });
  }

  return (
    <main className="fadein mx-auto max-w-[440px] px-5 pb-16 pt-12">
      <h1 className="m-0 text-[clamp(1.5rem,3.5vw,2rem)] font-semibold tracking-[-0.025em]">
        Mot de passe oublié
      </h1>

      {envoye ? (
        <div className="mt-6 rounded-[14px] border border-bordure bg-fond-eleve p-5">
          <p className="t-small m-0">
            Si un compte existe avec cet email, un lien de réinitialisation vient d&apos;être
            envoyé. Vérifie ta boîte de réception (et les spams).
          </p>
        </div>
      ) : (
        <>
          <p className="t-small mt-1.5">
            Saisis ton email — on t&apos;envoie un lien pour choisir un nouveau mot de passe.
          </p>
          <form onSubmit={soumettre} className="mt-5 grid gap-3">
            <input className="champ" type="email" name="email" placeholder="ton.email@univ.edu.sn" required />
            {erreur ? (
              <p className="m-0 text-[13px] text-danger">{erreur}</p>
            ) : null}
            <Bouton apparence="accent" type="submit" disabled={enCours}>
              {enCours ? "Envoi…" : "Envoyer le lien"} <Icon.Arrow size={15} />
            </Bouton>
          </form>
        </>
      )}

      <p className="t-xs t-discret mt-[22px] text-center">
        <Link href="/connexion" className="font-semibold text-orange-600">
          Retour à la connexion
        </Link>
      </p>
    </main>
  );
}
