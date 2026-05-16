"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Award, Download, ExternalLink } from "lucide-react";
import { Bouton } from "@/composants/ui/bouton";
import { Carte, CorpsCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { emettreCertificatDemo } from "@/app/app/projet/[id]/actions";

interface Proprietes {
  projetId: string;
  certificatExistantNumero?: string | null;
}

// Bouton d'émission de certificat de démonstration (projets internes JUB).
// Si un certificat existe déjà, affiche directement les liens vers la
// page de vérification et le PDF.
export function BoutonEmettreCertificat({ projetId, certificatExistantNumero }: Proprietes) {
  const [enCours, demarrer] = useTransition();
  const [numero, setNumero] = useState<string | null>(certificatExistantNumero ?? null);
  const [erreur, setErreur] = useState<string | null>(null);

  function emettre() {
    setErreur(null);
    demarrer(async () => {
      const r = await emettreCertificatDemo(projetId);
      if (!r.succes) {
        setErreur(r.message ?? "Erreur inconnue.");
      } else if (r.numeroPublic) {
        setNumero(r.numeroPublic);
      }
    });
  }

  if (numero) {
    return (
      <Carte className="border-jub-sage-300 bg-jub-sage-50">
        <CorpsCarte className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-jub-orange-500" />
              <span className="font-semibold">Certificat émis</span>
            </div>
            <Insigne ton="sombre">{numero}</Insigne>
          </div>
          <p className="text-sm text-texte-discret">
            Ton certificat vérifiable est prêt. Partage-le ou télécharge-le.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href={`/v/${numero}`} target="_blank">
              <Bouton apparence="primaire" taille="sm">
                <ExternalLink className="h-4 w-4" /> Page de vérification
              </Bouton>
            </Link>
            <a href={`/api/certificats/${numero}/pdf`} target="_blank" rel="noopener noreferrer">
              <Bouton apparence="accent" taille="sm">
                <Download className="h-4 w-4" /> Télécharger le PDF
              </Bouton>
            </a>
          </div>
        </CorpsCarte>
      </Carte>
    );
  }

  return (
    <Carte className="border-jub-orange-200 bg-jub-orange-50/40">
      <CorpsCarte className="space-y-3">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-jub-orange-500" />
          <span className="font-semibold">Émettre un certificat</span>
        </div>
        <p className="text-sm text-texte-discret">
          Sur les projets internes JUB Campus, tu peux émettre un certificat
          de démonstration immédiatement. Sur les projets entreprises, c&apos;est
          le mentor qui valide.
        </p>
        {erreur ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
            {erreur}
          </p>
        ) : null}
        <Bouton apparence="accent" onClick={emettre} chargement={enCours}>
          <Award className="h-4 w-4" /> Émettre mon certificat
        </Bouton>
      </CorpsCarte>
    </Carte>
  );
}
