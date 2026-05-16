"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const schemaProfilMentor = z.object({
  prenom: z.string().min(2).max(60),
  nom: z.string().min(2).max(60),
  type: z.enum(["PROFESSEUR", "PROFESSIONNEL", "ALUMNI", "EXPERT_INVITE"]),
  universite: z.string().optional(),
  titreOuPoste: z.string().max(160).optional(),
  specialites: z.string().max(500),
  biographie: z.string().max(2000).optional(),
});

export async function mettreAJourProfilMentor(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion?suivant=/mentor/profil");
  if (session.user.role !== "MENTOR" && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const parsed = schemaProfilMentor.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const d = parsed.data;

  let universiteId: string | null = null;
  if (d.universite) {
    const u = await prisma.universite.findUnique({ where: { acronyme: d.universite } });
    universiteId = u?.id ?? null;
  }

  await prisma.mentor.update({
    where: { utilisateurId: session.user.id },
    data: {
      prenom: d.prenom,
      nom: d.nom,
      type: d.type,
      universiteId,
      titreOuPoste: d.titreOuPoste || null,
      specialites: d.specialites.split(",").map((s) => s.trim()).filter(Boolean),
      biographie: d.biographie || null,
    },
  });
  await prisma.utilisateur.update({
    where: { id: session.user.id },
    data: { nomComplet: `${d.prenom} ${d.nom}` },
  });

  revalidatePath("/mentor");
  revalidatePath("/mentor/profil");
}
