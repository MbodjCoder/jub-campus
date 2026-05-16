import Link from "next/link";
import { Bouton } from "@/composants/ui/bouton";
import { Champ, ChampEtiquete, Selecteur, ZoneTexte } from "@/composants/ui/champ";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";

export default function PageInscriptionEntreprise() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <Link href="/inscription" className="text-sm text-jub-vert-700 hover:underline">← Changer de profil</Link>
      </div>
      <Carte>
        <EnteteCarte>
          <TitreCarte>Inscription entreprise / organisation</TitreCarte>
          <DescriptionCarte>
            Ton compte sera validé manuellement sous 48h ouvrées (vérification NINEA + email pro).
            Tu pourras publier ton premier projet juste après validation.
          </DescriptionCarte>
        </EnteteCarte>
        <form action="/api/inscription/entreprise" method="post">
          <CorpsCarte className="space-y-5">
            <ChampEtiquete libelle="Raison sociale" pour="raisonSociale">
              <Champ id="raisonSociale" name="raisonSociale" required />
            </ChampEtiquete>
            <div className="grid gap-4 sm:grid-cols-2">
              <ChampEtiquete libelle="Secteur" pour="secteur">
                <Champ id="secteur" name="secteur" required placeholder="Télécoms, banque, ONG, …" />
              </ChampEtiquete>
              <ChampEtiquete libelle="Taille" pour="taille">
                <Selecteur id="taille" name="taille" required>
                  <option value="TRES_PETITE">Moins de 10 personnes</option>
                  <option value="PETITE">10 à 49</option>
                  <option value="MOYENNE">50 à 249</option>
                  <option value="GRANDE">250 et plus</option>
                </Selecteur>
              </ChampEtiquete>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ChampEtiquete libelle="NINEA" pour="ninea" optionnel>
                <Champ id="ninea" name="ninea" />
              </ChampEtiquete>
              <ChampEtiquete libelle="RCCM" pour="rccm" optionnel>
                <Champ id="rccm" name="rccm" />
              </ChampEtiquete>
            </div>
            <ChampEtiquete libelle="Site web" pour="siteWeb" optionnel>
              <Champ id="siteWeb" name="siteWeb" type="url" placeholder="https://" />
            </ChampEtiquete>
            <ChampEtiquete libelle="Email du contact" pour="email" aide="Privilégie une adresse au domaine de l'entreprise.">
              <Champ id="email" name="email" type="email" required autoComplete="email" />
            </ChampEtiquete>
            <ChampEtiquete libelle="Mot de passe" pour="motDePasse">
              <Champ id="motDePasse" name="motDePasse" type="password" required minLength={8} />
            </ChampEtiquete>
            <ChampEtiquete libelle="Décris ton activité" pour="description" optionnel>
              <ZoneTexte id="description" name="description" placeholder="En 2-3 phrases…" />
            </ChampEtiquete>
          </CorpsCarte>
          <div className="border-t border-bordure bg-jub-pierre-50 p-5">
            <Bouton apparence="primaire" taille="lg" pleineLargeur type="submit">
              Demander la validation
            </Bouton>
          </div>
        </form>
      </Carte>
    </section>
  );
}
