export const statementText =
  "Le vibe coding permet de lancer un produit en quelques jours. Mais quand les bugs arrivent, que la sécurité inquiète et que personne ne comprend plus le code, il faut quelqu'un qui reprenne la main. C'est exactement notre travail.";

export type SeedOffer = {
  slug: "audit" | "rescue" | "hardening" | "maintenance" | "production-ready";
  position: number;
  name: string;
  shortLabel: string;
  shortDescription: string;
  description: string;
  includes: string[];
  isFlagship: boolean;
};

export const seedOffers: SeedOffer[] = [
  {
    slug: "audit",
    position: 1,
    name: "Vibe Code Audit",
    shortLabel: "Audit",
    shortDescription: "Code, sécurité, architecture, performance.",
    description:
      "Audit du code, de la sécurité, de l'architecture, de la performance et de la dette technique.",
    includes: [
      "doublons et dépendances inutiles",
      "secrets, auth, permissions",
      "rapport priorisé et roadmap",
    ],
    isFlagship: false,
  },
  {
    slug: "rescue",
    position: 2,
    name: "Vibe Code Rescue",
    shortLabel: "Rescue",
    shortDescription: "Réparer ce qui bug ou ne se déploie plus.",
    description: "Réparer une application qui bug ou qui ne peut plus être déployée.",
    includes: [
      "bugs, erreurs 500, formulaires cassés",
      "problèmes après mise à jour",
      "retour à un état stable",
    ],
    isFlagship: false,
  },
  {
    slug: "hardening",
    position: 3,
    name: "Vibe Code Hardening",
    shortLabel: "Hardening",
    shortDescription: "Tests, monitoring, CI/CD, production.",
    description: "Tests, sécurité, monitoring, CI/CD et préparation à la production.",
    includes: [
      "tests unitaires, intégration, E2E",
      "Sentry, logs, alertes",
      "CI/CD, staging, rollback",
    ],
    isFlagship: false,
  },
  {
    slug: "maintenance",
    position: 4,
    name: "Vibe Code Maintenance",
    shortLabel: "Maintenance",
    shortDescription: "Bugs, mises à jour, petites évolutions.",
    description: "Maintenance mensuelle, correction de bugs, mises à jour et petites évolutions.",
    includes: ["corrections", "mises à jour des dépendances", "petites évolutions"],
    isFlagship: false,
  },
  {
    slug: "production-ready",
    position: 5,
    name: "Vibe Code",
    shortLabel: "Production Ready",
    shortDescription: "Du prototype généré par IA à la production.",
    description:
      "Audit, sécurisation, tests, optimisation, CI/CD, monitoring, documentation et plan de maintenance : un seul parcours pour passer d'un prototype généré par IA à une application que vous maîtrisez.",
    includes: [],
    isFlagship: true,
  },
];

export const seedFaq = [
  {
    position: 1,
    question: "Dois-je réécrire mon application ?",
    answer:
      "Non. L'objectif est de conserver l'existant : on réorganise progressivement l'architecture et on ajoute des tests avant de modifier les parties critiques.",
  },
  {
    position: 2,
    question: "Quels outils et stacks prenez-vous en charge ?",
    answer:
      "Les projets créés avec Cursor, Lovable, Bolt ou Claude Code, avec Supabase, Firebase, Stripe, Next.js, Flutter, React Native et les hébergements Vercel, Netlify, AWS ou VPS.",
  },
  {
    position: 3,
    question: "Que contient l'audit ?",
    answer:
      "Une analyse du code, de la sécurité, de l'architecture, de la performance et de la dette technique, avec un rapport priorisé et un plan d'action.",
  },
  {
    position: 4,
    question: "Et après la mise en production ?",
    answer:
      "Avec Vibe Code Maintenance : corrections de bugs, mises à jour des dépendances et petites évolutions, chaque mois.",
  },
];

