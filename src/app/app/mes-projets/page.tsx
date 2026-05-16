// Mes jobs — données réelles + composant maquette client.

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MesJobs, type ProjetEnCours } from "@/composants/maquette/mes-jobs";
import { maintenantMs } from "@/lib/utils";

export const metadata = { title: "Mes jobs" };
export const dynamic = "force-dynamic";

const ACTIFS = ["EQUIPE_EN_CONSTITUTION", "EN_COURS", "EN_REVISION"];
const TERMINES = ["TERMINE", "CERTIFIE"];

export default async function PageMesJobs() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const etudiant = await prisma.etudiant.findUnique({
    where: { utilisateurId: session.user.id },
    select: {
      id: true,
      membreEquipes: {
        orderBy: { rejointLe: "desc" },
        select: {
          equipe: {
            select: {
              projet: {
                select: {
                  id: true, titre: true, statut: true, dureeJours: true, dateDebut: true,
                  entreprise: { select: { raisonSociale: true } },
                },
              },
            },
          },
        },
      },
      candidatures: {
        where: { statut: "EN_ATTENTE" },
        orderBy: { creeLe: "desc" },
        select: {
          creeLe: true,
          projet: { select: { titre: true, entreprise: { select: { raisonSociale: true } } } },
        },
      },
      certificats: { select: { projetId: true, numeroPublic: true, scoreFinal: true, organisationNom: true } },
    },
  });

  const projetsMembre = etudiant?.membreEquipes.map((m) => m.equipe.projet) ?? [];
  const projetActif = projetsMembre.find((p) => ACTIFS.includes(p.statut)) ?? null;

  let enCours: ProjetEnCours | null = null;
  if (projetActif) {
    const detail = await prisma.projet.findUnique({
      where: { id: projetActif.id },
      select: {
        id: true, titre: true, dureeJours: true, dateDebut: true,
        entreprise: { select: { raisonSociale: true } },
        equipe: {
          select: {
            membres: {
              select: { roleEquipe: true, etudiant: { select: { prenom: true, nom: true } } },
            },
          },
        },
        taches: {
          orderBy: { echeance: "asc" },
          select: {
            id: true, titre: true, statut: true, echeance: true,
            assignee: { select: { prenom: true, nom: true } },
          },
        },
        livrables: {
          orderBy: { deposeLe: "desc" },
          select: {
            id: true, titre: true, deposeLe: true, statut: true,
            deposePar: { select: { nomComplet: true } },
            feedbacks: {
              orderBy: { creeLe: "asc" },
              select: {
                id: true, contenu: true, creeLe: true, auteurId: true,
                auteur: { select: { nomComplet: true } },
              },
            },
          },
        },
      },
    });

    if (detail) {
      const jourActuel = detail.dateDebut
        ? Math.min(
            detail.dureeJours,
            Math.max(0, Math.floor((maintenantMs() - new Date(detail.dateDebut).getTime()) / 86_400_000)),
          )
        : 0;
      enCours = {
        id: detail.id,
        titre: detail.titre,
        organisation: detail.entreprise?.raisonSociale ?? "JUB Campus",
        jourActuel,
        duree: detail.dureeJours,
        equipe: (detail.equipe?.membres ?? []).map((m) => ({
          nom: `${m.etudiant.prenom} ${m.etudiant.nom}`,
          role: m.roleEquipe,
        })),
        taches: detail.taches.map((t) => ({
          id: t.id,
          titre: t.titre,
          statut: t.statut,
          echeance: t.echeance,
          assignee: t.assignee ? `${t.assignee.prenom} ${t.assignee.nom}` : "—",
        })),
        livrables: detail.livrables.map((l) => ({
          id: l.id,
          titre: l.titre,
          deposeLe: l.deposeLe,
          statut: l.statut,
          auteur: l.deposePar?.nomComplet ?? "—",
        })),
        feedbacks: detail.livrables
          .flatMap((l) => l.feedbacks)
          .sort((a, b) => new Date(a.creeLe).getTime() - new Date(b.creeLe).getTime())
          .map((f) => ({
            id: f.id,
            auteur: f.auteur?.nomComplet ?? "—",
            date: f.creeLe,
            contenu: f.contenu,
            moi: f.auteurId === session.user.id,
          })),
      };
    }
  }

  const certParProjet = new Map(
    (etudiant?.certificats ?? []).map((c) => [c.projetId, c]),
  );
  const termines = projetsMembre
    .filter((p) => TERMINES.includes(p.statut))
    .map((p) => {
      const cert = certParProjet.get(p.id);
      return {
        titre: p.titre,
        org: p.entreprise?.raisonSociale ?? "JUB Campus",
        score: cert?.scoreFinal ?? 0,
        numeroPublic: cert?.numeroPublic ?? null,
        projetId: p.id,
      };
    });

  return (
    <MesJobs
      enCours={enCours}
      candidatures={(etudiant?.candidatures ?? []).map((c) => ({
        projet: c.projet.titre,
        organisation: c.projet.entreprise?.raisonSociale ?? "JUB Campus",
        date: c.creeLe,
      }))}
      termines={termines}
    />
  );
}
