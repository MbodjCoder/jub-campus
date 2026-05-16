import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Carte, CorpsCarte } from "@/composants/ui/carte";
import { formaterDate } from "@/lib/utils";

export const metadata = { title: "Notifications" };

export default async function PageNotifications() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const notifications = await prisma.notification.findMany({
    where: { destinataireId: session.user.id },
    orderBy: { creeLe: "desc" },
    take: 100,
  });

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <p className="text-texte-discret">{notifications.length} message(s).</p>
      </header>

      {notifications.length === 0 ? (
        <Carte>
          <CorpsCarte className="text-center py-12 text-texte-discret">
            Aucune notification pour l&apos;instant.
          </CorpsCarte>
        </Carte>
      ) : (
        <Carte>
          <CorpsCarte className="divide-y divide-bordure p-0">
            {notifications.map((n) => (
              <div key={n.id} className={`p-4 ${n.lue ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{n.titre}</p>
                    <p className="mt-1 text-sm text-texte-discret">{n.contenu}</p>
                  </div>
                  <span className="text-xs text-texte-discret whitespace-nowrap">{formaterDate(n.creeLe)}</span>
                </div>
              </div>
            ))}
          </CorpsCarte>
        </Carte>
      )}
    </>
  );
}
