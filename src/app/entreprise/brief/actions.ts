"use server";

// Actions client : dépôt d'un brief de mission (entonnoir commercial).

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { journaliser } from "@/domaine/audit";
import { creerNotification } from "@/domaine/notifications";

const schemaBrief = z.object({
  typeMission: z.enum(["ENQUETE_TERRAIN", "ANNOTATION", "ETUDE", "REDACTION", "AUTRE"]),
  titre: z.string().min(4).max(160),
  budgetIndicatifFcfa: z.coerce.number().int().positive().optional().or(z.literal("")),
  // Détails structurés du stepper, sérialisés en JSON côté client.
  details: z.string().min(2).max(8000),
});

export async function soumettreBrief(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { succes: false as const, message: "Session expirée." };

  const entreprise = await prisma.entreprise.findUnique({
    where: { utilisateurId: session.user.id },
    select: { id: true, raisonSociale: true, statutValidation: true },
  });
  if (!entreprise) return { succes: false as const, message: "Profil organisation introuvable." };
  if (entreprise.statutValidation !== "VALIDEE") {
    return { succes: false as const, message: "Ton compte doit être validé avant de déposer un brief." };
  }

  const parsed = schemaBrief.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { succes: false as const, message: "Formulaire incomplet." };

  let details: unknown;
  try {
    details = JSON.parse(parsed.data.details);
  } catch {
    return { succes: false as const, message: "Détails invalides." };
  }

  const brief = await prisma.brief.create({
    data: {
      clientId: entreprise.id,
      typeMission: parsed.data.typeMission,
      titre: parsed.data.titre,
      details: details as object,
      budgetIndicatifFcfa: parsed.data.budgetIndicatifFcfa || null,
    },
    select: { id: true },
  });

  await journaliser({
    acteurId: session.user.id,
    action: "BRIEF_DEPOSE",
    ressourceType: "Brief",
    ressourceId: brief.id,
  });

  // Alerte les admins (nouveaux briefs = pipeline commercial).
  const admins = await prisma.utilisateur.findMany({
    where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
    select: { id: true },
  });
  await Promise.all(
    admins.map((a) =>
      creerNotification({
        destinataireId: a.id,
        type: "SYSTEME",
        titre: `Nouveau brief : ${parsed.data.titre}`,
        contenu: `${entreprise.raisonSociale} a déposé une demande de mission.`,
        lien: "/admin/briefs",
      }),
    ),
  );

  revalidatePath("/entreprise/brief");
  return { succes: true as const, briefId: brief.id };
}
