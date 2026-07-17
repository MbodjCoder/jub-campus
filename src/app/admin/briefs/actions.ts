"use server";

// Actions ops : pipeline des briefs (qualification → devis → gagné/perdu).

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { journaliser } from "@/domaine/audit";
import { creerNotification } from "@/domaine/notifications";

async function exigerAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") redirect("/");
  return session;
}

const schemaTransition = z.object({
  briefId: z.string().cuid(),
  statut: z.enum(["EN_QUALIFICATION", "DEVIS_ENVOYE", "PERDU"]),
  motifPerte: z.string().max(500).optional().or(z.literal("")),
  devisUrl: z.string().url().optional().or(z.literal("")),
});

export async function changerStatutBrief(formData: FormData) {
  const session = await exigerAdmin();
  const parsed = schemaTransition.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { succes: false as const, message: "Données invalides." };
  const d = parsed.data;

  const brief = await prisma.brief.update({
    where: { id: d.briefId },
    data: {
      statut: d.statut,
      motifPerte: d.statut === "PERDU" ? (d.motifPerte || null) : null,
      devisUrl: d.devisUrl || undefined,
    },
    select: {
      titre: true,
      client: { select: { utilisateurId: true } },
    },
  });

  await journaliser({
    acteurId: session.user.id,
    action: `BRIEF_${d.statut}`,
    ressourceType: "Brief",
    ressourceId: d.briefId,
  });

  if (d.statut === "DEVIS_ENVOYE") {
    await creerNotification({
      destinataireId: brief.client.utilisateurId,
      type: "SYSTEME",
      titre: `Devis disponible : ${brief.titre}`,
      contenu: "Notre équipe a chiffré ta demande. Consulte le devis dans ton espace.",
      lien: "/entreprise/brief",
    });
  }

  revalidatePath("/admin/briefs");
  revalidatePath("/entreprise/brief");
  return { succes: true as const };
}
