import Link from "next/link";
import Image from "next/image";
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
    <section className="relative -mt-16 flex min-h-[88vh] items-center overflow-hidden pt-16">
      <Image
        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2400&q=85"
        alt="Étudiants travaillant en équipe"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-jub-vert-950/90 via-jub-vert-950/65 to-jub-vert-950/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-jub-vert-950/60 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-2xl space-y-7 text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-jub-jaune-400" />
            Pilote UGB Saint-Louis · Phase 1
          </span>

          <h1 className="text-[clamp(2.5rem,6vw,4.75rem)] font-bold leading-[1.05] tracking-tight">
            L&apos;expérience pro<br />
            <span className="bg-gradient-to-r from-jub-jaune-400 to-jub-jaune-500 bg-clip-text text-transparent">
              qui change tout.
            </span>
          </h1>

          <p className="max-w-xl text-lg text-white/85 sm:text-xl">
            Même sans réseau et sans stage classique, travaille sur de vrais projets,
            prouve tes compétences avec des certificats vérifiables et accède aux
            entreprises qui te cherchent.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/inscription/etudiant">
              <Bouton apparence="accent" taille="lg" className="shadow-2xl shadow-jub-jaune-500/30">
                Commencer gratuitement →
              </Bouton>
            </Link>
            <Link href="/comment-ca-marche">
              <Bouton
                apparence="contour"
                taille="lg"
                className="border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
              >
                Voir comment ça marche
              </Bouton>
            </Link>
          </div>

          <ul className="grid max-w-xl grid-cols-2 gap-x-6 gap-y-2 pt-4 text-sm text-white/75">
            <li className="flex items-center gap-2"><Pastille /> 100% gratuit étudiants</li>
            <li className="flex items-center gap-2"><Pastille /> Certificats QR vérifiables</li>
            <li className="flex items-center gap-2"><Pastille /> Portfolio public partageable</li>
            <li className="flex items-center gap-2"><Pastille /> Mentorat intégré</li>
          </ul>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:block">
        <div className="flex flex-col items-center gap-1 text-white/60 animate-pulse">
          <span className="text-[10px] uppercase tracking-widest">Découvrir</span>
          <span className="text-xl">↓</span>
        </div>
      </div>
    </section>
  );
}

function Pastille() {
  return <span className="inline-block h-1.5 w-1.5 rounded-full bg-jub-jaune-400" />;
}

