import Link from "next/link";
import { Bouton } from "@/composants/ui/bouton";
import { Carte, CorpsCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";

const etapesEtudiant = [
  { num: "01", titre: "Crée ton profil étudiant", desc: "Université, niveau, compétences, objectifs. 5 minutes." },
  { num: "02", titre: "Reçois des projets adaptés", desc: "Notre matching te propose les projets les plus alignés avec ton profil." },
  { num: "03", titre: "Postule en un clic", desc: "Lettre courte + CV auto-généré depuis ton profil." },
  { num: "04", titre: "Travaille en équipe encadrée", desc: "Tâches, livrables, feedback du mentor — tout dans le même espace." },
  { num: "05", titre: "Reçois ton certificat vérifiable", desc: "PDF + QR code public + portfolio mis à jour automatiquement." },
];

const etapesEntreprise = [
  { num: "01", titre: "Crée ton compte partenaire", desc: "Vérification NINEA / email pro sous 48h ouvrées." },
  { num: "02", titre: "Publie un projet", desc: "Décris ton besoin, choisis compétences, niveau, durée et mode de rémunération." },
  { num: "03", titre: "Reçois des candidatures triées", desc: "Score de matching, profils détaillés, accès au portfolio public." },
  { num: "04", titre: "Suis et valide les livrables", desc: "Espace projet dédié, tableau de bord temps réel." },
  { num: "05", titre: "Recrute les meilleurs profils", desc: "Tu travailles 4 à 6 semaines avec eux — la décision de recrutement est éclairée." },
];

export default function PageCommentCaMarche() {
  return (
    <>
      <section className="border-b border-bordure bg-jub-vert-50">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <Insigne ton="vert">Le fonctionnement</Insigne>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Du profil au certificat,<br /> sans friction.
          </h1>
          <p className="mt-4 text-lg text-texte-discret">
            JUB Campus n&apos;est pas un job board. C&apos;est un système qui produit
            des preuves de compétences vérifiables.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="mb-8 text-2xl font-bold tracking-tight">Côté étudiant</h2>
        <ol className="space-y-3">
          {etapesEtudiant.map((e) => (
            <li key={e.num}>
              <Carte>
                <CorpsCarte className="flex items-start gap-5">
                  <span className="font-mono text-3xl font-bold text-jub-vert-700 leading-none">{e.num}</span>
                  <div>
                    <TitreCarte className="text-base">{e.titre}</TitreCarte>
                    <DescriptionCarte>{e.desc}</DescriptionCarte>
                  </div>
                </CorpsCarte>
              </Carte>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-bordure bg-fond-eleve py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">Côté entreprise</h2>
          <ol className="space-y-3">
            {etapesEntreprise.map((e) => (
              <li key={e.num}>
                <Carte>
                  <CorpsCarte className="flex items-start gap-5">
                    <span className="font-mono text-3xl font-bold text-jub-vert-700 leading-none">{e.num}</span>
                    <div>
                      <TitreCarte className="text-base">{e.titre}</TitreCarte>
                      <DescriptionCarte>{e.desc}</DescriptionCarte>
                    </div>
                  </CorpsCarte>
                </Carte>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight">Prêt à commencer ?</h2>
        <p className="mt-2 text-texte-discret">Pas de carte bancaire. Pas d&apos;abonnement étudiant.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/inscription/etudiant"><Bouton apparence="accent" taille="lg">Créer mon compte étudiant</Bouton></Link>
          <Link href="/inscription/entreprise"><Bouton apparence="contour" taille="lg">Inscrire mon entreprise</Bouton></Link>
        </div>
      </section>
    </>
  );
}
