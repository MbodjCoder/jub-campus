// Domaine métier des certificats : hash d'intégrité, numéro public,
// URL de vérification, et émission persistée en base.

import "server-only";
import { createHash } from "node:crypto";
import { customAlphabet } from "nanoid";
import { prisma } from "@/lib/prisma";
import { recalculerScoreJub, validerCompetences } from "@/domaine/score";

// Alphabet sans 0/O/1/I/L pour éviter toute confusion à la lecture humaine.
const ALPHABET_CERTIFICAT = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const genererJeton = customAlphabet(ALPHABET_CERTIFICAT, 8);

interface DonneesCertificat {
  etudiantId: string;
  projetId: string;
  scoreFinal: number;
  competencesValidees: string[];
  periodeDebut: Date;
  periodeFin: Date;
}

// Génère un numéro public lisible. Format : JUB-{annee}-{acronymeUniv}-{nanoid8}
export function genererNumeroPublic(opts: {
  annee?: number;
  acronymeUniversite: string;
}): string {
  const annee = opts.annee ?? new Date().getFullYear();
  const acronyme = opts.acronymeUniversite.toUpperCase().replace(/[^A-Z]/g, "");
  return `JUB-${annee}-${acronyme}-${genererJeton()}`;
}

// Calcule un hash SHA256 stable des données critiques du certificat,
// permettant de détecter une falsification ultérieure du contenu.
export function calculerHashIntegrite(donnees: DonneesCertificat & { numeroPublic: string }): string {
  const charge = [
    donnees.numeroPublic,
    donnees.etudiantId,
    donnees.projetId,
    donnees.scoreFinal.toFixed(2),
    [...donnees.competencesValidees].sort().join("|"),
    donnees.periodeDebut.toISOString(),
    donnees.periodeFin.toISOString(),
  ].join("::");
  return createHash("sha256").update(charge).digest("hex");
}

// Construit l'URL publique de vérification.
export function urlVerification(numeroPublic: string, base?: string): string {
  const racine = base ?? process.env.URL_PUBLIQUE ?? "http://localhost:3000";
  return `${racine.replace(/\/$/, "")}/v/${numeroPublic}`;
}

// URL de téléchargement / aperçu du PDF.
export function urlPdfCertificat(numeroPublic: string, base?: string): string {
  const racine = base ?? process.env.URL_PUBLIQUE ?? "http://localhost:3000";
  return `${racine.replace(/\/$/, "")}/api/certificats/${numeroPublic}/pdf`;
}

// ─────────────────────────────────────────────────────────────
// Émission persistée
// ─────────────────────────────────────────────────────────────

export interface ParametresEmission {
  etudiantId: string;
  projetId: string;
  roleJoue: string;
  periodeDebut: Date;
  periodeFin: Date;
  scoreFinal: number;
  competencesValidees: string[];
  livrablesIds?: string[];
  appreciation: string;
  mentorNom: string;
  organisationNom?: string | null;
}

// Crée un certificat en base avec numéro public + hash d'intégrité.
// Renvoie le certificat persisté.
export async function emettreCertificat(params: ParametresEmission) {
  const etudiant = await prisma.etudiant.findUnique({
    where: { id: params.etudiantId },
    include: { universite: true },
  });
  if (!etudiant) throw new Error("Étudiant introuvable");

  const numeroPublic = genererNumeroPublic({
    acronymeUniversite: etudiant.universite.acronyme,
  });

  const dureeJours = Math.max(
    1,
    Math.round((params.periodeFin.getTime() - params.periodeDebut.getTime()) / 86_400_000),
  );

  const hashIntegrite = calculerHashIntegrite({
    numeroPublic,
    etudiantId: params.etudiantId,
    projetId: params.projetId,
    scoreFinal: params.scoreFinal,
    competencesValidees: params.competencesValidees,
    periodeDebut: params.periodeDebut,
    periodeFin: params.periodeFin,
  });

  const certificat = await prisma.certificat.create({
    data: {
      numeroPublic,
      etudiantId: params.etudiantId,
      projetId: params.projetId,
      roleJoue: params.roleJoue,
      periodeDebut: params.periodeDebut,
      periodeFin: params.periodeFin,
      dureeJours,
      competencesValidees: params.competencesValidees,
      livrablesIds: params.livrablesIds ?? [],
      scoreFinal: params.scoreFinal,
      appreciation: params.appreciation,
      mentorNom: params.mentorNom,
      organisationNom: params.organisationNom ?? null,
      hashIntegrite,
      statut: "VALIDE",
    },
  });

  await prisma.journalAudit.create({
    data: {
      action: "CERTIFICAT.EMIS",
      ressourceType: "Certificat",
      ressourceId: certificat.id,
      metadonnees: {
        numeroPublic: certificat.numeroPublic,
        etudiantId: params.etudiantId,
        projetId: params.projetId,
        scoreFinal: params.scoreFinal,
      },
    },
  });

  // Le certificat est une preuve : il valide les compétences attestées
  // et fait évoluer le Score JUB. Best-effort — n'annule pas l'émission.
  try {
    await validerCompetences(params.etudiantId, params.competencesValidees);
    await recalculerScoreJub(params.etudiantId);
  } catch {
    // recalcul différable, ne bloque pas la délivrance du certificat
  }

  return certificat;
}
