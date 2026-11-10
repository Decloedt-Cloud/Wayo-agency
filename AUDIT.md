# Audit de production — Wayo Agency

Date de lecture du code : 2026-11-10. Aucun fichier applicatif n’a été modifié pour produire ce document. Les longueurs de title et de description ont été comptées par `node` sur les chaînes de `src/lib/copy.ts`.

Légende : **OK** déjà conforme, **À corriger** présent mais incomplet ou hors cible, **Absent** pas dans le dépôt.

## 1. SEO technique

| Point | Statut | Fichier |
| --- | --- | --- |
| 1.1 `generateMetadata` (title, description, canonical, metadataBase, langues, robots) | À corriger | `src/lib/seo.ts`, `src/app/layout.tsx`. `page.tsx` n’exporte pas `generateMetadata` (le layout couvre toutes les routes). Title FR = 75 caractères (cible 50–60). Description FR = 143 caractères (cible 140–160). Canonical rendu en absolu via `metadataBase`, mais `siteOrigin()` retombe sur `http://localhost:3000` si `NEXT_PUBLIC_SITE_URL` est vide (`src/lib/site.ts`). `alternates.languages` contient fr, en, ar et x-default (le français reste l’URL sans préfixe). |
| 1.1 Open Graph et Twitter | À corriger | `src/lib/seo.ts`, `src/app/opengraph-image.tsx` (1200×630, fond `#0a0908`, accent `#ff5a1f`). La carte Twitter est `summary_large_image` sans `images` explicite. |
| 1.1 Favicon, apple-touch, manifest, theme-color | À corriger | `src/app/favicon.ico` existe. `theme-color` est dans `generateViewport` de `src/app/layout.tsx` (`#0a0908` / `#f3efe6`). Pas de `manifest.ts` ni de `apple-icon`. |
| 1.1 Pages légales indexables ; `/admin` et `/api` exclus | OK | Les pages légales ont un contenu réel et restent indexables. `src/app/robots.ts` interdit `/admin` et `/api`. |
| 1.2 Sitemap absolu | À corriger | `src/app/sitemap.ts` : URLs absolues, sans `lastModified`. |
| 1.2 robots.txt | OK | `src/app/robots.ts`. |
| 1.2 Redirections 301 www / https / slash | Absent | `src/middleware.ts` ne normalise ni l’hôte ni le schéma. |
| 1.2 Page 404 réelle | Absent | Pas de `src/app/not-found.tsx`. |
| 1.3 JSON-LD Organization, Service, FAQ, WebSite | À corriger | `src/lib/seo.ts`. Organization sans `logo` ni e-mail (`site_settings.contact_email` n’est pas lu). `price` est déjà omis. `sameAs` est codé en dur, pas lu depuis les réglages. BreadcrumbList seulement sur les pages légales. Sérialisation `JSON.stringify` sans remplacement de `<` (`src/app/page.tsx`). |
| 1.3 Validation schema.org | Absent | Aucun test Vitest de JSON-LD. |
| 1.4 Un seul h1, ancres, HTML serveur | OK | `src/components/sections/Hero.tsx` (un h1). Ancres `contenu`, `constat`, `methode`, `offres`, `faq`, `contact`. Sections en Server Components. Canvas `aria-hidden` dans `HeroCanvas.tsx`. |
| 1.4 Texte du constat entier dans le DOM | OK | `src/components/sections/Statement.tsx` : mots entiers dans des `<span>`, pas des lettres isolées. |
| 1.4 Liens externes `noopener noreferrer` | OK | Réseaux et TidyCal dans `Footer.tsx` et `Contact.tsx`. |
| 1.4 Pages `/offres/[slug]` | Absent | Aucune route. |
| 1.4 Blog MDX | Absent | Aucune route ni dossier de contenu. |
| 1.6 `scripts/seo-check.ts` et Lighthouse CI | Absent | `.github/workflows/ci.yml` ne les lance pas. |

## 2. Sécurité

