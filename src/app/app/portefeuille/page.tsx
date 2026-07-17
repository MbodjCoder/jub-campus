// Portefeuille talent — solde, retrait Wave/OM, historique des transactions.
// Écran cœur de la rétention (plan de refonte §2.2).

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formaterMontantFcfa, formaterDate } from "@/lib/utils";
import { Insigne } from "@/composants/ui/insigne";
import { EtatVide } from "@/composants/ui/etat-vide";
import { StatTuile } from "@/composants/ui/stat-tuile";
import { Icon } from "@/composants/maquette/icones";
import { FormulaireRetrait } from "@/composants/portefeuille/formulaire-retrait";
import { BoutonAnnulerRetrait } from "@/composants/portefeuille/bouton-annuler-retrait";

export const metadata = { title: "Mon portefeuille" };
export const dynamic = "force-dynamic";

const TON_STATUT_RETRAIT = {
  DEMANDE: "jaune",
  EN_COURS: "jaune",
  PAYE: "vert",
  ECHEC: "rouge",
  ANNULE: "neutre",
} as const;

const LIBELLE_STATUT_RETRAIT = {
  DEMANDE: "Demandé",
  EN_COURS: "En cours",
  PAYE: "Payé",
  ECHEC: "Échec",
  ANNULE: "Annulé",
} as const;

export default async function PagePortefeuille() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const etudiant = await prisma.etudiant.findUnique({
    where: { utilisateurId: session.user.id },
    select: {
      portefeuille: {
        select: {
          soldeFcfa: true,
          transactions: {
            orderBy: { creeLe: "desc" },
            take: 50,
            select: { id: true, montantFcfa: true, type: true, libelle: true, creeLe: true },
          },
        },
      },
      retraits: {
        orderBy: { creeLe: "desc" },
        take: 10,
        select: {
          id: true, montantFcfa: true, methode: true, statut: true,
          numeroTelephone: true, creeLe: true,
        },
      },
    },
  });
  if (!etudiant) redirect("/app");

  const solde = etudiant.portefeuille?.soldeFcfa ?? 0;
  const transactions = etudiant.portefeuille?.transactions ?? [];
  const gainsTotal = transactions
    .filter((t) => t.montantFcfa > 0)
    .reduce((s, t) => s + t.montantFcfa, 0);
  const retraitEnAttente = etudiant.retraits.find((r) => r.statut === "DEMANDE" || r.statut === "EN_COURS");

  return (
    <main className="fadein mx-auto max-w-[800px] px-5 pb-8 pt-2">
      <h1 className="m-0 text-[clamp(1.5rem,3.5vw,2rem)] font-semibold tracking-[-0.025em]">
        Mon portefeuille
      </h1>
      <p className="t-small mt-1">
        Tes gains sont crédités à la validation de chaque livrable, retirables sur Wave ou Orange Money.
      </p>

      {/* Solde */}
      <section className="relative mt-5 overflow-hidden rounded-[18px] bg-gradient-to-br from-sage-900 to-sage-800 p-6 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(255,170,0,0.3),transparent_55%)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="t-eyebrow text-sage-100">Solde disponible</div>
            <div className="t-mono mt-1 text-4xl font-semibold tracking-tight text-white">
              {formaterMontantFcfa(solde)}
            </div>
          </div>
          <div className="text-right">
            <FormulaireRetrait soldeFcfa={solde} />
          </div>
        </div>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatTuile libelle="Gains cumulés" valeur={formaterMontantFcfa(gainsTotal)} icone={<Icon.TrendingUp size={16} />} />
        <StatTuile
          libelle="Retrait en attente"
          valeur={retraitEnAttente ? formaterMontantFcfa(retraitEnAttente.montantFcfa) : "—"}
          icone={<Icon.Clock size={16} />}
        />
      </div>

      {/* Retraits */}
      {etudiant.retraits.length > 0 ? (
        <section className="mt-8">
          <h2 className="m-0 flex items-center gap-2 text-[17px] font-semibold tracking-[-0.015em] text-sage-900">
            <Icon.Wallet size={18} className="text-sage-500" /> Mes retraits
          </h2>
          <div className="liste-bordee mt-3 rounded-xl">
            {etudiant.retraits.map((r) => (
              <div key={r.id} className="flex flex-wrap items-center gap-3 bg-fond-eleve px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold t-mono">{formaterMontantFcfa(r.montantFcfa)}</div>
                  <div className="t-xs t-discret">
                    {r.methode === "WAVE" ? "Wave" : "Orange Money"} · {r.numeroTelephone} · {formaterDate(r.creeLe)}
                  </div>
                </div>
                <Insigne ton={TON_STATUT_RETRAIT[r.statut as keyof typeof TON_STATUT_RETRAIT] ?? "neutre"}>
                  {LIBELLE_STATUT_RETRAIT[r.statut as keyof typeof LIBELLE_STATUT_RETRAIT] ?? r.statut}
                </Insigne>
                {r.statut === "DEMANDE" ? <BoutonAnnulerRetrait retraitId={r.id} /> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Historique */}
      <section className="mt-8">
        <h2 className="m-0 flex items-center gap-2 text-[17px] font-semibold tracking-[-0.015em] text-sage-900">
          <Icon.FileText size={18} className="text-sage-500" /> Historique
        </h2>
        {transactions.length === 0 ? (
          <EtatVide
            className="mt-3"
            icone={<Icon.Wallet size={20} />}
            titre="Aucune transaction pour l'instant"
            description="Termine des tâches payées : chaque livrable validé crédite ton portefeuille."
          />
        ) : (
          <div className="liste-bordee mt-3 rounded-xl">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center gap-3 bg-fond-eleve px-4 py-3">
                <span
                  className={
                    t.montantFcfa > 0
                      ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-sage-950"
                      : "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sage-100 text-sage-700"
                  }
                >
                  {t.montantFcfa > 0 ? <Icon.TrendingUp size={14} /> : <Icon.Wallet size={14} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{t.libelle}</div>
                  <div className="t-xs t-discret">{formaterDate(t.creeLe)}</div>
                </div>
                <span
                  className={
                    t.montantFcfa > 0
                      ? "t-mono text-sm font-bold text-succes"
                      : "t-mono text-sm font-bold text-texte"
                  }
                >
                  {t.montantFcfa > 0 ? "+" : ""}
                  {formaterMontantFcfa(t.montantFcfa)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
