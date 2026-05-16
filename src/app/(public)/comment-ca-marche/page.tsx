import Link from "next/link";
import Image from "next/image";
import { Bouton } from "@/composants/ui/bouton";
import { Carte, CorpsCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";

export const metadata = { title: "Comment ça marche" };

const etapesEtudiant = [
  { num: "01", titre: "Crée ton profil étudiant", desc: "Université, niveau, compétences, objectifs. Cinq minutes chrono." },
  { num: "02", titre: "Reçois des projets adaptés", desc: "Notre matching te propose les projets les plus alignés avec ton profil." },
  { num: "03", titre: "Postule en un clic", desc: "Lettre courte + CV auto-généré depuis ton profil. Pas de paperasse." },
  { num: "04", titre: "Travaille en équipe encadrée", desc: "Kanban tâches, livrables, feedback du mentor — tout au même endroit." },
  { num: "05", titre: "Reçois ton certificat vérifiable", desc: "PDF + QR code public. Portfolio mis à jour automatiquement." },
];

const etapesEntreprise = [
  { num: "01", titre: "Crée ton compte partenaire", desc: "Vérification NINEA + email pro sous 48h ouvrées." },
  { num: "02", titre: "Publie un projet", desc: "Compétences, niveau, durée, mode de rémunération — un formulaire guidé." },
  { num: "03", titre: "Reçois des candidatures triées", desc: "Score de matching, profils détaillés, accès au portfolio public." },
  { num: "04", titre: "Suis et valide les livrables", desc: "Espace projet dédié, kanban temps réel, feedback intégré." },
  { num: "05", titre: "Recrute les meilleurs profils", desc: "4 à 6 semaines de travail réel — la décision est éclairée." },
];

export default function PageCommentCaMarche() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-bordure bg-jub-vert-950 text-white">
        <Image
          src="https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=2400&q=85"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-jub-vert-950 via-jub-vert-950/90 to-jub-vert-900/60" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-24">
          <Insigne ton="jaune">Le fonctionnement</Insigne>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Du profil au certificat,<br /> sans friction.
          </h1>
          <p className="mt-5 text-lg text-jub-vert-100">
            JUB Campus n&apos;est pas un job board. C&apos;est un système qui produit
            des preuves de compétences vérifiables.
          </p>
        </div>
      </section>

      <section className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="mb-12 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-jub-vert-100 text-jub-vert-900 font-bold">É</span>
          <h2 className="text-2xl font-bold tracking-tight">Côté étudiant</h2>
        </div>
        <ol className="relative space-y-4 border-l-2 border-dashed border-jub-vert-200 pl-8 sm:pl-10">
          {etapesEtudiant.map((e) => (
            <li key={e.num} className="relative">
              <span className="absolute -left-[42px] flex h-10 w-10 items-center justify-center rounded-full bg-fond-eleve font-mono text-sm font-bold text-jub-vert-700 ring-2 ring-jub-vert-200 sm:-left-[50px]">
                {e.num}
              </span>
              <Carte>
                <CorpsCarte className="space-y-1">
                  <TitreCarte className="text-base">{e.titre}</TitreCarte>
                  <DescriptionCarte>{e.desc}</DescriptionCarte>
                </CorpsCarte>
              </Carte>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-bordure bg-fond-eleve py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-900 font-bold">E</span>
            <h2 className="text-2xl font-bold tracking-tight">Côté entreprise</h2>
          </div>
          <ol className="relative space-y-4 border-l-2 border-dashed border-violet-200 pl-8 sm:pl-10">
            {etapesEntreprise.map((e) => (
              <li key={e.num} className="relative">
                <span className="absolute -left-[42px] flex h-10 w-10 items-center justify-center rounded-full bg-fond font-mono text-sm font-bold text-violet-700 ring-2 ring-violet-200 sm:-left-[50px]">
                  {e.num}
                </span>
                <Carte>
                  <CorpsCarte className="space-y-1">
                    <TitreCarte className="text-base">{e.titre}</TitreCarte>
                    <DescriptionCarte>{e.desc}</DescriptionCarte>
                  </CorpsCarte>
                </Carte>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative overflow-hidden bg-jub-vert-50">
        <div className="absolute inset-0 opacity-50 [background:radial-gradient(circle_at_top_right,_var(--jub-jaune-400),_transparent_50%)]" />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight">Prêt à commencer ?</h2>
          <p className="mt-3 text-texte-discret">Pas de carte bancaire. Pas d&apos;abonnement étudiant.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/inscription/etudiant"><Bouton apparence="accent" taille="lg">Créer mon compte étudiant</Bouton></Link>
            <Link href="/inscription/entreprise"><Bouton apparence="contour" taille="lg">Inscrire mon entreprise</Bouton></Link>
          </div>
        </div>
      </section>
    </>
  );
}
