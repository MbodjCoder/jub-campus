"use client";

// Détail d'un job — port 1:1 de la maquette (screens-public-2.jsx ·
// PageDetailProjet + RecapCase + SectionTitre + ModalCandidature).
// Candidature câblée sur la vraie server action.

import { useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "./icones";
import { fmt } from "./format";
import { Pilule, Bouton, Avatar, MODE_REM } from "./primitifs";
import { soumettreCandidature } from "@/app/(public)/projets/[slug]/actions";

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
}

export function DetailJob({
  projet: p,
  candidatureStatut,
  estEtudiant,
  estConnecte,
}: {
  projet: DetailJobData;
  candidatureStatut: string | null;
  estEtudiant: boolean;
  estConnecte: boolean;
}) {
  const router = useRouter();
  const [postule, setPostule] = useState(candidatureStatut != null);
  const [showLetter, setShowLetter] = useState(false);
  const placesRestantes = Math.max(0, p.placesMax - p.placesPrises);
  const mode = MODE_REM[p.modeRemuneration];

  const ouvrirCandidature = () => {
    if (!estConnecte) {
      router.push(`/connexion?suivant=/projets/${p.slug}`);
      return;
    }
    if (!estEtudiant) return;
    setShowLetter(true);
  };

  return (
    <main className="fadein" style={{ paddingBottom: 100 }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 20px 0" }}>
        <Link
          href="/projets"
          className="t-small"
          style={{
            background: "transparent",
            border: 0,
            color: "var(--sage-600)",
            fontWeight: 500,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Icon.ArrowLeft size={14} /> Jobs
        </Link>
      </div>

      <section style={{ maxWidth: 800, margin: "0 auto", padding: "16px 20px 0" }}>
        <div
          style={{
            width: "100%",
            aspectRatio: "21 / 9",
            borderRadius: 16,
            overflow: "hidden",
            position: "relative",
            backgroundImage: `url(${p.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(20,26,19,0.15) 0%, rgba(20,26,19,0.75) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: 18,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
              <Pilule variant="neutre">{p.organisation}</Pilule>
              {p.matchScore != null && p.matchScore >= 80 ? (
                <Pilule variant="orange" icon={<Icon.Sparkles size={11} />}>
                  {p.matchScore}%
                </Pilule>
              ) : null}
            </div>
            <Pilule variant="neutre" icon={mode.icon}>
              {mode.libelle}
            </Pilule>
          </div>
        </div>

        <h1
          style={{
            marginTop: 24,
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 600,
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
          }}
        >
          {p.titre}
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 1,
            marginTop: 24,
            background: "var(--bordure)",
            border: "1px solid var(--bordure)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <RecapCase
            libelle="Récompense"
            valeur={p.montant != null ? (fmt.fcfa(p.montant) ?? "") : "Apprentissage"}
            icon={<Icon.Wallet size={14} />}
            accent={p.montant != null}
          />
          <RecapCase libelle="Durée" valeur={fmt.duree(p.duree) ?? ""} icon={<Icon.Clock size={14} />} />
          <RecapCase libelle="Équipe" valeur={`${p.placesPrises}/${p.placesMax}`} icon={<Icon.Users size={14} />} />
        </div>

        <div style={{ marginTop: 36 }}>
          <SectionTitre icon={<Icon.FileText size={13} />}>Le job</SectionTitre>
          <p style={{ marginTop: 8, fontSize: 15, lineHeight: 1.6, color: "var(--texte)" }}>{p.resume}</p>
          <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.6, color: "var(--texte)", whiteSpace: "pre-wrap" }}>
            {p.description}
          </p>
        </div>

        {p.competences.length > 0 ? (
          <div style={{ marginTop: 28 }}>
            <SectionTitre icon={<Icon.Sparkles size={13} />}>Compétences</SectionTitre>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
              {p.competences.map((c) => (
                <Pilule key={c} variant="neutre">
                  {c}
                </Pilule>
              ))}
            </div>
          </div>
        ) : null}

        {p.mentor ? (
          <div style={{ marginTop: 28 }}>
            <SectionTitre icon={<Icon.ShieldCheck size={13} />}>Mentor</SectionTitre>
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar nom={p.mentor.nom} size={40} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                  {p.mentor.nom}
                  {p.mentor.verifie ? <Icon.ShieldCheck size={13} style={{ color: "var(--orange-500)" }} /> : null}
                </div>
                {p.mentor.titre ? <div className="t-xs t-discret">{p.mentor.titre}</div> : null}
              </div>
            </div>
          </div>
        ) : null}
      </section>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 16,
          background: "linear-gradient(180deg, transparent, var(--fond) 40%)",
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "white",
            borderRadius: 14,
            padding: "10px 12px 10px 18px",
            boxShadow: "var(--ombre-md)",
            border: "1px solid var(--bordure)",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="t-xs t-discret">Récompense</div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {p.montant != null ? fmt.fcfa(p.montant) : "Apprentissage certifiant"}
            </div>
          </div>
          {postule ? (
            <Bouton variant="contour" taille="md" icon={<Icon.Check size={14} />}>
              Postulé
            </Bouton>
          ) : estEtudiant && placesRestantes <= 0 ? (
            <Bouton variant="contour" taille="md" disabled>
              Complet
            </Bouton>
          ) : (
            <Bouton
              variant="accent"
              taille="md"
              onClick={ouvrirCandidature}
              iconRight={<Icon.Arrow size={14} />}
            >
              Postuler
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
    <div style={{ padding: "14px 16px", background: "var(--fond-eleve)" }}>
      <div className="t-eyebrow" style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {icon ? <span style={{ color: "var(--sage-500)" }}>{icon}</span> : null}
        {libelle}
      </div>
      <div
        style={{
          marginTop: 4,
          fontSize: accent ? 18 : 15,
          fontWeight: 600,
          fontFamily: accent ? "var(--fonte-display)" : "inherit",
          fontStyle: accent ? "italic" : "normal",
          color: accent ? "var(--orange-600)" : "var(--sage-900)",
          letterSpacing: "-0.01em",
        }}
      >
        {valeur}
      </div>
    </div>
  );
}

function SectionTitre({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <h2 className="t-eyebrow" style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {icon ? <span style={{ color: "var(--sage-500)" }}>{icon}</span> : null}
      {children}
    </h2>
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
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
      className="modal-wrap"
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(20,26,19,0.5)" }} onClick={onClose} />
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 520,
          background: "white",
          borderRadius: "16px 16px 0 0",
          padding: 24,
          maxHeight: "92vh",
          overflow: "auto",
        }}
        className="modal-card"
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div className="t-xs t-discret">{organisation}</div>
            <h2 style={{ fontSize: 20, fontWeight: 600, margin: "4px 0 0", letterSpacing: "-0.01em" }}>{titre}</h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "var(--sage-50)",
              border: 0,
              width: 32,
              height: 32,
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Icon.X size={16} />
          </button>
        </div>
        <label className="t-xs" style={{ fontWeight: 600 }}>
          Pourquoi toi ?
        </label>
        <textarea
          className="champ champ--ta"
          rows={6}
          placeholder="Quelques phrases sincères (200 caractères minimum). L'entreprise lit attentivement."
          value={lettre}
          onChange={(e) => setLettre(e.target.value)}
          style={{ marginTop: 6 }}
        />
        <div className="t-xs t-discret" style={{ marginTop: 4 }}>
          {lettre.length}/200 caractères minimum
        </div>
        {erreur ? (
          <p
            style={{
              marginTop: 10,
              background: "color-mix(in oklab, var(--danger) 10%, transparent)",
              color: "var(--danger)",
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 13,
            }}
          >
            {erreur}
          </p>
        ) : null}
        <div style={{ marginTop: 16, display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Bouton variant="fantome" onClick={onClose}>
            Annuler
          </Bouton>
          <Bouton
            variant="accent"
            iconRight={<Icon.Send size={14} />}
            onClick={envoyer}
            disabled={enCours || lettre.length < 200}
          >
            {enCours ? "Envoi…" : "Envoyer"}
          </Bouton>
        </div>
      </div>
      <style>{`
        @media (min-width: 700px) {
          .modal-wrap { align-items: center !important; padding: 24px !important; }
          .modal-card { border-radius: 16px !important; }
        }
      `}</style>
    </div>
  );
}
