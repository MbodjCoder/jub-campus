import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { mettreAJourProfilEtudiant } from "@/app/app/actions";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { Champ, ChampEtiquete, Selecteur, ZoneTexte } from "@/composants/ui/champ";
import { Bouton } from "@/composants/ui/bouton";
import { LIBELLES_NIVEAU_ETUDE, UNIVERSITES_SENEGAL } from "@/lib/constantes";

export const metadata = { title: "Modifier mon profil" };
export const dynamic = "force-dynamic";

export default async function PageModifierProfil() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const utilisateur = await prisma.utilisateur.findUnique({
    where: { id: session.user.id },
    include: { etudiant: { include: { universite: true } } },
  });

  if (!utilisateur?.etudiant) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-2">
        <Carte><CorpsCarte>Profil étudiant introuvable.</CorpsCarte></Carte>
      </main>
    );
  }

  const e = utilisateur.etudiant;

  return (
    <main className="mx-auto max-w-2xl px-5 py-2">
      <Link href="/app/profil" className="t-small mb-4 inline-flex items-center gap-1 font-medium text-sage-600">
        <ArrowLeft size={14} /> Mon profil
      </Link>

      <Carte>
        <EnteteCarte>
          <TitreCarte>Informations personnelles</TitreCarte>
          <DescriptionCarte>Visible sur ton portfolio public si tu actives la visibilité.</DescriptionCarte>
        </EnteteCarte>
        <form action={mettreAJourProfilEtudiant}>
          <CorpsCarte className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <ChampEtiquete libelle="Prénom" pour="prenom">
                <Champ id="prenom" name="prenom" defaultValue={e.prenom} required />
              </ChampEtiquete>
              <ChampEtiquete libelle="Nom" pour="nom">
                <Champ id="nom" name="nom" defaultValue={e.nom} required />
              </ChampEtiquete>
            </div>

            <ChampEtiquete libelle="Email" pour="email" aide="Non modifiable. Contacte le support pour changer.">
              <Champ id="email" name="email" defaultValue={utilisateur.email} disabled />
            </ChampEtiquete>

            <div className="grid gap-4 sm:grid-cols-2">
              <ChampEtiquete libelle="Université" pour="universite">
                <Selecteur id="universite" name="universite" defaultValue={e.universite.acronyme}>
                  {UNIVERSITES_SENEGAL.map((u) => (
                    <option key={u.acronyme} value={u.acronyme}>{u.acronyme}</option>
                  ))}
                </Selecteur>
              </ChampEtiquete>
              <ChampEtiquete libelle="Niveau" pour="niveau">
                <Selecteur id="niveau" name="niveau" defaultValue={e.niveau}>
                  {Object.entries(LIBELLES_NIVEAU_ETUDE).map(([cle, libelle]) => (
                    <option key={cle} value={cle}>{libelle}</option>
                  ))}
                </Selecteur>
              </ChampEtiquete>
            </div>

            <ChampEtiquete libelle="Filière" pour="filiere" optionnel>
              <Champ id="filiere" name="filiere" defaultValue={e.filiere ?? ""} />
            </ChampEtiquete>

            <ChampEtiquete libelle="Biographie" pour="biographie" optionnel aide="2-3 phrases qui te décrivent.">
              <ZoneTexte id="biographie" name="biographie" defaultValue={e.biographie ?? ""} rows={4} />
            </ChampEtiquete>

            <ChampEtiquete libelle="Disponibilité" pour="disponibilite">
              <Selecteur id="disponibilite" name="disponibilite" defaultValue={e.disponibilite}>
                <option value="DISPONIBLE">Disponible</option>
                <option value="PARTIEL">Temps partiel</option>
                <option value="INDISPONIBLE">Indisponible</option>
              </Selecteur>
            </ChampEtiquete>
          </CorpsCarte>
          <div className="flex justify-end border-t border-bordure p-5">
            <Bouton apparence="primaire" type="submit">Enregistrer</Bouton>
          </div>
        </form>
      </Carte>
    </main>
  );
}
