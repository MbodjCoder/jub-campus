// Pour les entreprises — port 1:1 de la maquette (PageEntreprises).

import Link from "next/link";
import { Bouton } from "@/composants/maquette/primitifs";
import { Icon } from "@/composants/maquette/icones";

export const metadata = { title: "Pour les entreprises" };

export default function PageEntreprises() {
  return (
    <main className="fadein" style={{ padding: "40px 20px 64px", maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 600, letterSpacing: "-0.025em", margin: 0 }}>
        Pour les{" "}
        <span className="t-display" style={{ color: "var(--orange-600)", fontSize: "1.05em" }}>
          entreprises.
        </span>
      </h1>
      <p style={{ marginTop: 16, fontSize: 16, lineHeight: 1.55, color: "var(--sage-700)" }}>
        Sourcez les meilleurs étudiants du Sénégal sur de vrais jobs. Évaluez-les en situation. Recrutez sans risque.
      </p>

      <ul style={{ listStyle: "none", padding: 0, margin: "40px 0 0", display: "grid", gap: 22 }}>
        {[
          { t: "Publiez un job", d: "Décrivez le besoin, la rémunération, les compétences. Validé sous 24h." },
          { t: "Recevez les bonnes candidatures", d: "Algorithme de matching sur compétences, niveau et historique." },
          { t: "Suivez tout en temps réel", d: "Kanban, livrables, feedback mentor centralisés." },
          { t: "Recrutez en toute confiance", d: "À la livraison, vous savez exactement qui a fait quoi." },
        ].map((e, i) => (
          <li key={i} style={{ display: "flex", gap: 20 }}>
            <div className="t-display" style={{ fontSize: 24, color: "var(--orange-600)", lineHeight: 1, flexShrink: 0, width: 32 }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{e.t}</div>
              <p style={{ marginTop: 3, fontSize: 14, lineHeight: 1.5, color: "var(--sage-700)" }}>{e.d}</p>
            </div>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 48, padding: 24, background: "var(--sage-900)", borderRadius: 14, color: "white" }}>
        <div className="t-eyebrow" style={{ color: "var(--orange-400)" }}>
          Tarif
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 600, marginTop: 6, color: "white" }}>
          Gratuit pour publier votre premier job.
        </h3>
        <p style={{ marginTop: 6, fontSize: 14, color: "var(--sage-100)" }}>
          Pas d&apos;abonnement. Vous payez les étudiants à la livraison.
        </p>
        <Bouton
          as={Link}
          href="/inscription/entreprise"
          variant="accent"
          taille="md"
          iconRight={<Icon.Arrow size={15} />}
          style={{ marginTop: 18 }}
        >
          Publier un job
        </Bouton>
      </div>
    </main>
  );
}
