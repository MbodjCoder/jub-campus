import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte } from "@/composants/ui/carte";
import { Bouton } from "@/composants/ui/bouton";
import { Champ } from "@/composants/ui/champ";
import { Insigne } from "@/composants/ui/insigne";
import { formaterDate } from "@/lib/utils";
import { deciderPartenariat } from "@/app/entreprise/actions";

export const metadata = { title: "Partenariats" };
export const dynamic = "force-dynamic";

export default async function PagePartenariatsEntreprise() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion?suivant=/entreprise/partenariats");

  const entreprise = await prisma.entreprise.findUnique({
    where: { utilisateurId: session.user.id },
    select: { id: true },
  });
  if (!entreprise) return <p>Profil introuvable.</p>;

  const [recues, soumises] = await Promise.all([
    prisma.demandePartenariat.findMany({
      where: { projet: { OR: [{ entrepriseId: entreprise.id }, { publieParId: session.user.id }] } },
      include: {
        entreprise: { select: { raisonSociale: true } },
        projet: { select: { titre: true, slug: true } },
      },
      orderBy: { creeLe: "desc" },
    }),
    prisma.demandePartenariat.findMany({
      where: { entrepriseId: entreprise.id },
      include: { projet: { select: { titre: true, slug: true } } },
      orderBy: { creeLe: "desc" },
    }),
  ]);

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Partenariats</h1>
        <p className="text-sm text-texte-discret">
          Propositions reçues sur tes projets et demandes envoyées à d&apos;autres porteurs.
        </p>
      </header>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-texte-discret">
          Reçues
        </h2>
        {recues.length === 0 ? (
          <Carte><CorpsCarte className="py-10 text-center text-sm text-texte-discret">Aucune proposition reçue.</CorpsCarte></Carte>
        ) : (
          <div className="space-y-3">
            {recues.map((d) => (
              <Carte key={d.id}>
                <CorpsCarte className="space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{d.entreprise.raisonSociale}</p>
                      <p className="text-xs text-texte-discret">
                        sur{" "}
                        <Link href={`/projets/${d.projet.slug}`} className="text-jub-orange-600 hover:underline">
                          {d.projet.titre}
                        </Link>{" "}
                        le {formaterDate(d.creeLe)}
                      </p>
                    </div>
                    <StatutPartenariat statut={d.statut} />
                  </div>
                  <p className="text-sm text-texte-discret">{d.message}</p>
                  {d.statut === "EN_ATTENTE" ? (
                    <form action={deciderPartenariat} className="flex flex-wrap items-center gap-2">
                      <input type="hidden" name="demandeId" value={d.id} />
                      <Champ name="reponse" placeholder="Réponse ou motif éventuel" className="max-w-sm" />
                      <Bouton apparence="primaire" type="submit" name="decision" value="ACCEPTEE" taille="sm">
                        Accepter
                      </Bouton>
                      <Bouton apparence="danger" type="submit" name="decision" value="REFUSEE" taille="sm">
                        Refuser
                      </Bouton>
                    </form>
                  ) : d.reponse ? (
                    <p className="text-xs italic text-texte-discret">Réponse : {d.reponse}</p>
                  ) : null}
                </CorpsCarte>
              </Carte>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-texte-discret">
          Envoyées
        </h2>
        {soumises.length === 0 ? (
          <Carte><CorpsCarte className="py-10 text-center text-sm text-texte-discret">Aucune demande envoyée.</CorpsCarte></Carte>
        ) : (
          <div className="space-y-3">
            {soumises.map((d) => (
              <Carte key={d.id}>
                <CorpsCarte className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link href={`/projets/${d.projet.slug}`} className="font-medium hover:text-jub-orange-600 hover:underline">
                      {d.projet.titre}
                    </Link>
                    <p className="text-xs text-texte-discret">Envoyée le {formaterDate(d.creeLe)}</p>
                  </div>
                  <StatutPartenariat statut={d.statut} />
                </CorpsCarte>
              </Carte>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function StatutPartenariat({ statut }: { statut: "EN_ATTENTE" | "ACCEPTEE" | "REFUSEE" | "ANNULEE" }) {
  const ton =
    statut === "ACCEPTEE" ? "vert" :
    statut === "REFUSEE" ? "rouge" :
    statut === "ANNULEE" ? "neutre" : "orange";
  return <Insigne ton={ton}>{statut.replace("_", " ")}</Insigne>;
}
