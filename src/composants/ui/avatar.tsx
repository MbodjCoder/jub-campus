import { cn } from "@/lib/utils";

interface ProprietesAvatar {
  nom?: string | null;
  /** URL d'image — si absente, on affiche les initiales sur fond coloré. */
  src?: string | null;
  /** Diamètre en pixels. */
  taille?: number;
  className?: string;
}

// Paires [fond, texte] dérivées de façon stable depuis le nom.
const PALETTE: ReadonlyArray<readonly [string, string]> = [
  ["var(--sage-700)", "var(--sage-50)"],
  ["var(--orange-500)", "var(--sage-950)"],
  ["var(--sage-600)", "var(--orange-200)"],
  ["var(--sage-800)", "var(--orange-300)"],
];

/** Avatar — image ou initiales sur couleur stable dérivée du nom. */
export function Avatar({ nom, src, taille = 32, className }: ProprietesAvatar) {
  const propre = (nom ?? "?").trim();
  const initiales = propre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase() || "?";

  const graine = propre.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const [fond, couleurTexte] = PALETTE[graine % PALETTE.length];

  return (
    <span
      className={cn("avatar", className)}
      // eslint-disable-next-line react/forbid-dom-props -- diamètre et image dynamiques
      style={{
        width: taille,
        height: taille,
        fontSize: Math.round(taille * 0.38),
        background: src ? `center/cover no-repeat url(${src})` : fond,
        color: couleurTexte,
      }}
      aria-label={nom ?? undefined}
    >
      {src ? null : initiales}
    </span>
  );
}
