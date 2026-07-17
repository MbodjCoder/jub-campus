"use client";

// Stepper de dépôt de brief client — 4 étapes, brouillon en mémoire.
// 1. Type de mission · 2. Détails (par verticale) · 3. Budget & délai · 4. Récapitulatif.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn, formaterMontantFcfa } from "@/lib/utils";
import { Stepper } from "@/composants/ui/stepper";
import { Bouton } from "@/composants/ui/bouton";
import { Icon } from "@/composants/maquette/icones";
import { soumettreBrief } from "@/app/entreprise/brief/actions";

const ETAPES = ["Type", "Détails", "Budget", "Récapitulatif"] as const;

const TYPES = [
  {
    v: "ENQUETE_TERRAIN",
    titre: "Enquête terrain",
    desc: "Collecte de données sur le terrain : questionnaires, entretiens, observations.",
    icone: <Icon.MapPin size={20} />,
  },
  {
    v: "ANNOTATION",
    titre: "Annotation de données",
    desc: "Étiquetage de textes, audio, images pour l'entraînement de modèles IA.",
    icone: <Icon.Sparkles size={20} />,
  },
  {
    v: "ETUDE",
    titre: "Étude / recherche",
    desc: "Revue documentaire, analyse, benchmark, rapport de synthèse.",
    icone: <Icon.FileText size={20} />,
  },
  {
    v: "REDACTION",
    titre: "Rédaction",
    desc: "Contenus, transcriptions, traductions français / wolof / anglais.",
    icone: <Icon.FileText size={20} />,
  },
  {
    v: "AUTRE",
    titre: "Autre besoin",
    desc: "Décrivez votre besoin, notre équipe le qualifie avec vous.",
    icone: <Icon.Chat size={20} />,
  },
] as const;

type TypeMission = (typeof TYPES)[number]["v"];

interface Details {
  description: string;
  zone?: string;
  volume?: string;
  langues?: string;
  echeance?: string;
  materiel?: string;
}

