"use client";

import { Suspense, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Bouton } from "@/composants/ui/bouton";
import { Icon } from "@/composants/maquette/icones";
import { reinitialiserMotDePasse } from "../mot-de-passe-oublie/actions";

function Formulaire() {
  const router = useRouter();
  const sp = useSearchParams();
  const email = sp.get("email") ?? "";
  const jeton = sp.get("jeton") ?? "";
  const formRef = useRef<HTMLFormElement>(null);

  const [erreur, setErreur] = useState<string | null>(null);
  const [confirmationOuverte, setConfirmationOuverte] = useState(false);
  const [enCours, demarrer] = useTransition();

  function soumettre(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur(null);
    const fd = new FormData(e.currentTarget);
    if (fd.get("motDePasse") !== fd.get("motDePasseConfirme")) {
      setErreur("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setConfirmationOuverte(true);
  }

  function confirmer() {
    const form = formRef.current;
    if (!form) return;
    setConfirmationOuverte(false);
    demarrer(async () => {
      const r = await reinitialiserMotDePasse(new FormData(form));
      if (r.succes) {
        router.replace("/connexion?motdepasse=modifie");
      } else {
        setErreur(r.message ?? "Erreur.");
      }
    });
  }

  if (!email || !jeton) {
    return <p className="t-small">Lien invalide. Refais une demande de réinitialisation.</p>;
  }

  return (
    <>
      <form ref={formRef} onSubmit={soumettre} className="mt-5 grid gap-3">
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="jeton" value={jeton} />
        <label className="grid gap-1">
          <span className="text-xs font-semibold">Nouveau mot de passe</span>
          <input className="champ" type="password" name="motDePasse" minLength={8} required placeholder="8 caractères minimum" />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-semibold">Confirme le mot de passe</span>
          <input className="champ" type="password" name="motDePasseConfirme" minLength={8} required />
        </label>
        {erreur ? <p className="m-0 text-[13px] text-danger">{erreur}</p> : null}
        <Bouton apparence="accent" type="submit" disabled={enCours}>
          {enCours ? "Mise à jour…" : "Réinitialiser"} <Icon.Check size={15} />
        </Bouton>
      </form>

      {confirmationOuverte ? (
        <div
          role="alertdialog"
          aria-modal="true"
          className="fixed inset-0 z-[120] grid place-items-center bg-sage-950/50 p-4"
        >
          <div className="w-full max-w-[420px] rounded-2xl bg-white p-5">
            <h2 className="m-0 text-lg font-semibold">Confirmer le changement</h2>
            <p className="t-small mt-2.5">
              Tu vas modifier ton mot de passe. Le lien de réinitialisation sera immédiatement invalidé.
            </p>
            <div className="mt-4 flex justify-end gap-2.5">
              <Bouton apparence="fantome" type="button" onClick={() => setConfirmationOuverte(false)}>
                Annuler
              </Bouton>
              <Bouton apparence="accent" type="button" onClick={confirmer}>
                Confirmer
              </Bouton>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default function PageReinitialiser() {
  return (
    <main className="fadein mx-auto max-w-[440px] px-5 pb-16 pt-12">
      <h1 className="m-0 text-[clamp(1.5rem,3.5vw,2rem)] font-semibold tracking-[-0.025em]">
        Nouveau mot de passe
      </h1>
      <Suspense fallback={<p className="t-small mt-3">Chargement…</p>}>
        <Formulaire />
      </Suspense>
    </main>
  );
}
