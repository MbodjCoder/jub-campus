# Déploiement production — JUB Campus

## 1. Variables Vercel à définir

Définir séparément les valeurs **Production** et **Preview** dans Vercel :

- `JUB_ENV=production`
- `DATABASE_URL`
- `AUTH_SECRET`
- `URL_PUBLIQUE`
- `RESEND_CLE_API`
- `EMAIL_EXPEDITEUR`
- `EMAIL_CONTACT`
- `SUPABASE_URL`
- `SUPABASE_CLE_SERVICE`
- `SUPABASE_BUCKET_PUBLIC`
- `SUPABASE_BUCKET_PRIVE`
- `AUTH_GOOGLE_ID` et `AUTH_GOOGLE_SECRET` seulement si Google est activé
- `AUTORISER_CERTIFICAT_DEMO=false`

Le code refuse désormais :

- une configuration Google partielle ;
- une configuration Supabase incomplète ;
- `URL_PUBLIQUE=localhost` en production ;
- l'absence d'email transactionnel ou de stockage persistant en production ;
- l'activation des certificats de démonstration en production.

## 2. Ordre de mise en ligne

1. Vérifier localement :
   - `pnpm release:verify`
   - `pnpm audit:prod`
2. Déployer les migrations de production :
   - `pnpm bdd:deployer`
3. Déployer sur Vercel.
4. Après déploiement, vérifier :
   - inscription + email de confirmation ;
   - connexion après confirmation ;
   - mot de passe oublié + lien reçu ;
   - candidature étudiant ;
   - demande de partenariat entreprise ;
   - dépôt puis ouverture d'un livrable privé ;
   - génération et vérification d'un certificat.

## 3. Email transactionnel

Utiliser un domaine ou sous-domaine vérifié dans Resend, par exemple :

- domaine : `updates.jubcampus.sn`
- expéditeur : `JUB Campus <hello@updates.jubcampus.sn>`

Éviter les expéditeurs personnels pour les emails transactionnels de la plateforme.

## 4. Base de données

Les migrations versionnées sont dans `prisma/migrations/`.
En production, utiliser `pnpm bdd:deployer`, jamais `pnpm bdd:migrer`.

## 5. Vérifications de sécurité avant ouverture publique

- `pnpm audit:prod` ne remonte aucune vulnérabilité connue.
- Les buckets Supabase sont bien séparés :
  - public : avatars ;
  - privé : livrables et certificats.
- Les variables sensibles ne sont jamais commitées.
- Les previews Vercel restent protégées si elles contiennent des données réelles.
