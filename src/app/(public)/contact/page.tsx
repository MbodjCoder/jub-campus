"use client";

// Contact — port 1:1 de la maquette (PageContact).

import { useState, useTransition } from "react";
import { Bouton } from "@/composants/ui/bouton";
import { Icon } from "@/composants/maquette/icones";
import { envoyerMessageContact } from "./actions";

export default function PageContact() {
  const [envoye, setEnvoye] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, demarrer] = useTransition();

  function soumettre(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur(null);
    const fd = new FormData(e.currentTarget);
    demarrer(async () => {
      const r = await envoyerMessageContact(fd);
      if (r.succes) setEnvoye(true);
      else setErreur(r.message ?? "Erreur inconnue.");
    });
  }

  return (
    <main className="fadein mx-auto max-w-[520px] px-5 pb-16 pt-10">
      <h1 className="m-0 text-[clamp(1.75rem,4vw,2.25rem)] font-semibold tracking-[-0.025em]">
        Contact
      </h1>
      <p className="t-small mt-1.5">
        Réponse sous 24h ouvrées.
      </p>

      {envoye ? (
        <div className="mt-8 rounded-[14px] border border-bordure bg-fond-eleve p-6 text-center">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-sage-950">
            <Icon.Check size={20} />
          </div>
          <div className="mt-3 text-[15px] font-semibold">Message envoyé</div>
          <p className="t-small mt-1.5">
            Nous te répondons rapidement.
          </p>
        </div>
      ) : (
        <form onSubmit={soumettre} className="mt-6 grid gap-3">
          <div>
            <label className="t-xs font-semibold">
              Email
            </label>
            <input className="champ mt-1" name="email" type="email" placeholder="ton.email@univ.edu.sn" required />
          </div>
          <div>
            <label className="t-xs font-semibold">
              Sujet
            </label>
            <select className="champ mt-1 appearance-auto" name="sujet">
              <option>Question générale</option>
              <option>Partenariat université</option>
              <option>Partenariat entreprise</option>
              <option>Bug / problème technique</option>
              <option>Presse</option>
            </select>
          </div>
          <div>
            <label className="t-xs font-semibold">
              Message
            </label>
            <textarea className="champ champ--ta mt-1" name="message" rows={5} placeholder="Dis-nous tout…" required minLength={10} />
          </div>
          {erreur ? (
            <p className="m-0 rounded-lg bg-danger/10 px-3 py-2 text-[13px] text-danger">
              {erreur}
            </p>
          ) : null}
          <Bouton apparence="accent" type="submit" className="mt-2" disabled={enCours}>
            {enCours ? "Envoi…" : "Envoyer"} <Icon.Send size={14} />
          </Bouton>
        </form>
      )}

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-bordure pt-5">
        <span className="t-xs t-discret">Ou directement par email</span>
        <a
          href="mailto:contact@jubcampus.sn"
          className="inline-flex items-center gap-[5px] text-[13px] font-semibold text-orange-600 no-underline"
        >
          <Icon.Mail size={13} /> contact@jubcampus.sn
        </a>
      </div>
    </main>
  );
}
