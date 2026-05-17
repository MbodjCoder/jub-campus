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

  const [notifications, projets] = await Promise.all([
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
      session={{
        id: session.user.id,
        nom: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
        role: session.user.role,
      }}
      notifications={notifications}
      projetsRecherche={projets.map(versApercu)}
    >
      {children}
    </CoquilleApp>
  );
}
