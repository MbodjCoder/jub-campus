import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard, Building2, FolderKanban, Award, AlertTriangle, Users, FileText,
} from "lucide-react";
import { auth } from "@/auth";

const liens = [
  { libelle: "Vue d'ensemble", href: "/admin",                icone: LayoutDashboard },
  { libelle: "Utilisateurs",   href: "/admin/utilisateurs",   icone: Users },
  { libelle: "Entreprises",    href: "/admin/entreprises",    icone: Building2 },
  { libelle: "Projets",        href: "/admin/projets",        icone: FolderKanban },
  { libelle: "Certificats",    href: "/admin/certificats",    icone: Award },
  { libelle: "Signalements",   href: "/admin/signalements",   icone: AlertTriangle },
  { libelle: "Journal d'audit", href: "/admin/journal",       icone: FileText },
];

export default async function MiseAdmin({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") redirect("/");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-bordure bg-jub-sage-900 text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-jub-orange-500 shadow-sm">
              <span className="block h-2.5 w-2.5 rounded-full bg-jub-sage-500" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-jub-orange-500">JUB</span>
            <span className="text-sm font-semibold text-jub-sage-100">Campus · Administration</span>
          </Link>
          <Link href="/" className="text-xs text-jub-sage-100 hover:text-jub-orange-500">
            Quitter l&apos;admin →
          </Link>
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
