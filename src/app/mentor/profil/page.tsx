import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte } from "@/composants/ui/carte";
import { Champ, ChampEtiquete, Selecteur, ZoneTexte } from "@/composants/ui/champ";
import { Bouton } from "@/composants/ui/bouton";
import { Insigne } from "@/composants/ui/insigne";
import { UNIVERSITES_SENEGAL } from "@/lib/constantes";

export const metadata = { title: "Profil mentor" };
export const dynamic = "force-dynamic";

export default async function PageMentorProfil() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion?suivant=/mentor/profil");

  const mentor = await prisma.mentor.findUnique({
    where: { utilisateurId: session.user.id },
    include: { universite: true },
  });
  if (!mentor) return <p>Profil introuvable.</p>;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Mon profil mentor</h1>
        <p className="text-sm text-texte-discret">
          Statut :{" "}
          <Insigne ton={mentor.estVerifie ? "vert" : "orange"}>
            {mentor.estVerifie ? "VÉRIFIÉ" : "EN VÉRIFICATION"}
          </Insigne>
        </p>
      </header>

      <Carte>
        <EnteteCarte>
          <TitreCarte>Informations</TitreCarte>
        </EnteteCarte>
        <form action="/api/mentor/profil" method="post">
          <CorpsCarte className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <ChampEtiquete libelle="Prénom" pour="prenom">
                <Champ id="prenom" name="prenom" required defaultValue={mentor.prenom} />
              </ChampEtiquete>
              <ChampEtiquete libelle="Nom" pour="nom">
                <Champ id="nom" name="nom" required defaultValue={mentor.nom} />
              </ChampEtiquete>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ChampEtiquete libelle="Type" pour="type">
                <Selecteur id="type" name="type" defaultValue={mentor.type}>
                  <option value="PROFESSEUR">Professeur</option>
                  <option value="PROFESSIONNEL">Professionnel</option>
                  <option value="ALUMNI">Alumni</option>
                  <option value="EXPERT_INVITE">Expert invité</option>
                </Selecteur>
              </ChampEtiquete>
              <ChampEtiquete libelle="Université d'attache" pour="univ" optionnel>
                <Selecteur id="univ" name="universite" defaultValue={mentor.universite?.acronyme ?? ""}>
                  <option value="">— Aucune —</option>
                  {UNIVERSITES_SENEGAL.map((u) => (
                    <option key={u.acronyme} value={u.acronyme}>{u.acronyme}</option>
                  ))}
                </Selecteur>
              </ChampEtiquete>
            </div>
            <ChampEtiquete libelle="Poste / titre" pour="titre" optionnel>
              <Champ id="titre" name="titreOuPoste" defaultValue={mentor.titreOuPoste ?? ""} />
            </ChampEtiquete>
            <ChampEtiquete libelle="Spécialités" pour="spec" aide="Séparées par des virgules.">
              <Champ id="spec" name="specialites" defaultValue={mentor.specialites.join(", ")} />
            </ChampEtiquete>
            <ChampEtiquete libelle="Biographie" pour="bio" optionnel>
              <ZoneTexte id="bio" name="biographie" defaultValue={mentor.biographie ?? ""} rows={4} />
            </ChampEtiquete>
          </CorpsCarte>
          <div className="flex justify-end border-t border-bordure bg-jub-pierre-50 p-5">
            <Bouton apparence="primaire" type="submit">Enregistrer</Bouton>
          </div>
        </form>
      </Carte>
    </>
  );
}
