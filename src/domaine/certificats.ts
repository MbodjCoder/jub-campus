// Domaine métier des certificats : hash d'intégrité, numéro public, vérification.

import { createHash } from "node:crypto";
import { customAlphabet } from "nanoid";

const ALPHABET_CERTIFICAT = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // sans 0/O/1/I/L pour lisibilité
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
