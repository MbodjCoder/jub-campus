# JUB Campus — Plan de refonte « Agence opérée »

> Version 1.0 — 17 juillet 2026
> Pivot : de la marketplace de stages vers une **agence de services opérée par plateforme**
> (operated marketplace). Le client achète un livrable ; JUB orchestre, contrôle la qualité,
> livre, encaisse et reverse aux étudiants via mobile money.

---

## 1. Positionnement cible

**Ancienne promesse** (étudiant-centrée) : « Même sans réseau, chaque étudiant peut acquérir
une expérience réelle. » → personne ne paie.

**Nouvelle promesse** (client-centrée) :

> **« Des données fiables et des livrables vérifiés, produits par les meilleurs talents
> universitaires du Sénégal — collecte terrain, annotation IA, études. Vous payez le
> résultat, nous garantissons la qualité. »**

La promesse étudiante devient la conséquence : missions payées dès la première tâche
(Wave), certificat vérifiable à chaque mission, portfolio qui monte en valeur.

### Les deux verticales de lancement

| Verticale | Client type | Pourquoi maintenant |
|---|---|---|
| **Collecte terrain & enquêtes** (`ENQUETE_TERRAIN`) | ONG, agences UN, cabinets d'étude (People & Data, AfrikSurvey), projets Banque mondiale, MEAL | Besoin permanent d'enquêteurs fiables multilingues (français/wolof/pulaar) ; budgets réels ; recrutements d'enquêteurs constants au Sénégal |
| **Annotation & données IA** (`ANNOTATION_DONNEES`) | Labs IA, plateformes data (Scale/Outlier-like), projets langues africaines | Marché outils d'annotation : 3,07 Md$ (2026) → 12,42 Md$ (2031), CAGR 32 %. Google a lancé WAXAL (wolof « parler ») en février 2026 : la donnée en langues africaines est un axe stratégique mondial. Sama (Kenya) : ~750 M$ de revenu annuel avec ce modèle exact |

Troisième source (mois 9+) : **frais de placement** — une entreprise recrute un talent
prouvé par son historique de missions → success fee.

### Modèle économique

