import Link from "next/link";
import { Bouton } from "@/composants/ui/bouton";
import { Carte, CorpsCarte, TitreCarte, DescriptionCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";

export default function PageAccueil() {
  return (
    <>
      <Hero />
      <BandeauChiffres />
      <SectionTroisPublics />
      <SectionFonctionnement />
      <SectionTypesProjets />
      <SectionTemoignages />
      <SectionAppelAction />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-bordure bg-gradient-to-b from-jub-vert-50 via-fond to-fond">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:py-32">
        <div className="space-y-7">
          <Insigne ton="vert">Pilote UGB Saint-Louis · Phase 1</Insigne>
          <h1 className="text-4xl font-bold tracking-tight text-jub-vert-950 sm:text-5xl lg:text-6xl">
            L&apos;expérience pro<br />
            <span className="text-jub-vert-700">qui change tout.</span>
          </h1>
          <p className="max-w-xl text-lg text-texte-discret">
            Même sans réseau et sans stage classique, travaille sur de vrais projets,
            prouve tes compétences avec des certificats vérifiables et accède aux
            entreprises qui te cherchent.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/inscription/etudiant">
              <Bouton apparence="accent" taille="lg">Je suis étudiant</Bouton>
            </Link>
            <Link href="/entreprises">
              <Bouton apparence="contour" taille="lg">Je suis une entreprise</Bouton>
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-texte-discret">
            <li className="flex items-center gap-2"><Pastille /> 100% gratuit pour étudiants</li>
            <li className="flex items-center gap-2"><Pastille /> Certificats vérifiables QR</li>
            <li className="flex items-center gap-2"><Pastille /> Portfolio public partageable</li>
            <li className="flex items-center gap-2"><Pastille /> Mentorat intégré</li>
          </ul>
        </div>
        <ApercuCarteCertificat />
      </div>
    </section>
  );
}

function Pastille() {
  return <span className="inline-block h-1.5 w-1.5 rounded-full bg-jub-vert-700" />;
}

function ApercuCarteCertificat() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-jub-jaune-400/30 via-jub-vert-200/30 to-transparent blur-2xl" />
      <Carte className="overflow-hidden shadow-xl shadow-jub-vert-900/10">
        <div className="bg-jub-vert-950 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <span className="font-semibold tracking-wide">Certificat JUB Campus</span>
            <Insigne ton="jaune">VALIDE</Insigne>
          </div>
          <p className="mt-1 text-xs text-jub-vert-200 font-mono">JUB-2026-UGB-7K4M9P</p>
        </div>
        <CorpsCarte className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-texte-discret">Décerné à</p>
            <p className="text-xl font-semibold">Aïssatou Diop</p>
            <p className="text-sm text-texte-discret">M1 Informatique · UGB Saint-Louis</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs uppercase tracking-wider text-texte-discret">Projet</p>
            <p className="text-sm font-medium">Refonte de la billetterie en ligne — Sonatel</p>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-2">
            <BlocStat libelle="Score" valeur="8,7/10" />
            <BlocStat libelle="Durée" valeur="6 sem." />
            <BlocStat libelle="Rôle" valeur="Dev front" />
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <Insigne ton="vert">Next.js</Insigne>
            <Insigne ton="vert">TypeScript</Insigne>
            <Insigne ton="vert">UI/UX</Insigne>
          </div>
          <div className="flex items-center justify-between border-t border-bordure pt-4">
            <span className="text-xs text-texte-discret">Vérifier sur jubcampus.sn/v/...</span>
            <div className="h-12 w-12 rounded-md bg-[conic-gradient(at_top_left,_var(--jub-vert-950),_var(--jub-vert-700))]" />
          </div>
        </CorpsCarte>
      </Carte>
    </div>
  );
}

function BlocStat({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <div className="rounded-md bg-jub-pierre-100 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-texte-discret">{libelle}</p>
      <p className="text-sm font-semibold">{valeur}</p>
    </div>
  );
}