| Point | Statut | Fichier |
| --- | --- | --- |
| 2.1 En-têtes de base et `poweredByHeader: false` | OK | `next.config.ts` : nosniff, Referrer-Policy, HSTS, CSP partielle, `poweredByHeader: false`. |
| 2.1 CSP à nonce, COOP, X-Frame-Options, Permissions-Policy complète, HSTS seulement en production | À corriger | `next.config.ts`. CSP : `script-src 'unsafe-inline'` (et `'unsafe-eval'` en développement), pas de nonce ni `strict-dynamic` ni `upgrade-insecure-requests`. HSTS est envoyé aussi en développement. Permissions-Policy sans `payment` ni `usb`. Pas de `Cross-Origin-Opener-Policy` ni `X-Frame-Options`. |
| 2.2 zod, 10 Ko, SQL paramétré, erreurs génériques | À corriger | `src/lib/validators.ts` n’utilise pas `.strict()`. `src/app/api/leads/route.ts` limite le corps à 10 Ko et renvoie des erreurs génériques, mais ne vérifie pas `Content-Type`. Drizzle paramètre les requêtes (`src/lib/schema.ts`). |
| 2.2 `dangerouslySetInnerHTML` | À corriger | Réservé au JSON-LD, sans échappement de `<`. |
| 2.2 CSRF Origin | OK | `src/lib/site.ts` `isAllowedOrigin` : Origin absent = 403. |
| 2.3 Rate limit leads 5/h et login 5/15 min, honeypot | À corriger | `src/lib/rate-limit.ts`, `src/app/api/leads/route.ts`, `src/lib/auth.ts`. Le login renvoie `null` (échec silencieux), pas un 429. Pas de délai minimum de 3 s, pas de verrouillage progressif, pas de confirmation d’e-mail, pas de Turnstile. |
| 2.3 Destinataires d’e-mail hors du client | OK | `src/lib/email.ts` lit `site_settings` / `CONTACT_TO_EMAIL`. |
| 2.4 argon2id, cookie de session, garde admin | À corriger | Hash argon2 dans `src/lib/auth.ts`. Session JWT `maxAge` 12 h (`src/lib/auth.config.ts`), pas 8 h. `requireAdmin()` est appelé dans les actions et l’export (`src/lib/audit.ts`, `src/app/admin/actions.ts`, `src/app/admin/export/route.ts`). Pas de TOTP. Le journal `admin_audit_log` ne reçoit pas les connexions. |
| 2.5 Secrets hors du client, `.env` ignoré, `.env.example` vide | À corriger | `.gitignore` ignore `.env*` et garde `.env.example`. Pas de validation zod au démarrage. Pas de gitleaks. |
| 2.6 Rôle SQL minimal, TLS, sauvegardes, purge | Absent | `docker-compose.yml` publie Postgres sur `5433` avec l’utilisateur `user` (DDL inclus). Pas de `scripts/backup.sh` ni `restore.sh`. Pas de tâche de purge des leads. |
| 2.6 Contraintes et index leads | OK | `src/lib/schema.ts` : NOT NULL, CHECK, index `status/created_at` et `lower(email)`. |
| 2.7 `npm ci`, lockfile, Dependabot, depcheck | À corriger | `package-lock.json` présent, CI fait `npm ci`. Pas de `npm audit`, Dependabot, ni depcheck. `resend` n’est plus une dépendance (envoi via `nodemailer`). |
| 2.8 Docker non-root, digest, healthcheck applicatif | À corriger | `Dockerfile` : multi-stage `node:22-bookworm-slim` non épinglé par digest, utilisateur root, copie de `node_modules` entier, pas de healthcheck. `src/app/api/health/route.ts` existe. |
| 2.8 Sentry, logs JSON | Absent | `console.error` seulement. |
| 2.9 Tests d’en-têtes, injection, XSS, CSRF, 429 | À corriger | `tests/e2e/site.spec.ts` couvre le formulaire, le honeypot et le 429. Pas de test d’en-têtes, d’injection SQL, de XSS admin, ni de CSRF. Playwright vise `http://127.0.0.1:3000` (`playwright.config.ts`), port occupé par un autre service. |

## 3. Performance

| Point | Statut | Fichier |
| --- | --- | --- |
| 3.1 Page en cache tagué 3600 s | OK | `src/lib/load-content.ts`, `revalidate = 3600` dans `src/app/page.tsx`. |
| 3.1 H1 sans attendre le JS, polices `next/font` | OK | `src/app/layout.tsx`, `src/components/sections/Hero.tsx`. |
| 3.1 Canvas `ssr: false`, pause hors écran, DPR ≤ 2 | À corriger | `src/components/client/HeroScene.tsx`, `HeroCanvas.tsx`. Pas de `requestIdleCallback`, pas de baisse automatique si une frame dépasse 20 ms, allocations encore présentes dans la boucle. |
| 3.1 Bundle < 100 Ko gzip, analyzer | Absent | Pas de `@next/bundle-analyzer`. Taille non mesurée dans cet audit. |
| 3.2 `prefers-reduced-motion` | OK | `HeroCanvas.tsx`, `src/app/globals.css`. |
| 3.2 `content-visibility` sous la ligne de flottaison | OK | `src/app/globals.css` (sections, flagship, footer). Pas sur la méthode sticky. |
| 3.3 Trois familles de polices, pas de police tierce | À corriger | Latin : Instrument Serif, Inter Tight, JetBrains Mono. Arabe en plus : Noto Naskh et Noto Sans Arabic (`layout.tsx`), nécessaires à la langue arabe déjà livrée. |
| 3.4 Pool, index, pagination admin | À corriger | Pool `max: 8` dans `src/lib/db.ts`. L’export admin sélectionne tous les leads sans `LIMIT` (`src/app/admin/export/route.ts`). |
| 3.5 Lighthouse CI, `/api/vitals` | Absent | — |

