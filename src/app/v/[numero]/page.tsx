import Link from "next/link";
import { headers } from "next/headers";
import { createHash } from "node:crypto";
import { Download, ShieldCheck, ShieldAlert } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import type { Prisma } from "@/generated/prisma/client";
import { Bouton } from "@/composants/ui/bouton";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { LIBELLES_NIVEAU_ETUDE } from "@/lib/constantes";
import { formaterDate, formaterDureeJours } from "@/lib/utils";
import { calculerHashIntegrite, urlPdfCertificat } from "@/domaine/certificats";

export const dynamic = "force-dynamic";

type CertificatAvecRelations = Prisma.CertificatGetPayload<{
  include: {
    etudiant: { include: { universite: true } };
    projet: { include: { entreprise: true } };
  };
}>;

export async function generateMetadata({ params }: { params: Promise<{ numero: string }> }) {
  const { numero } = await params;
  return {
    title: `Vérifier le certificat ${numero}`,
    description: "Vérification publique d'authenticité du certificat JUB Campus.",
    robots: { index: false },
  };
}

type ParametresPage = { params: Promise<{ numero: string }> };

export default async function PageVerificationCertificat({ params }: ParametresPage) {
  const { numero } = await params;

  const cert = await prisma.certificat.findUnique({
    where: { numeroPublic: numero },
    include: {
      etudiant: { include: { universite: true } },
      projet: { include: { entreprise: true } },
    },
  });

  // Journalisation de toute consultation (succès ou échec).
  if (cert) {
    const entetes = await headers();
    const ip = entetes.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonyme";
  const ipHash = createHash("sha256").update(ip + env.AUTH_SECRET).digest("hex");
    await prisma.verificationCertificat.create({
      data: {
        certificatId: cert.id,
        ipHash,
        userAgent: entetes.get("user-agent") ?? null,
        origine: entetes.get("referer") ?? null,
      },
    }).catch(() => { /* journalisation best-effort */ });
  }

  return (
    <div className="flex min-h-screen flex-col bg-jub-pierre-100">
      <header className="border-b border-bordure bg-fond-eleve">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-jub-orange-500 shadow-sm">
              <span className="block h-2.5 w-2.5 rounded-full bg-jub-sage-500" />
            </span>
            <span className="text-sm font-extrabold text-jub-orange-500">JUB</span>
            <span className="text-xs font-semibold text-jub-sage-700">Campus · Vérification publique</span>
          </Link>
          <Link href="/" className="text-xs text-jub-sage-700 hover:text-jub-orange-600 hover:underline">
            jubcampus.sn
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <div className="mb-6 text-center">
          <p className="text-xs uppercase tracking-widest text-texte-discret">Certificat</p>
          <p className="font-mono text-2xl font-semibold tracking-tight">{numero}</p>
        </div>

        {cert ? <BlocCertificatExistant cert={cert} /> : <BlocCertificatInconnu numero={numero} />}

        <Carte className="mt-6">
          <CorpsCarte className="text-sm text-texte-discret">
            <p className="mb-1 font-medium text-texte">Comment vérifier ?</p>
            Chaque certificat JUB Campus est signé par un hash d&apos;intégrité SHA-256
            et possède une page publique unique. Si le statut affiché est{" "}
            <strong className="text-jub-sage-700">VALIDE</strong>, le certificat est
            authentique et émis par JUB Campus. Toute consultation est journalisée
            (date, IP anonymisée par SHA-256, user-agent) pour la traçabilité.
          </CorpsCarte>
        </Carte>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bloc certificat trouvé en base
// ─────────────────────────────────────────────────────────────

function BlocCertificatExistant({
  cert,
}: {
  cert: CertificatAvecRelations;
}) {
  // Vérification croisée : on recalcule le hash à partir des champs persistés.
  const hashRecalcule = calculerHashIntegrite({
    numeroPublic: cert.numeroPublic,
    etudiantId: cert.etudiantId,
    projetId: cert.projetId,
    scoreFinal: cert.scoreFinal,
    competencesValidees: cert.competencesValidees,
    periodeDebut: cert.periodeDebut,
    periodeFin: cert.periodeFin,
  });
  const integriteOk = hashRecalcule === cert.hashIntegrite;
  const valide = cert.statut === "VALIDE" && integriteOk;

  const meta = valide
    ? { ton: "vert" as const, libelle: "VALIDE", icone: ShieldCheck, couleur: "text-jub-sage-700" }
    : cert.statut === "REVOQUE"
      ? { ton: "rouge" as const, libelle: "RÉVOQUÉ", icone: ShieldAlert, couleur: "text-red-700" }
      : !integriteOk
        ? { ton: "rouge" as const, libelle: "INTÉGRITÉ COMPROMISE", icone: ShieldAlert, couleur: "text-red-700" }
        : { ton: "neutre" as const, libelle: cert.statut, icone: ShieldAlert, couleur: "text-texte-discret" };

  return (
    <Carte className="overflow-hidden shadow-lg">
      <EnteteCarte className="bg-jub-sage-900 text-white">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <meta.icone className="h-5 w-5" />
            <span className="font-semibold tracking-wide">Statut</span>
          </div>
          <Insigne ton={meta.ton}>{meta.libelle}</Insigne>
        </div>
      </EnteteCarte>
      <CorpsCarte className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-wider text-texte-discret">Décerné à</p>
          <Link
            href={`/u/${cert.etudiant.slug}`}
            className="text-2xl font-bold hover:text-jub-orange-600 hover:underline"
          >
            {cert.etudiant.prenom} {cert.etudiant.nom}
          </Link>
          <p className="text-sm text-texte-discret">
            {LIBELLES_NIVEAU_ETUDE[cert.etudiant.niveau]} · {cert.etudiant.universite.nom}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Champ libelle="Projet" valeur={cert.projet.titre} />
          <Champ libelle="Organisation" valeur={cert.organisationNom ?? cert.projet.entreprise?.raisonSociale ?? "JUB Campus"} />
          <Champ libelle="Rôle joué" valeur={cert.roleJoue} />
          <Champ libelle="Mentor" valeur={cert.mentorNom} />
          <Champ libelle="Période" valeur={`${formaterDate(cert.periodeDebut)} → ${formaterDate(cert.periodeFin)}`} />
          <Champ libelle="Durée" valeur={formaterDureeJours(cert.dureeJours)} />
          <Champ libelle="Score final" valeur={`${cert.scoreFinal.toFixed(1)} / 10`} mettreEnAvant />
          <Champ libelle="Émis le" valeur={formaterDate(cert.emisLe)} />
        </div>

        {cert.competencesValidees.length > 0 ? (
          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-texte-discret">Compétences validées</p>
            <div className="flex flex-wrap gap-1.5">
              {cert.competencesValidees.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center rounded-full bg-jub-sage-500 px-2.5 py-0.5 text-xs font-bold text-jub-orange-500"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {cert.appreciation ? (
          <div>
            <p className="mb-1 text-xs uppercase tracking-wider text-texte-discret">Appréciation du mentor</p>
            <p className="text-sm italic leading-relaxed text-texte">« {cert.appreciation} »</p>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-bordure pt-4">
          <p className="font-mono text-[10px] text-texte-discret">
            SHA-256 : {cert.hashIntegrite.slice(0, 16)}…{cert.hashIntegrite.slice(-16)}
          </p>
          <a href={urlPdfCertificat(cert.numeroPublic)} target="_blank" rel="noopener noreferrer">
            <Bouton apparence="accent" taille="sm">
              <Download className="h-4 w-4" /> Télécharger le PDF
            </Bouton>
          </a>
        </div>
      </CorpsCarte>
    </Carte>
  );
}

function BlocCertificatInconnu({ numero }: { numero: string }) {
  return (
    <Carte>
      <EnteteCarte className="border-red-200 bg-red-50">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-700" />
            <TitreCarte className="text-red-900">Certificat introuvable</TitreCarte>
          </div>
          <Insigne ton="rouge">INVALIDE</Insigne>
        </div>
      </EnteteCarte>
      <CorpsCarte className="space-y-3 text-sm text-texte-discret">
        <p>
          Aucun certificat JUB Campus ne correspond au numéro{" "}
          <code className="rounded bg-jub-pierre-100 px-1.5 py-0.5 font-mono">{numero}</code>.
        </p>
        <p>
          Vérifie l&apos;orthographe (les caractères 0, O, 1, I et L ne sont jamais utilisés).
          Si tu vois ce message en scannant un QR code, le certificat est probablement
          falsifié — signale-le via la page <Link href="/contact" className="text-jub-orange-600 underline">contact</Link>.
        </p>
      </CorpsCarte>
    </Carte>
  );
}

function Champ({ libelle, valeur, mettreEnAvant }: { libelle: string; valeur: string; mettreEnAvant?: boolean }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-texte-discret">{libelle}</p>
      <p className={mettreEnAvant ? "text-base font-bold text-jub-orange-600" : "text-sm font-medium"}>
        {valeur}
      </p>
    </div>
  );
}

