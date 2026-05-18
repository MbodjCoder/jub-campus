// Couche de stockage de fichiers JUB Campus.
// Implémentation : Supabase Storage si configuré, sinon disque local
// (public/uploads/{dossier}/{uuid}.{ext}) — dégradation gracieuse.
//
// Sécurité : liste blanche d'extensions (SVG exclu — vecteur XSS),
// limite de taille, et vérification des octets-magiques pour empêcher
// un fichier déguisé (ex. script renommé en .png).

import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { SUPABASE_ACTIF, BUCKET_MEDIAS, supabase } from "./supabase";

export interface ResultatStockage {
  url: string;
  typeMime: string;
  tailleOctets: number;
}

// Taille maximale : 25 Mo.
const TAILLE_MAX = 25 * 1024 * 1024;

// SVG volontairement absent : un SVG peut embarquer du JavaScript.
const EXTENSIONS_AUTORISEES = new Set([
  "pdf", "zip", "png", "jpg", "jpeg", "webp", "gif",
  "mp4", "mov", "webm",
  "doc", "docx", "xls", "xlsx", "ppt", "pptx", "csv", "txt", "md",
]);

// Familles d'extensions sans signature binaire fiable (texte).
const EXT_TEXTE = new Set(["csv", "txt", "md"]);

function extensionDe(nomFichier: string): string {
  const ext = nomFichier.split(".").pop()?.toLowerCase() ?? "bin";
  return ext.replace(/[^a-z0-9]/g, "").slice(0, 6) || "bin";
}

// Vérifie les octets-magiques. Retourne false si le contenu ne correspond
// manifestement pas à l'extension annoncée.
function signatureValide(ext: string, buf: Buffer): boolean {
  if (EXT_TEXTE.has(ext)) return true;
  const b = buf;
  const debut = (sig: number[]) => sig.every((o, i) => b[i] === o);

  switch (ext) {
    case "pdf":
      return debut([0x25, 0x50, 0x44, 0x46]); // %PDF
    case "png":
      return debut([0x89, 0x50, 0x4e, 0x47]);
    case "jpg":
    case "jpeg":
      return debut([0xff, 0xd8, 0xff]);
    case "gif":
      return debut([0x47, 0x49, 0x46, 0x38]);
    case "webp":
      return debut([0x52, 0x49, 0x46, 0x46]) && b[8] === 0x57 && b[9] === 0x45; // RIFF…WE
    case "zip":
    case "docx":
    case "xlsx":
    case "pptx":
      return debut([0x50, 0x4b, 0x03, 0x04]); // PK..
    case "doc":
    case "xls":
    case "ppt":
      return debut([0xd0, 0xcf, 0x11, 0xe0]); // OLE
    case "mp4":
    case "mov":
      return b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70; // ftyp
    case "webm":
      return debut([0x1a, 0x45, 0xdf, 0xa3]); // EBML
    default:
      return false;
  }
}

const MIME_PAR_EXT: Record<string, string> = {
  pdf: "application/pdf",
  zip: "application/zip",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  mp4: "video/mp4",
  mov: "video/quicktime",
  webm: "video/webm",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  csv: "text/csv",
  txt: "text/plain",
  md: "text/markdown",
};

export async function stockerFichier(fichier: File, dossier = "livrables"): Promise<ResultatStockage> {
  const extension = extensionDe(fichier.name);
  if (!EXTENSIONS_AUTORISEES.has(extension)) {
    throw new Error(`Type de fichier non autorisé : .${extension}`);
  }
  if (fichier.size <= 0 || fichier.size > TAILLE_MAX) {
    throw new Error("Fichier vide ou trop volumineux (max 25 Mo).");
  }

  const buffer = Buffer.from(await fichier.arrayBuffer());
  if (!signatureValide(extension, buffer)) {
    throw new Error("Le contenu du fichier ne correspond pas à son extension.");
  }

  const nomSur = `${randomUUID()}.${extension}`;
  // Type MIME fiable, dérivé de l'extension validée (jamais du client).
  const typeMime = MIME_PAR_EXT[extension] ?? "application/octet-stream";

  // Supabase Storage — persistant, recommandé en production.
  if (SUPABASE_ACTIF) {
    const chemin = `${dossier}/${nomSur}`;
    const { error } = await supabase()
      .storage.from(BUCKET_MEDIAS)
      .upload(chemin, buffer, { contentType: typeMime, upsert: false });
    if (error) {
      throw new Error(`Échec du stockage Supabase : ${error.message}`);
    }
    const { data } = supabase().storage.from(BUCKET_MEDIAS).getPublicUrl(chemin);
    return { url: data.publicUrl, typeMime, tailleOctets: fichier.size };
  }

  // Repli — disque local (dev ou Supabase non configuré).
  const racine = join(process.cwd(), "public", "uploads", dossier);
  await mkdir(racine, { recursive: true });
  await writeFile(join(racine, nomSur), buffer);

  return {
    url: `/uploads/${dossier}/${nomSur}`,
    typeMime,
    tailleOctets: fichier.size,
  };
}
