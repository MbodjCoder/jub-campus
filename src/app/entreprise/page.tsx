import Link from "next/link";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { Bouton } from "@/composants/ui/bouton";

export default function TableauEntreprise() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Espace entreprise</h1>
          <p className="text-texte-discret">Sonatel — compte validé.</p>
        </div>
        <Link href="/entreprise/publier"><Bouton apparence="accent">Publier un projet</Bouton></Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-4">
        <Stat libelle="Projets actifs" valeur="2" />
        <Stat libelle="Candidatures à traiter" valeur="14" />
        <Stat libelle="Livrables à valider" valeur="3" />
        <Stat libelle="Talents recommandés" valeur="8" />
      </div>

      <div className="mt-10 space-y-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-texte-discret">Mes projets</h2>
        {[
          { titre: "Refonte billetterie", statut: "EN_COURS", candidatures: 12, places: 3 },
          { titre: "Migration data warehouse", statut: "PUBLIE", candidatures: 7, places: 2 },
        ].map((p) => (
          <Carte key={p.titre}>
            <CorpsCarte className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium">{p.titre}</p>
                <p className="text-xs text-texte-discret">{p.candidatures} candidatures · {p.places} places</p>
              </div>
              <Insigne ton={p.statut === "EN_COURS" ? "vert" : "bleu"}>{p.statut}</Insigne>
              <Bouton apparence="contour" taille="sm">Ouvrir</Bouton>
            </CorpsCarte>
          </Carte>
        ))}
      </div>
    </div>
  );
}

function Stat({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <Carte>
      <CorpsCarte>
        <p className="text-xs uppercase tracking-wider text-texte-discret">{libelle}</p>
        <p className="text-2xl font-bold">{valeur}</p>
      </CorpsCarte>
    </Carte>
  );
}
