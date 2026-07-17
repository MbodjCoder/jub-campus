// Ops — paie : file des retraits à envoyer, en cours, historique.

import { prisma } from "@/lib/prisma";
import { formaterDate, formaterMontantFcfa } from "@/lib/utils";
import { modeWave } from "@/lib/wave";
import { StatTuile } from "@/composants/ui/stat-tuile";
import { Insigne } from "@/composants/ui/insigne";
import { EtatVide } from "@/composants/ui/etat-vide";
import { Icon } from "@/composants/maquette/icones";
import { BoutonPayer, BoutonPayerTout, BoutonReconcilier } from "@/composants/admin/actions-paie";

export const metadata = { title: "Paie" };
export const dynamic = "force-dynamic";

const TON_STATUT = {
  DEMANDE: "jaune",
  EN_COURS: "orange",
  PAYE: "vert",
  ECHEC: "rouge",
  ANNULE: "neutre",
} as const;

export default async function PagePaie() {
  const retraits = await prisma.retrait.findMany({
    orderBy: { creeLe: "desc" },
    take: 200,
    select: {
      id: true, montantFcfa: true, methode: true, statut: true, numeroTelephone: true,
      creeLe: true, finaliseLe: true, motifEchec: true, referenceExterne: true,
      etudiant: { select: { prenom: true, nom: true } },
    },
  });

  const demandes = retraits.filter((r) => r.statut === "DEMANDE");
  const enCours = retraits.filter((r) => r.statut === "EN_COURS");
  const aPayer = demandes.reduce((s, r) => s + r.montantFcfa, 0);
  const payesTotal = retraits.filter((r) => r.statut === "PAYE").reduce((s, r) => s + r.montantFcfa, 0);
  const nbWaveDemandes = demandes.filter((r) => r.methode === "WAVE").length;
  const mode = modeWave();

  return (
    <div className="fadein mx-auto max-w-[1000px]">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="m-0 text-2xl font-semibold tracking-tight">Paie</h1>
          <p className="t-small mt-1 mb-0">
            {demandes.length} retrait{demandes.length > 1 ? "s" : ""} à traiter.
          </p>
        </div>
        <BoutonPayerTout nb={nbWaveDemandes} />
      </div>

      {mode !== "reel" ? (
        <div
          className={
            mode === "simulation"
              ? "mb-5 rounded-xl border border-orange-500/40 bg-orange-500/10 px-4 py-3"
              : "mb-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3"
          }
        >
          <p className="t-small m-0 flex items-start gap-2">
            <Icon.ShieldCheck size={15} className="mt-0.5 shrink-0" />
            {mode === "simulation" ? (
              <span>
                <strong>Mode simulation</strong> — les paiements sont fictifs (WAVE_SIMULATION=true).
                Interdit en production.
              </span>
            ) : (
              <span>
                <strong>Wave non configuré</strong> — renseigner WAVE_CLE_API pour activer l&apos;envoi
                réel. En attendant, seul le marquage manuel est possible.
              </span>
            )}
          </p>
        </div>
      ) : null}

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatTuile libelle="À payer" valeur={formaterMontantFcfa(aPayer)} indication={`${demandes.length} retrait(s)`} />
        <StatTuile libelle="En cours chez Wave" valeur={String(enCours.length)} />
        <StatTuile libelle="Total payé" valeur={formaterMontantFcfa(payesTotal)} />
      </div>

      {enCours.length > 0 ? (
        <div className="mb-4 flex justify-end">
          <BoutonReconcilier nb={enCours.length} />
        </div>
      ) : null}

      {retraits.length === 0 ? (
        <EtatVide
          icone={<Icon.Wallet size={20} />}
          titre="Aucun retrait"
          description="Les demandes de retrait des talents arrivent ici."
        />
      ) : (
        <div className="liste-bordee">
          {retraits.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center gap-3 bg-fond-eleve px-4 py-3.5">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">
                  {r.etudiant.prenom} {r.etudiant.nom}
                  <span className="t-mono ml-2 font-bold">{formaterMontantFcfa(r.montantFcfa)}</span>
                </div>
                <div className="t-xs t-discret">
                  {r.methode === "WAVE" ? "Wave" : "Orange Money"} · {r.numeroTelephone} · demandé le{" "}
                  {formaterDate(r.creeLe)}
                  {r.finaliseLe ? ` · finalisé le ${formaterDate(r.finaliseLe)}` : ""}
                  {r.referenceExterne ? ` · réf ${r.referenceExterne}` : ""}
                </div>
                {r.motifEchec ? <div className="t-xs mt-0.5 text-danger">{r.motifEchec}</div> : null}
              </div>
              <Insigne ton={TON_STATUT[r.statut as keyof typeof TON_STATUT] ?? "neutre"}>{r.statut}</Insigne>
              {r.statut === "DEMANDE" ? <BoutonPayer retraitId={r.id} methode={r.methode} /> : null}
            </div>
          ))}
        </div>
      )}

      <p className="t-xs t-discret mt-4">
        Chaque envoi porte une clé d&apos;idempotence : retenter un retrait en erreur ne peut jamais
        provoquer de double paiement. Les échecs définitifs Wave recréditent automatiquement le talent.
      </p>
    </div>
  );
}
