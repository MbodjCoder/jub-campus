import { Bouton } from "@/composants/ui/bouton";
import { Champ, ChampEtiquete, Selecteur, ZoneTexte } from "@/composants/ui/champ";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { LIBELLES_CATEGORIE, LIBELLES_NIVEAU_PROJET, LIBELLES_MODE_REMUNERATION } from "@/lib/constantes";

export const metadata = { title: "Publier un projet" };

export default function PagePublierProjet() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Carte>
        <EnteteCarte>
          <TitreCarte>Publier un projet</TitreCarte>
          <DescriptionCarte>
            Le projet sera modéré par l&apos;équipe JUB avant publication (généralement sous 24h).
          </DescriptionCarte>
        </EnteteCarte>
        <form action="/api/projets" method="post">
          <CorpsCarte className="space-y-5">
            <ChampEtiquete libelle="Titre du projet" pour="titre">
              <Champ id="titre" name="titre" required placeholder="Ex. Refonte de la billetterie en ligne" />
            </ChampEtiquete>

            <ChampEtiquete libelle="Résumé" pour="resume" aide="1-2 phrases. Affiché sur la carte projet.">
              <Champ id="resume" name="resume" required maxLength={200} />
            </ChampEtiquete>

            <ChampEtiquete libelle="Description complète" pour="description" aide="Contexte, objectifs, livrables attendus. Markdown supporté.">
              <ZoneTexte id="description" name="description" required rows={10} />
            </ChampEtiquete>

            <div className="grid gap-4 sm:grid-cols-2">
              <ChampEtiquete libelle="Catégorie" pour="categorie">
                <Selecteur id="categorie" name="categorie" required>
                  {Object.entries(LIBELLES_CATEGORIE).map(([cle, libelle]) => (
                    <option key={cle} value={cle}>{libelle}</option>
                  ))}
                </Selecteur>
              </ChampEtiquete>
              <ChampEtiquete libelle="Niveau" pour="niveau">
                <Selecteur id="niveau" name="niveau" required>
                  {Object.entries(LIBELLES_NIVEAU_PROJET).map(([cle, libelle]) => (
                    <option key={cle} value={cle}>{libelle}</option>
                  ))}
                </Selecteur>
              </ChampEtiquete>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <ChampEtiquete libelle="Durée (jours)" pour="dureeJours">
                <Champ id="dureeJours" name="dureeJours" type="number" min={3} max={365} required defaultValue={28} />
              </ChampEtiquete>
              <ChampEtiquete libelle="Places dans l'équipe" pour="placesMax">
                <Champ id="placesMax" name="placesMax" type="number" min={1} max={20} required defaultValue={3} />
              </ChampEtiquete>
              <ChampEtiquete libelle="Mode de rémunération" pour="modeRemuneration">
                <Selecteur id="modeRemuneration" name="modeRemuneration" required>
                  {Object.entries(LIBELLES_MODE_REMUNERATION).map(([cle, libelle]) => (
                    <option key={cle} value={cle}>{libelle}</option>
                  ))}
                </Selecteur>
              </ChampEtiquete>
            </div>

            <ChampEtiquete libelle="Montant (FCFA)" pour="montantFcfa" optionnel aide="Laisser vide pour un projet d'apprentissage non rémunéré.">
              <Champ id="montantFcfa" name="montantFcfa" type="number" min={0} />
            </ChampEtiquete>

            <ChampEtiquete libelle="Compétences attendues" pour="competences" aide="Séparées par des virgules. Ex. Next.js, Figma, UX recherche.">
              <Champ id="competences" name="competences" required />
            </ChampEtiquete>
          </CorpsCarte>
          <div className="border-t border-bordure bg-jub-pierre-50 p-5">
            <Bouton apparence="primaire" taille="lg" pleineLargeur type="submit">
              Soumettre pour validation
            </Bouton>
          </div>
        </form>
      </Carte>
    </div>
  );
}
