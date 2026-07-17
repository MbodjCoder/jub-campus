// Ops — constructeur de mission : budget, équipe, tâches tarifées.

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formaterMontantFcfa, formaterDate } from "@/lib/utils";
import { StatTuile } from "@/composants/ui/stat-tuile";
import { PastilleStatut } from "@/composants/ui/pastille-statut";
import { BarreProgression } from "@/composants/ui/barre-progression";
import { Avatar } from "@/composants/ui/avatar";
import { Insigne } from "@/composants/ui/insigne";
import { Icon } from "@/composants/maquette/icones";
import {
  FormulaireAjoutTache,
  FormulaireAjoutTalent,
  BoutonRepartirEnveloppe,
  BoutonSupprimerTache,
} from "@/composants/admin/constructeur-mission";

export const metadata = { title: "Mission" };
export const dynamic = "force-dynamic";

export default async function PageMission({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mission = await prisma.projet.findUnique({
    where: { id },
    select: {
      id: true, titre: true, resume: true, statut: true, dureeJours: true, creeLe: true,
      montantClientFcfa: true, enveloppeTalentsFcfa: true,
      entreprise: { select: { raisonSociale: true } },
      equipe: {
        select: {
          membres: {
            select: {
              etudiantId: true,
              etudiant: { select: { prenom: true, nom: true, slug: true } },
            },
          },
        },
      },
      taches: {
        orderBy: { creeLe: "asc" },
        select: {
          id: true, titre: true, statut: true, montantFcfa: true, crediteeLe: true, echeance: true,
          assignee: { select: { id: true, prenom: true, nom: true } },
        },
      },
    },
  });
  if (!mission || mission.montantClientFcfa == null) notFound();

  const enveloppe = mission.enveloppeTalentsFcfa ?? 0;
  const alloue = mission.taches.reduce((s, t) => s + (t.montantFcfa ?? 0), 0);
  const verse = mission.taches
    .filter((t) => t.crediteeLe)
    .reduce((s, t) => s + (t.montantFcfa ?? 0), 0);
  const marge = mission.montantClientFcfa - enveloppe;
  const membres = (mission.equipe?.membres ?? []).map((m) => ({
    etudiantId: m.etudiantId,
    nom: `${m.etudiant.prenom} ${m.etudiant.nom}`,
    slug: m.etudiant.slug,
  }));

  return (
    <div className="fadein mx-auto max-w-[1100px]">
      <Link href="/admin/missions" className="t-small inline-flex items-center gap-1 font-medium text-sage-600 no-underline">
        <Icon.ArrowLeft size={14} /> Missions
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="m-0 text-2xl font-semibold tracking-tight">{mission.titre}</h1>
          <p className="t-small mt-1 mb-0">
            {mission.entreprise?.raisonSociale ?? "Client direct"} · {mission.dureeJours} jours ·
            créée le {formaterDate(mission.creeLe)}
          </p>
        </div>
        <PastilleStatut domaine="projet" statut={mission.statut} />
      </div>

      {/* Budget */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTuile libelle="Montant client" valeur={formaterMontantFcfa(mission.montantClientFcfa)} />
        <StatTuile libelle="Enveloppe talents" valeur={formaterMontantFcfa(enveloppe)} />
        <StatTuile
          libelle="Marge JUB"
          valeur={formaterMontantFcfa(marge)}
          indication={mission.montantClientFcfa > 0 ? `${Math.round((marge / mission.montantClientFcfa) * 100)} %` : undefined}
        />
        <StatTuile libelle="Déjà versé" valeur={formaterMontantFcfa(verse)} />
      </div>

      <div className="mt-3">
        <BarreProgression valeur={alloue} max={enveloppe || 1} etiquette="Enveloppe allouée aux tâches" />
        <div className="mt-1.5 flex justify-between">
          <span className="t-xs t-discret">Alloué : {formaterMontantFcfa(alloue)}</span>
          <span className="t-xs t-discret">Restant : {formaterMontantFcfa(Math.max(0, enveloppe - alloue))}</span>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {/* Tâches */}
        <section>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="m-0 flex items-center gap-2 text-[17px] font-semibold tracking-[-0.015em]">
              <Icon.Kanban size={18} className="text-sage-500" /> Tâches · {mission.taches.length}
            </h2>
            <BoutonRepartirEnveloppe projetId={mission.id} />
          </div>

          {mission.taches.length > 0 ? (
            <div className="liste-bordee mb-4">
              {mission.taches.map((t) => (
                <div key={t.id} className="flex flex-wrap items-center gap-3 bg-fond-eleve px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{t.titre}</div>
                    <div className="t-xs t-discret">
                      {t.assignee ? `${t.assignee.prenom} ${t.assignee.nom}` : "Non assignée"}
                      {t.echeance ? ` · échéance ${formaterDate(t.echeance)}` : ""}
                    </div>
                  </div>
                  <span className="t-mono text-[13px] font-bold text-sage-900">
                    {t.montantFcfa ? formaterMontantFcfa(t.montantFcfa) : "—"}
                  </span>
                  {t.crediteeLe ? (
                    <Insigne ton="vert">
                      <Icon.Check size={11} /> Payée
                    </Insigne>
                  ) : (
                    <PastilleStatut domaine="tache" statut={t.statut} />
                  )}
                  {!t.crediteeLe ? <BoutonSupprimerTache tacheId={t.id} /> : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="t-small mb-4">Aucune tâche. Découpe la mission ci-dessous.</p>
          )}

          <div className="carte p-4">
            <div className="t-eyebrow mb-3">Ajouter une tâche</div>
            <FormulaireAjoutTache projetId={mission.id} membres={membres} />
          </div>
        </section>

        {/* Équipe */}
        <section>
          <h2 className="m-0 mb-3 flex items-center gap-2 text-[17px] font-semibold tracking-[-0.015em]">
            <Icon.Users size={18} className="text-sage-500" /> Talents · {membres.length}
          </h2>
          {membres.length > 0 ? (
            <div className="liste-bordee mb-4">
              {membres.map((m) => (
                <Link
                  key={m.etudiantId}
                  href={`/u/${m.slug}`}
                  className="flex items-center gap-3 bg-fond-eleve px-4 py-3 no-underline text-inherit hover:bg-white"
                >
                  <Avatar nom={m.nom} taille={30} />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{m.nom}</span>
                  <Icon.ChevronRight size={14} className="text-sage-400" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="t-small mb-4">Aucun talent assigné.</p>
          )}
          <div className="carte p-4">
            <div className="t-eyebrow mb-3">Ajouter un talent</div>
            <FormulaireAjoutTalent projetId={mission.id} />
          </div>

          <div className="carte mt-4 p-4">
            <div className="t-eyebrow mb-2">Résumé</div>
            <p className="t-small m-0 whitespace-pre-wrap">{mission.resume}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
