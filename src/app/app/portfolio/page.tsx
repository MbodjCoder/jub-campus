import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Bouton } from "@/composants/ui/bouton";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";

export const metadata = { title: "Mon portfolio" };

export default async function PageMonPortfolio() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const etudiant = await prisma.etudiant.findUnique({
    where: { utilisateurId: session.user.id },
    select: { slug: true, estPublic: true, scoreJub: true },
  });

  if (!etudiant) {
    return (
      <Carte>
        <CorpsCarte>Profil étudiant introuvable.</CorpsCarte>
      </Carte>
    );
  }

  const url = `/u/${etudiant.slug}`;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Mon portfolio public</h1>
        <p className="text-texte-discret">Ton vitrine, visible par toute personne ayant le lien.</p>
      </header>

      <Carte>
        <EnteteCarte>
          <div className="flex items-center justify-between">
            <TitreCarte>État du portfolio</TitreCarte>
            <Insigne ton={etudiant.estPublic ? "vert" : "neutre"}>
              {etudiant.estPublic ? "PUBLIC" : "PRIVÉ"}
            </Insigne>
          </div>
          <DescriptionCarte>
            Score JUB actuel : <strong>{etudiant.scoreJub}</strong>
          </DescriptionCarte>
        </EnteteCarte>
        <CorpsCarte className="space-y-4">
          <div className="rounded-md border border-bordure bg-jub-pierre-100 p-3 font-mono text-sm">
            jubcampus.sn{url}
          </div>
          <div className="flex gap-2">
            <Link href={url}>
              <Bouton apparence="primaire">Voir mon portfolio</Bouton>
            </Link>
            <Bouton apparence="contour">Copier le lien</Bouton>
            <Bouton apparence="contour">Partager LinkedIn</Bouton>
          </div>
        </CorpsCarte>
      </Carte>
    </>
  );
}
