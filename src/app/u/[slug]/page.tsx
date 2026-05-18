import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { Bouton } from "@/composants/ui/bouton";
import { LIBELLES_DISPONIBILITE, LIBELLES_NIVEAU_ETUDE } from "@/lib/constantes";

export const metadata = {
  title: "Portfolio public",
  description: "Portfolios étudiants vérifiables sur JUB Campus.",
};
export const dynamic = "force-dynamic";

type ParametresPage = { params: Promise<{ slug: string }> };

export default async function PagePortfolio({ params }: ParametresPage) {
  const { slug } = await params;
  const p = await prisma.etudiant.findUnique({
    where: { slug },
    select: {
      prenom: true,
      nom: true,
      niveau: true,
      disponibilite: true,
      biographie: true,
      scoreJub: true,
      estPublic: true,
      avatarUrl: true,
      universite: { select: { nom: true } },
      competences: {
        orderBy: { niveau: "desc" },
        take: 12,
        select: { niveau: true, niveauValide: true, competence: { select: { nom: true } } },
      },
      certificats: {
        where: { statut: "VALIDE" },
        orderBy: { emisLe: "desc" },
        take: 12,
        select: {
          numeroPublic: true,
          roleJoue: true,
          periodeDebut: true,
          periodeFin: true,
          organisationNom: true,
          projet: { select: { slug: true, titre: true, entreprise: { select: { raisonSociale: true } } } },
        },
      },
      badgesObtenus: {
        orderBy: { obtenuLe: "desc" },
        take: 8,
        select: { badge: { select: { code: true, nom: true, rarete: true } } },
      },
      liens: true,
    },
  });
  if (!p || !p.estPublic) notFound();

  const tonDispo = p.disponibilite === "DISPONIBLE" ? "vert" : p.disponibilite === "PARTIEL" ? "jaune" : "neutre";
  const initiales = `${p.prenom[0] ?? ""}${p.nom[0] ?? ""}`.toUpperCase();
  const liens = (p.liens ?? {}) as Record<string, string | undefined>;

  return (
    <div className="min-h-screen bg-fond">
      <div className="h-32 bg-gradient-to-br from-jub-vert-900 via-jub-vert-700 to-jub-jaune-500" />
      <div className="mx-auto -mt-16 max-w-4xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 rounded-xl border border-bordure bg-fond-eleve p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-5">
            <div
              className="h-24 w-24 shrink-0 rounded-full border-4 border-fond-eleve bg-gradient-to-br from-jub-vert-700 to-jub-vert-950 flex items-center justify-center text-white text-3xl font-bold -mt-12 shadow-md"
              style={p.avatarUrl ? { backgroundImage: `url(${p.avatarUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
            >
              {p.avatarUrl ? null : initiales}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{p.prenom} {p.nom}</h1>
              <p className="text-sm text-texte-discret">
                {LIBELLES_NIVEAU_ETUDE[p.niveau]} · {p.universite.nom}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Insigne ton={tonDispo}>{LIBELLES_DISPONIBILITE[p.disponibilite]}</Insigne>
                <Insigne ton="sombre">Score JUB · {p.scoreJub}</Insigne>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Bouton apparence="primaire">Contacter</Bouton>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Carte>
              <EnteteCarte><TitreCarte>À propos</TitreCarte></EnteteCarte>
              <CorpsCarte>
                <p className="text-sm leading-relaxed">
                  {p.biographie ?? "Ce portfolio rassemble les preuves validées sur JUB Campus."}
                </p>
              </CorpsCarte>
            </Carte>

            <Carte>
              <EnteteCarte><TitreCarte>Jobs réalisés</TitreCarte></EnteteCarte>
              <CorpsCarte className="divide-y divide-bordure">
                {p.certificats.length === 0 ? (
                  <p className="text-sm text-texte-discret">Aucun job certifié publié pour le moment.</p>
                ) : (
                  p.certificats.map((pr) => (
                    <div key={pr.numeroPublic} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link href={`/projets/${pr.projet.slug}`} className="font-medium hover:text-jub-vert-700 hover:underline">
                            {pr.projet.titre}
                          </Link>
                          <DescriptionCarte>
                            {pr.organisationNom ?? pr.projet.entreprise?.raisonSociale ?? "JUB Campus"} · {pr.roleJoue}
                          </DescriptionCarte>
                        </div>
                        <Link href={`/v/${pr.numeroPublic}`}>
                          <Insigne ton="vert" className="cursor-pointer">Certificat ✓</Insigne>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </CorpsCarte>
            </Carte>

            <Carte>
              <EnteteCarte><TitreCarte>Compétences</TitreCarte></EnteteCarte>
              <CorpsCarte className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {p.competences.length === 0 ? (
                  <p className="col-span-full text-sm text-texte-discret">Aucune compétence publiée.</p>
                ) : (
                  p.competences.map((c) => (
                    <div key={c.competence.nom} className="space-y-1">
                      <p className="text-sm font-medium">{c.competence.nom}</p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`h-1.5 flex-1 rounded-full ${
                              i < (c.niveauValide ?? c.niveau) ? "bg-jub-vert-700" : "bg-jub-pierre-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </CorpsCarte>
            </Carte>
          </div>

          <aside className="space-y-6">
            <Carte>
              <EnteteCarte><TitreCarte>Badges</TitreCarte></EnteteCarte>
              <CorpsCarte className="space-y-2">
                {p.badgesObtenus.length === 0 ? (
                  <p className="text-sm text-texte-discret">Aucun badge publié.</p>
                ) : (
                  p.badgesObtenus.map(({ badge }) => (
                    <div key={badge.code} className="flex items-center justify-between">
                      <span className="text-sm">{badge.nom}</span>
                      <Insigne ton={badge.rarete === "RARE" ? "jaune" : "neutre"}>{badge.rarete}</Insigne>
                    </div>
                  ))
                )}
              </CorpsCarte>
            </Carte>

            <Carte>
              <EnteteCarte><TitreCarte>Liens</TitreCarte></EnteteCarte>
              <CorpsCarte className="space-y-1.5 text-sm">
                {liens.linkedin ? <a href={liens.linkedin} className="block text-jub-vert-700 hover:underline">LinkedIn</a> : null}
                {liens.github ? <a href={liens.github} className="block text-jub-vert-700 hover:underline">GitHub</a> : null}
                {!liens.linkedin && !liens.github ? <p className="text-texte-discret">Aucun lien public.</p> : null}
              </CorpsCarte>
            </Carte>
          </aside>
        </div>

        <p className="mt-10 mb-12 text-center text-xs text-texte-discret">
          Portfolio public vérifié par <Link href="/" className="text-jub-vert-700 hover:underline">JUB Campus</Link> ·
          Tous les certificats sont vérifiables individuellement.
        </p>
      </div>
    </div>
  );
}
