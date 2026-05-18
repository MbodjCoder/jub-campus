import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { imageProfil } from "@/lib/avatar";
import { CoquilleDashboard } from "@/composants/site/coquille-dashboard";
import { obtenirRecentes, compterNonLues } from "@/domaine/notifications";

export default async function MiseAdmin({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion?suivant=/admin");
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") redirect("/");

  const [recentes, nbNonLues] = await Promise.all([
    obtenirRecentes(session.user.id, 8),
    compterNonLues(session.user.id),
  ]);

  return (
    <CoquilleDashboard
      variante="admin"
      session={{
        id: session.user.id,
        nom: session.user.name ?? null,
        email: session.user.email ?? null,
        image: await imageProfil(session.user.id),
        role: session.user.role,
      }}
      notifications={recentes}
      nbNonLues={nbNonLues}
    >
      {children}
    </CoquilleDashboard>
  );
}
