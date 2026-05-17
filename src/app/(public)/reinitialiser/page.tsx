"use client";

// Choix d'un nouveau mot de passe via le lien reçu par email.

import { useState, useTransition, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Bouton } from "@/composants/maquette/primitifs";
import { Icon } from "@/composants/maquette/icones";
import { reinitialiserMotDePasse } from "../mot-de-passe-oublie/actions";

function Formulaire() {
  const sp = useSearchParams();
  const email = sp.get("email") ?? "";
  const jeton = sp.get("jeton") ?? "";

  const [fait, setFait] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, demarrer] = useTransition();

  function soumettre(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("motDePasse") !== fd.get("motDePasseConfirme")) {
      setErreur("Les deux mots de passe ne correspondent pas.");
      return;
    }
    demarrer(async () => {
      const r = await reinitialiserMotDePasse(fd);
      if (r.succes) setFait(true);
      else setErreur(r.message ?? "Erreur.");
    });
  }

  if (!email || !jeton) {
    return <p className="t-small">Lien invalide. Refais une demande de réinitialisation.</p>;
  }

  if (fait) {
    return (
      <div
        style={{
          marginTop: 8,
          padding: 20,
          background: "var(--fond-eleve)",
          border: "1px solid var(--bordure)",
          borderRadius: 14,
          textAlign: "center",
        }}
      >
        <p className="t-small" style={{ margin: "0 0 14px" }}>
          Mot de passe mis à jour. Tu peux te connecter.
        </p>
        <Bouton as={Link} href="/connexion" variant="accent">
          Se connecter
        </Bouton>
      </div>
    );
  }

  return (
    <form onSubmit={soumettre} style={{ marginTop: 20, display: "grid", gap: 12 }}>
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
