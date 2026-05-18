// Onboarding — complète le profil étudiant après une inscription Google.
// Les comptes déjà complets sont renvoyés vers leur espace.

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { urlsParRole } from "@/lib/role";
import { Carte, EnteteCarte, TitreCarte, DescriptionCarte, CorpsCarte } from "@/composants/ui/carte";
import { FormulaireBienvenue } from "./formulaire";

export const metadata = { title: "Bienvenue sur JUB Campus" };
export const dynamic = "force-dynamic";

export default async function PageBienvenue() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  // Seuls les étudiants passent par cet onboarding (inscription Google).
  if (session.user.role !== "ETUDIANT") {
    redirect(urlsParRole(session.user.role).espace);
  }

  // Profil déjà complété → espace étudiant.
  const etudiant = await prisma.etudiant.findUnique({
    where: { utilisateurId: session.user.id },
    select: { id: true },
  });
  if (etudiant) redirect("/app");

  const utilisateur = await prisma.utilisateur.findUnique({
    where: { id: session.user.id },
    select: { nomComplet: true },
  });
  const [prenom = "", ...reste] = (utilisateur?.nomComplet ?? "").trim().split(/\s+/);

  return (
    <section className="mx-auto flex min-h-screen max-w-md items-center px-4 py-12 sm:px-6">
      <Carte className="w-full">
        <EnteteCarte>
          <TitreCarte>Dernière étape</TitreCarte>
          <DescriptionCarte>
            Renseigne ton université et ton niveau pour activer ton espace étudiant.
          </DescriptionCarte>
        </EnteteCarte>
        <CorpsCarte>
          <FormulaireBienvenue prenomInitial={prenom} nomInitial={reste.join(" ")} />
        </CorpsCarte>
      </Carte>
    </section>
  );
}
