"use client";

// Contact — port 1:1 de la maquette (PageContact).

import { useState, useTransition } from "react";
import { Bouton } from "@/composants/maquette/primitifs";
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
    <main className="fadein" style={{ padding: "40px 20px 64px", maxWidth: 520, margin: "0 auto" }}>
      <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 600, letterSpacing: "-0.025em", margin: 0 }}>
        Contact
      </h1>
      <p className="t-small" style={{ marginTop: 6 }}>
        Réponse sous 24h ouvrées.
      </p>

      {envoye ? (
        <div
          style={{
            marginTop: 32,
            padding: 24,
            background: "var(--fond-eleve)",
            borderRadius: 14,
            border: "1px solid var(--bordure)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: 999,
              background: "var(--orange-500)",
              color: "var(--sage-950)",
            }}
          >
            <Icon.Check size={20} />
          </div>
          <div style={{ marginTop: 12, fontSize: 15, fontWeight: 600 }}>Message envoyé</div>
          <p className="t-small" style={{ marginTop: 6 }}>
            Nous te répondons rapidement.
          </p>
        </div>
      ) : (
        <form onSubmit={soumettre} style={{ marginTop: 24, display: "grid", gap: 12 }}>
          <div>
            <label className="t-xs" style={{ fontWeight: 600 }}>
              Email
            </label>
            <input className="champ" name="email" type="email" placeholder="ton.email@univ.edu.sn" required style={{ marginTop: 4 }} />
          </div>
          <div>
            <label className="t-xs" style={{ fontWeight: 600 }}>
              Sujet
            </label>
            <select className="champ" name="sujet" style={{ appearance: "auto", marginTop: 4 }}>
              <option>Question générale</option>
              <option>Partenariat université</option>
              <option>Partenariat entreprise</option>
              <option>Bug / problème technique</option>
              <option>Presse</option>
            </select>
          </div>
          <div>
            <label className="t-xs" style={{ fontWeight: 600 }}>
              Message
            </label>
            <textarea className="champ champ--ta" name="message" rows={5} placeholder="Dis-nous tout…" required minLength={10} style={{ marginTop: 4 }} />
          </div>
          {erreur ? (
            <p
              style={{
                margin: 0,
                background: "color-mix(in oklab, var(--danger) 10%, transparent)",
                color: "var(--danger)",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 13,
              }}
            >
              {erreur}
            </p>
          ) : null}
          <Bouton variant="accent" type="submit" iconRight={<Icon.Send size={14} />} style={{ marginTop: 8 }} disabled={enCours}>
            {enCours ? "Envoi…" : "Envoyer"}
          </Bouton>
        </form>
      )}

      <div
        style={{
          marginTop: 28,
          paddingTop: 20,
          borderTop: "1px solid var(--bordure)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span className="t-xs t-discret">Ou directement par email</span>
        <a
          href="mailto:contact@jubcampus.sn"
          style={{ color: "var(--orange-600)", fontSize: 13, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}
        >
          <Icon.Mail size={13} /> contact@jubcampus.sn
        </a>
      </div>
    </main>
  );
}
