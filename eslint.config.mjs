import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/generated/**",
  ]),

  // ── Design system : interdiction des styles inline ─────────────
  // Tout le style passe par les classes de globals.css + Tailwind.
  // Seule exception tolérée (via eslint-disable ciblé) : une valeur
  // réellement dynamique (largeur de progression, image de fond).
  {
    files: ["src/**/*.tsx"],
    rules: {
      "react/forbid-dom-props": [
        "error",
        {
          forbid: [
            {
              propName: "style",
              message:
                "Style inline interdit : utiliser les classes de globals.css ou Tailwind. " +
                "Exception (valeur dynamique) : désactiver la règle sur la ligne avec justification.",
            },
          ],
        },
      ],
    },
  },

  // Exemptions permanentes justifiées :
  // - documents @react-pdf : le style inline est le mécanisme officiel ;
  // - global-error : rend son propre <html> sans globals.css chargé.
  {
    files: [
      "src/composants/portfolio/document-pdf.tsx",
      "src/composants/certificat/document-pdf.tsx",
      "src/app/global-error.tsx",
    ],
    rules: {
      "react/forbid-dom-props": "off",
    },
  },
]);

export default eslintConfig;
