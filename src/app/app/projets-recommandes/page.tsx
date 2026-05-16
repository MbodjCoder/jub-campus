import { EnConstruction } from "@/composants/ui/en-construction";

export const metadata = { title: "Projets recommandés" };

export default function PageProjetsRecommandes() {
  return (
    <EnConstruction
      phase="Disponible phase 8"
      titre="Projets recommandés pour toi"
      description="Notre moteur de matching te proposera les projets les plus alignés avec tes compétences, ton niveau et ton historique. En attendant, parcours le catalogue complet."
      retourHref="/projets"
      retourLibelle="Voir tous les projets"
    />
  );
}
