// Journal d'audit — helper de journalisation best-effort.
// Obligatoire sur toute opération touchant l'argent (plan de refonte §4.4).

import "server-only";
import { prisma } from "@/lib/prisma";

export interface EntreeAudit {
  acteurId?: string | null;
  action: string;
  ressourceType: string;
  ressourceId: string;
  metadonnees?: Record<string, unknown>;
  ip?: string;
}

// N'échoue jamais : la journalisation ne doit pas casser l'opération métier.
export async function journaliser(e: EntreeAudit): Promise<void> {
  try {
    await prisma.journalAudit.create({
      data: {
        acteurId: e.acteurId ?? null,
        action: e.action,
        ressourceType: e.ressourceType,
        ressourceId: e.ressourceId,
        metadonnees: e.metadonnees ? JSON.parse(JSON.stringify(e.metadonnees)) : undefined,
        ip: e.ip,
      },
    });
  } catch (err) {
    console.error("[audit] échec de journalisation", err);
  }
}
