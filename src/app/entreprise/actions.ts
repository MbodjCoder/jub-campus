"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const schemaProfilEntreprise = z.object({
  raisonSociale: z.string().min(2).max(160),
  secteur: z.string().min(2).max(120),
  taille: z.enum(["TRES_PETITE", "PETITE", "MOYENNE", "GRANDE"]),
  ninea: z.string().max(60).optional(),
  rccm: z.string().max(60).optional(),
  ville: z.string().max(80).optional(),
  siteWeb: z.string().url().or(z.literal("")).optional(),
  description: z.string().max(2000).optional(),
});

export async function mettreAJourProfilEntreprise(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion?suivant=/entreprise/profil");
  if (session.user.role !== "ENTREPRISE" && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const parsed = schemaProfilEntreprise.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const d = parsed.data;

  await prisma.entreprise.update({
    where: { utilisateurId: session.user.id },
    data: {
      raisonSociale: d.raisonSociale,
      secteur: d.secteur,
      taille: d.taille,
      ninea: d.ninea || null,
      rccm: d.rccm || null,
      ville: d.ville || null,
      siteWeb: d.siteWeb || null,
      description: d.description || null,
    },
  });
  await prisma.utilisateur.update({
    where: { id: session.user.id },
    data: { nomComplet: d.raisonSociale },
  });

  revalidatePath("/entreprise");
  revalidatePath("/entreprise/profil");
}
