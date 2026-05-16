import Link from "next/link";
import { NavApp } from "@/composants/app/nav-app";

const liens = [
  { libelle: "Tableau de bord", href: "/app" },
  { libelle: "Projets recommandés", href: "/app/projets-recommandes" },
  { libelle: "Mes candidatures", href: "/app/candidatures" },
  { libelle: "Mes projets", href: "/app/mes-projets" },
  { libelle: "Mes certificats", href: "/app/certificats" },
  { libelle: "Mon portfolio", href: "/app/portfolio" },
  { libelle: "Profil", href: "/app/profil" },
];

export default function MiseEtudiant({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-bordure bg-fond-eleve/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/app" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-jub-vert-900 text-white font-bold">J</span>
            <span className="font-semibold tracking-tight">JUB Campus</span>
            <span className="hidden sm:inline text-xs text-texte-discret">· Étudiant</span>
          </Link>
          <NavApp />
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-6 sm:px-6">
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-20 space-y-1 text-sm">
            {liens.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block rounded-md px-3 py-2 text-texte-discret hover:bg-jub-pierre-100 hover:text-texte"
              >
                {l.libelle}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
