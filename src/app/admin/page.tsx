import Link from "next/link";
import { Users, Building2, FolderKanban, Award, AlertTriangle, GraduationCap } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { formaterDate } from "@/lib/utils";

export const metadata = { title: "Administration · Vue d'ensemble" };
export const dynamic = "force-dynamic";

export default async function TableauAdmin() {
  const [
    nbUtilisateurs, nbEtudiants, nbEntreprises, nbMentors,
    nbProjetsActifs, nbCertificats, nbVerifications,
    entreprisesEnAttente, projetsEnValidation, signalementsOuverts,
  ] = await Promise.all([
    prisma.utilisateur.count(),
    prisma.etudiant.count(),
    prisma.entreprise.count(),
    prisma.mentor.count(),
    prisma.projet.count({ where: { statut: { in: ["PUBLIE", "EN_COURS", "CANDIDATURES_OUVERTES", "EQUIPE_EN_CONSTITUTION"] } } }),
    prisma.certificat.count({ where: { statut: "VALIDE" } }),
    prisma.verificationCertificat.count(),
    prisma.entreprise.count({ where: { statutValidation: "EN_ATTENTE" } }),
    prisma.projet.count({ where: { statut: "EN_VALIDATION" } }),
    prisma.signalement.count({ where: { statut: "OUVERT" } }),
  ]);

  const journal = await prisma.journalAudit.findMany({
    orderBy: { creeLe: "desc" },
    take: 8,
    include: { acteur: { select: { email: true, nomComplet: true } } },
  });

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Vue d&apos;ensemble</h1>
        <p className="text-texte-discret">État temps réel de la plateforme.</p>
      </header>

      <section className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <CarteKpi icone={Users}           libelle="Utilisateurs"   valeur={nbUtilisateurs} />
        <CarteKpi icone={GraduationCap}   libelle="Étudiants"      valeur={nbEtudiants} />
        <CarteKpi icone={Building2}       libelle="Entreprises"    valeur={nbEntreprises} />
        <CarteKpi icone={FolderKanban}    libelle="Projets actifs" valeur={nbProjetsActifs} />
      </section>

      <section className="mb-10 grid gap-3 sm:grid-cols-3">
        <CarteAction
          libelle="Entreprises à valider"
          valeur={entreprisesEnAttente}
          href="/admin/entreprises"
          icone={Building2}
          ton={entreprisesEnAttente > 0 ? "orange" : "neutre"}
        />
        <CarteAction
          libelle="Projets à modérer"
          valeur={projetsEnValidation}
          href="/admin/projets"
          icone={FolderKanban}
          ton={projetsEnValidation > 0 ? "orange" : "neutre"}
        />
        <CarteAction
          libelle="Signalements ouverts"
          valeur={signalementsOuverts}
          href="/admin/signalements"
          icone={AlertTriangle}
          ton={signalementsOuverts > 0 ? "rouge" : "vert"}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Carte>
          <EnteteCarte>
            <TitreCarte className="flex items-center gap-2 text-base">
              <Award className="h-4 w-4 text-jub-orange-500" />
              Certificats émis
            </TitreCarte>
          </EnteteCarte>
          <CorpsCarte className="space-y-2">
            <p className="text-3xl font-bold">{nbCertificats}</p>
            <p className="text-sm text-texte-discret">
              {nbVerifications} vérification{nbVerifications > 1 ? "s" : ""} publique{nbVerifications > 1 ? "s" : ""} cumulée{nbVerifications > 1 ? "s" : ""}.
            </p>
            <Link href="/admin/certificats" className="inline-block text-sm font-medium text-jub-orange-600 hover:underline">
              Tous les certificats →
            </Link>
          </CorpsCarte>
        </Carte>

        <Carte>
          <EnteteCarte>
            <TitreCarte className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-jub-orange-500" />
              Répartition par rôle
            </TitreCarte>
          </EnteteCarte>
          <CorpsCarte className="space-y-2 text-sm">
            <Ligne libelle="Étudiants" valeur={nbEtudiants} />
            <Ligne libelle="Entreprises" valeur={nbEntreprises} />
            <Ligne libelle="Mentors" valeur={nbMentors} />
            <Ligne libelle="Autres (admin / sponsor)" valeur={nbUtilisateurs - nbEtudiants - nbEntreprises - nbMentors} />
          </CorpsCarte>
        </Carte>
      </section>

      <section className="mt-10">
        <Carte>
          <EnteteCarte>
            <TitreCarte className="text-base">Journal d&apos;audit récent</TitreCarte>
          </EnteteCarte>
          <CorpsCarte>
            {journal.length === 0 ? (
              <p className="text-sm italic text-texte-discret">Aucune activité.</p>
            ) : (
              <ul className="divide-y divide-bordure">
                {journal.map((j) => (
                  <li key={j.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Insigne ton="sage">{j.action}</Insigne>
                      <span className="text-texte-discret">{j.ressourceType}</span>
                    </div>
                    <span className="text-xs text-texte-discret">
                      {j.acteur?.nomComplet ?? j.acteur?.email ?? "système"} · {formaterDate(j.creeLe)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CorpsCarte>
        </Carte>
      </section>
    </>
  );
}

function CarteKpi({ icone: Icone, libelle, valeur }: { icone: React.ComponentType<{ className?: string }>; libelle: string; valeur: number }) {
  return (
    <Carte>
      <CorpsCarte className="space-y-1">
        <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-texte-discret">
          <Icone className="h-3.5 w-3.5" /> {libelle}
        </p>
        <p className="text-3xl font-bold">{valeur}</p>
      </CorpsCarte>
    </Carte>
  );
}

function CarteAction({
  libelle, valeur, href, icone: Icone, ton,
}: {
  libelle: string;
  valeur: number;
  href: string;
  icone: React.ComponentType<{ className?: string }>;
  ton: "orange" | "rouge" | "vert" | "neutre";
}) {
  const couleurs: Record<typeof ton, string> = {
    orange: "border-jub-orange-300 bg-jub-orange-50 text-jub-orange-700",
    rouge: "border-red-300 bg-red-50 text-red-700",
    vert: "border-emerald-300 bg-emerald-50 text-emerald-700",
    neutre: "border-bordure bg-fond-eleve text-texte-discret",
  } as const;
  return (
    <Link href={href} className={`group flex items-center justify-between rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${couleurs[ton]}`}>
      <div className="flex items-center gap-3">
        <Icone className="h-5 w-5" />
        <div>
          <p className="text-xs uppercase tracking-wider">{libelle}</p>
          <p className="text-2xl font-bold">{valeur}</p>
        </div>
      </div>
      <span aria-hidden className="text-xl transition-transform group-hover:translate-x-1">→</span>
    </Link>
  );
}

function Ligne({ libelle, valeur }: { libelle: string; valeur: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-texte-discret">{libelle}</span>
      <span className="font-mono font-bold">{valeur}</span>
    </div>
  );
}
