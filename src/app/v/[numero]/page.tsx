import Link from "next/link";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { formaterDate, formaterDureeJours } from "@/lib/utils";

export const metadata = {
  title: "Vérifier un certificat",
  description: "Vérification publique des certificats JUB Campus.",
};

// Démonstration : remplacer par requête Prisma quand DB connectée.
const certificatsDemo = {
  "JUB-2026-UGB-7K4M9P": {
    etudiantNom: "Aïssatou Diop",
    etudiantSlug: "aissatou-diop",
    universite: "UGB Saint-Louis",
    niveau: "M1 Informatique",
    projetTitre: "Refonte de la billetterie en ligne",
    organisation: "Sonatel",
    mentor: "Pr. Mamadou Niang",
    roleJoue: "Développeuse front-end",
    periodeDebut: new Date("2026-03-02"),
    periodeFin: new Date("2026-04-13"),
    dureeJours: 42,
    scoreFinal: 8.7,
    competencesValidees: ["Next.js", "TypeScript", "UX recherche", "Travail en équipe"],
    appreciation: "Travail rigoureux, livrables au-delà des attentes, communication exemplaire avec l'équipe Sonatel.",
    statut: "VALIDE" as const,
  },
} as const;

type ParametresPage = { params: Promise<{ numero: string }> };

export default async function PageVerificationCertificat({ params }: ParametresPage) {
  const { numero } = await params;
  const cert = certificatsDemo[numero as keyof typeof certificatsDemo];

  return (
    <div className="flex min-h-screen flex-col bg-jub-pierre-100">
      <header className="border-b border-bordure bg-fond-eleve">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-jub-vert-900 text-white text-sm font-bold">J</span>
            <span className="text-sm font-semibold">JUB Campus · Vérification publique</span>
          </Link>
          <Link href="/" className="text-xs text-jub-vert-700 hover:underline">jubcampus.sn</Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <div className="mb-6 text-center">
          <p className="text-xs uppercase tracking-widest text-texte-discret">Certificat</p>
          <p className="font-mono text-2xl font-semibold tracking-tight">{numero}</p>
        </div>

        {cert ? <BlocCertificatValide cert={cert} /> : <BlocCertificatInconnu numero={numero} />}

        <Carte className="mt-6">
          <CorpsCarte className="text-sm text-texte-discret">
            <p className="font-medium text-texte mb-1">Comment vérifier ?</p>
            Chaque certificat JUB Campus est signé par un hash d&apos;intégrité SHA-256
            et possède une page publique unique. Si le statut affiché est{" "}
            <strong className="text-jub-vert-700">VALIDE</strong>, le certificat est
            authentique et émis par JUB Campus. Toute vérification est journalisée
            (date, IP anonymisée) pour des raisons de traçabilité.
          </CorpsCarte>
        </Carte>
      </main>
    </div>
  );
}

function BlocCertificatValide({ cert }: { cert: typeof certificatsDemo[keyof typeof certificatsDemo] }) {
  return (
    <Carte className="overflow-hidden shadow-lg">
      <EnteteCarte className="bg-jub-vert-950 text-white border-b-0">
        <div className="flex items-center justify-between">
          <span className="font-semibold tracking-wide">Statut</span>
          <Insigne ton="jaune">{cert.statut}</Insigne>
        </div>
      </EnteteCarte>
      <CorpsCarte className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-wider text-texte-discret">Décerné à</p>
          <Link href={`/u/${cert.etudiantSlug}`} className="text-2xl font-semibold hover:text-jub-vert-700 hover:underline">
            {cert.etudiantNom}
          </Link>
          <p className="text-sm text-texte-discret">{cert.niveau} · {cert.universite}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Bloc libelle="Projet" valeur={cert.projetTitre} />
          <Bloc libelle="Organisation" valeur={cert.organisation} />
          <Bloc libelle="Rôle joué" valeur={cert.roleJoue} />
          <Bloc libelle="Mentor" valeur={cert.mentor} />
          <Bloc libelle="Période" valeur={`${formaterDate(cert.periodeDebut)} → ${formaterDate(cert.periodeFin)}`} />
          <Bloc libelle="Durée" valeur={formaterDureeJours(cert.dureeJours)} />
          <Bloc libelle="Score final" valeur={`${cert.scoreFinal.toFixed(1)} / 10`} />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-texte-discret mb-2">Compétences validées</p>
          <div className="flex flex-wrap gap-1.5">
            {cert.competencesValidees.map((c) => <Insigne key={c} ton="vert">{c}</Insigne>)}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-texte-discret mb-1">Appréciation du mentor</p>
          <p className="text-sm leading-relaxed italic text-texte">« {cert.appreciation} »</p>
        </div>
      </CorpsCarte>
    </Carte>
  );
}

function BlocCertificatInconnu({ numero }: { numero: string }) {
  return (
    <Carte>
      <EnteteCarte className="bg-red-50 border-red-200">
        <div className="flex items-center justify-between">
          <TitreCarte className="text-red-900">Certificat introuvable</TitreCarte>
          <Insigne ton="rouge">INVALIDE</Insigne>
        </div>
      </EnteteCarte>
      <CorpsCarte className="space-y-3 text-sm text-texte-discret">
        <p>
          Aucun certificat JUB Campus ne correspond au numéro{" "}
          <code className="font-mono bg-jub-pierre-100 px-1.5 py-0.5 rounded">{numero}</code>.
        </p>
        <p>
          Vérifie l&apos;orthographe (les caractères 0, O, 1, I et L ne sont jamais utilisés).
          Si tu vois ce message en scannant un QR code, le certificat est probablement
          falsifié — n&apos;hésite pas à nous le signaler via la page contact.
        </p>
      </CorpsCarte>
    </Carte>
  );
}

function Bloc({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-texte-discret">{libelle}</p>
      <p className="text-sm font-medium">{valeur}</p>
    </div>
  );
}
