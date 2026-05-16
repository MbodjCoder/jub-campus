import { Carte, CorpsCarte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { Champ, ChampEtiquete, ZoneTexte } from "@/composants/ui/champ";
import { Bouton } from "@/composants/ui/bouton";

export default function PageContact() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <Carte>
        <EnteteCarte>
          <TitreCarte>Une question, un projet, un partenariat ?</TitreCarte>
          <DescriptionCarte>
            Réponse sous 48h ouvrées. Pour les étudiants, le plus rapide est de
            créer ton compte — tu seras guidé.
          </DescriptionCarte>
        </EnteteCarte>
        <form action="/api/contact" method="post">
          <CorpsCarte className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <ChampEtiquete libelle="Nom" pour="nom">
                <Champ id="nom" name="nom" required />
              </ChampEtiquete>
              <ChampEtiquete libelle="Email" pour="email">
                <Champ id="email" name="email" type="email" required />
              </ChampEtiquete>
            </div>
            <ChampEtiquete libelle="Organisation" pour="organisation" optionnel>
              <Champ id="organisation" name="organisation" />
            </ChampEtiquete>
            <ChampEtiquete libelle="Message" pour="message">
              <ZoneTexte id="message" name="message" required rows={6} />
            </ChampEtiquete>
          </CorpsCarte>
          <div className="border-t border-bordure bg-jub-pierre-50 p-5">
            <Bouton apparence="primaire" taille="lg" pleineLargeur type="submit">
              Envoyer le message
            </Bouton>
          </div>
        </form>
      </Carte>
    </section>
  );
}
