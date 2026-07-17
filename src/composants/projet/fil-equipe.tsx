"use client";

// Fil de discussion d'équipe — messages projet partagés (équipe + mentor).

import { useState, useRef, useTransition } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { posterMessageProjet } from "@/app/app/projet/[id]/actions";

export interface MessageFil {
  id: string;
  contenu: string;
  creeLe: string | Date;
  auteur: string;
  moi: boolean;
}

function ilYa(d: string | Date): string {
  const diff = (Date.now() - new Date(d).getTime()) / 60000;
  if (diff < 1) return "à l'instant";
  if (diff < 60) return `il y a ${Math.floor(diff)} min`;
  if (diff < 1440) return `il y a ${Math.floor(diff / 60)} h`;
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

export function FilEquipe({ projetId, messages }: { projetId: string; messages: MessageFil[] }) {
  const [contenu, setContenu] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, demarrer] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!contenu.trim()) return;
    setErreur(null);
    const fd = new FormData();
    fd.set("projetId", projetId);
    fd.set("contenu", contenu.trim());
    demarrer(async () => {
      const r = await posterMessageProjet(fd);
      if (r.succes) setContenu("");
      else setErreur(r.message ?? "Erreur.");
    });
  }

  return (
    <div className="carte p-5">
      <h2 className="t-h3 mb-3.5 mt-0">
        Fil d&apos;équipe
      </h2>

      {messages.length === 0 ? (
        <p className="t-small mb-3.5 mt-0">
          Aucun message. Lance la discussion avec ton équipe et ton mentor.
        </p>
      ) : (
        <div className="mb-4 flex max-h-[360px] flex-col gap-3 overflow-y-auto">
          {messages.map((m) => (
            <div key={m.id} className={cn("flex gap-2", m.moi && "flex-row-reverse")}>
              <div className="max-w-[80%]">
                <div className={cn("mb-[3px] flex gap-1.5", m.moi && "flex-row-reverse")}>
                  <span className="text-xs font-semibold">{m.moi ? "Moi" : m.auteur}</span>
                  <span className="t-xs t-discret">· {ilYa(m.creeLe)}</span>
                </div>
                <div
                  className={cn(
                    "whitespace-pre-wrap rounded-[14px] px-3.5 py-2.5 text-[13.5px] leading-normal",
                    m.moi ? "rounded-tr bg-sage-700 text-white" : "rounded-tl bg-fond-eleve text-texte",
                  )}
                >
                  {m.contenu}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <form ref={formRef} onSubmit={envoyer} className="flex items-end gap-2">
        <textarea
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          placeholder="Écrire à l'équipe…"
          rows={2}
          maxLength={2000}
          className="champ champ--ta flex-1"
        />
        <button type="submit" className="btn btn--primaire btn--icone" disabled={enCours || !contenu.trim()}>
          <Send size={14} />
        </button>
      </form>
      {erreur ? (
        <p className="mb-0 mt-2 text-[13px] text-danger">{erreur}</p>
      ) : null}
    </div>
  );
}
