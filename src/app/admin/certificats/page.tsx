import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte, EnteteCarte, TitreCarte } from "@/composants/ui/carte";
import { Insigne } from "@/composants/ui/insigne";
import { Bouton } from "@/composants/ui/bouton";
import { Champ } from "@/composants/ui/champ";
import { revoquerCertificat } from "../actions";
import { formaterDate } from "@/lib/utils";

export const metadata = { title: "Admin · Certificats" };
export const dynamic = "force-dynamic";

export default async function PageAdminCertificats() {
  const certificats = await prisma.certificat.findMany({
    orderBy: { emisLe: "desc" },
    take: 50,
    include: { etudiant: true, projet: { select: { titre: true } } },
  });

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Certificats</h1>
        <p className="text-texte-discret">{certificats.length} dernier{certificats.length > 1 ? "s" : ""} certificat{certificats.length > 1 ? "s" : ""}.</p>
      </header>

      <div className="space-y-3">
        {certificats.length === 0 ? (
          <Carte><CorpsCarte className="text-center py-10 text-sm text-texte-discret">Aucun certificat émis.</CorpsCarte></Carte>
        ) : certificats.map((c) => (
          <Carte key={c.id}>
            <EnteteCarte className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-texte-discret">{c.numeroPublic}</p>
                <p className="font-medium">{c.etudiant.prenom} {c.etudiant.nom}</p>
                <p className="text-xs text-texte-discret">{c.projet.titre} · score {c.scoreFinal.toFixed(1)} · {formaterDate(c.emisLe)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Insigne ton={c.statut === "VALIDE" ? "vert" : "rouge"}>{c.statut}</Insigne>
                <Link href={`/v/${c.numeroPublic}`} target="_blank" className="text-xs text-jub-orange-600 hover:underline">Page publique →</Link>
              </div>
            </EnteteCarte>
            {c.statut === "VALIDE" ? (
              <CorpsCarte>
                <form action={revoquerCertificat} className="flex flex-wrap items-center gap-2">
                  <input type="hidden" name="certificatId" value={c.id} />
                  <Champ name="motif" placeholder="Motif de révocation" className="max-w-md" required />
                  <Bouton apparence="danger" type="submit">Révoquer</Bouton>
                </form>
              </CorpsCarte>
            ) : c.motifRevocation ? (
              <CorpsCarte className="text-xs italic text-red-700">Motif : {c.motifRevocation}</CorpsCarte>
            ) : null}
          </Carte>
        ))}
      </div>
    </>
  );
}
