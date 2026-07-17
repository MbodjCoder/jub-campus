// Tableau de bord étudiant — port 1:1 de la maquette (PageTableauDeBord).

import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PHOTOS, imageProjet } from "@/lib/medias";
import { maintenantMs } from "@/lib/utils";
import { fmt } from "@/composants/maquette/format";
import Image from "next/image";
import { LienBouton } from "@/composants/ui/lien-bouton";
import { BarreProgression } from "@/composants/ui/barre-progression";
import { Icon } from "@/composants/maquette/icones";

export const metadata = { title: "Tableau de bord" };
export const dynamic = "force-dynamic";

const STATUTS_ACTIFS = ["EQUIPE_EN_CONSTITUTION", "EN_COURS", "EN_REVISION"];

export default async function PageTableauDeBord() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const etudiant = await prisma.etudiant.findUnique({
    where: { utilisateurId: session.user.id },
    select: {
      id: true,
      prenom: true,
      candidatures: { where: { statut: "EN_ATTENTE" }, select: { id: true } },
      membreEquipes: {
        select: {
          equipe: {
            select: {
              projet: {
                select: {
                  id: true, slug: true, titre: true, statut: true, dureeJours: true,
                  dateDebut: true, imageCouvertureUrl: true, categorie: true,
                  entreprise: { select: { raisonSociale: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!etudiant) {
    return (
      <main className="mx-auto max-w-[1100px] px-5 py-8">
        <div className="carte p-8 text-center">Profil étudiant introuvable.</div>
      </main>
    );
  }

  const projetsActifs = etudiant.membreEquipes
    .map((m) => m.equipe.projet)
    .filter((p) => STATUTS_ACTIFS.includes(p.statut));
  const jobEnCours = projetsActifs[0] ?? null;

  const taches = jobEnCours
    ? await prisma.tache.findMany({
        where: { projetId: jobEnCours.id, assigneeId: etudiant.id, statut: { not: "TERMINEE" } },
        orderBy: { echeance: "asc" },
        take: 3,
        select: { id: true, titre: true, echeance: true },
      })
    : [];

  const recommandes = await prisma.projet.findMany({
    where: {
      statut: { in: ["PUBLIE", "CANDIDATURES_OUVERTES", "EQUIPE_EN_CONSTITUTION"] },
      visibilite: "PUBLIQUE",
    },
    orderBy: { publieLe: "desc" },
    take: 4,
    select: {
      slug: true, titre: true, categorie: true, imageCouvertureUrl: true,
      entreprise: { select: { raisonSociale: true } },
    },
  });

  const jourActuel =
    jobEnCours && jobEnCours.dateDebut
      ? Math.min(
          jobEnCours.dureeJours,
          Math.max(0, Math.floor((maintenantMs() - new Date(jobEnCours.dateDebut).getTime()) / 86_400_000)),
        )
      : 0;
  const nbActions = etudiant.candidatures.length;

  return (
    <main className="fadein mx-auto max-w-[1100px] px-5 pb-8 pt-2">
      {/* Salutation */}
      <section className="relative mb-7 mt-2 overflow-hidden rounded-[18px] bg-gradient-to-br from-sage-900 to-sage-800 px-6 py-5">
        <Image src={PHOTOS.travail} alt="" fill sizes="1100px" className="object-cover opacity-[0.18]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(255,170,0,0.35),transparent_55%)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-4 text-white">
          <div>
            <h1 className="m-0 text-[clamp(1.5rem,3.5vw,2rem)] font-semibold leading-[1.15] tracking-[-0.025em] text-white">
              Bonjour,{" "}
              <span className="t-display text-[1.05em] text-orange-400">{etudiant.prenom}.</span>
            </h1>
            <p className="t-small mb-0 mt-2.5 text-sage-100">
              {nbActions > 0
                ? `Tu as ${nbActions} action${nbActions > 1 ? "s" : ""} en attente.`
                : "Prêt à trouver ton prochain job ?"}
            </p>
          </div>
          <LienBouton
            href="/projets"
            apparence="accent"
            iconeDroite={<Icon.Arrow size={14} />}
            className="ml-auto"
          >
            Voir les jobs
          </LienBouton>
        </div>
      </section>

      <div className="grid gap-5 min-[900px]:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] min-[900px]:gap-6">
        {/* Job en cours */}
        <div>
          <h2 className="mb-3 mt-0 flex items-center gap-2 text-[17px] font-semibold tracking-[-0.015em] text-sage-900">
            <Icon.Kanban size={19} className="shrink-0 text-sage-700" />
            Job en cours
            <span className="font-normal text-texte-discret">· {projetsActifs.length}</span>
          </h2>
          {jobEnCours ? (
            <div className="carte relative overflow-hidden p-5">
              <div
                className="absolute right-0 top-0 h-full w-2/5 bg-cover bg-center opacity-[0.12] [mask-image:linear-gradient(to_right,transparent,black)]"
                // eslint-disable-next-line react/forbid-dom-props -- URL d'image dynamique
                style={{ backgroundImage: `url(${imageProjet(jobEnCours)})` }}
              />
              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="t-xs t-discret">{jobEnCours.entreprise?.raisonSociale ?? "JUB Campus"}</div>
                    <h3 className="mb-0 mt-1 text-[17px] font-semibold tracking-[-0.01em]">
                      {jobEnCours.titre}
                    </h3>
                  </div>
                  <span className="pilule pilule--orange">En cours</span>
                </div>

                <div className="mt-4">
                  <BarreProgression
                    valeur={jourActuel}
                    max={jobEnCours.dureeJours}
                    accent
                    etiquette="Avancement du job"
                    className="h-1 bg-white"
                  />
                  <div className="mt-1.5 flex justify-between">
                    <span className="t-xs t-discret">Jour {jourActuel}</span>
                    <span className="t-xs t-discret">{Math.max(0, jobEnCours.dureeJours - jourActuel)}j restants</span>
                  </div>
                </div>

                <div className="mt-[22px]">
                  <div className="t-eyebrow mb-2.5 flex items-center gap-1.5">
                    <Icon.Check size={12} className="text-sage-500" />À faire · {taches.length}
                  </div>
                  {taches.length > 0 ? (
                    <ul className="m-0 grid list-none gap-0.5 p-0">
                      {taches.map((t) => (
                        <li key={t.id} className="flex items-center gap-2.5 border-b border-bordure py-2.5">
                          <span className="h-3.5 w-3.5 shrink-0 rounded-[3px] border-[1.5px] border-sage-400" />
                          <span className="flex-1 text-sm">{t.titre}</span>
                          {t.echeance ? <span className="t-xs t-discret">{fmt.dateCourt(t.echeance)}</span> : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="t-small m-0">Aucune tâche en attente.</p>
                  )}
                </div>

                <LienBouton
                  href={`/app/projet/${jobEnCours.id}`}
                  apparence="primaire"
                  iconeDroite={<Icon.Arrow size={14} />}
                  className="mt-4 w-full"
                >
                  Ouvrir
                </LienBouton>
              </div>
            </div>
          ) : (
            <div className="carte p-8 text-center">
              <p className="t-small mb-3.5 mt-0">
                Aucun job en cours. Postule à ton premier job&nbsp;!
              </p>
              <LienBouton href="/projets" apparence="accent">
                Découvrir les jobs
              </LienBouton>
            </div>
          )}
        </div>

        {/* Pour toi */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="m-0 flex items-center gap-2 text-[17px] font-semibold tracking-[-0.015em] text-sage-900">
              <Icon.Sparkles size={19} className="shrink-0 text-sage-700" />
              Pour toi
            </h2>
            <Link href="/projets" className="t-xs cursor-pointer font-semibold text-orange-600">
              Tout voir
            </Link>
          </div>
          <div className="liste-bordee rounded-xl">
            {recommandes.map((pp) => (
              <Link
                key={pp.slug}
                href={`/projets/${pp.slug}`}
                className="flex cursor-pointer items-center gap-3 bg-fond-eleve px-3.5 py-3 text-left no-underline text-inherit hover:bg-white"
              >
                <div
                  className="h-10 w-10 shrink-0 rounded-lg bg-cover bg-center"
                  // eslint-disable-next-line react/forbid-dom-props -- URL d'image dynamique
                  style={{ backgroundImage: `url(${imageProjet(pp)})` }}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-semibold">{pp.titre}</div>
                  <div className="t-xs t-discret">{pp.entreprise?.raisonSociale ?? "JUB Campus"}</div>
                </div>
                <Icon.ChevronRight size={14} className="text-sage-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
