"use client";

// Détail d'un job — candidature et partenariat câblés sur les server actions.
// Migré maquette → classes ; modales via FeuilleModale ; primitives ui/.

import { useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Insigne } from "@/composants/ui/insigne";
import { Bouton } from "@/composants/ui/bouton";
import { LienBouton } from "@/composants/ui/lien-bouton";
import { Avatar } from "@/composants/ui/avatar";
import { FeuilleModale } from "@/composants/ui/feuille-modale";
import { LIBELLES_MODE_REMUNERATION } from "@/lib/constantes";
import { Icon } from "./icones";
import { fmt } from "./format";
import {
  soumettreCandidature,
  soumettreDemandePartenariat,
} from "@/app/(public)/projets/[slug]/actions";
import type { Role, TypePartenariat } from "@/generated/prisma/client";

export interface DetailJobData {
  id: string;
  slug: string;
  titre: string;
  resume: string;
  description: string;
  image: string;
  organisation: string;
  modeRemuneration: string;
  montant: number | null;
  duree: number;
  placesPrises: number;
  placesMax: number;
  matchScore: number | null;
  competences: string[];
  mentor: { nom: string; titre: string | null; verifie: boolean } | null;
  partenaires: { entreprise: string; typeContribution: TypePartenariat }[];
}

const ICONE_MODE: Record<string, ReactNode> = {
  APPRENTISSAGE: <Icon.GraduationCap size={12} />,
  PRIME: <Icon.Award size={12} />,
  REMUNERE: <Icon.Wallet size={12} />,
  SPONSORISE: <Icon.Sparkles size={12} />,
};

