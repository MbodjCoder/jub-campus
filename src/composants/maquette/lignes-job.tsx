// Lignes de job — liste compacte cliquable (landing, catalogue).
// Migré maquette → classes : hover CSS (.ligne-item), zéro style inline
// hors image de fond (valeur dynamique).

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon } from "./icones";
import { fmt } from "./format";

export interface ProjetApercu {
  slug: string;
  image: string;
  organisation: string;
  categorieLibelle: string;
  titre: string;
  matchScore?: number | null;
  duree: number;
  montant: number | null;
}

function LigneJob({ projet: p, compacte }: { projet: ProjetApercu; compacte: boolean }) {
  return (
    <Link href={`/projets/${p.slug}`} className="ligne-item">
      <div
        className={cn(
          "relative shrink-0 rounded-[10px] bg-cover bg-center",
          compacte ? "h-[52px] w-[52px]" : "h-14 w-14",
        )}
        // eslint-disable-next-line react/forbid-dom-props -- URL d'image dynamique
        style={{ backgroundImage: `url(${p.image})` }}
      >
        {p.matchScore != null && p.matchScore >= 80 ? (
          <span className="absolute -right-1.5 -top-1.5 rounded-full border-2 border-fond-eleve bg-orange-500 px-1.5 py-0.5 text-[9px] font-extrabold text-sage-950">
            {p.matchScore}%
          </span>
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <div className="t-xs t-discret">
          {p.organisation} · {p.categorieLibelle}
        </div>
        <div className="mt-0.5 truncate text-[15px] font-semibold">{p.titre}</div>
      </div>
      <div className={cn("hide-sm flex shrink-0 items-center", compacte ? "gap-3.5" : "gap-4")}>
        <span className="t-xs t-discret inline-flex items-center gap-1">
          <Icon.Clock size={12} /> {fmt.duree(p.duree)}
        </span>
        <span className={cn("text-[13px] font-bold text-sage-900", !compacte && "min-w-[90px] text-right")}>
          {p.montant != null ? fmt.fcfa(p.montant) : "Apprentissage"}
        </span>
      </div>
      <Icon.ChevronRight size={16} className="shrink-0 text-sage-400" />
    </Link>
  );
}

export function LignePrjet({ projet }: { projet: ProjetApercu }) {
  return <LigneJob projet={projet} compacte />;
}

export function LigneCatalogue({ projet }: { projet: ProjetApercu }) {
  return <LigneJob projet={projet} compacte={false} />;
}