- Client paie JUB **au livrable** (devis mission).
- JUB reverse **60–70 %** aux étudiants via **Wave Payout API** (Bulk Pay : 50 paiements
  en un appel, 1 % de frais, pas d'abonnement) ; garde **30–40 %** de commission.
- Contrôleurs qualité (ex-mentors) payés sur la commission, au livrable validé.
- Contrats-cadres (volume annuel) pour ONG/instituts à partir du mois 3–6.

### Différenciation vs concurrence

- **Andela / Gebeya** : seniors tech, remote, panafricain → ne servent ni la collecte
  terrain locale ni les juniors. JUB = terrain + junior + Sénégal/Afrique de l'Ouest.
- **Cabinets d'étude locaux** : opèrent à la main, sans plateforme, sans preuve
  d'enquêteur vérifiable. JUB = plateforme (suivi temps réel client) + vivier certifié.
- **Kobo/ODK** : outils de collecte, pas de main-d'œuvre. JUB peut s'y intégrer
  (import des soumissions Kobo comme livrables) au lieu de les concurrencer.
- **Le certificat vérifiable** (numéro public + SHA-256 + QR + page `/v/`) devient la
  **garantie qualité côté client** (« qui a collecté ma donnée ? un enquêteur certifié,
  vérifiable en un scan ») — plus seulement un trophée étudiant.

---

## 2. Produit : trois faces

### 2.1 Face Client (nouvelle — remplace « Espace entreprise »)

Le client **ne gère ni candidatures, ni équipe, ni kanban**. Il voit :

1. **Brief** : formulaire guidé par verticale (enquête : zone, taille échantillon,
   questionnaire, langues, délai / annotation : type de données, volume, consignes,
   format d'export).
2. **Devis** : chiffré par l'équipe Ops (V1 manuel, V2 semi-automatique), accepté en ligne.
3. **Suivi mission** : barre de progression, jalons, échantillons de livrables validés,
   messagerie avec le chef de mission JUB uniquement.
4. **Livraison** : livrables finaux + **rapport de traçabilité** (qui a produit quoi,
   certificats des contributeurs, journal qualité).
5. **Facture & paiement** : virement, Wave Business, Stripe (clients internationaux).

Routes : `/client` (dashboard), `/client/brief/nouveau`, `/client/missions/[id]`,
`/client/factures`.

### 2.2 Face Talent (refonte de l'espace étudiant)

Le mot « stage » disparaît. Vocabulaire : **missions, gains, niveau**.

1. **Onboarding qualifiant** : inscription → test de qualification par verticale
   (mini-tâche notée : annotation d'essai, questionnaire test) → statut « Vérifié ».
2. **Fil de missions** : missions ouvertes triées par le matching existant
   ([matching.ts](../src/domaine/matching.ts)) ; candidature en 1 tap (le profil suffit,
   plus de lettre de motivation pour les micro-tâches).
3. **Espace mission** : tâches assignées, dépôt livrables, feedback QC — le kanban
   existant, simplifié en vue mobile « liste de tâches ».
4. **Portefeuille (nouveau, cœur de rétention)** : solde, historique, bouton
   « Retirer sur Wave / Orange Money », gains du mois, projection.
5. **Progression** : score JUB → **niveaux de talent** (Débutant → Vérifié → Confirmé →
   Expert) qui débloquent les missions mieux payées. Badges conservés mais secondaires.
6. **Portfolio public** `/u/[slug]` : conservé, réorienté « preuve pour recruteurs ».

### 2.3 Face Ops (extension de l'admin — le vrai moteur)

L'équipe JUB opère les missions. Nouveaux écrans admin :

1. **Pipeline briefs** : nouveaux briefs → qualification → devis → gagné/perdu.
2. **Constructeur de mission** : découpage en tâches, tarif par tâche, taille d'équipe,
   assignation assistée par matching.
3. **File de contrôle qualité** : livrables `EN_REVUE` → valider / à corriger / rejeter,
   avec quotas par contrôleur.
4. **Paie** : lots de paiement Wave (Bulk Pay), statuts, réconciliation, export compta.
5. **Vivier talents** : recherche par compétence/zone/langue/niveau, taux de complétion,
   fiabilité (retards, rejets).

---

## 3. Refonte UX/UI — exigence « excellente qualité »

### 3.1 État des lieux (audit du code actuel)

- **Bon** : tokens CSS propres et complets dans [globals.css](../src/app/globals.css)
  (palettes orange/sage/pierre, rayons, ombres, typo Instrument Serif + Geist) ;
  stratégie perf saine (classes statiques, zéro CSS-in-JS).
- **Dette majeure** : le dossier [composants/maquette/](../src/composants/maquette/)
  est un « port 1:1 » avec **des centaines de `style={{}}` inline** (35 rien que sur la
  landing). Conséquences : responsive fragile (styles inline non media-queryables),
  incohérences d'espacement, thème impossible à faire évoluer, code UI non réutilisable.
- **Incohérence** : deux jeux de primitives coexistent (`composants/ui/` et
  `composants/maquette/primitifs.tsx`).

### 3.2 Décisions du design system

1. **Un seul jeu de primitives** : fusionner `maquette/primitifs` dans `composants/ui/`,
   tout en classes Tailwind 4 + tokens `@theme`. **Zéro style inline** (règle ESLint
   `react/forbid-dom-props` sur `style`), exceptions : valeurs réellement dynamiques
   (barres de progression, images de fond).
2. **Identité** : conserver la personnalité actuelle (sage + orange, serif display,
   fond chaud) — elle est distinctive et déjà bonne. La refonte est structurelle, pas
   cosmétique.
3. **Échelle typo & espacement formalisées** : échelle 4px ; styles de texte nommés
   (`display`, `titre-1/2/3`, `corps`, `corps-sm`, `legende`, `mono-data`) en classes
   utilitaires ; interdit de composer des tailles à la main.
4. **Composants à construire** (au-dessus des primitives) :
   `StatTuile` (KPI), `BarreProgression`, `Jalon/Timeline`, `TableDonnees` (tri +
   scroll horizontal mobile), `FeuilleModale` (bottom-sheet mobile), `EtatVide`
   (illustration + CTA), `Squelette` (loading), `Toast`, `Stepper` (brief client),
   `CarteMission`, `LigneTransaction`, `PastilleStatut` (mapping 1:1 avec les enums
   Prisma — couleur unique par statut dans toute l'app).
5. **Mobile-first réel** : les étudiants sont sur smartphone 3G/4G. Cibles :
   LCP < 2,5 s sur 3G rapide, bundle JS par page < 120 kB, images AVIF/WebP via
   `next/image`, navigation par barre d'onglets bas d'écran dans l'espace talent
   (Missions / Mes tâches / Portefeuille / Profil).
6. **Face client = desktop-first, dense et sobre** : le client est une organisation ;
   tableaux, exports, PDF. Deux « ambiances » sur le même système de tokens :
   talent = chaleureux/motivant, client = institutionnel/confiance (plus de sage-900,
   moins d'orange).
7. **Accessibilité** : contraste AA systématique (l'orange 500 `#ffaa00` sur blanc ne
   passe pas pour du texte → réserver aux fonds/accents, texte orange = orange-700),
   focus visible, cibles tactiles ≥ 44px, formulaires avec erreurs inline annoncées.
8. **États non vides** : chaque page a ses états vide / chargement (squelettes) /
   erreur / hors-ligne. Conformément à la convention existante « pas de faux parcours
   silencieux ».

### 3.3 Pages clés à re-concevoir (ordre de priorité)

| Page | Objectif UX |
|---|---|
| **Landing publique** | Double audience : hero orienté client (« Vos données, collectées et vérifiées ») + section talent (« Gagne de l'argent avec tes compétences »). Preuves : logos clients, compteur missions payées, montant reversé aux étudiants (compteur FCFA = argument massue de recrutement talent) |
| **Brief client (stepper)** | 4–5 étapes max, sauvegarde brouillon, estimation de fourchette de prix en direct si possible |
| **Suivi mission client** | Une seule page : progression, jalons, échantillons, messages. Lisible par un directeur non technique |
| **Fil missions talent** | Cartes mission : gain FCFA en gros, durée, places restantes, badge « match 92 % ». Candidature 1 tap |
| **Portefeuille talent** | Solde énorme et clair, bouton retrait Wave proéminent, historique simple |
| **File QC (ops)** | Revue livrable au clavier (valider = V, corriger = C), aperçu inline des fichiers, quotas visibles |

---

## 4. Architecture technique

### 4.1 Ce qui est conservé tel quel

- Stack : Next.js 16 / React 19 / Prisma 7 / Postgres / Auth.js v5 / Supabase Storage / Resend.
- Domaine : [certificats.ts](../src/domaine/certificats.ts) (numéro public, hash, QR,
  `/v/[numero]`), [matching.ts](../src/domaine/matching.ts), [score.ts](../src/domaine/score.ts),
  kanban/tâches/livrables/feedback, notifications, journal d'audit, RBAC.

### 4.2 Migrations de schéma (Prisma)

```prisma
// Nouveaux enums
enum TypeMission { ENQUETE_TERRAIN  ANNOTATION  ETUDE  REDACTION  AUTRE }
enum StatutBrief { RECU  EN_QUALIFICATION  DEVIS_ENVOYE  ACCEPTE  PERDU }
enum StatutRetrait { DEMANDE  EN_COURS  PAYE  ECHEC }

// Nouveau : Brief (entonnoir commercial)
model Brief {
  id           String      @id @default(cuid())
  clientId     String
  typeMission  TypeMission
  titre        String
  détails      Json        // réponses du stepper, par verticale
  budgetIndicatifFcfa Int?
  statut       StatutBrief @default(RECU)
  devisUrl     String?
  missionId    String?     @unique // Projet créé si gagné
  creeLe       DateTime    @default(now())
}

// Projet → étendu en Mission (renommage progressif, pas de big-bang)
//  + montantClientFcfa   Int      // ce que paie le client
//  + enveloppeTalentsFcfa Int     // ce qui est reversé
//  + chefMissionId       String?  // membre ops responsable
// Tache
//  + montantFcfa          Int?    // gain du talent à la validation

// Nouveau : portefeuille
model Portefeuille {
  id          String @id @default(cuid())
  etudiantId  String @unique
  soldeFcfa   Int    @default(0)
  transactions TransactionPortefeuille[]
}
model TransactionPortefeuille {
  id          String   @id @default(cuid())
  portefeuilleId String
  montantFcfa Int      // + crédit (tâche validée), - débit (retrait)
  type        String   // GAIN_TACHE | RETRAIT | AJUSTEMENT | BONUS
  tacheId     String?
  retraitId   String?
  creeLe      DateTime @default(now())
}
model Retrait {
  id            String        @id @default(cuid())
  etudiantId    String
  montantFcfa   Int
  methode       MethodePaiement // WAVE | ORANGE_MONEY (existant)
  numeroTelephone String
  statut        StatutRetrait @default(DEMANDE)
  referenceWave String?       // id payout Wave
  cleIdempotence String       @unique // exigée par l'API Wave
  creeLe        DateTime      @default(now())
  finaliseLe    DateTime?
}
```

- `Entreprise` → devient `Client` (raison sociale, type : ONG / entreprise / institution /
  international). Les modèles `Candidature`, `Equipe`, `Evaluation`, `Certificat`
  restent, mais la sélection d'équipe passe côté **ops**, plus côté client.
- Crédit de portefeuille = transaction atomique lors du passage d'un livrable/tâche à
  `VALIDE` (transaction Prisma : maj statut + insertion `TransactionPortefeuille` + maj solde).

### 4.3 Intégration Wave Payout

- Compte Wave Business (activation 5–10 jours ouvrés — **à lancer dès maintenant**).
- `POST /v1/payout` (unitaire) et `POST /v1/payout-batch` (lots de paie) ; clé
  d'idempotence obligatoire par requête (déjà prévue dans `Retrait.cleIdempotence`).
- V1 : retrait déclenché par le talent, validé par ops (bouton « payer le lot ») —
  humain dans la boucle tant que les volumes sont faibles. Webhook/polling de statut →
  `Retrait.statut`.
- Frais 1 % supportés par JUB (inclus dans la commission).

### 4.4 Sécurité / conformité (points nouveaux du fait de l'argent)

- Journal d'audit (existant) obligatoire sur : création retrait, validation lot de paie,
  modification de montant de tâche, changement de numéro de téléphone de retrait.
- Double validation (deux comptes ops distincts) pour tout lot > seuil configurable.
- Numéros de téléphone de retrait vérifiés par OTP avant premier paiement.
- Données d'enquête = données personnelles de répondants → chiffrement au repos
  (Supabase), accès par mission, purge contractuelle en fin de mission.

---

## 5. Roadmap — 8 sprints (2 semaines chacun)

> Remplace les sprints 4–12 de l'ancien README. Objectif : **première mission payante
> réelle au sprint R4**, plateforme complète au sprint R8.

| Sprint | Contenu | Jalon business |
|---|---|---|
| **R1 — Fondation UI** | Fusion des primitives, éradication des styles inline (landing + espaces), composants nouveaux (StatTuile, PastilleStatut, Stepper, TableDonnees, Squelette, Toast, EtatVide), barre d'onglets mobile talent. Règle ESLint anti-inline | Design system unique et documenté |
| **R2 — Cœur mission** | Migration schéma (Brief, montants, Portefeuille, Transaction, Retrait), constructeur de mission ops, tarif par tâche, crédit portefeuille à la validation QC, file QC clavier | Une mission interne de bout en bout (données de test) |
| **R3 — Face client** | Stepper de brief (2 verticales), pipeline briefs ops, page suivi mission client, rapport de traçabilité (réutilise le PDF certificat), landing refondue double audience | Démo client montrable — **début prospection réelle** |
| **R4 — Argent réel** | Compte Wave Business actif, intégration Payout (unitaire + batch, idempotence), OTP numéro de retrait, écran portefeuille talent, paie ops, double validation | **Première mission client payée, premiers FCFA reversés** |
| **R5 — Qualification talents** | Test d'entrée par verticale, niveaux de talent (Vérifié/Confirmé/Expert) branchés sur score JUB, candidature 1 tap, notifications email + (option) WhatsApp/SMS | Vivier ≥ 100 talents vérifiés UGB |
| **R6 — Verticale annotation** | Types de tâches d'annotation (texte, audio wolof/français, image) avec UI de tâche dédiée in-app, import/export datasets (CSV/JSONL), consignes par lot, double annotation + arbitrage QC | Premier contrat annotation (prospection labs IA / plateformes data) |
| **R7 — Verticale terrain** | Mode hors-ligne léger (PWA — l'enregistreur SW existe), géotag des soumissions, intégration Kobo/ODK en import, tableaux de suivi de collecte par zone | Premier contrat ONG/cabinet signé sur plateforme |
| **R8 — Industrialisation** | Facturation client (PDF, échéances), contrats-cadres, statistiques ops (marge par mission, coût QC), audit a11y + perf 3G, E2E Playwright sur les 3 parcours critiques (brief→devis, tâche→paie, retrait) | Bilan pilote, dossier levée/subvention |

**Parallèle non-code (critique)** : dès R3, une personne à plein temps sur la prospection
(ONG à Saint-Louis/Dakar, cabinets, labs IA pour l'annotation). La plateforme attire le
client, elle ne le remplace pas.

### Dépriorisé (retiré du MVP)

Classements publics, thèmes de portfolio, partenariats multi-entreprises,
messagerie 1-à-1 généralisée (messagerie par mission suffit), programmes sponsors
(reviennent quand un sponsor réel se présente).

---

## 6. KPIs de pilotage

| KPI | Cible fin R8 |
|---|---|
| Missions payées livrées | ≥ 5 |
| CA encaissé | ≥ 5 M FCFA |
| FCFA reversés aux talents | ≥ 3 M FCFA (affiché publiquement sur la landing) |
| Talents vérifiés actifs | ≥ 150 |
| Taux de livrables validés au 1er passage QC | ≥ 80 % |
| Délai brief → devis | < 72 h |
| NPS client | > 50 |

---

## 7. Sources de la recherche marché

- Marché annotation 3,07 Md$ (2026) → 12,42 Md$ (2031) ; sortie de l'ère « anglais
  d'abord » : Outsource Accelerator, Conectys (tendances 2026).
- Google Research Africa — projet **WAXAL** (wolof « parler »), février 2026 : collecte
  de parole spontanée en langues africaines avec universités partenaires ; Zindi
  référence des datasets wolof (ASR) : 9jaLingo blog.
- **Sama** : modèle impact-sourcing Afrique de l'Est, ~750 M$ de revenu annuel (2025),
  69 000+ vies impactées : sama.com, Wikipedia, CanvasBusinessModel.
- Taux annotation freelance 2026 : Outlier 20–60 $+/h (experts), DataAnnotation
  15–35 $/h, Remotasks 5–20 $/h : RemoteStack, CareerSeeker.
- **Wave Payout API** : payout unitaire + batch (50 destinataires/appel), 1 % de frais,
  clé d'idempotence obligatoire, activation compte 5–10 j : docs.wave.com/payout, Kolonell.
- Écosystème enquêtes Sénégal : People & Data, AfrikSurvey, recrutements récurrents
  d'enquêteurs (Humanité & Inclusion, CNJ, ANSD).
- Concurrence talents Afrique : Andela (mid/senior tech, global), Gebeya (SaaS talent
  cloud) — aucun sur le créneau junior + terrain + Sénégal : CIO, techinafrica.
