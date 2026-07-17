// Ops — pipeline commercial : briefs par étape de l'entonnoir.

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formaterDate, formaterMontantFcfa } from "@/lib/utils";
import { Insigne } from "@/composants/ui/insigne";
import { EtatVide } from "@/composants/ui/etat-vide";
import { Icon } from "@/composants/maquette/icones";
import { ActionsBrief } from "@/composants/admin/actions-brief";

export const metadata = { title: "Pipeline briefs" };
export const dynamic = "force-dynamic";

const LIBELLE_TYPE: Record<string, string> = {
  ENQUETE_TERRAIN: "Enquête terrain",
  ANNOTATION: "Annotation",
  ETUDE: "Étude",
  REDACTION: "Rédaction",
  AUTRE: "Autre",
};

const SECTIONS = [
  { statut: "RECU", titre: "Reçus", ton: "jaune" },
  { statut: "EN_QUALIFICATION", titre: "En qualification", ton: "jaune" },
  { statut: "DEVIS_ENVOYE", titre: "Devis envoyés", ton: "orange" },
  { statut: "ACCEPTE", titre: "Gagnés", ton: "vert" },
  { statut: "PERDU", titre: "Perdus", ton: "neutre" },
] as const;

export default async function PagePipelineBriefs() {
  const briefs = await prisma.brief.findMany({
    orderBy: { creeLe: "desc" },
    select: {
      id: true, titre: true, typeMission: true, statut: true, creeLe: true,
      budgetIndicatifFcfa: true, details: true, projetId: true, motifPerte: true,
      client: { select: { raisonSociale: true } },
    },
  });

  return (
    <div className="fadein mx-auto max-w-[1000px]">
      <h1 className="m-0 text-2xl font-semibold tracking-tight">Pipeline briefs</h1>
      <p className="t-small mt-1 mb-6">
        {briefs.filter((b) => b.statut === "RECU" || b.statut === "EN_QUALIFICATION").length} demande(s) à traiter.
        Objectif : devis sous 72 h.
      </p>

      {briefs.length === 0 ? (
        <EtatVide
          icone={<Icon.FileText size={20} />}
          titre="Aucun brief"
          description="Les demandes déposées par les clients arrivent ici."
        />
      ) : (
        SECTIONS.map((section) => {
          const liste = briefs.filter((b) => b.statut === section.statut);
          if (liste.length === 0) return null;
          return (
            <section key={section.statut} className="mb-8">
              <h2 className="m-0 mb-3 flex items-center gap-2 text-[17px] font-semibold tracking-[-0.015em]">
                {section.titre}
                <span className="t-small font-normal">· {liste.length}</span>
              </h2>
              <div className="grid gap-3">
                {liste.map((b) => {
                  const d = (b.details ?? {}) as Record<string, string>;
                  return (
                    <div key={b.id} className="carte p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[15px] font-semibold">{b.titre}</span>
                            <Insigne ton="neutre">{LIBELLE_TYPE[b.typeMission] ?? b.typeMission}</Insigne>
                          </div>
                          <div className="t-xs t-discret mt-1">
                            {b.client.raisonSociale} · {formaterDate(b.creeLe)}
                            {b.budgetIndicatifFcfa ? ` · budget indicatif ${formaterMontantFcfa(b.budgetIndicatifFcfa)}` : ""}
                          </div>
                        </div>
                        {b.statut !== "ACCEPTE" ? (
                          <ActionsBrief briefId={b.id} statut={b.statut} titre={b.titre} />
                        ) : b.projetId ? (
                          <Link href={`/admin/missions/${b.projetId}`}
                            className="t-xs inline-flex items-center gap-1 font-semibold text-orange-600 no-underline">
                            Voir la mission <Icon.Arrow size={12} />
                          </Link>
                        ) : null}
                      </div>

                      {d.description ? (
                        <p className="t-small mt-3 mb-0 whitespace-pre-wrap">{d.description}</p>
                      ) : null}
                      <div className="t-xs t-discret mt-2 flex flex-wrap gap-x-4 gap-y-1">
                        {d.zone ? <span>Zone : {d.zone}</span> : null}
                        {d.volume ? <span>Volume : {d.volume}</span> : null}
                        {d.langues ? <span>Langues : {d.langues}</span> : null}
                        {d.echeance ? <span>Échéance : {d.echeance}</span> : null}
                        {d.materiel ? <span>Matériel : {d.materiel}</span> : null}
                        {b.motifPerte ? <span className="text-danger">Perdu : {b.motifPerte}</span> : null}
                      </div>

                      {b.statut === "DEVIS_ENVOYE" ? (
                        <div className="mt-3 border-t border-bordure pt-3">
                          <Link href="/admin/missions/nouvelle"
                            className="t-xs inline-flex items-center gap-1 font-semibold text-orange-600 no-underline">
                            <Icon.Plus size={12} /> Devis accepté → créer la mission (sélectionner ce brief)
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
