"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const schemaProfilEtudiant = z.object({
  prenom: z.string().min(2).max(60),
  nom: z.string().min(2).max(60),
  universite: z.string().min(2),
  niveau: z.enum(["L1", "L2", "L3", "M1", "M2", "DOCTORAT"]),
  filiere: z.string().max(120).optional(),
  biographie: z.string().max(2000).optional(),
  disponibilite: z.enum(["DISPONIBLE", "PARTIEL", "INDISPONIBLE"]),
});

export async function mettreAJourProfilEtudiant(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion?suivant=/app/profil");

  const parsed = schemaProfilEtudiant.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const d = parsed.data;

  const universite = await prisma.universite.findUnique({ where: { acronyme: d.universite } });
  if (!universite) return;

  await prisma.etudiant.update({
    where: { utilisateurId: session.user.id },
    data: {
      prenom: d.prenom,
      nom: d.nom,
      universiteId: universite.id,
      niveau: d.niveau,
      filiere: d.filiere || null,
      biographie: d.biographie || null,
      disponibilite: d.disponibilite,
    },
  });
  await prisma.utilisateur.update({
    where: { id: session.user.id },
    data: { nomComplet: `${d.prenom} ${d.nom}` },
  });

  revalidatePath("/app");
  revalidatePath("/app/profil");
  // Le portfolio public peut avoir changé : invalider aussi
  const e = await prisma.etudiant.findUnique({ where: { utilisateurId: session.user.id }, select: { slug: true } });
  if (e) revalidatePath(`/u/${e.slug}`);
}
