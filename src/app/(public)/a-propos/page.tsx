// À propos — port 1:1 de la maquette (PageAbout + Bloc).

import Link from "next/link";
import type { ReactNode } from "react";
import { Bouton } from "@/composants/maquette/primitifs";
import { Icon } from "@/composants/maquette/icones";

export const metadata = { title: "À propos" };

function Bloc({ icon, titre, children }: { icon: ReactNode; titre: string; children: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 14 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "var(--sage-700)",
          color: "var(--orange-400)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 600 }}>{titre}</div>
        <p style={{ marginTop: 3, fontSize: 14, lineHeight: 1.55, color: "var(--sage-700)" }}>{children}</p>
      </div>
    </div>
  );
}

export default function PageAbout() {
  return (
    <main className="fadein" style={{ padding: "40px 20px 64px", maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 600, letterSpacing: "-0.025em", margin: 0 }}>
        À propos de{" "}
        <span className="t-display" style={{ color: "var(--orange-600)", fontSize: "1.05em" }}>
          JUB.
        </span>
      </h1>
      <p style={{ marginTop: 16, fontSize: 17, lineHeight: 1.55, color: "var(--sage-700)" }}>
        <em>
          « Même sans réseau, chaque étudiant peut acquérir une vraie expérience, prouver ses compétences et accéder à
          de meilleures opportunités. »
        </em>
      </p>

      <div style={{ marginTop: 32, display: "grid", gap: 22 }}>
        <Bloc icon={<Icon.MapPin size={16} />} titre="D'où on vient">
          Né à Saint-Louis en 2026, sur le campus de l&apos;UGB.
        </Bloc>
        <Bloc icon={<Icon.Sparkles size={16} />} titre="Ce qu'on fait">
          Une plateforme de jobs par projets, encadrés et certifiés, pour les étudiants du Sénégal.
        </Bloc>
        <Bloc icon={<Icon.ShieldCheck size={16} />} titre="Pourquoi ça compte">
          Chaque certificat est vérifiable publiquement par QR code. Aucune contrefaçon possible.
        </Bloc>
        <Bloc icon={<Icon.Heart size={16} />} titre="Notre promesse">
          Gratuit pour les étudiants. À vie.
        </Bloc>
      </div>

      <div
        style={{
          marginTop: 48,
          padding: 24,
          background: "var(--fond-eleve)",
          borderRadius: 14,
          border: "1px solid var(--bordure)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <span className="t-small">Une question ?</span>
        <Bouton as={Link} href="/contact" variant="primaire" icon={<Icon.Mail size={14} />}>
          Nous contacter
        </Bouton>
      </div>
    </main>
  );
}
