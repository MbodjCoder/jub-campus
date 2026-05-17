/* JUB Campus · Primitives UI — port 1:1 de la maquette (components.jsx).
   Styles inline conservés tels quels pour fidélité pixel-perfect. */

import type { CSSProperties, ReactNode, ElementType } from "react";
import { Icon } from "./icones";

// ── Logo ────────────────────────────────────────────────────────
export const Logo = ({
  size = "md", mot = true, blanc = false,
}: {
  size?: "md" | "lg" | "xl";
  mot?: boolean;
  blanc?: boolean;
}) => {
  const cls =
    size === "lg" ? "logo-pastille logo-pastille--lg"
    : size === "xl" ? "logo-pastille logo-pastille--xl"
    : "logo-pastille";
  const fs = size === "lg" ? 22 : size === "xl" ? 30 : 16;
  return (
    // Cadre du logo — fond sage-500 (couleur du point central du logo),
    // appliqué partout pour une identité cohérente sur toutes les pages.
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 9,
        background: "var(--sage-500)",
        border: "1px solid var(--sage-600)",
        borderRadius: 999,
        padding: "5px 13px",
      }}
    >
      <span className={cls + (blanc ? " logo-pastille--blanc" : "")} />
      {mot ? (
        <span className="logo-mot" style={{ fontSize: fs, color: "var(--orange-500)" }}>
          JUB
        </span>
      ) : null}
    </span>
  );
};

// ── Pilule ──────────────────────────────────────────────────────
export const Pilule = ({
  children, variant = "defaut", icon,
}: {
  children: ReactNode;
  variant?: "defaut" | "orange" | "sage" | "neutre" | "ghost";
  icon?: ReactNode;
}) => {
  const cls =
    variant === "orange" ? "pilule pilule--orange"
    : variant === "sage" ? "pilule pilule--sage"
    : variant === "neutre" ? "pilule pilule--neutre"
    : variant === "ghost" ? "pilule pilule--ghost"
    : "pilule";
  return (
    <span className={cls}>
      {icon}
      {children}
    </span>
  );
};

// ── Bouton ──────────────────────────────────────────────────────
interface ProprietesBouton {
  children?: ReactNode;
  variant?: "primaire" | "accent" | "contour" | "fantome" | "sombre" | "lien";
  taille?: "sm" | "md" | "lg" | "xl";
  icon?: ReactNode;
  iconRight?: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  as?: ElementType;
  href?: string;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  name?: string;
  value?: string;
}

export const Bouton = ({
  children, variant = "primaire", taille = "md", icon, iconRight,
  onClick, type = "button", as: As = "button", className, ...rest
}: ProprietesBouton) => {
  const cls = `btn btn--${variant}${taille !== "md" ? ` btn--${taille}` : ""}${className ? ` ${className}` : ""}`;
  return (
    <As className={cls} onClick={onClick} type={As === "button" ? type : undefined} {...rest}>
      {icon}
      {children}
      {iconRight}
    </As>
  );
};

// ── Carte ───────────────────────────────────────────────────────
export const Carte = ({
  children, variant = "defaut", className = "", style, onClick,
}: {
  children: ReactNode;
  variant?: "defaut" | "plate" | "sombre";
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}) => {
  const cls =
    variant === "plate" ? "carte carte--plate"
    : variant === "sombre" ? "carte carte--sombre"
    : "carte";
  return (
    <div className={`${cls} ${className}`} style={style} onClick={onClick}>
      {children}
    </div>
  );
};

// ── Avatar ──────────────────────────────────────────────────────
const PALETTE_AVATAR: ReadonlyArray<readonly [string, string]> = [
  ["var(--sage-700)", "var(--sage-50)"],
  ["var(--orange-500)", "var(--sage-950)"],
  ["var(--sage-600)", "var(--orange-200)"],
  ["var(--sage-800)", "var(--orange-300)"],
];

export const Avatar = ({
  nom, src, size = 32, taille,
}: {
  nom?: string | null;
  src?: string | null;
  size?: number;
  taille?: number;
}) => {
  const initiales =
    (nom || "?").split(" ").filter(Boolean).slice(0, 2).map((s) => s[0]).join("").toUpperCase();
  const dim = taille || size;
  const fs = Math.round(dim * 0.38);
  const seed = (nom || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const [bg, fg] = PALETTE_AVATAR[seed % PALETTE_AVATAR.length];
  return (
    <span
      className="avatar"
      style={{
        width: dim, height: dim, fontSize: fs,
        background: src ? `url(${src}) center/cover` : bg,
        color: fg,
      }}
    >
      {!src ? initiales : null}
    </span>
  );
};

// ── Stat ────────────────────────────────────────────────────────
export const Stat = ({
  libelle, valeur, indication, icon,
}: {
  libelle: string;
  valeur: ReactNode;
  indication?: ReactNode;
  icon?: ReactNode;
}) => (
  <div>
    {icon ? <div style={{ color: "var(--sage-600)", marginBottom: 6 }}>{icon}</div> : null}
    <div className="t-eyebrow" style={{ marginBottom: 4 }}>{libelle}</div>
    <div style={{ fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.02em" }}>{valeur}</div>
    {indication ? <div className="t-xs t-discret" style={{ marginTop: 2 }}>{indication}</div> : null}
  </div>
);

// ── Couleurs sémantiques des modes de rémunération ──────────────
export const MODE_REM: Record<string, { libelle: string; icon: ReactNode; classe: string }> = {
  APPRENTISSAGE: { libelle: "Apprentissage", icon: <Icon.GraduationCap size={14} />, classe: "pilule" },
  PRIME: { libelle: "Avec prime", icon: <Icon.Award size={14} />, classe: "pilule pilule--orange" },
  REMUNERE: { libelle: "Rémunéré", icon: <Icon.Wallet size={14} />, classe: "pilule pilule--sage" },
  SPONSORISE: { libelle: "Sponsorisé", icon: <Icon.Sparkles size={14} />, classe: "pilule" },
};