export function DetailJob({
  projet: p,
  candidatureStatut,
  estEtudiant,
  estConnecte,
  role,
  estEntrepriseProprietaire,
}: {
  projet: DetailJobData;
  candidatureStatut: string | null;
  estEtudiant: boolean;
  estConnecte: boolean;
  role: Role | null;
  estEntrepriseProprietaire: boolean;
}) {
  const router = useRouter();
  const [postule, setPostule] = useState(candidatureStatut != null);
  const [showLetter, setShowLetter] = useState(false);
  const [showPartenariat, setShowPartenariat] = useState(false);
  const placesRestantes = Math.max(0, p.placesMax - p.placesPrises);

  const ouvrirCandidature = () => {
    if (!estConnecte) {
      router.push(`/connexion?suivant=/projets/${p.slug}`);
      return;
    }
    if (!estEtudiant) return;
    setShowLetter(true);
  };

  const actionPrincipale = (() => {
    if (!estConnecte) {
      return {
        libelle: "Se connecter",
        onClick: ouvrirCandidature,
        apparence: "accent" as const,
      };
    }
    if (role === "ENTREPRISE") {
      if (estEntrepriseProprietaire) {
        return {
          libelle: "Gérer ce projet",
          href: "/entreprise/projets",
          apparence: "primaire" as const,
        };
      }
      return {
        libelle: "Proposer un partenariat",
        onClick: () => setShowPartenariat(true),
        apparence: "accent" as const,
      };
    }
    if (role === "MENTOR") {
      return {
        libelle: "Voir comme mentor",
        href: "/mentor/projets",
        apparence: "primaire" as const,
      };
    }
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      return {
        libelle: "Voir en admin",
        href: "/admin/projets",
        apparence: "primaire" as const,
      };
    }
    return null;
  })();

  return (
    <main className="fadein pb-[100px]">
      <div className="mx-auto max-w-[800px] px-5 pt-5">
        <Link
          href="/projets"
          className="t-small inline-flex items-center gap-1 font-medium text-sage-600 no-underline"
        >
          <Icon.ArrowLeft size={14} /> Jobs
        </Link>
      </div>

      <section className="mx-auto max-w-[800px] px-5 pt-4">
        <div
          className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-cover bg-center"
          // eslint-disable-next-line react/forbid-dom-props -- URL d'image dynamique
          style={{ backgroundImage: `url(${p.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-sage-950/15 to-sage-950/75" />
          <div className="absolute inset-0 flex flex-col justify-between p-[18px]">
            <div className="flex flex-wrap justify-between gap-2">
              <Insigne ton="neutre">{p.organisation}</Insigne>
              {p.matchScore != null && p.matchScore >= 80 ? (
                <Insigne ton="orange">
                  <Icon.Sparkles size={11} /> {p.matchScore}%
                </Insigne>
              ) : null}
            </div>
            <Insigne ton="neutre" className="self-start">
              {ICONE_MODE[p.modeRemuneration]}
              {LIBELLES_MODE_REMUNERATION[p.modeRemuneration as keyof typeof LIBELLES_MODE_REMUNERATION] ?? p.modeRemuneration}
            </Insigne>
          </div>
        </div>

        <h1 className="mt-6 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.025em]">
          {p.titre}
        </h1>

        <div className="liste-bordee mt-6 grid-cols-3 rounded-xl">
          <RecapCase
            libelle="Récompense"
            valeur={p.montant != null ? (fmt.fcfa(p.montant) ?? "") : "Apprentissage"}
            icon={<Icon.Wallet size={14} />}
            accent={p.montant != null}
          />
          <RecapCase libelle="Durée" valeur={fmt.duree(p.duree) ?? ""} icon={<Icon.Clock size={14} />} />
          <RecapCase libelle="Équipe" valeur={`${p.placesPrises}/${p.placesMax}`} icon={<Icon.Users size={14} />} />
        </div>

        <div className="mt-9">
          <SectionTitre icon={<Icon.FileText size={13} />}>Le job</SectionTitre>
          <p className="mt-2 text-[15px] leading-[1.6] text-texte">{p.resume}</p>
          <p className="mt-3 whitespace-pre-wrap text-[15px] leading-[1.6] text-texte">{p.description}</p>
        </div>

        {p.competences.length > 0 ? (
          <div className="mt-7">
            <SectionTitre icon={<Icon.Sparkles size={13} />}>Compétences</SectionTitre>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {p.competences.map((c) => (
                <Insigne key={c} ton="neutre">
                  {c}
                </Insigne>
              ))}
            </div>
          </div>
        ) : null}

        {p.mentor ? (
          <div className="mt-7">
            <SectionTitre icon={<Icon.ShieldCheck size={13} />}>Mentor</SectionTitre>
            <div className="mt-2.5 flex items-center gap-3">
              <Avatar nom={p.mentor.nom} taille={40} />
              <div>
                <div className="flex items-center gap-[5px] text-sm font-semibold">
                  {p.mentor.nom}
                  {p.mentor.verifie ? <Icon.ShieldCheck size={13} className="text-orange-500" /> : null}
                </div>
                {p.mentor.titre ? <div className="t-xs t-discret">{p.mentor.titre}</div> : null}
              </div>
            </div>
          </div>
        ) : null}

        {p.partenaires.length > 0 ? (
          <div className="mt-7">
            <SectionTitre icon={<Icon.Users size={13} />}>Partenaires</SectionTitre>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {p.partenaires.map((partenaire) => (
                <Insigne key={`${partenaire.entreprise}-${partenaire.typeContribution}`} ton="neutre">
                  {partenaire.entreprise}
                </Insigne>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <div className="fixed inset-x-0 bottom-0 z-50 bg-gradient-to-b from-transparent from-0% via-fond/95 via-40% to-fond p-4">
        <div className="mx-auto flex max-w-[760px] items-center gap-3 rounded-[14px] border border-bordure bg-white py-2.5 pl-[18px] pr-3 shadow-md">
          <div className="min-w-0 flex-1">
            <div className="t-xs t-discret">Récompense</div>
            <div className="truncate text-sm font-bold">
              {p.montant != null ? fmt.fcfa(p.montant) : "Apprentissage certifiant"}
            </div>
          </div>
          {estEtudiant && postule ? (
            <Bouton apparence="contour">
              <Icon.Check size={14} /> Postulé
            </Bouton>
          ) : estEtudiant && placesRestantes <= 0 ? (
            <Bouton apparence="contour" disabled>
              Complet
            </Bouton>
          ) : estEtudiant ? (
            <Bouton apparence="accent" onClick={ouvrirCandidature}>
              Postuler <Icon.Arrow size={14} />
            </Bouton>
          ) : actionPrincipale?.href ? (
            <LienBouton
              href={actionPrincipale.href}
              apparence={actionPrincipale.apparence}
              iconeDroite={<Icon.Arrow size={14} />}
            >
              {actionPrincipale.libelle}
            </LienBouton>
          ) : actionPrincipale ? (
            <Bouton apparence={actionPrincipale.apparence} onClick={actionPrincipale.onClick}>
              {actionPrincipale.libelle} <Icon.Arrow size={14} />
            </Bouton>
          ) : (
            <Bouton apparence="contour" disabled>
              Accès réservé
            </Bouton>
          )}
        </div>
      </div>

      {showLetter ? (
        <ModalCandidature
          projetId={p.id}
          titre={p.titre}
          organisation={p.organisation}
          onClose={() => setShowLetter(false)}
          onPostule={() => {
            setPostule(true);
            setShowLetter(false);
          }}
        />
      ) : null}
      {showPartenariat ? (
        <ModalPartenariat
          projetId={p.id}
          titre={p.titre}
          organisation={p.organisation}
          onClose={() => setShowPartenariat(false)}
        />
      ) : null}
    </main>
  );
}

function RecapCase({
  libelle,
  valeur,
  accent = false,
  icon,
}: {
  libelle: string;
  valeur: string;
  accent?: boolean;
  icon?: ReactNode;
}) {
  return (
    <div className="bg-fond-eleve px-4 py-3.5">
      <div className="t-eyebrow flex items-center gap-1">
        {icon ? <span className="text-sage-500">{icon}</span> : null}
        {libelle}
      </div>
      <div
        className={cn(
          "mt-1 font-semibold tracking-[-0.01em]",
          accent ? "t-display text-lg text-orange-600" : "text-[15px] text-sage-900",
        )}
      >
        {valeur}
      </div>
    </div>
  );
}

function SectionTitre({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <h2 className="t-eyebrow flex items-center gap-1.5">
      {icon ? <span className="text-sage-500">{icon}</span> : null}
      {children}
    </h2>
  );
}

function ModalPartenariat({
  projetId,
  titre,
  organisation,
  onClose,
}: {
  projetId: string;
  titre: string;
  organisation: string;
  onClose: () => void;
}) {
  const [typeContribution, setTypeContribution] = useState<TypePartenariat>("CO_REALISATION");
  const [message, setMessage] = useState("");
  const [envoyee, setEnvoyee] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, demarrer] = useTransition();

  function envoyer() {
    setErreur(null);
    const fd = new FormData();
    fd.set("projetId", projetId);
    fd.set("typeContribution", typeContribution);
    fd.set("message", message);
    demarrer(async () => {
      const r = await soumettreDemandePartenariat(fd);
      if (r.succes) setEnvoyee(true);
      else setErreur(r.message ?? "Erreur inconnue.");
    });
  }

  return (
    <FeuilleModale onClose={onClose} surTitre={organisation} titre={titre}>
      {envoyee ? (
        <div className="rounded-xl border border-bordure bg-fond-eleve p-4">
          <p className="t-small m-0">
            Proposition envoyée. Le porteur du projet pourra l&apos;accepter ou la refuser depuis son espace entreprise.
          </p>
        </div>
      ) : (
        <>
          <label className="grid gap-1">
            <span className="text-xs font-semibold">Type de contribution</span>
            <select
              className="champ"
              value={typeContribution}
              onChange={(e) => setTypeContribution(e.target.value as TypePartenariat)}
            >
              <option value="CO_REALISATION">Co-réalisation</option>
              <option value="FINANCEMENT">Financement</option>
              <option value="RECRUTEMENT">Débouchés / recrutement</option>
              <option value="MENTORAT">Mentorat</option>
              <option value="DIFFUSION">Diffusion</option>
            </select>
          </label>
          <label className="mt-3 grid gap-1">
            <span className="text-xs font-semibold">Proposition</span>
            <textarea
              className="champ champ--ta"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explique ce que ton entreprise apporte concrètement au projet."
            />
          </label>
          <div className="t-xs t-discret mt-1">{message.length}/80 caractères minimum</div>
          {erreur ? <p className="text-[13px] text-danger">{erreur}</p> : null}
          <div className="mt-4 flex justify-end gap-2.5">
            <Bouton apparence="fantome" onClick={onClose}>
              Annuler
            </Bouton>
            <Bouton apparence="accent" onClick={envoyer} disabled={enCours || message.length < 80}>
              {enCours ? "Envoi…" : "Envoyer"} <Icon.Send size={14} />
            </Bouton>
          </div>
        </>
      )}
    </FeuilleModale>
  );
}

function ModalCandidature({
  projetId,
  titre,
  organisation,
  onClose,
  onPostule,
}: {
  projetId: string;
  titre: string;
  organisation: string;
  onClose: () => void;
  onPostule: () => void;
}) {
  const [lettre, setLettre] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, demarrer] = useTransition();

  const envoyer = () => {
    setErreur(null);
    const fd = new FormData();
    fd.set("projetId", projetId);
    fd.set("lettre", lettre);
    demarrer(async () => {
      const r = await soumettreCandidature(fd);
      if (r?.succes) onPostule();
      else setErreur(r?.message ?? "Erreur inconnue.");
    });
  };

  return (
    <FeuilleModale onClose={onClose} surTitre={organisation} titre={titre} className="max-w-[520px]">
      <label className="t-xs font-semibold">Pourquoi toi ?</label>
      <textarea
        className="champ champ--ta mt-1.5"
        rows={6}
        placeholder="Quelques phrases sincères (200 caractères minimum). L'entreprise lit attentivement."
        value={lettre}
        onChange={(e) => setLettre(e.target.value)}
      />
      <div className="t-xs t-discret mt-1">{lettre.length}/200 caractères minimum</div>
      {erreur ? (
        <p className="mt-2.5 rounded-lg bg-danger/10 px-3 py-2 text-[13px] text-danger">{erreur}</p>
      ) : null}
      <div className="mt-4 flex justify-end gap-2.5">
        <Bouton apparence="fantome" onClick={onClose}>
          Annuler
        </Bouton>
        <Bouton apparence="accent" onClick={envoyer} disabled={enCours || lettre.length < 200}>
          {enCours ? "Envoi…" : "Envoyer"} <Icon.Send size={14} />
        </Bouton>
      </div>
    </FeuilleModale>
  );
}
