// Client — mes missions opérées par JUB (lecture seule, suivi).

import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formaterMontantFcfa } from "@/lib/utils";
import { PastilleStatut } from "@/composants/ui/pastille-statut";
import { EtatVide } from "@/composants/ui/etat-vide";
import { LienBouton } from "@/composants/ui/lien-bouton";
import { BarreProgression } from "@/composants/ui/barre-progression";
import { Icon } from "@/composants/maquette/icones";

export const metadata = { title: "Mes missions" };
export const dynamic = "force-dynamic";

export default async function PageMissionsClient() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const entreprise = await prisma.entreprise.findUnique({
    where: { utilisateurId: session.user.id },
    select: { id: true },
  });
  if (!entreprise) redirect("/entreprise");

  const missions = await prisma.projet.findMany({
    where: { entrepriseId: entreprise.id, montantClientFcfa: { not: null } },
    orderBy: { creeLe: "desc" },
    select: {
      id: true, titre: true, statut: true, montantClientFcfa: true,
      taches: { select: { statut: true } },
    },
  });

  return (
    <div className="fadein mx-auto max-w-[900px]">
      <h1 className="m-0 text-2xl font-semibold tracking-tight">Mes missions</h1>
      <p className="t-small mt-1 mb-6">Suivi en temps réel des missions opérées par JUB.</p>

      {missions.length === 0 ? (
        <EtatVide
          icone={<Icon.Briefcase size={20} />}
          titre="Aucune mission en cours"
          description="Déposez une demande : notre équipe la chiffre et la pilote de bout en bout."
          action={
            <LienBouton href="/entreprise/brief/nouveau" apparence="accent">
              Déposer une demande
            </LienBouton>
          }
        />
      ) : (
        <div className="grid gap-3">
          {missions.map((m) => {
            const total = m.taches.length;
            const faites = m.taches.filter((t) => t.statut === "TERMINEE").length;
            return (
              <Link key={m.id} href={`/entreprise/missions/${m.id}`}
                className="carte lift block p-5 no-underline text-inherit">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[15px] font-semibold">{m.titre}</span>
                  <PastilleStatut domaine="projet" statut={m.statut} />
                </div>
                <div className="mt-3">
                  <BarreProgression valeur={faites} max={total || 1} accent etiquette="Avancement" />
                  <div className="mt-1.5 flex justify-between">
                    <span className="t-xs t-discret">{faites}/{total} tâches livrées</span>
                    <span className="t-xs t-mono t-discret">{formaterMontantFcfa(m.montantClientFcfa ?? 0)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
