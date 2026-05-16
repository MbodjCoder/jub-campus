import Link from "next/link";
import { notFound } from "next/navigation";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { Bouton } from "@/composants/ui/bouton";

export const metadata = {
  title: "Portfolio public",
  description: "Portfolios étudiants vérifiables sur JUB Campus.",
};

const portfoliosDemo = {
  "aissatou-diop": {
    nom: "Aïssatou Diop",
    universite: "UGB Saint-Louis",
    niveau: "M1 Informatique",
    disponibilite: "DISPONIBLE" as const,
    bio: "Étudiante développeuse passionnée par les produits qui résolvent de vrais problèmes africains. Je cherche un stage long en développement web full-stack.",
    scoreJub: 1247,
    competences: [
      { nom: "Next.js", niveau: 4 }, { nom: "TypeScript", niveau: 4 },
      { nom: "Figma", niveau: 3 }, { nom: "UX recherche", niveau: 3 },
      { nom: "PostgreSQL", niveau: 3 }, { nom: "Travail en équipe", niveau: 5 },
    ],
    projets: [
      {
        slug: "refonte-billetterie-sonatel",
        titre: "Refonte de la billetterie Sonatel",
        organisation: "Sonatel",
        role: "Développeuse front-end",
        periode: "Mars → Avril 2026",
        certificatNumero: "JUB-2026-UGB-7K4M9P",
      },
    ],
    badges: [
      { code: "PREMIER_PROJET", nom: "Premier projet", rarete: "COMMUN" as const },
      { code: "LIVRABLE_PARFAIT", nom: "Livrable parfait", rarete: "RARE" as const },
    ],
    liens: { linkedin: "#", github: "#" },
  },
} as const;

type ParametresPage = { params: Promise<{ slug: string }> };

export default async function PagePortfolio({ params }: ParametresPage) {
  const { slug } = await params;
  const p = portfoliosDemo[slug as keyof typeof portfoliosDemo];
  if (!p) notFound();

  const tonDispo = p.disponibilite === "DISPONIBLE" ? "vert" : p.disponibilite === "PARTIEL" ? "jaune" : "neutre";
  const libelleDispo =
    p.disponibilite === "DISPONIBLE" ? "Disponible" :
    p.disponibilite === "PARTIEL" ? "Temps partiel" : "Indisponible";

  return (
    <div className="min-h-screen bg-fond">
      <div className="h-32 bg-gradient-to-br from-jub-vert-900 via-jub-vert-700 to-jub-jaune-500" />
      <div className="mx-auto -mt-16 max-w-4xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 rounded-xl border border-bordure bg-fond-eleve p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-5">
            <div className="h-24 w-24 shrink-0 rounded-full border-4 border-fond-eleve bg-gradient-to-br from-jub-vert-700 to-jub-vert-950 flex items-center justify-center text-white text-3xl font-bold -mt-12 shadow-md">
              {p.nom.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{p.nom}</h1>
              <p className="text-sm text-texte-discret">{p.niveau} · {p.universite}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Insigne ton={tonDispo}>{libelleDispo}</Insigne>
                <Insigne ton="sombre">Score JUB · {p.scoreJub}</Insigne>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Bouton apparence="contour">Recommander</Bouton>
            <Bouton apparence="primaire">Contacter</Bouton>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Carte>
              <EnteteCarte><TitreCarte>À propos</TitreCarte></EnteteCarte>
              <CorpsCarte>
                <p className="text-sm leading-relaxed">{p.bio}</p>
              </CorpsCarte>
            </Carte>

            <Carte>
              <EnteteCarte><TitreCarte>Projets réalisés</TitreCarte></EnteteCarte>
              <CorpsCarte className="divide-y divide-bordure">
                {p.projets.map((pr) => (
                  <div key={pr.slug} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link href={`/projets/${pr.slug}`} className="font-medium hover:text-jub-vert-700 hover:underline">
                          {pr.titre}
                        </Link>
                        <DescriptionCarte>
                          {pr.organisation} · {pr.role} · {pr.periode}
                        </DescriptionCarte>
                      </div>
                      <Link href={`/v/${pr.certificatNumero}`}>
                        <Insigne ton="vert" className="cursor-pointer">Certificat ✓</Insigne>
                      </Link>
                    </div>
                  </div>
                ))}
              </CorpsCarte>
            </Carte>

            <Carte>
              <EnteteCarte><TitreCarte>Compétences</TitreCarte></EnteteCarte>
              <CorpsCarte className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {p.competences.map((c) => (
                  <div key={c.nom} className="space-y-1">
                    <p className="text-sm font-medium">{c.nom}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`h-1.5 flex-1 rounded-full ${i < c.niveau ? "bg-jub-vert-700" : "bg-jub-pierre-200"}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </CorpsCarte>
            </Carte>
          </div>

          <aside className="space-y-6">
            <Carte>
              <EnteteCarte><TitreCarte>Badges</TitreCarte></EnteteCarte>
              <CorpsCarte className="space-y-2">
                {p.badges.map((b) => (
                  <div key={b.code} className="flex items-center justify-between">
                    <span className="text-sm">{b.nom}</span>
                    <Insigne ton={b.rarete === "RARE" ? "jaune" : "neutre"}>{b.rarete}</Insigne>
                  </div>
                ))}
              </CorpsCarte>
            </Carte>

            <Carte>
              <EnteteCarte><TitreCarte>Liens</TitreCarte></EnteteCarte>
              <CorpsCarte className="space-y-1.5 text-sm">
                {p.liens.linkedin ? <a href={p.liens.linkedin} className="block text-jub-vert-700 hover:underline">LinkedIn</a> : null}
                {p.liens.github ? <a href={p.liens.github} className="block text-jub-vert-700 hover:underline">GitHub</a> : null}
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
