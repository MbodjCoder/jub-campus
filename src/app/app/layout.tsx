import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard, Sparkles, Inbox, FolderKanban, FlaskConical,
  Award, BadgeCheck, ExternalLink, User, Bell,
} from "lucide-react";
import { auth } from "@/auth";
import { MenuUtilisateur } from "@/composants/site/menu-utilisateur";

const liens = [
  { libelle: "Tableau de bord",      href: "/app",                    icone: LayoutDashboard },
  { libelle: "Projets recommandés",  href: "/app/projets-recommandes",icone: Sparkles },
  { libelle: "Mes candidatures",     href: "/app/candidatures",       icone: Inbox },
  { libelle: "Mes projets",          href: "/app/mes-projets",        icone: FolderKanban },
  { libelle: "Espace projet démo",   href: "/app/projet-demo",        icone: FlaskConical },
  { libelle: "Mes certificats",      href: "/app/certificats",        icone: Award },
  { libelle: "Mes compétences",      href: "/app/competences",        icone: BadgeCheck },
  { libelle: "Mon portfolio",        href: "/app/portfolio",          icone: ExternalLink },
  { libelle: "Profil",               href: "/app/profil",             icone: User },
];

export default async function MiseEtudiant({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion?suivant=/app");
  // Permet à un mentor / entreprise / admin de visiter par curiosité,
  // mais redirige vers leur espace principal pour la cohérence.
  if (session.user.role !== "ETUDIANT" && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
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
          <Link href="/app" className="flex items-center gap-2.5">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-jub-orange-500 shadow-sm shadow-jub-orange-500/30">
              <span className="block h-2.5 w-2.5 rounded-full bg-jub-sage-500" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-jub-orange-500">JUB</span>
            <span className="text-sm font-semibold text-jub-sage-700">Campus</span>
            <span className="ml-1 hidden text-xs text-texte-discret sm:inline">· Étudiant</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/app/notifications"
              className="hidden h-9 w-9 items-center justify-center rounded-full text-jub-sage-700 transition-colors hover:bg-jub-orange-50 hover:text-jub-orange-700 sm:inline-flex"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </Link>
            <MenuUtilisateur session={infos} />
          </div>
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
                  <Icone className="h-4 w-4" />
                  {l.libelle}
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
