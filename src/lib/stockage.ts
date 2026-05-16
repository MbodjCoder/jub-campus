// Couche de stockage de fichiers JUB Campus.
// Implémentation : disque local (public/uploads/{dossier}/{uuid}.{ext}),
// directement accessible via URL Next /uploads/...
// La bascule vers Supabase Storage se fera quand SUPABASE_URL et
// SUPABASE_CLE_SERVICE seront configurés (à venir V1.3).

import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

export interface ResultatStockage {
  url: string;
  typeMime: string;
  tailleOctets: number;
}

const EXTENSIONS_AUTORISEES = new Set([
  "pdf", "zip", "png", "jpg", "jpeg", "webp", "gif", "svg",
  "mp4", "mov", "webm",
  "doc", "docx", "xls", "xlsx", "ppt", "pptx", "csv", "txt", "md",
]);

function extensionDe(nomFichier: string): string {
  const ext = nomFichier.split(".").pop()?.toLowerCase() ?? "bin";
  return ext.replace(/[^a-z0-9]/g, "").slice(0, 6) || "bin";
}

export async function stockerFichier(fichier: File, dossier: string = "livrables"): Promise<ResultatStockage> {
  const extension = extensionDe(fichier.name);
  if (!EXTENSIONS_AUTORISEES.has(extension)) {
    throw new Error(`Type de fichier non autorisé : .${extension}`);
  }

  const nomSur = `${randomUUID()}.${extension}`;
  const racine = join(process.cwd(), "public", "uploads", dossier);
  await mkdir(racine, { recursive: true });
  const cheminLocal = join(racine, nomSur);

  const buffer = Buffer.from(await fichier.arrayBuffer());
  await writeFile(cheminLocal, buffer);

  return {
    url: `/uploads/${dossier}/${nomSur}`,
    typeMime: fichier.type || "application/octet-stream",
    tailleOctets: fichier.size,
  };
}
