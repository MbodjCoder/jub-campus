"use client";

// Fil de discussion d'équipe — messages projet partagés (équipe + mentor).

import { useState, useRef, useTransition } from "react";
import { Send } from "lucide-react";
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
    <div className="carte" style={{ padding: 20 }}>
      <h2 className="t-h3" style={{ marginTop: 0, marginBottom: 14 }}>
        Fil d&apos;équipe
      </h2>

      {messages.length === 0 ? (
        <p className="t-small" style={{ margin: "0 0 14px" }}>
          Aucun message. Lance la discussion avec ton équipe et ton mentor.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16, maxHeight: 360, overflowY: "auto" }}>
          {messages.map((m) => (
            <div key={m.id} style={{ display: "flex", flexDirection: m.moi ? "row-reverse" : "row", gap: 8 }}>
              <div style={{ maxWidth: "80%" }}>
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    marginBottom: 3,
                    flexDirection: m.moi ? "row-reverse" : "row",
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{m.moi ? "Moi" : m.auteur}</span>
                  <span className="t-xs t-discret">· {ilYa(m.creeLe)}</span>
                </div>
                <div
                  style={{
                    background: m.moi ? "var(--sage-700)" : "var(--fond-eleve)",
                    color: m.moi ? "white" : "var(--texte)",
                    padding: "10px 14px",
                    borderRadius: 14,
                    borderTopRightRadius: m.moi ? 4 : 14,
                    borderTopLeftRadius: m.moi ? 14 : 4,
                    fontSize: 13.5,
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.contenu}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <form ref={formRef} onSubmit={envoyer} style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        <textarea
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          placeholder="Écrire à l'équipe…"
          rows={2}
          maxLength={2000}
          className="champ champ--ta"
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn--primaire btn--icone" disabled={enCours || !contenu.trim()}>
          <Send size={14} />
        </button>
      </form>
      {erreur ? (
        <p style={{ marginTop: 8, marginBottom: 0, color: "var(--danger)", fontSize: 13 }}>{erreur}</p>
      ) : null}
    </div>
  );
}
