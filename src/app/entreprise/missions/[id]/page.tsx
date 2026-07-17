// Client — suivi d'une mission : progression, jalons, livrables validés.
// Lecture seule : le client ne gère ni équipe ni tâches (mode agence).

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formaterDate, formaterMontantFcfa } from "@/lib/utils";
import { PastilleStatut } from "@/composants/ui/pastille-statut";
import { BarreProgression } from "@/composants/ui/barre-progression";
import { StatTuile } from "@/composants/ui/stat-tuile";
import { Icon } from "@/composants/maquette/icones";

export const metadata = { title: "Suivi de mission" };
export const dynamic = "force-dynamic";

export default async function PageSuiviMission({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const entreprise = await prisma.entreprise.findUnique({
    where: { utilisateurId: session.user.id },
    select: { id: true },
  });
  if (!entreprise) redirect("/entreprise");

  const mission = await prisma.projet.findFirst({
    // Le client ne voit que SES missions — filtre entrepriseId obligatoire.
    where: { id, entrepriseId: entreprise.id, montantClientFcfa: { not: null } },
    select: {
      titre: true, resume: true, statut: true, dureeJours: true, creeLe: true,
      montantClientFcfa: true,
      taches: {
        orderBy: { creeLe: "asc" },
        select: { id: true, titre: true, statut: true, echeance: true, termineeLe: true },
      },
      livrables: {
        where: { statut: "VALIDE" },
        orderBy: { deposeLe: "desc" },
        select: { id: true, titre: true, fichierUrl: true, deposeLe: true },
      },
      equipe: { select: { _count: { select: { membres: true } } } },
    },
  });
  if (!mission) notFound();

  const total = mission.taches.length;
  const faites = mission.taches.filter((t) => t.statut === "TERMINEE").length;

  return (
    <div className="fadein mx-auto max-w-[900px]">
      <Link href="/entreprise/missions" className="t-small inline-flex items-center gap-1 font-medium text-sage-600 no-underline">
        <Icon.ArrowLeft size={14} /> Mes missions
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="m-0 text-2xl font-semibold tracking-tight">{mission.titre}</h1>
          <p className="t-small mt-1 mb-0">
            Lancée le {formaterDate(mission.creeLe)} · {mission.dureeJours} jours ·{" "}
            {mission.equipe?._count.membres ?? 0} talent{(mission.equipe?._count.membres ?? 0) > 1 ? "s" : ""} mobilisé
            {(mission.equipe?._count.membres ?? 0) > 1 ? "s" : ""}
          </p>
        </div>
        <PastilleStatut domaine="projet" statut={mission.statut} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatTuile libelle="Avancement" valeur={`${total > 0 ? Math.round((faites / total) * 100) : 0} %`} />
        <StatTuile libelle="Jalons livrés" valeur={`${faites}/${total}`} />
        <StatTuile libelle="Montant" valeur={formaterMontantFcfa(mission.montantClientFcfa ?? 0)} />
      </div>

      <div className="mt-3">
        <BarreProgression valeur={faites} max={total || 1} accent etiquette="Avancement de la mission" />
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* Jalons */}
        <section>
          <h2 className="m-0 mb-3 flex items-center gap-2 text-[17px] font-semibold tracking-[-0.015em]">
            <Icon.Kanban size={18} className="text-sage-500" /> Jalons
          </h2>
          {total === 0 ? (
            <p className="t-small">Le découpage de la mission est en cours.</p>
          ) : (
            <ol className="m-0 grid list-none gap-2 p-0">
              {mission.taches.map((t) => (
                <li key={t.id} className="flex items-center gap-3 rounded-xl border border-bordure bg-fond-eleve px-4 py-3">
                  <span
                    className={
                      t.statut === "TERMINEE"
                        ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-succes text-white"
                        : "h-6 w-6 shrink-0 rounded-full border-[1.5px] border-bordure-forte"
                    }
                  >
                    {t.statut === "TERMINEE" ? <Icon.Check size={13} /> : null}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{t.titre}</div>
                    <div className="t-xs t-discret">
                      {t.statut === "TERMINEE" && t.termineeLe
                        ? `Livré le ${formaterDate(t.termineeLe)}`
                        : t.echeance
                          ? `Prévu le ${formaterDate(t.echeance)}`
                          : "En cours"}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

        {/* Livrables validés */}
        <section>
          <h2 className="m-0 mb-3 flex items-center gap-2 text-[17px] font-semibold tracking-[-0.015em]">
            <Icon.FileText size={18} className="text-sage-500" /> Livrables validés
          </h2>
          {mission.livrables.length === 0 ? (
            <p className="t-small">Les livrables validés par notre contrôle qualité apparaîtront ici.</p>
          ) : (
            <div className="liste-bordee">
              {mission.livrables.map((l) => (
                <a key={l.id} href={l.fichierUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-fond-eleve px-4 py-3 no-underline text-inherit hover:bg-white">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-sage-950">
                    <Icon.Check size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{l.titre}</div>
                    <div className="t-xs t-discret">Validé · {formaterDate(l.deposeLe)}</div>
                  </div>
                  <Icon.Download size={14} className="shrink-0 text-sage-400" />
                </a>
              ))}
            </div>
          )}

          <div className="carte mt-4 p-4">
            <div className="t-eyebrow mb-2">Une question sur cette mission ?</div>
            <p className="t-small m-0">
              Votre chef de mission JUB vous répond :{" "}
              <a href="mailto:missions@jubcampus.sn" className="font-semibold text-orange-600 no-underline">
                missions@jubcampus.sn
              </a>
            </p>
          </div>

          <div className="carte mt-4 p-4">
            <div className="t-eyebrow mb-2">Traçabilité</div>
            <p className="t-small m-0 flex items-start gap-2">
              <Icon.ShieldCheck size={15} className="mt-0.5 shrink-0 text-orange-500" />
              <span>
                Chaque contributeur de cette mission est un talent vérifié JUB. Un certificat
                vérifiable par QR code atteste de qui a produit quoi.
              </span>
            </p>
          </div>
        </section>
      </div>

      {/* Résumé */}
      <section className="mt-8">
        <div className="carte p-4">
          <div className="t-eyebrow mb-2">Périmètre</div>
          <p className="t-small m-0 whitespace-pre-wrap">{mission.resume}</p>
        </div>
      </section>
    </div>
  );
}