function BandeauChiffres() {
  const chiffres = [
    { valeur: "1", libelle: "université pilote (UGB)" },
    { valeur: "7+", libelle: "universités prévues an 1" },
    { valeur: "100%", libelle: "gratuit étudiants" },
    { valeur: "QR", libelle: "vérification publique" },
  ];
  return (
    <section className="border-b border-bordure bg-fond-eleve">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 sm:px-6">
        {chiffres.map((c) => (
          <div key={c.libelle} className="text-center sm:text-left">
            <p className="text-3xl font-bold text-jub-vert-900">{c.valeur}</p>
            <p className="text-sm text-texte-discret">{c.libelle}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionTroisPublics() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="mb-12 max-w-2xl">
        <Insigne ton="vert">Pour qui ?</Insigne>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Trois publics. Une même promesse.
        </h2>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <Carte>
          <CorpsCarte className="space-y-3">
            <Insigne ton="vert">Étudiants</Insigne>
            <TitreCarte>Prouve ce que tu sais faire.</TitreCarte>
            <DescriptionCarte>
              Travaille sur des projets concrets, sois encadré par des pros, obtiens
              des certificats vérifiables et un portfolio public partageable sur LinkedIn.
            </DescriptionCarte>
            <Link href="/inscription/etudiant" className="inline-block text-sm font-medium text-jub-vert-700 hover:underline">
              Commencer →
            </Link>
          </CorpsCarte>
        </Carte>
        <Carte>
          <CorpsCarte className="space-y-3">
            <Insigne ton="violet">Entreprises</Insigne>
            <TitreCarte>Sourcer mieux, recruter sûr.</TitreCarte>
            <DescriptionCarte>
              Publie un projet, vois les étudiants travailler en conditions réelles,
              choisis tes futurs talents sur preuves — pas sur CV.
            </DescriptionCarte>
            <Link href="/entreprises" className="inline-block text-sm font-medium text-jub-vert-700 hover:underline">
              Découvrir →
            </Link>
          </CorpsCarte>
        </Carte>
        <Carte>
          <CorpsCarte className="space-y-3">
            <Insigne ton="bleu">Professeurs & mentors</Insigne>
            <TitreCarte>Forme par la pratique.</TitreCarte>
            <DescriptionCarte>
              Propose un projet, encadre une équipe, valide les compétences. Tes
              recommandations comptent dans le score JUB de l&apos;étudiant.
            </DescriptionCarte>
            <Link href="/inscription/mentor" className="inline-block text-sm font-medium text-jub-vert-700 hover:underline">
              Rejoindre →
            </Link>
          </CorpsCarte>
        </Carte>
      </div>
    </section>
  );
}

function SectionFonctionnement() {
  const etapes = [
    { num: "01", titre: "Crée ton profil", desc: "Université, niveau, compétences, objectifs. Cinq minutes." },
    { num: "02", titre: "Postule à un projet", desc: "Catalogue filtré par domaine, niveau, durée, mode de rémunération." },
    { num: "03", titre: "Rejoins l'équipe", desc: "Espace projet avec kanban tâches, livrables, feedback du mentor." },
    { num: "04", titre: "Reçois ton certificat", desc: "PDF + QR code vérifiable publiquement. Portfolio mis à jour automatiquement." },
  ];
  return (
    <section className="border-y border-bordure bg-fond-eleve py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 max-w-2xl">
          <Insigne ton="vert">Comment ça marche</Insigne>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            De la candidature au certificat, en quatre temps.
          </h2>
        </div>
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {etapes.map((e) => (
            <li key={e.num}>
              <Carte className="h-full">
                <CorpsCarte className="space-y-2">
                  <span className="font-mono text-3xl font-bold text-jub-vert-700">{e.num}</span>
                  <TitreCarte className="text-base">{e.titre}</TitreCarte>
                  <DescriptionCarte>{e.desc}</DescriptionCarte>
                </CorpsCarte>
              </Carte>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function SectionTypesProjets() {
  const types = [
    { tag: "APPRENTISSAGE", titre: "Apprentissage certifiant", desc: "Court, encadré, certifié. L'option idéale pour démarrer." },
    { tag: "PRIME", titre: "Avec prime", desc: "Récompense forfaitaire à la fin si le projet est livré." },
    { tag: "REMUNERE", titre: "Rémunéré", desc: "Payé par une entreprise. Pour projets à forte valeur ajoutée." },
    { tag: "SPONSORISE", titre: "Sponsorisé", desc: "Financé par une ONG, institution ou fondation thématique." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="mb-12 max-w-2xl">
        <Insigne ton="vert">Quatre modes</Insigne>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Pas tous les projets se valent. Et c&apos;est tant mieux.
        </h2>
        <p className="mt-3 text-texte-discret">
          La rémunération est transparente sur chaque projet. Aucun étudiant ne paie jamais JUB Campus.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {types.map((t) => (
          <Carte key={t.tag}>
            <CorpsCarte className="space-y-3">
              <Insigne ton={
                t.tag === "APPRENTISSAGE" ? "vert" :
                t.tag === "PRIME" ? "jaune" :
                t.tag === "REMUNERE" ? "violet" : "bleu"
              }>{t.tag}</Insigne>
              <TitreCarte className="text-base">{t.titre}</TitreCarte>
              <DescriptionCarte>{t.desc}</DescriptionCarte>
            </CorpsCarte>
          </Carte>
        ))}
      </div>
    </section>
  );
}

function SectionTemoignages() {
  return (
    <section className="border-t border-bordure bg-fond-eleve py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Insigne ton="vert">Ils nous font confiance (bientôt)</Insigne>
        <h2 className="mt-3 mb-10 text-3xl font-bold tracking-tight sm:text-4xl">
          Les premiers partenaires de la cohorte pilote.
        </h2>
        <div className="grid grid-cols-2 gap-6 opacity-60 sm:grid-cols-4 lg:grid-cols-6">
          {["UGB", "Sonatel", "Wave", "Orange Digital Center", "Sococim", "Ministère ESRI"].map((p) => (
            <div key={p} className="flex h-14 items-center justify-center rounded-md border border-bordure bg-fond text-sm font-semibold tracking-tight text-jub-pierre-700">
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionAppelAction() {
  return (
    <section className="relative overflow-hidden bg-jub-vert-950 text-white">
      <div className="absolute inset-0 -z-10 opacity-30 [background:radial-gradient(circle_at_top_right,_var(--jub-jaune-500),_transparent_50%)]" />
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ton prochain projet t&apos;attend.
        </h2>
        <p className="mt-3 text-jub-vert-100">
          Crée ton compte gratuit, ajoute tes compétences, postule au premier projet
          qui te parle.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/inscription/etudiant">
            <Bouton apparence="accent" taille="lg">Je crée mon compte</Bouton>
          </Link>
          <Link href="/projets">
            <Bouton apparence="contour" taille="lg" className="border-white/30 bg-transparent text-white hover:bg-white/10">Voir les projets</Bouton>
          </Link>
        </div>
      </div>
    </section>
  );
}
