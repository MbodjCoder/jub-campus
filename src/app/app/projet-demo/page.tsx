import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugifier } from "@/lib/utils";

// Provisionne un projet de démonstration pour l'étudiant connecté.
// L'utilisateur est ajouté à l'équipe en rôle "Lead". Quelques tâches
// et un livrable de départ sont créés pour pouvoir tester le kanban
// et le fil de feedback dès la première visite.

export default async function PageProvisionDemo() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const etudiant = await prisma.etudiant.findUnique({
    where: { utilisateurId: session.user.id },
  });
  if (!etudiant) redirect("/app/profil");

  // S'il a déjà rejoint un projet, on l'y renvoie directement.
  const dejaMembre = await prisma.membreEquipe.findFirst({
    where: { etudiantId: etudiant.id },
    include: { equipe: true },
  });
  if (dejaMembre) {
    redirect(`/app/projet/${dejaMembre.equipe.projetId}`);
  }

  const slug = `demo-${slugifier(etudiant.prenom)}-${nanoid(6).toLowerCase()}`;

  const projet = await prisma.projet.create({
    data: {
      slug,
      titre: "Projet de démonstration JUB Campus",
      resume: "Espace de test pour découvrir le kanban, les livrables et le fil de feedback.",
      description:
        "Bienvenue dans ton espace projet de démo. Toutes les fonctionnalités sont identiques " +
        "à celles d'un vrai projet : création de tâches, déplacement entre colonnes, dépôt de " +
        "livrables (URL pour l'instant), feedbacks notés. Quand tu rejoindras un vrai projet, " +
        "cet espace ressemblera exactement à ça.",
      source: "JUB_INTERNE",
      categorie: "WEB",
      niveau: "INTERMEDIAIRE",
      modeRemuneration: "APPRENTISSAGE",
      dureeJours: 28,
      placesMax: 3,
      statut: "EN_COURS",
      visibilite: "PRIVEE",
      publieParId: session.user.id,
      publieLe: new Date(),
      equipe: {
        create: {
          nom: "Équipe démo",
          membres: { create: { etudiantId: etudiant.id, roleEquipe: "Lead" } },
        },
      },
      taches: {
        create: [
          { titre: "Découvrir le kanban", description: "Déplace cette tâche vers « En cours » en utilisant le menu déroulant.", priorite: "NORMALE", assigneeId: etudiant.id },
          { titre: "Créer une nouvelle tâche", description: "Clique sur « Ajouter une tâche » pour en créer une.", priorite: "BASSE" },
          { titre: "Déposer un livrable", description: "Dépose un livrable (lien Drive / Figma / GitHub) puis donne-toi un feedback.", priorite: "HAUTE" },
          { titre: "Terminer la démo", description: "Marque cette tâche comme « Terminée ».", priorite: "BASSE" },
        ],
      },
    },
  });

  redirect(`/app/projet/${projet.id}`);
}
