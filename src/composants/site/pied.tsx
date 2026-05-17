"use client";

// Pied de page public — port 1:1 de la maquette (screens-public.jsx · FooterPublic).

import Link from "next/link";
import { Logo } from "@/composants/maquette/primitifs";
import { Icon } from "@/composants/maquette/icones";

const LIENS = [
  { l: "À propos", href: "/a-propos" },
  { l: "Comment ça marche", href: "/comment-ca-marche" },
  { l: "Entreprises", href: "/entreprises" },
  { l: "Vérifier un certificat", href: "/verifier" },
  { l: "Contact", href: "/contact" },
];

const SOCIALS = [
  { l: "WhatsApp", icon: <Icon.Whatsapp size={15} />, href: "https://wa.me/221XXXXXXXXX", couleur: "#25D366" },
  { l: "Facebook", icon: <Icon.Facebook size={15} />, href: "https://facebook.com/jubcampus", couleur: "#1877F2" },
  { l: "Instagram", icon: <Icon.Instagram size={15} />, href: "https://instagram.com/jubcampus", couleur: "#E4405F" },
  { l: "TikTok", icon: <Icon.Tiktok size={15} />, href: "https://tiktok.com/@jubcampus", couleur: "#010101" },
  { l: "LinkedIn", icon: <Icon.Linkedin size={15} />, href: "https://linkedin.com/company/jubcampus", couleur: "#0A66C2" },
  { l: "Email", icon: <Icon.Mail size={15} />, href: "mailto:contact@jubcampus.sn", couleur: "#5f6c57" },
];

export function PiedSite() {
  return (
    <footer style={{ padding: "40px 20px 28px", marginTop: 64, borderTop: "1px solid var(--bordure)" }}>
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        {/* Bloc identité */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo mot />
          <span className="t-xs t-discret">·</span>
          <span className="t-xs t-discret">Sénégal</span>
        </div>

        {/* Liens texte */}
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          {LIENS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="t-xs"
              style={{ cursor: "pointer", color: "var(--sage-700)", fontWeight: 500 }}
            >
              {item.l}
            </Link>
          ))}
        </div>

        {/* Icônes sociales */}
        <div style={{ display: "flex", gap: 4 }}>
          {SOCIALS.map((s) => (
            <a
              key={s.l}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.l}
              title={s.l}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 30,
                height: 30,
                borderRadius: 999,
                color: s.couleur,
                transition: "background 120ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--fond-eleve)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      <div
        style={{
          maxWidth: 1180,
          margin: "24px auto 0",
          paddingTop: 16,
          borderTop: "1px solid var(--bordure)",
          textAlign: "center",
        }}
      >
        <span className="t-xs t-discret">© 2026 JUB</span>
      </div>
    </footer>
  );
}
