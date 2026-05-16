import Link from "next/link";
import { Bouton } from "@/composants/ui/bouton";
import { Champ, ChampEtiquete, Selecteur, ZoneTexte } from "@/composants/ui/champ";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { UNIVERSITES_SENEGAL } from "@/lib/constantes";

export default function PageInscriptionMentor() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <Link href="/inscription" className="text-sm text-jub-vert-700 hover:underline">← Changer de profil</Link>
      </div>
      <Carte>
        <EnteteCarte>
          <TitreCarte>Devenir mentor / professeur</TitreCarte>
          <DescriptionCarte>
            Les mentors encadrent des équipes, donnent du feedback, valident des compétences.
            Ton compte est vérifié avant ton premier encadrement.
          </DescriptionCarte>
        </EnteteCarte>
        <form action="/api/inscription/mentor" method="post">
          <CorpsCarte className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <ChampEtiquete libelle="Prénom" pour="prenom">
                <Champ id="prenom" name="prenom" required />
              </ChampEtiquete>
              <ChampEtiquete libelle="Nom" pour="nom">
                <Champ id="nom" name="nom" required />
              </ChampEtiquete>
            </div>
            <ChampEtiquete libelle="Email" pour="email" aide="Privilégie ton email institutionnel ou pro.">
              <Champ id="email" name="email" type="email" required />
            </ChampEtiquete>
            <ChampEtiquete libelle="Mot de passe" pour="motDePasse">
              <Champ id="motDePasse" name="motDePasse" type="password" required minLength={8} />
            </ChampEtiquete>
            <div className="grid gap-4 sm:grid-cols-2">
              <ChampEtiquete libelle="Type de mentor" pour="type">
                <Selecteur id="type" name="type" required>
                  <option value="PROFESSEUR">Professeur / chercheur</option>
                  <option value="PROFESSIONNEL">Professionnel en activité</option>
                  <option value="ALUMNI">Alumni</option>
                  <option value="EXPERT_INVITE">Expert invité</option>
                </Selecteur>
              </ChampEtiquete>
              <ChampEtiquete libelle="Université d'attache" pour="universite" optionnel>
                <Selecteur id="universite" name="universite" defaultValue="">
                  <option value="">— Aucune —</option>
                  {UNIVERSITES_SENEGAL.map((u) => (
                    <option key={u.acronyme} value={u.acronyme}>{u.acronyme}</option>
                  ))}
                </Selecteur>
              </ChampEtiquete>
            </div>
            <ChampEtiquete libelle="Poste / titre" pour="titreOuPoste" optionnel>
              <Champ id="titreOuPoste" name="titreOuPoste" placeholder="Ex. Maître de conférences, Senior Engineer, …" />
            </ChampEtiquete>
            <ChampEtiquete libelle="Spécialités" pour="specialites" aide="Séparées par des virgules.">
              <Champ id="specialites" name="specialites" placeholder="Machine learning, gestion de projet, marketing…" />
            </ChampEtiquete>
            <ChampEtiquete libelle="Biographie courte" pour="biographie" optionnel>
              <ZoneTexte id="biographie" name="biographie" />
            </ChampEtiquete>
          </CorpsCarte>
          <div className="border-t border-bordure bg-jub-pierre-50 p-5">
            <Bouton apparence="primaire" taille="lg" pleineLargeur type="submit">
              Soumettre ma candidature mentor
            </Bouton>
          </div>
        </form>
      </Carte>
    </section>
  );
}
