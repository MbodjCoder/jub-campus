import Link from "next/link";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { Bouton } from "@/composants/ui/bouton";

export default function TableauDeBordEtudiant() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Bienvenue, Aïssatou 👋</h1>
        <p className="text-texte-discret">Voici où tu en es aujourd&apos;hui.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CarteStat libelle="Score JUB" valeur="1 247" indication="+128 cette semaine" />
        <CarteStat libelle="Projets actifs" valeur="1" indication="Sonatel · Refonte billetterie" />
        <CarteStat libelle="Candidatures en cours" valeur="2" indication="1 en attente · 1 entretien" />
        <CarteStat libelle="Certificats obtenus" valeur="3" indication="Tous publics" />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <SectionTitre>Projets recommandés pour toi</SectionTitre>
          {[
            { titre: "Dashboard interne — Sococim", duree: "4 sem", mode: "Avec prime", score: 92 },
            { titre: "Étude sur l'accès à l'eau — ONG EPT", duree: "5 sem", mode: "Sponsorisé", score: 78 },
          ].map((p) => (
            <Carte key={p.titre}>
              <CorpsCarte className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{p.titre}</p>
                  <p className="text-xs text-texte-discret">{p.duree} · {p.mode}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Insigne ton="vert">{p.score}% match</Insigne>
                  <Link href="/projets"><Bouton apparence="contour" taille="sm">Voir</Bouton></Link>
                </div>
              </CorpsCarte>
            </Carte>
          ))}
        </div>

        <div className="space-y-4">
          <SectionTitre>Tâches du jour</SectionTitre>
          <Carte>
            <CorpsCarte className="space-y-3 text-sm">
              {["Finaliser maquette panier", "Tester le tunnel de paiement", "Préparer entretien utilisateur"].map((t) => (
                <label key={t} className="flex items-start gap-2">
                  <input type="checkbox" className="mt-0.5" />
                  <span>{t}</span>
                </label>
              ))}
            </CorpsCarte>
          </Carte>

          <SectionTitre>Livrables à déposer</SectionTitre>
          <Carte>
            <CorpsCarte>
              <DescriptionCarte>Tu as 1 livrable à déposer avant <strong>vendredi 17h</strong>.</DescriptionCarte>
              <Link href="#" className="mt-3 inline-block text-sm font-medium text-jub-vert-700 hover:underline">
                Déposer maintenant →
              </Link>
            </CorpsCarte>
          </Carte>
        </div>
      </div>
    </>
  );
}

function CarteStat({ libelle, valeur, indication }: { libelle: string; valeur: string; indication?: string }) {
  return (
    <Carte>
      <CorpsCarte className="space-y-1">
        <p className="text-xs uppercase tracking-wider text-texte-discret">{libelle}</p>
        <p className="text-2xl font-bold">{valeur}</p>
        {indication ? <p className="text-xs text-texte-discret">{indication}</p> : null}
      </CorpsCarte>
    </Carte>
  );
}

function SectionTitre({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-semibold uppercase tracking-wider text-texte-discret">{children}</h2>;
}
