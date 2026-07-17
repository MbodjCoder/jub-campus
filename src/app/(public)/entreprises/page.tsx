// Pour les entreprises — port 1:1 de la maquette (PageEntreprises).

import { LienBouton } from "@/composants/ui/lien-bouton";
import { Icon } from "@/composants/maquette/icones";

export const metadata = { title: "Pour les entreprises" };

export default function PageEntreprises() {
  return (
    <main className="fadein mx-auto max-w-[720px] px-5 pb-16 pt-10">
      <h1 className="m-0 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-[-0.025em]">
        Pour les{" "}
        <span className="t-display text-[1.05em] text-orange-600">entreprises.</span>
      </h1>
      <p className="mt-4 text-base leading-[1.55] text-sage-700">
        Sourcez les meilleurs étudiants du Sénégal sur de vrais jobs. Évaluez-les en situation. Recrutez sans risque.
      </p>

      <ul className="mx-0 mb-0 mt-10 grid list-none gap-[22px] p-0">
        {[
          { t: "Publiez un job", d: "Décrivez le besoin, la rémunération, les compétences. Validé sous 24h." },
          { t: "Recevez les bonnes candidatures", d: "Algorithme de matching sur compétences, niveau et historique." },
          { t: "Suivez tout en temps réel", d: "Kanban, livrables, feedback mentor centralisés." },
          { t: "Recrutez en toute confiance", d: "À la livraison, vous savez exactement qui a fait quoi." },
        ].map((e, i) => (
          <li key={i} className="flex gap-5">
            <div className="t-display w-8 shrink-0 text-2xl leading-none text-orange-600">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <div className="text-base font-semibold">{e.t}</div>
              <p className="mt-[3px] text-sm leading-normal text-sage-700">{e.d}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-12 rounded-[14px] bg-sage-900 p-6 text-white">
        <div className="t-eyebrow text-orange-400">Tarif</div>
        <h3 className="mt-1.5 text-xl font-semibold text-white">
          Gratuit pour publier votre premier job.
        </h3>
        <p className="mt-1.5 text-sm text-sage-100">
          Pas d&apos;abonnement. Vous payez les étudiants à la livraison.
        </p>
        <LienBouton
          href="/inscription/entreprise"
          apparence="accent"
          iconeDroite={<Icon.Arrow size={15} />}
          className="mt-[18px]"
        >
          Publier un job
        </LienBouton>
      </div>
    </main>
  );
}
