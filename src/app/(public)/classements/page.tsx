import { EnConstruction } from "@/composants/ui/en-construction";

export const metadata = { title: "Classements" };

export default function PageClassements() {
  return (
    <EnConstruction
      phase="Disponible phase 8"
      titre="Classements JUB Campus"
      description="Top étudiants par université et par domaine, badges les plus rares, parcours qui inspirent. Disponible quand la cohorte 1 aura livré ses premiers certificats."
      retourHref="/projets"
      retourLibelle="Voir les projets"
    />
  );
}
