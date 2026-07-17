// Client — dépôt d'un brief en 4 étapes.

import Link from "next/link";
import { Icon } from "@/composants/maquette/icones";
import { StepperBrief } from "@/composants/client/stepper-brief";

export const metadata = { title: "Nouvelle demande" };

export default function PageNouveauBrief() {
  return (
    <div className="fadein mx-auto max-w-[680px]">
      <Link href="/entreprise/brief" className="t-small inline-flex items-center gap-1 font-medium text-sage-600 no-underline">
        <Icon.ArrowLeft size={14} /> Mes demandes
      </Link>
      <h1 className="mb-1 mt-3 text-2xl font-semibold tracking-tight">Décrivez votre besoin</h1>
      <p className="t-small mt-0 mb-8">
        4 étapes, 3 minutes. Notre équipe qualifie la demande et revient avec un devis gratuit.
      </p>
      <StepperBrief />
    </div>
  );
}