Aucun score Lighthouse n’a été mesuré pour cet audit.

## 4. Accessibilité

| Point | Statut | Fichier |
| --- | --- | --- |
| 4 Contraste outillé | À corriger | `src/lib/contrast.ts` existe. Aucune mesure exécutée dans cet audit. `#a39d92` et `#8f897e` sur `#0a0908` ne sont pas vérifiés ici. |
| 4 Clavier, focus, lien d’évitement | OK | `src/app/globals.css` (`:focus-visible`), lien « Aller au contenu » dans `layout.tsx`. |
| 4 FAQ bouton `aria-expanded` / `aria-controls` | À corriger | `src/components/client/FaqAccordion.tsx`. La région n’a pas `aria-labelledby`. Le panneau fermé est retiré du DOM (`hidden` + enfant absent). |
| 4 Formulaire | À corriger | `src/components/client/ContactForm.tsx`. Labels présents, `role="alert"` présent. Pas d’`autocomplete`. La case de consentement n’a pas de lien vers la politique ni `aria-describedby`. |
| 4 Méthode dans le DOM | OK | `src/components/client/MethodView.tsx` rend la liste statique et la vue sticky. `aria-current` non vérifié sur l’étape courante dans cette lecture. |
| 4 Canvas et curseur décoratifs | OK | `aria-hidden` sur le canvas. `CursorRing.tsx` sort si `prefers-reduced-motion` ou `pointer: coarse`. |
| 4 Zoom, `maximum-scale` | OK | `generateViewport` ne fixe pas `maximumScale`. |
| 4 axe-core | Absent | — |

## 5. RGPD

| Point | Statut | Fichier |
| --- | --- | --- |
| 5 Pages légales sans identité inventée | OK | `src/app/(legal)/mentions-legales/page.tsx`, `confidentialite/page.tsx`. Nom, adresse et identifiant restent vides tant que `site_settings` n’est pas rempli. Contact : `contact_email` ou `CONTACT_TO_EMAIL`. |
| 5 Case non pré-cochée | OK | `ContactForm.tsx`, pas d’attribut `checked` par défaut. |
| 5 Pas de bannière si pas de traceur | OK | Pas d’analytique tierce. Cookies `locale` et `theme` seulement. |
| 5 Polices self-host | OK | `next/font` dans `layout.tsx`. |
| 5 Registre et purge testée | Absent | Pas de `docs/rgpd.md` ni de suppression planifiée des leads. |

## 6. Qualité et exploitation

| Point | Statut | Fichier |
| --- | --- | --- |
| 6 TypeScript strict, ESLint, tests unitaires | À corriger | `tsconfig` strict, `eslint-config-next`. Tests : `tests/unit/locale.test.ts`, `validators.test.ts`, `rate-limit.test.ts`, `motion.test.ts`. Pas de Prettier, pas de `eslint-plugin-security` dédié au-delà de la config Next. |
| 6 GitHub Actions | À corriger | `.github/workflows/ci.yml` : `npm ci`, lint, typecheck, tests, migrations, build, Playwright. Pas d’audit, gitleaks, Lighthouse, seo-check, ZAP. |
| 6 Healthcheck HTTP | OK | `src/app/api/health/route.ts`. |
| 6 README, architecture, runbook | À corriger | `README.md` existe. Pas de `docs/architecture.md` ni `docs/runbook.md`. |
| 6 Sentry, pino, uptime | Absent | — |

## 7. Conversion

| Point | Statut | Fichier |
| --- | --- | --- |
| 7 UTM stockés | OK | Colonnes dans `src/lib/schema.ts`, écriture dans `src/app/api/leads/route.ts`. Le formulaire ne les envoie pas encore (`ContactForm.tsx`). |
| 7 Accusé de réception | OK | `src/lib/email.ts`. |
| 7 Événements de clic et profondeur de scroll | Absent | — |

## Gravité retenue pour la suite

Critique : en-têtes manquants (clickjacking, CSP sans nonce), corps JSON non typé, JSON-LD non échappé, page 404 absente.

Élevé : title trop long, sitemap sans `lastModified`, pages d’offres absentes, délai anti-robot absent, session à 12 h, journal de connexion absent, canonical de production dépendant d’une variable non forcée.

Moyen : manifeste, blog (structure seule), autocomplete, FAQ `aria-labelledby`, script `seo-check`, sauvegardes, rôle SQL, Docker root.

Faible ou hors machine : score securityheaders.com, Lighthouse mobile, ZAP, VoiceOver, TOTP, Sentry, restauration prouvée sur un serveur de production. Ces points restent non mesurés tant qu’une commande ne les a pas produits.
