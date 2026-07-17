// À propos — port 1:1 de la maquette (PageAbout + Bloc).

import type { ReactNode } from "react";
import { LienBouton } from "@/composants/ui/lien-bouton";
import { Icon } from "@/composants/maquette/icones";

export const metadata = { title: "À propos" };

function Bloc({ icon, titre, children }: { icon: ReactNode; titre: string; children: ReactNode }) {
  return (
    <div className="flex gap-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-sage-700 text-orange-400">
        {icon}
      </div>
      <div>
        <div className="text-[15px] font-semibold">{titre}</div>
        <p className="mt-[3px] text-sm leading-[1.55] text-sage-700">{children}</p>
      </div>
    </div>
  );
}

export default function PageAbout() {
  return (
    <main className="fadein mx-auto max-w-[720px] px-5 pb-16 pt-10">
      <h1 className="m-0 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-[-0.025em]">
        À propos de{" "}
        <span className="t-display text-[1.05em] text-orange-600">JUB.</span>
      </h1>
      <p className="mt-4 text-[17px] leading-[1.55] text-sage-700">
        <em>
          « Même sans réseau, chaque étudiant peut acquérir une vraie expérience, prouver ses compétences et accéder à
          de meilleures opportunités. »
        </em>
      </p>

      <div className="mt-8 grid gap-[22px]">
        <Bloc icon={<Icon.MapPin size={16} />} titre="D'où on vient">
          Né à Saint-Louis en 2026, sur le campus de l&apos;UGB.
        </Bloc>
        <Bloc icon={<Icon.Sparkles size={16} />} titre="Ce qu'on fait">
          Une plateforme de jobs par projets, encadrés et certifiés, pour les étudiants du Sénégal.
        </Bloc>
        <Bloc icon={<Icon.ShieldCheck size={16} />} titre="Pourquoi ça compte">
          Chaque certificat est vérifiable publiquement par QR code. Aucune contrefaçon possible.
        </Bloc>
        <Bloc icon={<Icon.Heart size={16} />} titre="Notre promesse">
          Gratuit pour les étudiants. À vie.
        </Bloc>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-bordure bg-fond-eleve p-6">
        <span className="t-small">Une question ?</span>
        <LienBouton href="/contact" apparence="primaire" icone={<Icon.Mail size={14} />}>
          Nous contacter
        </LienBouton>
      </div>
    </main>
  );
}
