// Couche d'envoi d'emails JUB Campus.
// Backend : Resend. Si RESEND_CLE_API n'est pas configurée, on log
// dans la console en dev (best-effort) sans bloquer le flux métier.

import { Resend } from "resend";

let clientResend: Resend | null = null;
function obtenirClient(): Resend | null {
  if (clientResend) return clientResend;
  const cle = process.env.RESEND_CLE_API;
  if (!cle) return null;
  clientResend = new Resend(cle);
  return clientResend;
}

const EXPEDITEUR_PAR_DEFAUT = process.env.EMAIL_EXPEDITEUR ?? "JUB Campus <hello@jubcampus.sn>";

export interface OptionsEnvoi {
  destinataire: string | string[];
  sujet: string;
  /** Corps HTML complet (déjà mis en forme). */
  html: string;
  /** Corps texte brut (fallback). Si absent, dérivé du HTML. */
  texte?: string;
  expediteur?: string;
}

interface ResultatEnvoi {
  succes: boolean;
  id?: string;
  /** Renseigné quand on tombe en mode log (pas de clé API). */
  modeLog?: boolean;
  erreur?: string;
}

// Envoie un email. Ne lève jamais : retourne un résultat structuré.
export async function envoyerEmail(opts: OptionsEnvoi): Promise<ResultatEnvoi> {
  const client = obtenirClient();
  if (!client) {
    console.info("[email/log]", {
      destinataire: opts.destinataire,
      sujet: opts.sujet,
      apercu: opts.html.replace(/<[^>]+>/g, " ").slice(0, 240),
    });
    return { succes: true, modeLog: true };
  }
  try {
    const r = await client.emails.send({
      from: opts.expediteur ?? EXPEDITEUR_PAR_DEFAUT,
      to: Array.isArray(opts.destinataire) ? opts.destinataire : [opts.destinataire],
      subject: opts.sujet,
      html: opts.html,
      text: opts.texte ?? opts.html.replace(/<[^>]+>/g, " "),
    });
    if (r.error) return { succes: false, erreur: r.error.message };
    return { succes: true, id: r.data?.id };
  } catch (e) {
    return { succes: false, erreur: (e as Error).message };
  }
}

// ─────────────────────────────────────────────────────────────
// Couche de templates (HTML inline, palette de marque JUB)
// ─────────────────────────────────────────────────────────────

// Échappe toute valeur dynamique injectée dans le HTML d'un email.
export function esc(s: string | null | undefined): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const COULEUR_ORANGE = "#ffaa00";
const COULEUR_SAGE = "#5f6c57";
const COULEUR_SAGE_900 = "#1f2820";

function gabarit({
  titre, contenu, ctaLibelle, ctaHref,
}: {
  titre: string;
  contenu: string;
  ctaLibelle?: string;
  ctaHref?: string;
}): string {
  const cta = ctaLibelle && ctaHref
    ? `<a href="${ctaHref}" style="display:inline-block;background:${COULEUR_ORANGE};color:${COULEUR_SAGE_900};padding:14px 24px;border-radius:9999px;font-weight:700;text-decoration:none;font-family:Helvetica,Arial,sans-serif;">${ctaLibelle}</a>`
    : "";
  return `
<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>${titre}</title></head>
<body style="margin:0;background:#ececea;font-family:Helvetica,Arial,sans-serif;color:${COULEUR_SAGE_900};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ececea;padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="background:#f5f4f1;border-radius:16px;overflow:hidden;border:1px solid #e7e5e4;">
        <tr><td style="background:${COULEUR_SAGE};padding:18px 24px;">
          <span style="display:inline-block;width:24px;height:24px;border-radius:50%;background:${COULEUR_ORANGE};vertical-align:middle;text-align:center;line-height:24px;">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${COULEUR_SAGE};"></span>
          </span>
          <span style="display:inline-block;color:${COULEUR_ORANGE};font-weight:800;font-size:18px;margin-left:8px;vertical-align:middle;">JUB</span>
          <span style="display:inline-block;color:#ced4d2;font-weight:600;font-size:13px;margin-left:4px;vertical-align:middle;">Campus</span>
        </td></tr>
        <tr><td style="padding:32px 28px;">
          <h1 style="margin:0 0 16px;font-size:22px;color:${COULEUR_SAGE_900};">${titre}</h1>
          <div style="font-size:14px;line-height:1.6;color:#2a3328;">${contenu}</div>
          ${cta ? `<div style="margin-top:24px;">${cta}</div>` : ""}
        </td></tr>
        <tr><td style="border-top:1px solid #e7e5e4;padding:16px 24px;font-size:11px;color:#78716c;">
          JUB Campus · Saint-Louis du Sénégal<br/>
          Si tu ne veux plus recevoir ces emails, contacte-nous via la page support.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`.trim();
}

// ─────────────────────────────────────────────────────────────
// Templates métier
// ─────────────────────────────────────────────────────────────

