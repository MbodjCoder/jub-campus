"use client";

// Demande de réinitialisation de mot de passe.

import { useState, useTransition } from "react";
import Link from "next/link";
import { Bouton } from "@/composants/maquette/primitifs";
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
    <main className="fadein" style={{ padding: "48px 20px 64px", maxWidth: 440, margin: "0 auto" }}>
      <h1 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2rem)", fontWeight: 600, letterSpacing: "-0.025em", margin: 0 }}>
        Mot de passe oublié
      </h1>

      {envoye ? (
        <div
          style={{
            marginTop: 24,
            padding: 20,
            background: "var(--fond-eleve)",
            border: "1px solid var(--bordure)",
            borderRadius: 14,
          }}
        >
          <p className="t-small" style={{ margin: 0 }}>
            Si un compte existe avec cet email, un lien de réinitialisation vient d&apos;être
            envoyé. Vérifie ta boîte de réception (et les spams).
          </p>
        </div>
      ) : (
        <>
          <p className="t-small" style={{ marginTop: 6 }}>
            Saisis ton email — on t&apos;envoie un lien pour choisir un nouveau mot de passe.
          </p>
          <form onSubmit={soumettre} style={{ marginTop: 20, display: "grid", gap: 12 }}>
            <input className="champ" type="email" name="email" placeholder="ton.email@univ.edu.sn" required />
            {erreur ? (
              <p style={{ margin: 0, color: "var(--danger)", fontSize: 13 }}>{erreur}</p>
            ) : null}
            <Bouton variant="accent" type="submit" disabled={enCours} iconRight={<Icon.Arrow size={15} />}>
              {enCours ? "Envoi…" : "Envoyer le lien"}
            </Bouton>
          </form>
        </>
      )}

      <p className="t-xs t-discret" style={{ marginTop: 22, textAlign: "center" }}>
        <Link href="/connexion" style={{ color: "var(--orange-600)", fontWeight: 600 }}>
          Retour à la connexion
        </Link>
      </p>
    </main>
  );
}
