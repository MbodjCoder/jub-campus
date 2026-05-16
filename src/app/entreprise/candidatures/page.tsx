import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { Bouton } from "@/composants/ui/bouton";
import { Champ } from "@/composants/ui/champ";
import { formaterDate } from "@/lib/utils";
import { deciderCandidature } from "@/app/entreprise/actions";

export const metadata = { title: "Candidatures reçues" };
export const dynamic = "force-dynamic";

export default async function PageEntrepriseCandidatures() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion?suivant=/entreprise/candidatures");

  const entreprise = await prisma.entreprise.findUnique({
    where: { utilisateurId: session.user.id },
    select: { id: true },
  });
  if (!entreprise) return <p>Profil introuvable.</p>;

  const candidatures = await prisma.candidature.findMany({
    where: { projet: { entrepriseId: entreprise.id } },
    orderBy: [{ statut: "asc" }, { creeLe: "desc" }],
    take: 100,
    include: {
      etudiant: { include: { universite: true } },
      projet: { select: { titre: true, slug: true } },
    },
  });

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Candidatures reçues</h1>
        <p className="text-sm text-texte-discret">{candidatures.length} candidature{candidatures.length > 1 ? "s" : ""} sur tous tes projets.</p>
      </header>

      {candidatures.length === 0 ? (
        <Carte>
          <CorpsCarte className="py-12 text-center text-sm text-texte-discret">
            Aucune candidature pour l&apos;instant.
          </CorpsCarte>
        </Carte>
      ) : (
        <div className="space-y-3">
          {candidatures.map((c) => (
            <Carte key={c.id}>
              <CorpsCarte className="space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link href={`/u/${c.etudiant.slug}`} className="font-medium hover:text-jub-orange-600 hover:underline">
                      {c.etudiant.prenom} {c.etudiant.nom}
                    </Link>
                    <p className="text-xs text-texte-discret">
                      {c.etudiant.niveau} · {c.etudiant.universite.acronyme} ·{" "}
                      candidaté sur{" "}
                      <Link href={`/projets/${c.projet.slug}`} className="text-jub-orange-600 hover:underline">
                        {c.projet.titre}
                      </Link>{" "}
                      le {formaterDate(c.creeLe)}
                    </p>
                  </div>
                  <Insigne ton={
                    c.statut === "ACCEPTEE" ? "vert" :
                    c.statut === "REFUSEE" ? "rouge" :
                    c.statut === "RETIREE" ? "neutre" : "orange"
                  }>
                    {c.statut.replace("_", " ")}
                  </Insigne>
                </div>
                {c.lettre ? <p className="text-sm italic text-texte-discret">« {c.lettre.slice(0, 300)}{c.lettre.length > 300 ? "…" : ""} »</p> : null}

                {c.statut === "EN_ATTENTE" ? (
                  <form action={deciderCandidature} className="flex flex-wrap items-center gap-2 pt-2">
                    <input type="hidden" name="candidatureId" value={c.id} />
                    <Champ name="motif" placeholder="Motif (si refus)" className="max-w-xs" />
                    <Bouton apparence="primaire" type="submit" name="decision" value="ACCEPTEE" taille="sm">
                      Accepter
                    </Bouton>
                    <Bouton apparence="danger" type="submit" name="decision" value="REFUSEE" taille="sm">
                      Refuser
                    </Bouton>
                  </form>
                ) : c.motifReponse ? (
                  <p className="text-xs italic text-texte-discret">Réponse : {c.motifReponse}</p>
                ) : null}
              </CorpsCarte>
            </Carte>
          ))}
        </div>
      )}
    </>
  );
}
