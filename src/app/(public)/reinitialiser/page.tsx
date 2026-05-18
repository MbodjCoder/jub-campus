"use client";

import { Suspense, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Bouton } from "@/composants/maquette/primitifs";
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
      <form ref={formRef} onSubmit={soumettre} style={{ marginTop: 20, display: "grid", gap: 12 }}>
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
        {erreur ? <p style={{ margin: 0, color: "var(--danger)", fontSize: 13 }}>{erreur}</p> : null}
        <Bouton variant="accent" type="submit" disabled={enCours} iconRight={<Icon.Check size={15} />}>
          {enCours ? "Mise à jour…" : "Réinitialiser"}
        </Bouton>
      </form>

      {confirmationOuverte ? (
        <div
          role="alertdialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 120,
            display: "grid",
            placeItems: "center",
            padding: 16,
            background: "rgba(20,26,19,0.5)",
          }}
        >
          <div style={{ width: "100%", maxWidth: 420, borderRadius: 16, background: "white", padding: 20 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Confirmer le changement</h2>
            <p className="t-small" style={{ marginTop: 10 }}>
              Tu vas modifier ton mot de passe. Le lien de réinitialisation sera immédiatement invalidé.
            </p>
            <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <Bouton variant="fantome" type="button" onClick={() => setConfirmationOuverte(false)}>
                Annuler
              </Bouton>
              <Bouton variant="accent" type="button" onClick={confirmer}>
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
    <main className="fadein" style={{ padding: "48px 20px 64px", maxWidth: 440, margin: "0 auto" }}>
      <h1 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2rem)", fontWeight: 600, letterSpacing: "-0.025em", margin: 0 }}>
        Nouveau mot de passe
      </h1>
      <Suspense fallback={<p className="t-small" style={{ marginTop: 12 }}>Chargement…</p>}>
        <Formulaire />
      </Suspense>
    </main>
  );
}
