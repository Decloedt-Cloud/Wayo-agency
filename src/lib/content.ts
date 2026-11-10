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
      "Audit de code et de sécurité d'une application générée par IA : architecture, performance et dette technique, avec un rapport priorisé.",
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
    description: "Réparer une application qui bug : correction des erreurs 500, des formulaires cassés et d'un déploiement qui ne part plus.",
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
    description: "Mise en production d'une application IA : tests automatisés, CI/CD, monitoring Sentry et passage en production.",
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
    description: "Maintenance applicative mensuelle : correction de bugs, mise à jour des dépendances et petites évolutions.",
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
      "Parcours pour rendre une application prête pour la production : audit, tests, CI/CD, monitoring et plan de maintenance, sans la réécrire.",
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
      "Les projets créés avec Cursor, Lovable, Bolt ou Claude Code, avec Supabase, Firebase, Stripe, Next.js, Java, Spring Boot, Flutter, React Native et les hébergements Hostinger, Netlify, AWS ou VPS.",
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
  {
    position: 5,
    question: "Une application Lovable est-elle sécurisée ?",
    answer:
      "Pas par défaut. Une application Lovable peut exposer une clé API, laisser une route ouverte ou élargir trop les accès aux données. L'audit lit votre code et classe ces risques.",
  },
  {
    position: 6,
    question: "Combien coûte un audit de code ?",
    answer:
      "Sur devis. Le montant dépend de la taille du code et des risques trouvés. Aucun prix n'est affiché avant d'avoir vu le projet.",
  },
  {
    position: 7,
    question: "Quelle est la différence entre un audit et une maintenance ?",
    answer:
      "L'audit est un passage : lire le code, classer les risques, proposer un plan. La maintenance est le suivi mensuel : bugs, dépendances et petites évolutions.",
  },
  {
    position: 8,
    question: "Comment savoir si mon code généré par IA est dangereux ?",
    answer:
      "Les signes fréquents sont une clé API dans le frontend, une route d'administration ouverte, un webhook Stripe non vérifié, ou des accès base trop larges. L'audit le vérifie sur votre code.",
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
  { position: 9, name: "Déploiement", detail: "Hostinger, Netlify, AWS, VPS, Docker, staging, rollback" },
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
