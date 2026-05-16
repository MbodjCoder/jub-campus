"use client";

// Inscription — choix du profil, port 1:1 de la maquette (PageInscription
// étape 1). « Continuer » mène au formulaire réel du rôle choisi.

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bouton } from "@/composants/maquette/primitifs";
import { Icon } from "@/composants/maquette/icones";

const ROLES = [
  { v: "etudiant", titre: "Étudiant·e", desc: "Je cherche un job." },
  { v: "entreprise", titre: "Entreprise", desc: "Je publie des jobs." },
  { v: "mentor", titre: "Mentor", desc: "J'encadre des étudiants." },
];

export default function PageInscription() {
  const router = useRouter();
  const [role, setRole] = useState("etudiant");

  return (
    <main className="fadein" style={{ padding: "40px 20px 64px" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2rem)", fontWeight: 600, letterSpacing: "-0.025em", margin: 0 }}>
          Tu es…
        </h1>
        <p className="t-small" style={{ marginTop: 6 }}>
          Choisis ton profil pour créer ton compte.
        </p>

        <div style={{ display: "grid", gap: 8, marginTop: 24 }}>
          {ROLES.map((r) => (
            <button
              key={r.v}
              onClick={() => setRole(r.v)}
              style={{
                textAlign: "left",
                padding: "16px 18px",
                borderRadius: 12,
                background: role === r.v ? "var(--sage-700)" : "white",
                color: role === r.v ? "white" : "inherit",
                border: "1px solid " + (role === r.v ? "var(--sage-700)" : "var(--bordure-forte)"),
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>{r.titre}</div>
                <div style={{ fontSize: 12.5, opacity: role === r.v ? 0.8 : 0.65, marginTop: 2 }}>{r.desc}</div>
              </div>
              {role === r.v ? (
                <Icon.Check size={18} style={{ color: "var(--orange-400)" }} />
              ) : (
                <Icon.ChevronRight size={16} style={{ color: "var(--sage-400)" }} />
              )}
            </button>
          ))}
          <Bouton
            variant="accent"
            taille="lg"
            iconRight={<Icon.Arrow size={15} />}
            onClick={() => router.push(`/inscription/${role}`)}
            style={{ marginTop: 10, width: "100%" }}
          >
            Continuer
          </Bouton>
        </div>

        <p className="t-xs t-discret" style={{ marginTop: 24, textAlign: "center" }}>
          Déjà un compte ?{" "}
          <Link href="/connexion" style={{ color: "var(--orange-600)", fontWeight: 600 }}>
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
