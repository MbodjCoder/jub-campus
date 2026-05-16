// Bandeau de logos partenaires en défilement infini horizontal.
// Cherche chaque logo dans /public/logos/{slug}.{svg|png}.
// Fallback automatique vers une pastille texte si le fichier manque.

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Partenaire {
  slug: string;          // nom de fichier attendu dans /public/logos/
  acronyme: string;      // fallback texte
  nomComplet: string;
  extensions?: string[]; // par défaut ["svg", "png"]
  couleurTexteFallback?: string; // tailwind class
}

// Référentiel des partenaires. L'ordre est respecté dans le bandeau.
const PARTENAIRES: Partenaire[] = [
  { slug: "ugb",     acronyme: "UGB",     nomComplet: "Université Gaston Berger" },
  { slug: "ucad",    acronyme: "UCAD",    nomComplet: "Université Cheikh Anta Diop" },
  { slug: "uadb",    acronyme: "UADB",    nomComplet: "Université Alioune Diop Bambey" },
  { slug: "uidt",    acronyme: "UIDT",    nomComplet: "Université Iba Der Thiam" },
  { slug: "uasz",    acronyme: "UASZ",    nomComplet: "Université Assane Seck Ziguinchor" },
  { slug: "ussein",  acronyme: "USSEIN",  nomComplet: "Université du Sine Saloum" },
  { slug: "uvs",     acronyme: "UVS",     nomComplet: "Université Virtuelle du Sénégal" },
  { slug: "sonatel", acronyme: "Sonatel", nomComplet: "Sonatel" },
  { slug: "orange",  acronyme: "Orange",  nomComplet: "Orange Sénégal", couleurTexteFallback: "text-orange-600" },
  { slug: "wave",    acronyme: "Wave",    nomComplet: "Wave Mobile Money", couleurTexteFallback: "text-sky-600" },
  { slug: "bnde",    acronyme: "BNDE",    nomComplet: "Banque Nationale pour le Développement Économique" },
  { slug: "ecobank", acronyme: "Ecobank", nomComplet: "Ecobank Sénégal" },
  { slug: "senelec", acronyme: "Senelec", nomComplet: "Société nationale d'électricité du Sénégal" },
  { slug: "sococim", acronyme: "Sococim", nomComplet: "Sococim Industries" },
  { slug: "odc",     acronyme: "ODC",     nomComplet: "Orange Digital Center" },
  { slug: "saed",    acronyme: "SAED",    nomComplet: "Société d'aménagement et d'exploitation du Delta" },
  { slug: "scl",     acronyme: "SCL",     nomComplet: "Société de Cultures Industrielles" },
  { slug: "ona",     acronyme: "ONA",     nomComplet: "Office National de l'Assainissement" },
  { slug: "casl",    acronyme: "CASL",    nomComplet: "Centre Acoustique Lab" },
  { slug: "mesri",   acronyme: "MESRI",   nomComplet: "Ministère de l'Enseignement Supérieur" },
];

export function BandeauLogos({ surFondSombre = false }: { surFondSombre?: boolean }) {
  const liste = [...PARTENAIRES, ...PARTENAIRES];
  return (
    <div className="relative w-full overflow-hidden">
      {/* Dégradés de bord pour fondre le défilement aux extrémités */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-0 top-0 z-10 h-full w-20 sm:w-32",
          surFondSombre
            ? "bg-gradient-to-r from-jub-sage-900 to-transparent"
            : "bg-gradient-to-r from-fond to-transparent",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute right-0 top-0 z-10 h-full w-20 sm:w-32",
          surFondSombre
            ? "bg-gradient-to-l from-jub-sage-900 to-transparent"
            : "bg-gradient-to-l from-fond to-transparent",
        )}
      />

      <div className="jub-marquee flex w-max items-center gap-6 py-6 sm:gap-8 sm:py-8">
        {liste.map((p, i) => (
          <CarteLogo key={`${p.slug}-${i}`} partenaire={p} />
        ))}
      </div>
    </div>
  );
}

function CarteLogo({ partenaire }: { partenaire: Partenaire }) {
  const extensions = partenaire.extensions ?? ["svg", "png"];
  const [indexExt, setIndexExt] = useState(0);
  const [echec, setEchec] = useState(false);

  const cheminLogo = `/logos/${partenaire.slug}.${extensions[indexExt]}`;

  return (
    <div
      title={partenaire.nomComplet}
      className="group flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white p-3 shadow-md transition-all hover:scale-105 hover:shadow-xl sm:h-28 sm:w-28 sm:p-4"
    >
      {!echec ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cheminLogo}
          alt={partenaire.nomComplet}
          className="h-full w-full object-contain"
          loading="lazy"
          onError={() => {
            // Essaie l'extension suivante avant d'abandonner.
            if (indexExt < extensions.length - 1) {
              setIndexExt((i) => i + 1);
            } else {
              setEchec(true);
            }
          }}
        />
      ) : (
        <Fallback partenaire={partenaire} />
      )}
    </div>
  );
}

function Fallback({ partenaire }: { partenaire: Partenaire }) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center rounded-xl bg-gradient-to-br from-jub-sage-50 to-jub-pierre-100 px-1 text-center",
        partenaire.couleurTexteFallback ?? "text-jub-sage-700",
      )}
    >
      <span className="text-sm font-extrabold leading-tight tracking-tight sm:text-base">
        {partenaire.acronyme}
      </span>
    </div>
  );
}
