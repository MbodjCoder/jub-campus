"use server";

import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugifier } from "@/lib/utils";

// Onboarding : complète le profil étudiant après une inscription Google.
const schema = z.object({
  prenom: z.string().min(2, "Prénom trop court."),
  nom: z.string().min(2, "Nom trop court."),
  universite: z.string().min(2, "Université requise."),
  niveau: z.enum(["L1", "L2", "L3", "M1", "M2", "DOCTORAT"]),
  filiere: z.string().max(120).optional(),
});

interface Resultat {
  succes: boolean;
  erreurs?: Record<string, string>;
}

export async function finaliserProfilEtudiant(
  _etat: Resultat | null,
  formData: FormData,
): Promise<Resultat> {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const erreurs: Record<string, string> = {};
    for (const i of parsed.error.issues) {
      erreurs[String(i.path[0] ?? "racine")] = i.message;
    }
    return { succes: false, erreurs };
  }
  const d = parsed.data;

  // Profil déjà complété : rien à faire.
  const existant = await prisma.etudiant.findUnique({
    where: { utilisateurId: session.user.id },
    select: { id: true },
  });
  if (existant) redirect("/app");

  const universite = await prisma.universite.findUnique({
    where: { acronyme: d.universite },
  });
  if (!universite) {
    return { succes: false, erreurs: { universite: "Université inconnue." } };
  }

  const slug = `${slugifier(`${d.prenom} ${d.nom}`)}-${nanoid(6).toLowerCase()}`;
  await prisma.etudiant.create({
    data: {
      utilisateurId: session.user.id,
      prenom: d.prenom,
      nom: d.nom,
      slug,
      universiteId: universite.id,
      niveau: d.niveau,
      filiere: d.filiere || null,
    },
  });
  await prisma.utilisateur.update({
    where: { id: session.user.id },
    data: { nomComplet: `${d.prenom} ${d.nom}` },
  });

  redirect("/app");
}
