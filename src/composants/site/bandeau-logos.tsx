// Bandeau de logos partenaires en défilement infini horizontal.
// Astuce : on duplique la liste pour que la translation -50% boucle
// sans saut visible.

import { cn } from "@/lib/utils";

interface Partenaire {
  acronyme: string;
  nomComplet: string;
  couleurFond?: string;
}

const PARTENAIRES: Partenaire[] = [
  { acronyme: "UGB",       nomComplet: "Université Gaston Berger" },
  { acronyme: "UCAD",      nomComplet: "Université Cheikh Anta Diop" },
  { acronyme: "UADB",      nomComplet: "Université Alioune Diop Bambey" },
  { acronyme: "UIDT",      nomComplet: "Université Iba Der Thiam" },
  { acronyme: "UASZ",      nomComplet: "Université Assane Seck Ziguinchor" },
  { acronyme: "USSEIN",    nomComplet: "Université du Sine Saloum" },
  { acronyme: "UVS",       nomComplet: "Université Virtuelle du Sénégal" },
  { acronyme: "Sonatel",   nomComplet: "Sonatel" },
  { acronyme: "Orange",    nomComplet: "Orange Sénégal", couleurFond: "bg-orange-500 text-white" },
  { acronyme: "Wave",      nomComplet: "Wave",           couleurFond: "bg-sky-500 text-white" },
  { acronyme: "BNDE",      nomComplet: "Banque Nationale pour le Développement Économique" },
  { acronyme: "Ecobank",   nomComplet: "Ecobank Sénégal" },
  { acronyme: "Senelec",   nomComplet: "Société nationale d'électricité" },
  { acronyme: "Sococim",   nomComplet: "Sococim Industries" },
  { acronyme: "ODC",       nomComplet: "Orange Digital Center" },
  { acronyme: "S.A.E.D.",  nomComplet: "Société d'aménagement et d'exploitation du Delta" },
  { acronyme: "SCL",       nomComplet: "Société de Cultures Industrielles" },
  { acronyme: "ONA",       nomComplet: "Office National de l'Assainissement" },
  { acronyme: "CASL",      nomComplet: "Centre Acoustique Lab" },
  { acronyme: "Min. ESRI", nomComplet: "Ministère de l'Enseignement Supérieur" },
];

export function BandeauLogos({ surFondSombre = false }: { surFondSombre?: boolean }) {
  const liste = [...PARTENAIRES, ...PARTENAIRES];
  return (
    <div className="relative w-full overflow-hidden">
      {/* Dégradés de bord pour fondre le défilement aux extrémités */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-0 top-0 z-10 h-full w-16 sm:w-24",
          surFondSombre
            ? "bg-gradient-to-r from-jub-sage-900 to-transparent"
            : "bg-gradient-to-r from-fond to-transparent",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute right-0 top-0 z-10 h-full w-16 sm:w-24",
          surFondSombre
            ? "bg-gradient-to-l from-jub-sage-900 to-transparent"
            : "bg-gradient-to-l from-fond to-transparent",
        )}
      />

      <div className="jub-marquee flex w-max items-center gap-4 py-4 sm:gap-6 sm:py-6">
        {liste.map((p, i) => (
          <LogoCircle key={`${p.acronyme}-${i}`} partenaire={p} surFondSombre={surFondSombre} />
        ))}
      </div>
    </div>
  );
}

function LogoCircle({ partenaire, surFondSombre }: { partenaire: Partenaire; surFondSombre: boolean }) {
  const fondDefaut = surFondSombre
    ? "bg-jub-sage-50 text-jub-sage-700"
    : "bg-fond-eleve text-jub-sage-700 border border-bordure";
  return (
    <div
      title={partenaire.nomComplet}
      className={cn(
        "flex h-14 w-14 shrink-0 items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-center leading-tight shadow-sm sm:h-16 sm:w-16 sm:text-[11px]",
        partenaire.couleurFond ?? fondDefaut,
      )}
    >
      {partenaire.acronyme}
    </div>
  );
}
