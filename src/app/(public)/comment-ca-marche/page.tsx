// Comment ça marche — port 1:1 de la maquette (PageCommentCaMarche).

import { LienBouton } from "@/composants/ui/lien-bouton";
import { Icon } from "@/composants/maquette/icones";

export const metadata = { title: "Comment ça marche" };

export default function PageCommentCaMarche() {
  return (
    <main className="fadein mx-auto max-w-[720px] px-5 pb-16 pt-10">
      <h1 className="m-0 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-[-0.025em]">
        Comment ça marche
      </h1>
      <p className="mt-4 text-base leading-[1.55] text-sage-700">
        JUB n&apos;est ni un job board, ni une école. C&apos;est un parcours encadré qui transforme l&apos;expérience en preuve.
      </p>

      <ol className="mx-0 mb-0 mt-10 grid list-none gap-7 p-0">
        {[
          { t: "Postule à un job", d: "Catalogue filtré. La majorité des entreprises répondent sous 5 jours." },
          { t: "Travaille avec ton équipe", d: "Kanban, livrables, feedback mentor — tout au même endroit." },
          { t: "Reçois ton certificat", d: "PDF + QR vérifiable publiquement. Ajouté à ton portfolio automatiquement." },
        ].map((e, i) => (
          <li key={i} className="flex gap-5">
            <div className="t-display w-10 shrink-0 text-3xl leading-none text-orange-600">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <div className="text-[17px] font-semibold tracking-[-0.01em]">{e.t}</div>
              <p className="mt-1 text-[14.5px] leading-[1.55] text-sage-700">{e.d}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-bordure pt-7">
        <span className="t-small">Prêt à commencer ?</span>
        <LienBouton href="/inscription" apparence="accent" iconeDroite={<Icon.Arrow size={15} />}>
          Créer mon compte
        </LienBouton>
      </div>
    </main>
  );
}
