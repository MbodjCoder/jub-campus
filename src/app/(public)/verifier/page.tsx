"use client";

// Vérification de certificat — saisie d'un numéro public → page /v/[numero].
// Esthétique maquette (en-tête de PageVerifCertificat).

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bouton } from "@/composants/ui/bouton";
import { Icon } from "@/composants/maquette/icones";

export default function PageVerifier() {
  const router = useRouter();
  const [numero, setNumero] = useState("");

  return (
    <main className="fadein mx-auto max-w-[520px] px-5 pb-16 pt-8">
      <div className="mb-7 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-sage-950">
          <Icon.ShieldCheck size={24} />
        </div>
        <h1 className="mt-3.5 text-[clamp(1.5rem,3.5vw,2rem)] font-semibold tracking-[-0.025em]">
          Vérifier un certificat
        </h1>
        <p className="t-small mt-1.5">
          Saisis le numéro public du certificat (ex. JUB-2026-UGB-XXXXXXXX).
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const n = numero.trim();
          if (n) router.push(`/v/${encodeURIComponent(n)}`);
        }}
        className="grid gap-3"
      >
        <input
          className="champ t-mono text-center"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          placeholder="JUB-2026-…"
        />
        <Bouton apparence="accent" type="submit">
          Vérifier l&apos;authenticité <Icon.Arrow size={15} />
        </Bouton>
      </form>

      <div className="mt-6 rounded-xl border border-bordure bg-fond-eleve p-3.5">
        <p className="t-xs t-discret m-0 leading-[1.6]">
          Chaque certificat JUB porte une empreinte SHA-256 infalsifiable et un QR code. La page de
          vérification confirme l&apos;identité de l&apos;étudiant, le job réalisé et la note obtenue.
        </p>
      </div>
    </main>
  );
}
