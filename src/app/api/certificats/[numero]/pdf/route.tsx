// Route handler de génération PDF du certificat.
// Runtime Node obligatoire pour @react-pdf/renderer + qrcode.

import { renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { DocumentCertificat } from "@/composants/certificat/document-pdf";
import { urlVerification } from "@/domaine/certificats";
import { LIBELLES_NIVEAU_ETUDE } from "@/lib/constantes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ numero: string }> },
) {
  const { numero } = await params;

  const cert = await prisma.certificat.findUnique({
    where: { numeroPublic: numero },
    include: {
      etudiant: { include: { universite: true } },
      projet: { include: { entreprise: true } },
    },
  });

  if (!cert) {
    return new Response("Certificat introuvable", { status: 404 });
  }
  if (cert.statut !== "VALIDE") {
    return new Response(`Certificat ${cert.statut.toLowerCase()}`, { status: 410 });
  }

  const lien = urlVerification(cert.numeroPublic);
  // QR avec niveau de correction H pour résister à de légères salissures / impressions.
  const qrDataUrl = await QRCode.toDataURL(lien, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 320,
    color: { dark: "#1f2820", light: "#f5f4f1" },
  });

  const buffer = await renderToBuffer(
    <DocumentCertificat
      numeroPublic={cert.numeroPublic}
      hashIntegrite={cert.hashIntegrite}
      etudiantPrenom={cert.etudiant.prenom}
      etudiantNom={cert.etudiant.nom}
      universiteNom={cert.etudiant.universite.nom}
      niveau={LIBELLES_NIVEAU_ETUDE[cert.etudiant.niveau]}
      projetTitre={cert.projet.titre}
      organisationNom={cert.organisationNom ?? cert.projet.entreprise?.raisonSociale ?? null}
      roleJoue={cert.roleJoue}
      periodeDebut={cert.periodeDebut}
      periodeFin={cert.periodeFin}
      dureeJours={cert.dureeJours}
      scoreFinal={cert.scoreFinal}
      competencesValidees={cert.competencesValidees}
      appreciation={cert.appreciation}
      mentorNom={cert.mentorNom}
      emisLe={cert.emisLe}
      qrDataUrl={qrDataUrl}
      urlVerification={lien}
    />,
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename="${cert.numeroPublic}.pdf"`,
      "cache-control": "private, no-store",
    },
  });
}
