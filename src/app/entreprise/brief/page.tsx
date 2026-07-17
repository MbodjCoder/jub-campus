// Client — mes briefs : suivi de l'entonnoir (reçu → devis → mission).

import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formaterDate, formaterMontantFcfa } from "@/lib/utils";
import { Insigne } from "@/composants/ui/insigne";
import { EtatVide } from "@/composants/ui/etat-vide";
import { LienBouton } from "@/composants/ui/lien-bouton";
import { Icon } from "@/composants/maquette/icones";

export const metadata = { title: "Mes demandes" };
export const dynamic = "force-dynamic";

const TON_STATUT = {
  RECU: "jaune",
  EN_QUALIFICATION: "jaune",
  DEVIS_ENVOYE: "orange",
  ACCEPTE: "vert",
  PERDU: "neutre",
} as const;

const LIBELLE_STATUT = {
  RECU: "Reçu",
  EN_QUALIFICATION: "En qualification",
  DEVIS_ENVOYE: "Devis envoyé",
  ACCEPTE: "Mission lancée",
  PERDU: "Sans suite",
} as const;

export default async function PageMesBriefs() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const entreprise = await prisma.entreprise.findUnique({
    where: { utilisateurId: session.user.id },
    select: {
      briefs: {
        orderBy: { creeLe: "desc" },
        select: {
          id: true, titre: true, typeMission: true, statut: true, creeLe: true,
          budgetIndicatifFcfa: true, devisUrl: true, projetId: true,
        },
      },
    },
  });
  const briefs = entreprise?.briefs ?? [];

  return (
    <div className="fadein mx-auto max-w-[900px]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="m-0 text-2xl font-semibold tracking-tight">Mes demandes</h1>
          <p className="t-small mt-1 mb-0">Devis gratuit sous 72 h ouvrées. Vous payez le résultat, nous garantissons la qualité.</p>
        </div>
        <LienBouton href="/entreprise/brief/nouveau" apparence="accent" icone={<Icon.Plus size={15} />}>
          Nouvelle demande
        </LienBouton>
      </div>

      {briefs.length === 0 ? (
        <EtatVide
          icone={<Icon.FileText size={20} />}
          titre="Aucune demande pour l'instant"
          description="Décrivez votre besoin en 4 étapes — enquête terrain, annotation de données, étude…"
          action={
            <LienBouton href="/entreprise/brief/nouveau" apparence="accent">
              Déposer une demande
            </LienBouton>
          }
        />
      ) : (
        <div className="liste-bordee">
          {briefs.map((b) => (
            <div key={b.id} className="flex flex-wrap items-center gap-3 bg-fond-eleve px-4 py-3.5">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{b.titre}</div>
                <div className="t-xs t-discret">
                  Déposée le {formaterDate(b.creeLe)}
                  {b.budgetIndicatifFcfa ? ` · budget indicatif ${formaterMontantFcfa(b.budgetIndicatifFcfa)}` : ""}
                </div>
              </div>
              {b.devisUrl ? (
                <a href={b.devisUrl} target="_blank" rel="noopener noreferrer"
                  className="t-xs inline-flex items-center gap-1 font-semibold text-orange-600 no-underline">
                  <Icon.Download size={13} /> Devis
                </a>
              ) : null}
              {b.projetId ? (
                <Link href={`/entreprise/missions/${b.projetId}`}
                  className="t-xs inline-flex items-center gap-1 font-semibold text-orange-600 no-underline">
                  Suivre la mission <Icon.Arrow size={12} />
                </Link>
              ) : null}
              <Insigne ton={TON_STATUT[b.statut as keyof typeof TON_STATUT] ?? "neutre"}>
                {LIBELLE_STATUT[b.statut as keyof typeof LIBELLE_STATUT] ?? b.statut}
              </Insigne>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
