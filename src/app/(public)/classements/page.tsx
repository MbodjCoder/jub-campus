// Classements — top étudiants par score JUB (national + par université).

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Avatar } from "@/composants/maquette/primitifs";
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
    <main className="fadein" style={{ padding: "32px 20px 64px", maxWidth: 760, margin: "0 auto" }}>
      <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 600, letterSpacing: "-0.025em", margin: 0 }}>
        Classements
      </h1>
      <p className="t-small" style={{ marginTop: 6 }}>
        Les étudiants qui prouvent le plus, par score JUB cumulé.
      </p>

      {/* Filtre université */}
      <div style={{ marginTop: 20, display: "flex", gap: 6, flexWrap: "wrap" }}>
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
        <div className="carte" style={{ marginTop: 24, padding: 48, textAlign: "center" }}>
          <p className="t-small" style={{ margin: 0 }}>
            Aucun étudiant classé pour l&apos;instant. Les scores montent avec les premiers projets livrés.
          </p>
        </div>
      ) : (
        <div
          style={{
            marginTop: 24,
            display: "grid",
            gap: 1,
            background: "var(--bordure)",
            border: "1px solid var(--bordure)",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          {etudiants.map((e, i) => (
            <Link
              key={e.slug}
              href={`/u/${e.slug}`}
              style={{
                background: "var(--fond-eleve)",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <span
                style={{
                  width: 28,
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: i < 3 ? 16 : 13,
                  fontFamily: i < 3 ? "var(--fonte-display)" : "inherit",
                  fontStyle: i < 3 ? "italic" : "normal",
                  color: i < 3 ? "var(--orange-600)" : "var(--sage-400)",
                }}
              >
                {i + 1}
              </span>
              <Avatar nom={`${e.prenom} ${e.nom}`} src={e.avatarUrl} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {e.prenom} {e.nom}
                </div>
                <div className="t-xs t-discret">
                  {e.universite.acronyme} · {e.niveau} · {e._count.certificats} certificat
                  {e._count.certificats > 1 ? "s" : ""}
                </div>
              </div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--sage-900)",
                }}
              >
                <Icon.TrendingUp size={13} style={{ color: "var(--orange-500)" }} />
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
      style={{
        padding: "6px 12px",
        borderRadius: 999,
        fontSize: 12.5,
        fontWeight: 600,
        background: actif ? "var(--sage-700)" : "transparent",
        color: actif ? "white" : "var(--sage-700)",
        border: "1px solid " + (actif ? "var(--sage-700)" : "var(--bordure)"),
      }}
    >
      {libelle}
    </Link>
  );
}
