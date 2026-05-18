import { auth } from "@/auth";
import { imageProfil } from "@/lib/avatar";
import { EnTeteSite } from "@/composants/site/en-tete";
import { PiedSite } from "@/composants/site/pied";

export default async function MisePublique({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const infos = session?.user?.id
    ? {
        id: session.user.id,
        nom: session.user.name ?? null,
        email: session.user.email ?? null,
        image: await imageProfil(session.user.id),
        role: session.user.role,
      }
    : null;

  return (
    <>
      <EnTeteSite session={infos} />
      <main className="flex-1">{children}</main>
      <PiedSite />
    </>
  );
}
