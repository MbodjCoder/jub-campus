"use client";

// Inscription — choix du profil, port 1:1 de la maquette (PageInscription
// étape 1). « Continuer » mène au formulaire réel du rôle choisi.

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bouton } from "@/composants/ui/bouton";
import { Icon } from "@/composants/maquette/icones";

const ROLES = [
  { v: "etudiant", titre: "Étudiant·e", desc: "Je cherche un job." },
  { v: "entreprise", titre: "Entreprise", desc: "Je publie des jobs." },
  { v: "mentor", titre: "Mentor", desc: "J'encadre des étudiants." },
];

export default function PageInscription() {
  const router = useRouter();
  const [role, setRole] = useState("etudiant");

  return (
    <main className="fadein px-5 pb-16 pt-10">
      <div className="mx-auto max-w-[440px]">
        <h1 className="m-0 text-[clamp(1.5rem,3.5vw,2rem)] font-semibold tracking-[-0.025em]">
          Tu es…
        </h1>
        <p className="t-small mt-1.5">
          Choisis ton profil pour créer ton compte.
        </p>

        <div className="mt-6 grid gap-2">
          {ROLES.map((r) => (
            <button
              key={r.v}
              onClick={() => setRole(r.v)}
              aria-pressed={role === r.v}
              className={
                role === r.v
                  ? "flex cursor-pointer items-center justify-between rounded-xl border border-sage-700 bg-sage-700 px-[18px] py-4 text-left text-white"
                  : "flex cursor-pointer items-center justify-between rounded-xl border border-bordure-forte bg-white px-[18px] py-4 text-left"
              }
            >
              <div>
                <div className="font-semibold">{r.titre}</div>
                <div className={role === r.v ? "mt-0.5 text-[12.5px] opacity-80" : "mt-0.5 text-[12.5px] opacity-65"}>{r.desc}</div>
              </div>
              {role === r.v ? (
                <Icon.Check size={18} className="text-orange-400" />
              ) : (
                <Icon.ChevronRight size={16} className="text-sage-400" />
              )}
            </button>
          ))}
          <Bouton
            apparence="accent"
            taille="lg"
            pleineLargeur
            onClick={() => router.push(`/inscription/${role}`)}
            className="mt-2.5"
          >
            Continuer <Icon.Arrow size={15} />
          </Bouton>
        </div>

        <p className="t-xs t-discret mt-6 text-center">
          Déjà un compte ?{" "}
          <Link href="/connexion" className="font-semibold text-orange-600">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
