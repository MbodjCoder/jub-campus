import Link from "next/link";
import { Bouton } from "@/composants/ui/bouton";
import { Champ, ChampEtiquete, Selecteur } from "@/composants/ui/champ";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { UNIVERSITES_SENEGAL, LIBELLES_NIVEAU_ETUDE } from "@/lib/constantes";

export default function PageInscriptionEtudiant() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <Link href="/inscription" className="text-sm text-jub-vert-700 hover:underline">← Changer de profil</Link>
      </div>
      <Carte>
        <EnteteCarte>
          <TitreCarte>Crée ton compte étudiant</TitreCarte>
          <DescriptionCarte>
            Étape 1 sur 3 — informations de base. Tu pourras compléter ton profil ensuite.
          </DescriptionCarte>
        </EnteteCarte>
        <form action="/api/inscription/etudiant" method="post">
          <CorpsCarte className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <ChampEtiquete libelle="Prénom" pour="prenom">
                <Champ id="prenom" name="prenom" required autoComplete="given-name" />
              </ChampEtiquete>
              <ChampEtiquete libelle="Nom" pour="nom">
                <Champ id="nom" name="nom" required autoComplete="family-name" />
              </ChampEtiquete>
            </div>
            <ChampEtiquete libelle="Email" pour="email" aide="Privilégie l'email de ton université (.edu.sn) si tu en as un.">
              <Champ id="email" name="email" type="email" required autoComplete="email" />
            </ChampEtiquete>
            <ChampEtiquete libelle="Mot de passe" pour="motDePasse" aide="8 caractères minimum.">
              <Champ id="motDePasse" name="motDePasse" type="password" required autoComplete="new-password" minLength={8} />
            </ChampEtiquete>
            <div className="grid gap-4 sm:grid-cols-2">
              <ChampEtiquete libelle="Université" pour="universite">
                <Selecteur id="universite" name="universite" required defaultValue="UGB">
                  {UNIVERSITES_SENEGAL.map((u) => (
                    <option key={u.acronyme} value={u.acronyme}>{u.nom} ({u.acronyme})</option>
                  ))}
                </Selecteur>
              </ChampEtiquete>
              <ChampEtiquete libelle="Niveau d'étude" pour="niveau">
                <Selecteur id="niveau" name="niveau" required defaultValue="L3">
                  {Object.entries(LIBELLES_NIVEAU_ETUDE).map(([cle, libelle]) => (
                    <option key={cle} value={cle}>{libelle}</option>
                  ))}
                </Selecteur>
              </ChampEtiquete>
            </div>
            <ChampEtiquete libelle="Filière" pour="filiere" optionnel aide="Ex. Informatique, Sociologie, Sciences éco, …">
              <Champ id="filiere" name="filiere" />
            </ChampEtiquete>
            <label className="flex items-start gap-2 text-sm text-texte-discret">
              <input type="checkbox" name="cgu" required className="mt-0.5" />
              <span>
                J&apos;accepte les{" "}
                <Link href="/cgu" className="text-jub-vert-700 underline">CGU</Link> et la{" "}
                <Link href="/confidentialite" className="text-jub-vert-700 underline">politique de confidentialité</Link>.
              </span>
            </label>
          </CorpsCarte>
          <div className="border-t border-bordure bg-jub-pierre-50 p-5">
            <Bouton apparence="primaire" taille="lg" pleineLargeur type="submit">
              Créer mon compte
            </Bouton>
          </div>
        </form>
      </Carte>
      <p className="mt-6 text-center text-sm text-texte-discret">
        Déjà inscrit ? <Link href="/connexion" className="text-jub-vert-700 hover:underline">Connecte-toi</Link>
      </p>
    </section>
  );
}
