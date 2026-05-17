// Mes certificats — liste des certificats de l'étudiant.

import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck, ChevronRight, Download } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Insigne } from "@/composants/ui/insigne";
import { formaterDate } from "@/lib/utils";

export const metadata = { title: "Mes certificats" };
export const dynamic = "force-dynamic";

export default async function PageMesCertificats() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const etudiant = await prisma.etudiant.findUnique({
    where: { utilisateurId: session.user.id },
    select: {
      certificats: {
        orderBy: { emisLe: "desc" },
        select: {
          id: true, numeroPublic: true, scoreFinal: true, statut: true, emisLe: true,
          organisationNom: true,
          projet: { select: { titre: true } },
        },
      },
    },
  });

  const certificats = etudiant?.certificats ?? [];

  return (
    <main className="fadein mx-auto max-w-[800px] px-5 pb-8 pt-2">
      <header className="mb-6">
        <h1 className="m-0 text-[clamp(1.5rem,3.5vw,2rem)] font-semibold tracking-tight">
          Mes certificats
        </h1>
        <p className="t-small mt-1">
          {certificats.length} certificat{certificats.length > 1 ? "s" : ""} obtenu
          {certificats.length > 1 ? "s" : ""}.
        </p>
      </header>

      {certificats.length === 0 ? (
        <div className="carte p-12 text-center">
          <ShieldCheck size={28} className="mx-auto text-sage-400" />
          <p className="t-small mt-3 mb-0">
            Pas encore de certificat. Termine un job pour en décrocher un.
          </p>
        </div>
      ) : (
        <div className="grid gap-px overflow-hidden rounded-[14px] border border-bordure bg-bordure">
          {certificats.map((c) => (
            <article key={c.id} className="bg-fond-eleve p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-sage-700 text-orange-400">
                  <ShieldCheck size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[15px] font-semibold">{c.projet.titre}</div>
                  <div className="t-xs t-discret mt-0.5 truncate">
                    {c.organisationNom ?? "JUB Campus"} · émis le {formaterDate(c.emisLe)}
                  </div>
                  <div className="t-xs t-discret mt-1 break-all font-mono">{c.numeroPublic}</div>
                </div>
                <Insigne ton={c.statut === "VALIDE" ? "vert" : "rouge"}>
                  {c.statut === "VALIDE" ? "Valide" : c.statut.toLowerCase()}
                </Insigne>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-bordure pt-3">
                <span className="text-[13px] font-bold text-orange-700">
                  Score {c.scoreFinal.toFixed(1).replace(".", ",")}/10
                </span>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/v/${c.numeroPublic}`} className="btn btn--contour btn--sm">
                    Vérifier <ChevronRight size={13} />
                  </Link>
                  <a
                    href={`/api/certificats/${c.numeroPublic}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--primaire btn--sm"
                  >
                    <Download size={13} /> PDF
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
