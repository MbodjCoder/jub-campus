import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard, FolderPlus, Inbox, Users, BarChart3, Settings,
} from "lucide-react";
import { auth } from "@/auth";
import { MenuUtilisateur } from "@/composants/site/menu-utilisateur";

const liens = [
  { libelle: "Tableau de bord", href: "/entreprise",            icone: LayoutDashboard },
  { libelle: "Publier un projet", href: "/entreprise/publier",  icone: FolderPlus },
  { libelle: "Candidatures",     href: "/entreprise/candidatures", icone: Inbox },
  { libelle: "Talents",          href: "/entreprise/talents",     icone: Users },
  { libelle: "Statistiques",     href: "/entreprise/statistiques", icone: BarChart3 },
  { libelle: "Paramètres",       href: "/entreprise/parametres",  icone: Settings },
];

export default async function MiseEntreprise({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion?suivant=/entreprise");
  if (session.user.role !== "ENTREPRISE" && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const infos = {
    id: session.user.id,
    nom: session.user.name ?? null,
    email: session.user.email ?? null,
    image: session.user.image ?? null,
    role: session.user.role,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-bordure bg-fond-eleve/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/entreprise" className="flex items-center gap-2.5">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-jub-orange-500 shadow-sm shadow-jub-orange-500/30">
              <span className="block h-2.5 w-2.5 rounded-full bg-jub-sage-500" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-jub-orange-500">JUB</span>
            <span className="text-sm font-semibold text-jub-sage-700">Campus</span>
            <span className="ml-1 hidden text-xs text-texte-discret sm:inline">· Entreprise</span>
          </Link>
          <MenuUtilisateur session={infos} />
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-6 sm:px-6">
        <aside className="hidden w-60 shrink-0 lg:block">
          <nav className="sticky top-20 space-y-1 text-sm">
            {liens.map((l) => {
              const Icone = l.icone;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-texte-discret transition-colors hover:bg-jub-orange-50 hover:text-jub-orange-700"
                >
                  <Icone className="h-4 w-4" /> {l.libelle}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