export function emailCertificatEmis(p: {
  destinataire: string;
  prenom: string;
  projetTitre: string;
  numeroPublic: string;
  scoreFinal: number;
  urlVerification: string;
  urlPdf: string;
}): OptionsEnvoi {
  const html = gabarit({
    titre: "Ton certificat est prêt 🎓",
    contenu: `
      <p>Bonjour ${esc(p.prenom)},</p>
      <p>Bravo, ton certificat pour le projet <strong>${esc(p.projetTitre)}</strong> vient d'être émis avec un score final de
      <strong style="color:${COULEUR_ORANGE};">${p.scoreFinal.toFixed(1)}/10</strong>.</p>
      <p>Tu peux le partager publiquement, l'ajouter à ton LinkedIn, ou le télécharger en PDF avec QR code vérifiable.</p>
      <p>Numéro public : <code style="background:#ececea;padding:2px 6px;border-radius:4px;">${esc(p.numeroPublic)}</code></p>
      <p style="margin-top:18px;">Page de vérification :<br/>
        <a href="${p.urlVerification}" style="color:${COULEUR_SAGE};">${p.urlVerification}</a></p>
      <p>PDF :<br/>
        <a href="${p.urlPdf}" style="color:${COULEUR_SAGE};">${p.urlPdf}</a></p>
    `,
    ctaLibelle: "Voir mon certificat",
    ctaHref: p.urlVerification,
  });
  return {
    destinataire: p.destinataire,
    sujet: `Ton certificat JUB Campus est prêt — ${p.numeroPublic}`,
    html,
  };
}

export function emailFeedbackRecu(p: {
  destinataire: string;
  prenomDestinataire: string;
  livrableTitre: string;
  auteurNom: string;
  apercu: string;
  urlProjet: string;
}): OptionsEnvoi {
  const html = gabarit({
    titre: "Tu as reçu un feedback",
    contenu: `
      <p>Bonjour ${esc(p.prenomDestinataire)},</p>
      <p><strong>${esc(p.auteurNom)}</strong> a laissé un feedback sur ton livrable
      <strong>« ${esc(p.livrableTitre)} »</strong>.</p>
      <p style="background:#ececea;padding:12px;border-radius:8px;font-style:italic;">« ${esc(p.apercu)} »</p>
    `,
    ctaLibelle: "Voir le projet",
    ctaHref: p.urlProjet,
  });
  return {
    destinataire: p.destinataire,
    sujet: `Nouveau feedback sur ${p.livrableTitre}`,
    html,
  };
}

// Email générique adossé à une notification in-app.
export function emailNotification(p: {
  destinataire: string;
  prenom: string;
  titre: string;
  contenu: string;
  url?: string;
}): OptionsEnvoi {
  const html = gabarit({
    titre: esc(p.titre),
    contenu: `<p>Bonjour ${esc(p.prenom)},</p><p>${esc(p.contenu)}</p>`,
    ctaLibelle: p.url ? "Ouvrir JUB Campus" : undefined,
    ctaHref: p.url,
  });
  return { destinataire: p.destinataire, sujet: `JUB Campus — ${p.titre}`, html };
}

export function emailEvaluationRecue(p: {
  destinataire: string;
  prenomDestinataire: string;
  projetTitre: string;
  source: string;
  scoreGlobal: number;
  urlProjet: string;
}): OptionsEnvoi {
  const html = gabarit({
    titre: "Tu as été évalué(e)",
    contenu: `
      <p>Bonjour ${esc(p.prenomDestinataire)},</p>
      <p>Une nouvelle évaluation <strong>${esc(p.source)}</strong> a été soumise sur le projet
      <strong>${esc(p.projetTitre)}</strong>.</p>
      <p>Score global : <strong style="color:${COULEUR_ORANGE};">${p.scoreGlobal.toFixed(1)}/10</strong></p>
    `,
    ctaLibelle: "Voir le détail",
    ctaHref: p.urlProjet,
  });
  return {
    destinataire: p.destinataire,
    sujet: `Nouvelle évaluation sur ${p.projetTitre}`,
    html,
  };
}

export function emailVerification(p: {
  destinataire: string;
  prenom: string;
  url: string;
}): OptionsEnvoi {
  const html = gabarit({
    titre: "Confirme ton adresse email",
    contenu: `
      <p>Bonjour ${esc(p.prenom)},</p>
      <p>Bienvenue sur JUB Campus. Confirme ton adresse email pour activer
      pleinement ton compte.</p>
      <p>Ce lien expire dans 24&nbsp;heures.</p>
    `,
    ctaLibelle: "Confirmer mon email",
    ctaHref: p.url,
  });
  return { destinataire: p.destinataire, sujet: "Confirme ton email — JUB Campus", html };
}

export function emailReset(p: {
  destinataire: string;
  prenom: string;
  url: string;
}): OptionsEnvoi {
  const html = gabarit({
    titre: "Réinitialise ton mot de passe",
    contenu: `
      <p>Bonjour ${esc(p.prenom)},</p>
      <p>Tu as demandé à réinitialiser ton mot de passe. Clique ci-dessous —
      ce lien expire dans 1&nbsp;heure.</p>
      <p>Si tu n'es pas à l'origine de cette demande, ignore cet email.</p>
    `,
    ctaLibelle: "Choisir un nouveau mot de passe",
    ctaHref: p.url,
  });
  return { destinataire: p.destinataire, sujet: "Réinitialisation de mot de passe — JUB Campus", html };
}