export function StepperBrief() {
  const router = useRouter();
  const [etape, setEtape] = useState(0);
  const [type, setType] = useState<TypeMission | null>(null);
  const [titre, setTitre] = useState("");
  const [details, setDetails] = useState<Details>({ description: "" });
  const [budget, setBudget] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoye, setEnvoye] = useState(false);
  const [enCours, demarrer] = useTransition();

  const estEnquete = type === "ENQUETE_TERRAIN";
  const estAnnotation = type === "ANNOTATION";

  const etapeValide = (() => {
    if (etape === 0) return type != null;
    if (etape === 1) return details.description.trim().length >= 20;
    if (etape === 3) return titre.trim().length >= 4;
    return true;
  })();

  function suivant() {
    setErreur(null);
    if (!etapeValide) {
      setErreur(
        etape === 1
          ? "Décris ton besoin en quelques phrases (20 caractères minimum)."
          : "Complète cette étape avant de continuer.",
      );
      return;
    }
    setEtape((e) => Math.min(e + 1, ETAPES.length - 1));
  }

  function envoyer() {
    setErreur(null);
    if (!type || titre.trim().length < 4) {
      setErreur("Donne un titre à ta demande (4 caractères minimum).");
      return;
    }
    const fd = new FormData();
    fd.set("typeMission", type);
    fd.set("titre", titre.trim());
    if (budget) fd.set("budgetIndicatifFcfa", budget);
    fd.set("details", JSON.stringify(details));
    demarrer(async () => {
      const r = await soumettreBrief(fd);
      if (r.succes) {
        setEnvoye(true);
        setTimeout(() => router.push("/entreprise/brief"), 1600);
      } else {
        setErreur(r.message ?? "Erreur.");
      }
    });
  }

  if (envoye) {
    return (
      <div className="carte p-10 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-sage-950">
          <Icon.Check size={22} />
        </div>
        <h2 className="mt-4 text-xl font-semibold">Brief envoyé</h2>
        <p className="t-small mx-auto mt-2 max-w-sm">
          Notre équipe qualifie ta demande et revient vers toi avec un devis sous 72 h ouvrées.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Stepper etapes={ETAPES} etapeActive={etape} className="mb-8" />

      {/* Étape 1 — type */}
      {etape === 0 ? (
        <div className="grid gap-2">
          {TYPES.map((t) => (
            <button
              key={t.v}
              onClick={() => setType(t.v)}
              aria-pressed={type === t.v}
              className={cn(
                "flex cursor-pointer items-center gap-4 rounded-xl border px-4 py-4 text-left",
                type === t.v
                  ? "border-sage-700 bg-sage-700 text-white"
                  : "border-bordure-forte bg-white hover:bg-sage-50",
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]",
                  type === t.v ? "bg-white/10 text-orange-400" : "bg-sage-700 text-orange-400",
                )}
              >
                {t.icone}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold">{t.titre}</span>
                <span className={cn("block text-[12.5px]", type === t.v ? "opacity-80" : "opacity-65")}>
                  {t.desc}
                </span>
              </span>
              {type === t.v ? <Icon.Check size={18} className="ml-auto shrink-0 text-orange-400" /> : null}
            </button>
          ))}
        </div>
      ) : null}

      {/* Étape 2 — détails par verticale */}
      {etape === 1 ? (
        <div className="grid gap-4">
          <label className="grid gap-1">
            <span className="text-xs font-semibold">
              {estEnquete
                ? "Objectif de l'enquête (que cherchez-vous à mesurer ?)"
                : estAnnotation
                  ? "Description des données et de la tâche d'annotation"
                  : "Description du besoin"}
            </span>
            <textarea
              className="champ champ--ta"
              rows={5}
              value={details.description}
              onChange={(e) => setDetails({ ...details, description: e.target.value })}
              placeholder={
                estEnquete
                  ? "Ex. Mesurer la satisfaction des bénéficiaires du programme X dans la région de Saint-Louis…"
                  : estAnnotation
                    ? "Ex. 10 000 segments audio en wolof à transcrire et étiqueter selon nos consignes…"
                    : "Contexte, objectif, livrable attendu…"
              }
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            {estEnquete ? (
              <label className="grid gap-1">
                <span className="text-xs font-semibold">Zone géographique</span>
                <input className="champ" value={details.zone ?? ""}
                  onChange={(e) => setDetails({ ...details, zone: e.target.value })}
                  placeholder="Ex. Saint-Louis et périphérie" />
              </label>
            ) : null}
            <label className="grid gap-1">
              <span className="text-xs font-semibold">
                {estEnquete ? "Taille d'échantillon visée" : "Volume estimé"}
              </span>
              <input className="champ" value={details.volume ?? ""}
                onChange={(e) => setDetails({ ...details, volume: e.target.value })}
                placeholder={estEnquete ? "Ex. 400 ménages" : "Ex. 10 000 items"} />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold">Langues concernées</span>
              <input className="champ" value={details.langues ?? ""}
                onChange={(e) => setDetails({ ...details, langues: e.target.value })}
                placeholder="Ex. français, wolof" />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold">
                {estEnquete ? "Questionnaire déjà disponible ?" : "Consignes / matériel déjà disponibles ?"}
              </span>
              <input className="champ" value={details.materiel ?? ""}
                onChange={(e) => setDetails({ ...details, materiel: e.target.value })}
                placeholder="Oui / Non / En cours" />
            </label>
          </div>
        </div>
      ) : null}

      {/* Étape 3 — budget & délai */}
      {etape === 2 ? (
        <div className="grid gap-4">
          <label className="grid max-w-sm gap-1">
            <span className="text-xs font-semibold">Budget indicatif (FCFA, optionnel)</span>
            <input className="champ t-mono" type="number" min={0} step={50000} value={budget}
              onChange={(e) => setBudget(e.target.value)} placeholder="Ex. 2000000" />
            <span className="t-xs t-discret">
              Aide notre équipe à calibrer la proposition. Le devis reste gratuit et sans engagement.
            </span>
          </label>
          <label className="grid max-w-sm gap-1">
            <span className="text-xs font-semibold">Échéance souhaitée</span>
            <input className="champ" type="date" value={details.echeance ?? ""}
              onChange={(e) => setDetails({ ...details, echeance: e.target.value })} />
          </label>
        </div>
      ) : null}

      {/* Étape 4 — récapitulatif */}
      {etape === 3 ? (
        <div className="grid gap-4">
          <label className="grid gap-1">
            <span className="text-xs font-semibold">Titre de la demande</span>
            <input className="champ" value={titre} onChange={(e) => setTitre(e.target.value)}
              placeholder="Ex. Enquête satisfaction bénéficiaires — Saint-Louis" maxLength={160} />
          </label>
          <div className="carte p-4">
            <div className="t-eyebrow mb-2">Récapitulatif</div>
            <dl className="m-0 grid gap-1.5 text-sm">
              <Ligne l="Type" v={TYPES.find((t) => t.v === type)?.titre ?? "—"} />
              <Ligne l="Description" v={details.description || "—"} />
              {details.zone ? <Ligne l="Zone" v={details.zone} /> : null}
              {details.volume ? <Ligne l="Volume" v={details.volume} /> : null}
              {details.langues ? <Ligne l="Langues" v={details.langues} /> : null}
              {details.echeance ? <Ligne l="Échéance" v={details.echeance} /> : null}
              <Ligne l="Budget indicatif" v={budget ? formaterMontantFcfa(Number(budget)) : "Non précisé"} />
            </dl>
          </div>
        </div>
      ) : null}

      {erreur ? (
        <p className="mt-4 mb-0 rounded-lg bg-danger/10 px-3 py-2 text-[13px] text-danger">{erreur}</p>
      ) : null}

      <div className="mt-6 flex items-center justify-between">
        <Bouton apparence="fantome" onClick={() => setEtape((e) => Math.max(0, e - 1))} disabled={etape === 0}>
          <Icon.ArrowLeft size={14} /> Retour
        </Bouton>
        {etape < ETAPES.length - 1 ? (
          <Bouton apparence="primaire" onClick={suivant} disabled={!etapeValide}>
            Continuer <Icon.Arrow size={14} />
          </Bouton>
        ) : (
          <Bouton apparence="accent" onClick={envoyer} disabled={enCours || !etapeValide}>
            {enCours ? "Envoi…" : "Envoyer la demande"} <Icon.Send size={14} />
          </Bouton>
        )}
      </div>
    </div>
  );
}

function Ligne({ l, v }: { l: string; v: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-32 shrink-0 font-semibold text-texte-discret">{l}</dt>
      <dd className="m-0 min-w-0 flex-1">{v}</dd>
    </div>
  );
}