function BandeauChiffres() {
  const chiffres = [
    { valeur: "1", libelle: "université pilote (UGB)" },
    { valeur: "7+", libelle: "universités prévues an 1" },
    { valeur: "100%", libelle: "gratuit étudiants" },
    { valeur: "QR", libelle: "vérification publique" },
  ];
  return (
    <section className="relative z-10 -mt-12 px-4 sm:px-6">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 rounded-2xl border border-bordure bg-fond-eleve p-6 shadow-xl shadow-jub-vert-950/5 sm:grid-cols-4 sm:gap-6 sm:p-8">
        {chiffres.map((c) => (
          <div key={c.libelle} className="text-center sm:text-left">
            <p className="text-3xl font-bold tracking-tight text-jub-vert-900 sm:text-4xl">{c.valeur}</p>
            <p className="mt-1 text-xs text-texte-discret sm:text-sm">{c.libelle}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionTroisPublics() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="mb-14 max-w-2xl">
        <Insigne ton="vert">Pour qui ?</Insigne>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Trois publics. Une même promesse.
        </h2>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <CarteRole
          ton="vert"
          tag="Étudiants"
          titre="Prouve ce que tu sais faire."
          desc="Travaille sur des projets concrets, sois encadré par des pros, obtiens des certificats vérifiables et un portfolio public partageable sur LinkedIn."
          href="/inscription/etudiant"
          libelleLien="Commencer"
        />
        <CarteRole
          ton="violet"
          tag="Entreprises"
          titre="Sourcer mieux, recruter sûr."
          desc="Publie un projet, vois les étudiants travailler en conditions réelles, choisis tes futurs talents sur preuves — pas sur CV."
          href="/entreprises"
          libelleLien="Découvrir"
        />
        <CarteRole
          ton="bleu"
          tag="Professeurs & mentors"
          titre="Forme par la pratique."
          desc="Propose un projet, encadre une équipe, valide les compétences. Tes recommandations comptent dans le score JUB de l'étudiant."
          href="/inscription/mentor"
          libelleLien="Rejoindre"
        />
      </div>
    </section>
  );
}

function CarteRole({
  ton, tag, titre, desc, href, libelleLien,
}: {
  ton: "vert" | "violet" | "bleu";
  tag: string;
  titre: string;
  desc: string;
  href: string;
  libelleLien: string;
}) {
  return (
    <Link href={href} className="group block">
      <Carte className="h-full transition-all group-hover:-translate-y-1 group-hover:border-jub-vert-500 group-hover:shadow-xl group-hover:shadow-jub-vert-900/10">
        <CorpsCarte className="space-y-3">
          <Insigne ton={ton}>{tag}</Insigne>
          <TitreCarte>{titre}</TitreCarte>
          <DescriptionCarte>{desc}</DescriptionCarte>
          <span className="inline-block pt-2 text-sm font-medium text-jub-vert-700 group-hover:underline">
            {libelleLien} →
          </span>
        </CorpsCarte>
      </Carte>
    </Link>
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
    <section className="border-y border-bordure bg-fond-eleve py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-14 max-w-2xl">
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
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="mb-14 max-w-2xl">
        <Insigne ton="vert">Quatre modes</Insigne>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Tous les projets ne se valent pas. Et c&apos;est tant mieux.
        </h2>
        <p className="mt-3 text-texte-discret">
          La rémunération est transparente sur chaque projet. Aucun étudiant ne paie jamais JUB Campus.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {types.map((t) => (
          <Carte key={t.tag}>
            <CorpsCarte className="space-y-3">
              <Insigne
                ton={
                  t.tag === "APPRENTISSAGE" ? "vert" :
                  t.tag === "PRIME" ? "jaune" :
                  t.tag === "REMUNERE" ? "violet" : "bleu"
                }
              >
                {t.tag}
              </Insigne>
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
    <section className="border-t border-bordure bg-fond-eleve py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Insigne ton="vert">Ils nous font confiance (bientôt)</Insigne>
        <h2 className="mt-3 mb-12 text-3xl font-bold tracking-tight sm:text-4xl">
          Les premiers partenaires de la cohorte pilote.
        </h2>
        <div className="grid grid-cols-2 gap-6 opacity-70 sm:grid-cols-3 lg:grid-cols-6">
          {["UGB", "Sonatel", "Wave", "Orange Digital", "Sococim", "Min. ESRI"].map((p) => (
            <div
              key={p}
              className="flex h-16 items-center justify-center rounded-lg border border-bordure bg-fond text-sm font-semibold tracking-tight text-jub-pierre-700"
            >
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
      <Image
        src="https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=2400&q=85"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-jub-vert-950 via-jub-vert-950/95 to-jub-vert-950/70" />
      <div className="absolute inset-0 -z-0 opacity-40 [background:radial-gradient(circle_at_top_right,_var(--jub-jaune-500),_transparent_60%)]" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Ton prochain projet t&apos;attend.
        </h2>
        <p className="mt-3 text-lg text-jub-vert-100">
          Crée ton compte gratuit, ajoute tes compétences, postule au premier projet qui te parle.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/inscription/etudiant">
            <Bouton apparence="accent" taille="lg" className="shadow-xl shadow-jub-jaune-500/30">
              Je crée mon compte
            </Bouton>
          </Link>
          <Link href="/projets">
            <Bouton
              apparence="contour"
              taille="lg"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
            >
              Voir les projets
            </Bouton>
          </Link>
        </div>
      </div>
    </section>
  );
}
