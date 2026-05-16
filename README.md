# JUB Campus

> Plateforme sénégalaise de **stages par projets, certification vérifiable et insertion professionnelle** pour étudiants.
> Lancement pilote à l&apos;Université Gaston Berger (Saint-Louis), puis expansion nationale (UCAD, UADB, UASZ, UIDT, USSEIN, UVS, …).

## Promesse

*« Même sans réseau et sans stage classique, chaque étudiant peut acquérir une expérience réelle, prouver ses compétences et accéder à de meilleures opportunités. »*

## Stack technique

| Couche | Choix |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + Turbopack |
| Styling | Tailwind CSS 4 (composants maison, sans shadcn) |
| Auth | Auth.js v5 (à câbler — Credentials + Google) |
| ORM / DB | Prisma 7 (`prisma-client` ESM) + PostgreSQL via adaptateur `@prisma/adapter-pg` |
| Stockage | Supabase Storage prévu (livrables + certificats) |
| Email | Resend |
| Génération PDF | `@react-pdf/renderer` + `qrcode` |
| Validation | Zod 4 |
| Mots de passe | bcryptjs |

## Conventions

- **Tout en français** : variables, fichiers, composants, énumérations Prisma, libellés UI.
  Ex : `CarteProjet`, `formaterMontantFcfa`, `StatutCandidature.ACCEPTEE`.
- **Pas d&apos;emojis** dans le code/UI sauf demande explicite.
- **Pas de mocks ni TODO laissés**. Commentaires = pourquoi, pas quoi.
- **Mobile-first** strict. Performance critique (audiences sur 3G/4G).

## Structure du projet

```
jub-campus/
├─ prisma/
│  ├─ schema.prisma           Schéma complet (40+ modèles)
│  └─ seed/index.ts            Universités, compétences, badges
├─ src/
│  ├─ app/
│  │  ├─ (public)/            Routes publiques avec header/footer (landing, projets, …)
│  │  ├─ app/                  Espace étudiant
│  │  ├─ entreprise/           Espace entreprise
│  │  ├─ admin/                Espace admin
│  │  ├─ v/[numero]/           Vérification publique certificat
│  │  ├─ u/[slug]/             Portfolio public étudiant
│  │  ├─ layout.tsx
│  │  └─ globals.css
│  ├─ composants/
│  │  ├─ ui/                   Primitives (Bouton, Champ, Carte, Insigne, …)
│  │  ├─ site/                 Header / Footer publics
│  │  └─ app/                  Composants protégés
│  ├─ domaine/                 Logique métier pure (certificats, score, …)
│  ├─ lib/
│  │  ├─ prisma.ts             Singleton Prisma + adaptateur pg
│  │  ├─ utils.ts              Formatters FR (FCFA, dates, slug, …)
│  │  └─ constantes.ts         Libellés énumérations + référentiel universités
│  └─ generated/prisma/        Client Prisma généré (gitignored)
└─ prisma.config.ts
```

## Démarrage

```powershell
# 1. Dépendances
pnpm install

# 2. Variables d'environnement
cp .env.example .env.local
# Renseigner au minimum DATABASE_URL et AUTH_SECRET

# 3. Base de données (Postgres local OU Neon)
pnpm bdd:generer        # générer le client Prisma
pnpm bdd:migrer         # appliquer le schéma
pnpm bdd:semer          # universités + compétences + badges

# 4. Lancer
pnpm dev                # http://localhost:3000
```

## Scripts utiles

| Commande | Effet |
|---|---|
| `pnpm dev` | Serveur de dev (Turbopack) sur 3000 |
| `pnpm build` | Build production |
| `pnpm typecheck` | Vérification TS sans émission |
| `pnpm bdd:generer` | Régénérer le client Prisma |
| `pnpm bdd:migrer` | Créer/appliquer une migration |
| `pnpm bdd:semer` | Re-peupler les données de référence |
| `pnpm bdd:studio` | Ouvrir Prisma Studio |

## Système de certification

Chaque certificat possède :

- un **numéro public** lisible : `JUB-{annee}-{acronyme-univ}-{nanoid8}` (sans 0/O/1/I/L) ;
- un **hash d&apos;intégrité SHA-256** des champs critiques (anti-falsification) ;
- une **page publique** `/v/{numero}` accessible sans compte ;
- un **PDF + QR code** pointant vers la page publique ;
- un **journal d&apos;audit** de chaque vérification.

Voir `src/domaine/certificats.ts` et `src/app/v/[numero]/page.tsx`.

## Roadmap MVP (12 sprints)

- [x] Sprint 0 — Setup repo, design tokens, UI primitives, schéma Prisma
- [x] Sprint 1 — Landing publique, pages inscription/connexion (formulaires)
- [x] Sprint 2 — Catalogue projets + détail (démo statique), portfolio public, vérification certificat
- [ ] Sprint 3 — Câbler Auth.js v5 + middleware RBAC + flows réels d&apos;inscription
- [ ] Sprint 4 — Espace projet (kanban tâches + livrables + feedback)
- [ ] Sprint 5 — Système d&apos;évaluation multi-source + génération PDF + QR
- [ ] Sprint 6 — Notifications email Resend + tableaux de bord temps réel
- [ ] Sprint 7 — Modération admin + signalements + journal d&apos;audit
- [ ] Sprint 8 — Matching règles → IA, score JUB, classements
- [ ] Sprint 9 — Programmes sponsorisés + paiements Wave/OM
- [ ] Sprint 10 — Audit a11y, perf 3G, tests E2E Playwright
- [ ] Sprint 11 — Beta UGB (5 projets pilotes)
- [ ] Sprint 12 — Lancement public cohorte 1

## Licence

Code propriétaire. JUB Campus © 2026.
