# Wayo Agency

Landing éditoriale de Wayo Agency. Le site présente un seul service, Vibe Code : auditer, réparer et préparer pour la production une application générée par IA, sans la réécrire.

## Installation

```bash
npm ci
cp .env.example .env
```

Renseignez `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` et `IP_HASH_SALT`. Les prix, délais, email, URL de réservation et mentions légales restent vides tant qu'ils ne sont pas saisis dans l'admin. Un champ vide s'affiche « Sur devis ».

## Base de données

PostgreSQL 16. Avec Docker :

```bash
docker compose up --build
```

Le conteneur applique les migrations puis le seed avant de lancer l'application.

Sans Docker, une base locale `wayo` :

```bash
npm run db:migrate
npm run db:seed
npm run dev
```

Le seed est idempotent. Il met à jour les textes, mais ne remplace pas un prix, un délai, un email, une URL ou une mention déjà enregistrés.

Hash du mot de passe admin :

```bash
npm run admin:hash -- "votre-mot-de-passe"
```

Collez le résultat dans `ADMIN_PASSWORD_HASH`.

## Sauvegarde

```bash
pg_dump --format=custom --file=wayo.dump "$DATABASE_URL"
pg_restore --clean --if-exists --dbname="$DATABASE_URL" wayo.dump
```

## Déploiement

L'image est multi-stage (`output: "standalone"`) et compatible Vercel + Neon. Sur Vercel, les migrations et le seed se lancent à part (`npm run db:migrate` puis `npm run db:seed`) avec `DATABASE_URL` Neon. Le client Postgres désactive les prepared statements (`prepare: false`) pour le pooler Neon.

## Choix

- Un PRNG à graine fixe dessine la même grille à chaque chargement.
- Un seul écouteur de scroll met à jour des variables CSS. React ne change d'état que lorsque l'étape de la méthode change.
- La classe `html.js` est ajoutée avant l'hydratation : sans JavaScript, le texte et le rapport corrigé restent visibles.
- L'échec d'un email SMTP n'annule pas l'enregistrement du message.
- Un honeypot rempli répond 200 sans rien enregistrer. Un envoi réel répond 201.
- La CSP autorise `'unsafe-inline'` : Next n'injecte pas de nonce sur les scripts d'hydratation. `'unsafe-eval'` n'est ajouté qu'en développement, pour le runtime de `next dev`.
- Les fenêtres de limite d'envoi sont calées sur l'heure UTC.
- Si `DATABASE_URL` est absent ou si la lecture échoue, la page utilise les textes du seed, avec les champs commerciaux vides. Ce repli n'est pas mis en cache.

## Mise en production

- `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `IP_HASH_SALT`, `NEXT_PUBLIC_SITE_URL`
- `CONTACT_SMTP_HOST`, `CONTACT_SMTP_PORT`, `CONTACT_SMTP_USER`, `CONTACT_SMTP_PASS`, `CONTACT_SMTP_FROM` et `CONTACT_TO_EMAIL` si les emails doivent partir
- migrations et seed appliqués
- email de contact et URL de réservation saisis dans `/admin/content` s'ils doivent apparaître
- sauvegarde PostgreSQL planifiée