export const seedSteps = [
  {
    position: 1,
    label: "Audit",
    body: "Lecture du code, de l'architecture et des dépendances. Repérage de la dette technique et de ce qui fonctionne déjà.",
  },
  {
    position: 2,
    label: "Sécurisation",
    body: "Secrets, authentification, permissions, endpoints publics, validation des entrées et limitation de débit.",
  },
  {
    position: 3,
    label: "Tests",
    body: "Tests unitaires, d'intégration et E2E sur le parcours inscription → paiement → dashboard.",
  },
  {
    position: 4,
    label: "Optimisation",
    body: "Bundle, requêtes répétées, images, cache, base de données et Core Web Vitals.",
  },
  {
    position: 5,
    label: "CI/CD",
    body: "Déploiement automatisé, environnements staging et production, variables d'environnement, rollback.",
  },
  {
    position: 6,
    label: "Monitoring",
    body: "Sentry, logs serveur, alertes et suivi des erreurs frontend et backend.",
  },
  {
    position: 7,
    label: "Documentation",
    body: "README propre, architecture, procédure de déploiement, sauvegarde et récupération.",
  },
  {
    position: 8,
    label: "Plan de maintenance",
    body: "Corrections, mises à jour des dépendances et petites évolutions dans la durée.",
  },
];

export const seedDomains = [
  { position: 1, name: "Bugs & maintenance", detail: "erreurs 500, écrans cassés, formulaires, crashs mobile" },
  { position: 2, name: "Code généré par IA", detail: "doublons, fichiers énormes, logique incohérente, dépendances inutiles" },
  { position: 3, name: "Sécurité", detail: "clés API, auth, permissions, endpoints publics, validation, rate limiting" },
  { position: 4, name: "Performance", detail: "bundle, requêtes répétées, images, cache, Core Web Vitals" },
  { position: 5, name: "Refactoring", detail: "réorganiser sans casser l'existant, tests avant les parties critiques" },
  { position: 6, name: "Base de données", detail: "migrations, relations, index, requêtes lentes, sauvegardes" },
  { position: 7, name: "Authentification", detail: "Google, Apple, email, reset password, sessions, rôles, tokens" },
  { position: 8, name: "Paiement", detail: "Stripe, abonnements, webhooks, factures, synchronisation" },
  { position: 9, name: "Déploiement", detail: "Vercel, Netlify, AWS, VPS, Docker, staging, rollback" },
  { position: 10, name: "Tests", detail: "unitaires, intégration, E2E" },
  { position: 11, name: "Monitoring", detail: "Sentry, logs, alertes" },
  { position: 12, name: "SEO", detail: "metadata, sitemap, canonical, SSR, pages non indexables" },
  { position: 13, name: "Mobile", detail: "Flutter, React Native, Expo, stores" },
  { position: 14, name: "Migration", detail: "de Lovable ou Bolt vers un dépôt maintenable" },
  { position: 15, name: "Dépendances", detail: "React, Next.js, Flutter, Node, paquets vulnérables" },
  { position: 16, name: "Fonctionnalités", detail: "admin, notifications, export PDF/CSV, emails, analytics, i18n" },
  { position: 17, name: "Documentation", detail: "README, architecture, variables d'environnement, déploiement" },
  { position: 18, name: "Reprise de projet", detail: "comprendre un code abandonné, établir une roadmap" },
];

export const seedAuditRows = [
  { position: 1, severity: "critique", text: "Clé API présente dans le code envoyé au navigateur" },
  { position: 2, severity: "critique", text: "Route d'administration accessible sans authentification" },
  { position: 3, severity: "eleve", text: "Webhook Stripe non vérifié : abonnements désynchronisés" },
  { position: 4, severity: "eleve", text: "Aucune limite de requêtes sur la connexion" },
  { position: 5, severity: "moyen", text: "Code non découpé, images non optimisées, requêtes répétées" },
  { position: 6, severity: "moyen", text: "Aucun test sur le parcours inscription → paiement → dashboard" },
] as const;

export const heroIntro =
  "Cursor, Lovable, Bolt, Claude Code : l'IA vous a donné un produit. Wayo Agency vérifie le code, corrige les risques critiques et prépare votre application pour la production, sans tout réécrire.";

export const siteTitle =
  "Wayo Agency | Audit, réparation et mise en production de code généré par IA";

export const siteDescription =
  "Wayo Agency audite, répare et prépare pour la production les applications générées par Cursor, Lovable, Bolt ou Claude Code, sans les réécrire.";
