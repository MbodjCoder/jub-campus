"use client";

// Vérification de certificat — saisie d'un numéro public → page /v/[numero].
// Esthétique maquette (en-tête de PageVerifCertificat).

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bouton } from "@/composants/maquette/primitifs";
import { Icon } from "@/composants/maquette/icones";

export default function PageVerifier() {
  const router = useRouter();
  const [numero, setNumero] = useState("");

  return (
    <main className="fadein" style={{ padding: "32px 20px 64px", maxWidth: 520, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
            borderRadius: 999,
            background: "var(--orange-500)",
            color: "var(--sage-950)",
          }}
        >
          <Icon.ShieldCheck size={24} />
        </div>
        <h1 style={{ marginTop: 14, fontSize: "clamp(1.5rem, 3.5vw, 2rem)", fontWeight: 600, letterSpacing: "-0.025em" }}>
          Vérifier un certificat
        </h1>
        <p className="t-small" style={{ marginTop: 6 }}>
          Saisis le numéro public du certificat (ex. JUB-2026-UGB-XXXXXXXX).
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const n = numero.trim();
          if (n) router.push(`/v/${encodeURIComponent(n)}`);
        }}
        style={{ display: "grid", gap: 12 }}
      >
        <input
          className="champ"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          placeholder="JUB-2026-…"
          style={{ textAlign: "center", fontFamily: "var(--fonte-mono)" }}
        />
        <Bouton variant="accent" type="submit" iconRight={<Icon.Arrow size={15} />}>
          Vérifier l&apos;authenticité
        </Bouton>
      </form>

      <div
        style={{
          marginTop: 24,
          padding: 14,
          background: "var(--fond-eleve)",
          borderRadius: 12,
          border: "1px solid var(--bordure)",
        }}
      >
        <p className="t-xs t-discret" style={{ margin: 0, lineHeight: 1.6 }}>
          Chaque certificat JUB porte une empreinte SHA-256 infalsifiable et un QR code. La page de
          vérification confirme l&apos;identité de l&apos;étudiant, le job réalisé et la note obtenue.
        </p>
      </div>
    </main>
  );
}
