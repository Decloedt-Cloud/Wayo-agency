# Rapport de mise en production — Wayo Agency

Date des commandes : 2026-11-10. Les chiffres ci-dessous viennent des commandes citées. Ce qui n’a pas été exécuté est marqué « non mesuré ».

## Corrections prouvées

### Sécurité

- En-têtes ajoutés dans `next.config.ts` et `src/lib/csp.ts` : `X-Frame-Options: DENY`, `Cross-Origin-Opener-Policy: same-origin`, `Permissions-Policy` avec caméra, micro, géolocalisation, paiement et USB. HSTS seulement hors développement.
- CSP : en développement, `unsafe-inline` et `unsafe-eval` restent, sinon le serveur Next ne tourne pas. En production, le middleware pose un nonce et `strict-dynamic`. Ce mode production n’a pas été servi ici : le serveur lancé était `next dev`.
- `zod` `.strict()`, `Content-Type: application/json`, délai minimum de 3 secondes (`submittedTooFast`).
- `localhost` et `127.0.0.1` sur le même port sont le même origine pour le contrôle CSRF. Un autre site reste refusé.
- Session admin : 8 h, renouvellement toutes les heures. Connexions journalisées dans `admin_audit_log` sans le mot de passe.
- JSON-LD : `<` remplacé par `\u003c`.

Mesures :

- `npx vitest run` : 5 fichiers, 22 tests, tous passés (14:13).
- `curl -sI http://127.0.0.1:3010/` : `200`, les en-têtes ci-dessus présents, `X-Powered-By` absent, `Strict-Transport-Security` absent (développement).
- `node` contre `POST /api/leads` : corps trop rapide `400`, `Content-Type: text/plain` `415`.
- Un premier essai a envoyé `startedAt: 1` (année 1970). La route a répondu `201` et a donc pu tenter un e-mail. La ligne `ada-check@example.com` a été supprimée ensuite : `DELETE 1`.

### SEO

- Title français ramené à 53 caractères : « Wayo Agency | Audit, réparation et production du code ». Description mesurée à 143 caractères.
- Un seul `<h1>` sur `/`. Canonical absolu mesuré : `http://localhost:3000` parce que `NEXT_PUBLIC_SITE_URL` n’est pas le domaine public. Il ne faut pas inventer ce domaine.
- `404` réel sur `/cette-page-n-existe-pas`.
- Sitemap : `lastmod` présent, `/offres/audit` présent. `scripts/seo-check.ts` avec `SEO_BASE_URL=http://127.0.0.1:3010` : `seo-check ok : 21 URL, title 53, description 143`.
- Pages `/offres/[slug]` construites avec le nom, la description et les livrables déjà en base. Pas de prix inventé, pas de témoignage. `/offres/audit` a répondu `200`, titre visible « Vibe Code Audit ».
- `/blog` existe, sans article. Réponse mesurée : `200` et `robots` `noindex, follow`.
- Manifeste et icône Apple ajoutés. `GET /manifest.webmanifest` a répondu `200` dans le journal du serveur de développement.

### Accessibilité

- Réponses de FAQ toujours dans le HTML, région `aria-labelledby`.
- `autocomplete` nom et e-mail, lien vers la politique à côté de la case non pré-cochée.
- Non revérifié au clavier ni avec un lecteur d’écran dans cette session.

## Ce qui reste

| Sujet | Pourquoi |
| --- | --- |
| Score securityheaders.com et Observatory | Le site n’est pas en ligne sous son domaine. Non mesuré. |
| Lighthouse mobile, LCP, CLS, INP, TBT, taille JS gzip | Non mesuré. Aucun score n’est annoncé. |
| CSP à nonce en production | Codée, non servie par un `next start`. |
| `npm audit --audit-level=high` | Résultat lu : info 0, low 0, moderate 10, high 3, critical 3, total 16. Pas de `npm audit fix --force`. La CI n’échoue pas encore sur cet audit, sinon elle serait rouge sans correctif validé. |
| Sauvegardes, rôle SQL minimal, TLS Postgres, purge 24 mois | Non écrits et non exécutés. |
| Docker non-root, digest, healthcheck d’image | Non modifiés. |
| TOTP, Turnstile, Sentry, pino, ZAP, axe-core, gitleaks, Lighthouse CI | Absents. |
| Confirmation d’e-mail, 429 HTTP sur le login Auth.js | Le compteur existe ; Auth.js renvoie toujours un échec de connexion, pas un `429`. |
| VoiceOver / NVDA | Non fait. |
| Domaine canonique | À renseigner dans `NEXT_PUBLIC_SITE_URL` avant Search Console. |

## Checklist

- [x] Title 50–60 et description 140–160 sur `/` (`seo-check`, title 53, description 143)
- [x] Un seul h1 sur `/` (compte HTML : 1)
- [x] Sitemap : 21 URL en `200` via `seo-check`
- [x] `404` HTTP réel
- [x] En-têtes de base mesurés sur le serveur de développement
- [x] 22 tests unitaires passés
- [ ] Lighthouse ≥ 90 / SEO 100 — non mesuré
- [ ] En-têtes notés A sur securityheaders.com — non mesuré
- [ ] `npm audit` sans vulnérabilité haute — 3 hautes et 3 critiques restantes
- [ ] Sauvegarde restaurée une fois — non exécuté
- [ ] axe-core sans violation sérieuse — non exécuté
