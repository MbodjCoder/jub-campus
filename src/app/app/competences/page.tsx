import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";

export const metadata = { title: "Mes compétences" };

export default async function PageCompetences() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const etudiant = await prisma.etudiant.findUnique({
    where: { utilisateurId: session.user.id },
    include: { competences: { include: { competence: true } } },
  });

  const competencesCatalogue = await prisma.competence.findMany({
    orderBy: [{ categorie: "asc" }, { nom: "asc" }],
  });

  const mesCompetences = new Set(etudiant?.competences.map((c) => c.competenceId) ?? []);

  const parCategorie = competencesCatalogue.reduce<Record<string, typeof competencesCatalogue>>((acc, c) => {
    (acc[c.categorie] ??= []).push(c);
    return acc;
  }, {});

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Mes compétences</h1>
        <p className="text-texte-discret">
          Sélectionne les compétences que tu maîtrises pour recevoir des projets pertinents.
        </p>
      </header>

      <div className="space-y-4">
        {Object.entries(parCategorie).map(([categorie, liste]) => (
          <Carte key={categorie}>
            <EnteteCarte>
              <TitreCarte className="text-base">{categorie}</TitreCarte>
              <DescriptionCarte>{liste.length} compétences disponibles</DescriptionCarte>
            </EnteteCarte>
            <CorpsCarte className="flex flex-wrap gap-2">
              {liste.map((c) => {
                const possedee = mesCompetences.has(c.id);
                return (
                  <Insigne key={c.id} ton={possedee ? "vert" : "neutre"} className="cursor-pointer">
                    {c.nom}
                  </Insigne>
                );
              })}
            </CorpsCarte>
          </Carte>
        ))}
      </div>
    </>
  );
}
