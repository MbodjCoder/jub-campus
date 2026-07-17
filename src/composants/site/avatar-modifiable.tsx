"use client";

// Photo de profil cliquable — commune à tous les rôles.
// Ouvre le sélecteur de fichier, envoie l'image à /api/portfolio/avatar
// (qui met à jour Utilisateur.imageUrl) puis rafraîchit la page.

import { useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { obtenirInitiales } from "@/lib/role";

export function AvatarModifiable({
  nom,
  src,
  taille = 72,
}: {
  nom: string;
  src: string | null;
  taille?: number;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function onChange(ev: ChangeEvent<HTMLInputElement>) {
    const fichier = ev.target.files?.[0];
    ev.target.value = "";
    if (!fichier) return;
    setErreur(null);
    setChargement(true);
    try {
      const fd = new FormData();
      fd.append("fichier", fichier);
      const res = await fetch("/api/portfolio/avatar", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erreur ?? "Échec de l'envoi");
      router.refresh();
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        title="Changer ma photo de profil"
        className={cn(
          "relative shrink-0 rounded-full border-0 bg-transparent p-0",
          chargement ? "cursor-wait opacity-60" : "cursor-pointer",
        )}
        // eslint-disable-next-line react/forbid-dom-props -- diamètre dynamique
        style={{ width: taille, height: taille }}
      >
        <span
          className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-sage-700 bg-cover bg-center font-semibold text-orange-400"
          // eslint-disable-next-line react/forbid-dom-props -- taille de police et image dynamiques
          style={{
            fontSize: Math.round(taille * 0.36),
            backgroundImage: src ? `url(${src})` : undefined,
          }}
        >
          {!src ? obtenirInitiales(nom) : null}
        </span>
        <span className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-orange-500 text-white">
          <Camera size={13} />
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={onChange}
        className="hidden"
      />
      {erreur ? <span className="text-xs text-red-600">{erreur}</span> : null}
    </div>
  );
}
