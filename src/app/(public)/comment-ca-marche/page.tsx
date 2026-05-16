// Comment ça marche — port 1:1 de la maquette (PageCommentCaMarche).

import Link from "next/link";
import { Bouton } from "@/composants/maquette/primitifs";
import { Icon } from "@/composants/maquette/icones";

export const metadata = { title: "Comment ça marche" };

export default function PageCommentCaMarche() {
  return (
    <main className="fadein" style={{ padding: "40px 20px 64px", maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 600, letterSpacing: "-0.025em", margin: 0 }}>
        Comment ça marche
      </h1>
      <p style={{ marginTop: 16, fontSize: 16, lineHeight: 1.55, color: "var(--sage-700)" }}>
        JUB n&apos;est ni un job board, ni une école. C&apos;est un parcours encadré qui transforme l&apos;expérience en preuve.
      </p>

      <ol style={{ listStyle: "none", padding: 0, margin: "40px 0 0", display: "grid", gap: 28 }}>
        {[
          { t: "Postule à un job", d: "Catalogue filtré. La majorité des entreprises répondent sous 5 jours." },
          { t: "Travaille avec ton équipe", d: "Kanban, livrables, feedback mentor — tout au même endroit." },
          { t: "Reçois ton certificat", d: "PDF + QR vérifiable publiquement. Ajouté à ton portfolio automatiquement." },
        ].map((e, i) => (
          <li key={i} style={{ display: "flex", gap: 20 }}>
            <div className="t-display" style={{ fontSize: 30, color: "var(--orange-600)", lineHeight: 1, flexShrink: 0, width: 40 }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em" }}>{e.t}</div>
              <p style={{ marginTop: 4, fontSize: 14.5, lineHeight: 1.55, color: "var(--sage-700)" }}>{e.d}</p>
            </div>
          </li>
        ))}
      </ol>

      <div
        style={{
          marginTop: 56,
          paddingTop: 28,
          borderTop: "1px solid var(--bordure)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <span className="t-small">Prêt à commencer ?</span>
        <Bouton as={Link} href="/inscription" variant="accent" iconRight={<Icon.Arrow size={15} />}>
          Créer mon compte
        </Bouton>
      </div>
    </main>
  );
}
