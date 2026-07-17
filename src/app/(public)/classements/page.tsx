// Classements — top étudiants par score JUB (national + par université).

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Avatar } from "@/composants/ui/avatar";
import { Icon } from "@/composants/maquette/icones";

export const metadata = {
  title: "Classements",
  description: "Top étudiants JUB Campus par score, national et par université.",
};
export const dynamic = "force-dynamic";

type Params = Promise<{ universite?: string }>;

export default async function PageClassements({ searchParams }: { searchParams: Params }) {
  const sp = await searchParams;
  const filtreUniv = sp.universite ?? "";

  const [universites, etudiants] = await Promise.all([
    prisma.universite.findMany({ orderBy: { acronyme: "asc" }, select: { id: true, acronyme: true } }),
    prisma.etudiant.findMany({
      where: {
        estPublic: true,
        scoreJub: { gt: 0 },
        ...(filtreUniv ? { universite: { acronyme: filtreUniv } } : {}),
      },
      orderBy: { scoreJub: "desc" },
      take: 50,
      select: {
        slug: true, prenom: true, nom: true, scoreJub: true, avatarUrl: true, niveau: true,
        universite: { select: { acronyme: true } },
        _count: { select: { certificats: true } },
      },
    }),
  ]);

  return (
    <main className="fadein mx-auto max-w-[760px] px-5 pb-16 pt-8">
      <h1 className="m-0 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-[-0.025em]">
        Classements
      </h1>
      <p className="t-small mt-1.5">
        Les étudiants qui prouvent le plus, par score JUB cumulé.
      </p>

      {/* Filtre université */}
      <div className="mt-5 flex flex-wrap gap-1.5">
        <Filtre href="/classements" actif={!filtreUniv} libelle="National" />
        {universites.map((u) => (
          <Filtre
            key={u.id}
            href={`/classements?universite=${u.acronyme}`}
            actif={filtreUniv === u.acronyme}
            libelle={u.acronyme}
          />
        ))}
      </div>

      {etudiants.length === 0 ? (
        <div className="carte mt-6 p-12 text-center">
          <p className="t-small m-0">
            Aucun étudiant classé pour l&apos;instant. Les scores montent avec les premiers projets livrés.
          </p>
        </div>
      ) : (
        <div className="liste-bordee mt-6">
          {etudiants.map((e, i) => (
            <Link
              key={e.slug}
              href={`/u/${e.slug}`}
              className="flex items-center gap-3.5 bg-fond-eleve px-4 py-3 no-underline text-inherit hover:bg-white"
            >
              <span
                className={
                  i < 3
                    ? "t-display w-7 text-center text-base font-bold text-orange-600"
                    : "w-7 text-center text-[13px] font-bold text-sage-400"
                }
              >
                {i + 1}
              </span>
              <Avatar nom={`${e.prenom} ${e.nom}`} src={e.avatarUrl} taille={36} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">
                  {e.prenom} {e.nom}
                </div>
                <div className="t-xs t-discret">
                  {e.universite.acronyme} · {e.niveau} · {e._count.certificats} certificat
                  {e._count.certificats > 1 ? "s" : ""}
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-sage-900">
                <Icon.TrendingUp size={13} className="text-orange-500" />
                {e.scoreJub}
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

function Filtre({ href, actif, libelle }: { href: string; actif: boolean; libelle: string }) {
  return (
    <Link
      href={href}
      className={actif ? "filtre-jeton filtre-jeton--actif no-underline" : "filtre-jeton no-underline"}
    >
      {libelle}
    </Link>
  );
}
