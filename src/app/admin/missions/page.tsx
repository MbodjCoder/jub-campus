// Ops — liste des missions (projets en mode agence : montant client défini).

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formaterMontantFcfa } from "@/lib/utils";
import { StatTuile } from "@/composants/ui/stat-tuile";
import { PastilleStatut } from "@/composants/ui/pastille-statut";
import { EtatVide } from "@/composants/ui/etat-vide";
import { LienBouton } from "@/composants/ui/lien-bouton";
import { Icon } from "@/composants/maquette/icones";

export const metadata = { title: "Missions" };
export const dynamic = "force-dynamic";

export default async function PageMissions() {
  const missions = await prisma.projet.findMany({
    where: { montantClientFcfa: { not: null } },
    orderBy: { creeLe: "desc" },
    select: {
      id: true, titre: true, statut: true, creeLe: true,
      montantClientFcfa: true, enveloppeTalentsFcfa: true,
      entreprise: { select: { raisonSociale: true } },
      taches: { select: { montantFcfa: true, crediteeLe: true } },
      equipe: { select: { _count: { select: { membres: true } } } },
    },
  });

  const caTotal = missions.reduce((s, m) => s + (m.montantClientFcfa ?? 0), 0);
  const reverse = missions.reduce(
    (s, m) => s + m.taches.filter((t) => t.crediteeLe).reduce((x, t) => x + (t.montantFcfa ?? 0), 0),
    0,
  );
  const margeTotale = missions.reduce(
    (s, m) => s + ((m.montantClientFcfa ?? 0) - (m.enveloppeTalentsFcfa ?? 0)),
    0,
  );

  return (
    <div className="fadein mx-auto max-w-[1100px]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="m-0 text-2xl font-semibold tracking-tight">Missions</h1>
          <p className="t-small mt-1 mb-0">Missions vendues au livrable, opérées par JUB.</p>
        </div>
        <LienBouton href="/admin/missions/nouvelle" apparence="accent" icone={<Icon.Plus size={15} />}>
          Nouvelle mission
        </LienBouton>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatTuile libelle="CA missions" valeur={formaterMontantFcfa(caTotal)} />
        <StatTuile libelle="Reversé aux talents" valeur={formaterMontantFcfa(reverse)} />
        <StatTuile libelle="Marge théorique" valeur={formaterMontantFcfa(margeTotale)} />
      </div>

      {missions.length === 0 ? (
        <EtatVide
          icone={<Icon.Briefcase size={20} />}
          titre="Aucune mission pour l'instant"
          description="Crée la première mission à partir d'un brief client gagné."
          action={
            <LienBouton href="/admin/missions/nouvelle" apparence="accent">
              Créer une mission
            </LienBouton>
          }
        />
      ) : (
        <div className="liste-bordee">
          {missions.map((m) => {
            const alloue = m.taches.reduce((s, t) => s + (t.montantFcfa ?? 0), 0);
            return (
              <Link
                key={m.id}
                href={`/admin/missions/${m.id}`}
                className="flex flex-wrap items-center gap-3 bg-fond-eleve px-4 py-3.5 no-underline text-inherit hover:bg-white"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{m.titre}</div>
                  <div className="t-xs t-discret">
                    {m.entreprise?.raisonSociale ?? "Client direct"} · {m.equipe?._count.membres ?? 0} talent
                    {(m.equipe?._count.membres ?? 0) > 1 ? "s" : ""} · alloué {formaterMontantFcfa(alloue)} /{" "}
                    {formaterMontantFcfa(m.enveloppeTalentsFcfa ?? 0)}
                  </div>
                </div>
                <span className="t-mono hide-sm text-[13px] font-bold text-sage-900">
                  {formaterMontantFcfa(m.montantClientFcfa ?? 0)}
                </span>
                <PastilleStatut domaine="projet" statut={m.statut} />
                <Icon.ChevronRight size={14} className="text-sage-400" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
