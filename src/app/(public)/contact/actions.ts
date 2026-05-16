"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { envoyerEmail } from "@/lib/email";
import { limiterDebit } from "@/lib/rate-limit";

const schemaContact = z.object({
  email: z.string().email("Email invalide."),
  sujet: z.string().min(2).max(120),
  message: z.string().min(10, "Message trop court (10 caractères minimum).").max(4000),
});

export interface ResultatContact {
  succes: boolean;
  message?: string;
}

// Adresse de réception interne (équipe JUB).
const DESTINATAIRE_EQUIPE = process.env.EMAIL_CONTACT ?? "contact@jubcampus.sn";

export async function envoyerMessageContact(formData: FormData): Promise<ResultatContact> {
  // Anti-spam : 5 messages / heure par IP.
  const enTetes = await headers();
  const ip = enTetes.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnu";
  const limite = limiterDebit(`contact:${ip}`, 5, 3_600_000);
  if (!limite.autorise) {
    return { succes: false, message: "Trop de messages envoyés. Réessaie plus tard." };
  }

  const parsed = schemaContact.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { succes: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }
  const d = parsed.data;

  const r = await envoyerEmail({
    destinataire: DESTINATAIRE_EQUIPE,
    sujet: `[Contact] ${d.sujet}`,
    html: `
      <p><strong>Sujet :</strong> ${escapeHtml(d.sujet)}</p>
      <p><strong>De :</strong> ${escapeHtml(d.email)}</p>
      <hr/>
      <p>${escapeHtml(d.message).replace(/\n/g, "<br/>")}</p>
    `,
    expediteur: undefined,
  });

  if (!r.succes) {
    return { succes: false, message: "Envoi impossible pour le moment. Réessaie plus tard." };
  }
  return { succes: true };
}

// Échappe le HTML pour éviter toute injection dans le corps de l'email.
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
