import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CoquilleApp } from "@/composants/maquette/coquille-app";
import { versApercu, SELECT_APERCU } from "@/lib/projet-apercu";
import type { StatutProjet } from "@/generated/prisma/client";

const STATUTS_OUVERTS: StatutProjet[] = ["PUBLIE", "CANDIDATURES_OUVERTES", "EQUIPE_EN_CONSTITUTION"];

export default async function MiseEtudiant({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion?suivant=/app");
  if (
    session.user.role !== "ETUDIANT" &&
    session.user.role !== "ADMIN" &&
    session.user.role !== "SUPER_ADMIN"
  ) {
    redirect("/");
  }

  const [etudiant, notifications, projets] = await Promise.all([
    prisma.etudiant.findUnique({
      where: { utilisateurId: session.user.id },
      select: { universite: { select: { acronyme: true } } },
    }),
    prisma.notification.findMany({
      where: { destinataireId: session.user.id },
      orderBy: { creeLe: "desc" },
      take: 12,
      select: { id: true, type: true, titre: true, lue: true, creeLe: true, lien: true },
    }),
    prisma.projet.findMany({
      where: { statut: { in: STATUTS_OUVERTS }, visibilite: "PUBLIQUE" },
      orderBy: { publieLe: "desc" },
      take: 12,
      select: SELECT_APERCU,
    }),
  ]);

  return (
    <CoquilleApp
      nom={session.user.name ?? "Mon profil"}
      acronymeUniversite={etudiant?.universite?.acronyme ?? null}
      imageUrl={session.user.image ?? null}
      notifications={notifications}
      projetsRecherche={projets.map(versApercu)}
    >
      {children}
    </CoquilleApp>
  );
}
