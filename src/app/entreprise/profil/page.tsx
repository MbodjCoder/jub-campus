import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { mettreAJourProfilEntreprise } from "@/app/entreprise/actions";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { Champ, ChampEtiquete, Selecteur, ZoneTexte } from "@/composants/ui/champ";
import { Bouton } from "@/composants/ui/bouton";
import { Insigne } from "@/composants/ui/insigne";
import { AvatarModifiable } from "@/composants/site/avatar-modifiable";

export const metadata = { title: "Profil entreprise" };
export const dynamic = "force-dynamic";

export default async function PageProfilEntreprise() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion?suivant=/entreprise/profil");

  const entreprise = await prisma.entreprise.findUnique({
    where: { utilisateurId: session.user.id },
    include: { utilisateur: { select: { email: true, imageUrl: true } } },
  });
  if (!entreprise) {
    return <p className="text-texte-discret">Profil entreprise introuvable.</p>;
  }

  return (
    <>
      <header className="mb-6 flex flex-col items-center gap-3 text-center">
        <AvatarModifiable
          nom={entreprise.raisonSociale}
          src={entreprise.utilisateur.imageUrl}
        />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profil entreprise</h1>
          <p className="text-texte-discret">Tes informations affichées aux étudiants.</p>
        </div>
      </header>

      <Carte>
        <EnteteCarte className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <TitreCarte>{entreprise.raisonSociale}</TitreCarte>
            <DescriptionCarte>{entreprise.utilisateur.email}</DescriptionCarte>
          </div>
          <Insigne ton={
            entreprise.statutValidation === "VALIDEE" ? "vert" :
            entreprise.statutValidation === "REJETEE" ? "rouge" : "orange"
          }>
            {entreprise.statutValidation}
          </Insigne>
        </EnteteCarte>
        <form action={mettreAJourProfilEntreprise}>
          <CorpsCarte className="space-y-5">
            <ChampEtiquete libelle="Raison sociale" pour="rs">
              <Champ id="rs" name="raisonSociale" required defaultValue={entreprise.raisonSociale} />
            </ChampEtiquete>
            <div className="grid gap-4 sm:grid-cols-2">
              <ChampEtiquete libelle="Secteur" pour="sect">
                <Champ id="sect" name="secteur" defaultValue={entreprise.secteur} required />
              </ChampEtiquete>
              <ChampEtiquete libelle="Taille" pour="tail">
                <Selecteur id="tail" name="taille" defaultValue={entreprise.taille}>
                  <option value="TRES_PETITE">Moins de 10</option>
                  <option value="PETITE">10 à 49</option>
                  <option value="MOYENNE">50 à 249</option>
                  <option value="GRANDE">250 et plus</option>
                </Selecteur>
              </ChampEtiquete>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ChampEtiquete libelle="NINEA" pour="ninea" optionnel>
                <Champ id="ninea" name="ninea" defaultValue={entreprise.ninea ?? ""} />
              </ChampEtiquete>
              <ChampEtiquete libelle="RCCM" pour="rccm" optionnel>
                <Champ id="rccm" name="rccm" defaultValue={entreprise.rccm ?? ""} />
              </ChampEtiquete>
            </div>
            <ChampEtiquete libelle="Ville" pour="ville" optionnel>
              <Champ id="ville" name="ville" defaultValue={entreprise.ville ?? ""} placeholder="Ex. Dakar" />
            </ChampEtiquete>
            <ChampEtiquete libelle="Site web" pour="site" optionnel>
              <Champ id="site" name="siteWeb" type="url" defaultValue={entreprise.siteWeb ?? ""} placeholder="https://" />
            </ChampEtiquete>
            <ChampEtiquete libelle="Description" pour="desc" optionnel>
              <ZoneTexte id="desc" name="description" defaultValue={entreprise.description ?? ""} rows={4} />
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
