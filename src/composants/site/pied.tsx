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
  { l: "WhatsApp", icon: <Icon.Whatsapp size={15} />, href: "https://wa.me/221XXXXXXXXX" },
  { l: "Facebook", icon: <Icon.Facebook size={15} />, href: "https://facebook.com/jubcampus" },
  { l: "Instagram", icon: <Icon.Instagram size={15} />, href: "https://instagram.com/jubcampus" },
  { l: "TikTok", icon: <Icon.Tiktok size={15} />, href: "https://tiktok.com/@jubcampus" },
  { l: "LinkedIn", icon: <Icon.Linkedin size={15} />, href: "https://linkedin.com/company/jubcampus" },
  { l: "Email", icon: <Icon.Mail size={15} />, href: "mailto:contact@jubcampus.sn" },
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
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "var(--pierre-300)",
              border: "1px solid var(--bordure-forte)",
              borderRadius: 999,
              padding: "5px 13px",
            }}
          >
            <Logo mot />
          </span>
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
                color: "var(--sage-600)",
                transition: "all 120ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--sage-700)";
                e.currentTarget.style.color = "var(--orange-400)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--sage-600)";
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
