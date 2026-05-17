import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ControlesParametres } from "@/composants/parametres/controles-etudiant";

export const metadata = { title: "Paramètres" };
export const dynamic = "force-dynamic";

export default async function PageParametres() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const etudiant = await prisma.etudiant.findUnique({
    where: { utilisateurId: session.user.id },
    select: { estPublic: true },
  });

  return (
    <main className="mx-auto max-w-2xl px-5 py-2">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-texte-discret">Sécurité, visibilité, compte.</p>
      </header>
      <ControlesParametres estPublic={etudiant?.estPublic ?? true} />
    </main>
  );
}
