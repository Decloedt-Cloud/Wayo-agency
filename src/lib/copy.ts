import type { Locale } from "@/lib/locale";
import type { PageContent } from "@/lib/queries";

export type CopySection = { title: string; paragraphs: string[] };

export type Ui = {
  skip: string;
  navLabel: string;
  langLabel: string;
  nav: { constat: string; method: string; offers: string; faq: string };
  book: string;
  bookArrow: string;
  seeOffers: string;
  hero1: string;
  hero2: string;
  heroIntro: string;
  statementKicker: string;
  statement: string;
  statementEmphasis: string;
  auditKicker: string;
  auditTitleA: string;
  auditTitleB: string;
  auditBody: string;
  auditNote: string;
  auditOpen: string;
  auditFixed: string;
  auditFinal: string;
  severity: Record<"critique" | "eleve" | "moyen", string>;
  canvas: [string, string, string];
  methodKicker: string;
  scrollHint: string;
  scopeKicker: string;
  scopeTitleA: string;
  scopeTitleB: string;
  scopeQuote: string;
  offersKicker: string;
  offersTitleA: string;
  offersTitleB: string;
  price: string;
  delay: string;
  onRequest: string;
  flagshipKicker: string;
  flagshipCta: string;
  faqKicker: string;
  faqTitleA: string;
  faqTitleB: string;
  contactTitleA: string;
  contactTitleB: string;
  call: string;
  callBody: string;
  bookSlot: string;
  form: {
    name: string;
    email: string;
    offer: string;
    stack: string;
    message: string;
    consent: string;
    send: string;
    sending: string;
    success: string;
    tooMany: string;
    failed: string;
    offers: Record<"audit" | "rescue" | "hardening" | "maintenance" | "production-ready" | "unknown", string>;
  };
  rail: { stacks: string; pause: string; resume: string; editor: string; tech: string };
  footerLegal: string;
  footerPrivacy: string;
  socialLabel: string;
  themeLight: string;
  themeDark: string;
  themeLabel: string;
  legalTitle: string;
  legalEmpty: string;
  legalSections: CopySection[];
  privacyTitle: string;
  privacySections: CopySection[];
  privacyContact: string;
  privacyContactEmpty: string;
  privacyOwner: string;
  siteTitle: string;
  siteDescription: string;
  notFound: string;
  backHome: string;
};

type OfferCopy = { shortDescription: string; description: string; includes: string[] };
type Catalog = {
  offers: Record<"audit" | "rescue" | "hardening" | "maintenance" | "production-ready", OfferCopy>;
  faq: { question: string; answer: string }[];
  steps: { label: string; body: string }[];
  domains: { name: string; detail: string }[];
  audit: string[];
};

const fr: Ui = {
  skip: "Aller au contenu",
  navLabel: "Navigation principale",
  langLabel: "Langue",
  nav: { constat: "Constat", method: "Méthode", offers: "Offres", faq: "FAQ" },
  book: "Réserver un audit",
  bookArrow: "Réserver un audit →",
  seeOffers: "Voir les offres",
  hero1: "Votre app existe.",
  hero2: "Rendons-la solide.",
  heroIntro: "Cursor, Lovable, Bolt, Claude Code : l'IA vous a donné un produit. Wayo Agency vérifie le code, corrige les risques critiques et prépare votre application pour la production, sans tout réécrire.",
  statementKicker: "Constat",
  statement: "Le vibe coding permet de lancer un produit en quelques jours. Mais quand les bugs arrivent, que la sécurité inquiète et que personne ne comprend plus le code, il faut quelqu'un qui reprenne la main. C'est exactement notre travail.",
  statementEmphasis: "reprenne la main.",
  auditKicker: "L'audit",
  auditTitleA: "Ce qu'un audit",
  auditTitleB: "remonte.",
  auditBody: "Clés exposées, routes ouvertes, paiements fragiles, aucun test : on lit votre code, on classe les risques par gravité et on corrige les critiques en premier.",
  auditNote: "Exemple type de rapport. Le vôtre est établi à partir de votre propre code.",
  auditOpen: "OUVERT",
  auditFixed: "CORRIGÉ ✓",
  auditFinal: "✓ 0 risque critique restant, prêt pour la production",
  severity: { critique: "CRITIQUE", eleve: "ÉLEVÉ", moyen: "MOYEN" },
  canvas: ["clé API exposée", "route admin ouverte", "webhook non vérifié"],
  methodKicker: "Méthode, du prototype à la production",
  scrollHint: "Défiler",
  scopeKicker: "Périmètre",
  scopeTitleA: "Tout ce qui peut",
  scopeTitleB: "casser.",
  scopeQuote: "« J'ai réussi à créer le produit, mais je ne sais plus comment le maintenir. » On prend en charge ce qui se passe après.",
  offersKicker: "Offres",
  offersTitleA: "Quatre façons de travailler",
  offersTitleB: "ensemble.",
  price: "Prix",
  delay: "Délai",
  onRequest: "Sur devis",
  flagshipKicker: "Offre complète",
  flagshipCta: "Passer en production →",
  faqKicker: "FAQ",
  faqTitleA: "Avant de",
  faqTitleB: "nous écrire.",
  contactTitleA: "On en",
  contactTitleB: "parle ?",
  call: "Appel",
  callBody: "30 minutes en visio pour repérer les risques critiques.",
  bookSlot: "Réserver un créneau →",
  form: {
    name: "Nom",
    email: "Email",
    offer: "Offre souhaitée",
    stack: "Outil / stack",
    message: "Votre problème",
    consent: "J'accepte que mes données soient utilisées pour me répondre",
    send: "Envoyer →",
    sending: "Envoi…",
    success: "Merci, on vous répond sous 48 h ouvrées.",
    tooMany: "Trop d'envois. Réessayez dans une heure.",
    failed: "L'envoi a échoué. Réessayez.",
    offers: { audit: "Audit", rescue: "Rescue", hardening: "Hardening", maintenance: "Maintenance", "production-ready": "Production Ready", unknown: "Je ne sais pas" },
  },
  rail: { stacks: "Stacks", pause: "Pause", resume: "Reprendre", editor: "Éditeur", tech: "Techno" },
  footerLegal: "Mentions légales",
  footerPrivacy: "Confidentialité",
  socialLabel: "Réseaux",
  themeLight: "Clair",
  themeDark: "Sombre",
  themeLabel: "Thème",
  legalTitle: "Mentions légales",
  legalEmpty: "Dénomination sociale, adresse et numéro d'immatriculation : non publiés pour le moment.",
  legalSections: [
    { title: "Éditeur", paragraphs: ["Wayo Agency édite ce site. Il présente l'audit, la réparation et la mise en production d'applications générées par intelligence artificielle, sans les réécrire."] },
    { title: "Contact", paragraphs: ["Pour écrire à Wayo Agency, utilisez l'adresse indiquée sur cette page ou le formulaire de la page d'accueil. Une réponse est envoyée sous 48 heures ouvrées."] },
    { title: "Propriété intellectuelle", paragraphs: ["Les textes, la marque Wayo Agency et les éléments graphiques du site sont réservés. Toute reproduction non autorisée est interdite. Les noms des outils cités restent la propriété de leurs éditeurs."] },
    { title: "Liens", paragraphs: ["Le site renvoie vers LinkedIn, Instagram, Facebook et vers la prise de rendez-vous TidyCal. Ces services appliquent leurs propres conditions. Wayo Agency n'est pas responsable de leur contenu."] },
    { title: "Responsabilité", paragraphs: ["Les textes du site décrivent une méthode de travail. Ils ne valent pas engagement de résultat tant qu'un accord n'est pas conclu. Lorsqu'un prix ou un délai est indiqué « Sur devis », il est fixé après étude du projet."] },
    { title: "Droit applicable", paragraphs: ["Le site est soumis au droit français. Le traitement des données personnelles est décrit sur la page Confidentialité."] },
  ],
  privacyTitle: "Confidentialité",
  privacySections: [
    { title: "Responsable", paragraphs: ["Wayo Agency est responsable des données collectées sur ce site."] },
    { title: "Données collectées", paragraphs: ["Le formulaire enregistre le nom, l'email, l'offre souhaitée, l'outil ou la stack, le texte du message, le consentement, la langue choisie et, s'ils sont présents, les paramètres de campagne.", "L'adresse IP n'est pas enregistrée. Elle est transformée en empreinte SHA-256 avec un sel secret. Cette empreinte sert seulement à compter les envois : cinq messages par heure. Le compteur disparaît à la fin de cette heure."] },
    { title: "Finalité", paragraphs: ["Ces données servent à lire la demande, à y répondre et à limiter les envois automatiques. Le formulaire demande le consentement. La limite d'envois protège le site."] },
    { title: "Emails", paragraphs: ["Le message est envoyé à la boîte de Wayo Agency. Un accusé de réception est adressé au visiteur. Si l'envoi de l'email échoue, le message reste enregistré."] },
    { title: "Cookies", paragraphs: ["Deux cookies sont déposés pour les visiteurs : locale, qui retient la langue, et theme, qui retient le mode clair ou sombre. Ils durent un an. Aucun cookie publicitaire n'est déposé. Un cookie de session existe seulement pour l'administration, qui n'est pas ouverte au public."] },
    { title: "Durée et destinataires", paragraphs: ["Les messages sont conservés le temps de traiter la demande et son suivi. Ils sont lus par Wayo Agency et passent par son prestataire de messagerie. La prise de rendez-vous s'ouvre sur TidyCal, qui applique ses propres règles."] },
    { title: "Vos droits", paragraphs: ["Vous pouvez demander l'accès, la rectification, l'effacement, la limitation ou l'opposition, et saisir la CNIL. Écrivez à l'adresse de contact indiquée sur cette page."] },
  ],
  privacyContact: "Contact",
  privacyContactEmpty: "L'adresse de contact n'est pas encore renseignée.",
  privacyOwner: "Responsable",
  siteTitle: "Wayo Agency | Audit, réparation et production du code",
  siteDescription: "Wayo Agency audite, répare et prépare pour la production les applications générées par Cursor, Lovable, Bolt ou Claude Code, sans les réécrire.",
  notFound: "Cette adresse ne correspond à aucune page.",
  backHome: "Retour à l'accueil",
};

const en: Ui = {
  skip: "Skip to content",
  navLabel: "Main navigation",
  langLabel: "Language",
  nav: { constat: "Problem", method: "Method", offers: "Offers", faq: "FAQ" },
  book: "Book an audit",
  bookArrow: "Book an audit →",
  seeOffers: "See the offers",
  hero1: "Your app exists.",
  hero2: "Let's make it solid.",
  heroIntro: "Cursor, Lovable, Bolt, Claude Code: AI gave you a product. Wayo Agency checks the code, fixes the critical risks, and prepares your application for production, without rewriting it.",
  statementKicker: "The problem",
  statement: "Vibe coding can launch a product in a few days. But when the bugs arrive, security becomes a worry, and nobody understands the code anymore, someone has to take back control. That is exactly our work.",
  statementEmphasis: "take back control.",
  auditKicker: "The audit",
  auditTitleA: "What an audit",
  auditTitleB: "finds.",
  auditBody: "Exposed keys, open routes, fragile payments, no tests: we read your code, rank the risks by severity, and fix the critical ones first.",
  auditNote: "Sample report. Yours is based on your own code.",
  auditOpen: "OPEN",
  auditFixed: "FIXED ✓",
  auditFinal: "✓ 0 critical risks left, ready for production",
  severity: { critique: "CRITICAL", eleve: "HIGH", moyen: "MEDIUM" },
  canvas: ["exposed API key", "open admin route", "unverified webhook"],
  methodKicker: "Method, from prototype to production",
  scrollHint: "Scroll",
  scopeKicker: "Scope",
  scopeTitleA: "Everything that can",
  scopeTitleB: "break.",
  scopeQuote: "“I managed to build the product, but I no longer know how to maintain it.” We take over what happens next.",
  offersKicker: "Offers",
  offersTitleA: "Four ways to work",
  offersTitleB: "together.",
  price: "Price",
  delay: "Timeline",
  onRequest: "On request",
  flagshipKicker: "Full offer",
  flagshipCta: "Go to production →",
  faqKicker: "FAQ",
  faqTitleA: "Before you",
  faqTitleB: "write to us.",
  contactTitleA: "Shall we",
  contactTitleB: "talk?",
  call: "Call",
  callBody: "30 minutes on a video call to spot the critical risks.",
  bookSlot: "Book a slot →",
  form: {
    name: "Name",
    email: "Email",
    offer: "Offer",
    stack: "Tool / stack",
    message: "Your problem",
    consent: "I agree that my data will be used to reply to me",
    send: "Send →",
    sending: "Sending…",
    success: "Thank you. We will reply within 48 business hours.",
    tooMany: "Too many messages. Try again in an hour.",
    failed: "Sending failed. Try again.",
    offers: { audit: "Audit", rescue: "Rescue", hardening: "Hardening", maintenance: "Maintenance", "production-ready": "Production Ready", unknown: "I don't know" },
  },
  rail: { stacks: "Stacks", pause: "Pause", resume: "Resume", editor: "Editor", tech: "Stack" },
  footerLegal: "Legal notice",
  footerPrivacy: "Privacy",
  socialLabel: "Social",
  themeLight: "Light",
  themeDark: "Dark",
  themeLabel: "Theme",
  legalTitle: "Legal notice",
  legalEmpty: "Registered name, address, and registration number: not published yet.",
  legalSections: [
    { title: "Publisher", paragraphs: ["Wayo Agency publishes this site. It presents the audit, repair, and production launch of applications generated by artificial intelligence, without rewriting them."] },
    { title: "Contact", paragraphs: ["To write to Wayo Agency, use the address shown on this page or the form on the home page. A reply is sent within 48 business hours."] },
    { title: "Intellectual property", paragraphs: ["The texts, the Wayo Agency name, and the graphic elements of the site are reserved. Unauthorized reproduction is not allowed. The names of the tools mentioned remain the property of their publishers."] },
    { title: "Links", paragraphs: ["The site links to LinkedIn, Instagram, Facebook, and to booking on TidyCal. Those services apply their own terms. Wayo Agency is not responsible for their content."] },
    { title: "Liability", paragraphs: ["The texts describe a way of working. They are not a commitment to a result until an agreement is made. When a price or a timeline is shown as “On request”, it is set after the project is reviewed."] },
    { title: "Applicable law", paragraphs: ["The site is governed by French law. Personal data is described on the Privacy page."] },
  ],
  privacyTitle: "Privacy",
  privacySections: [
    { title: "Owner", paragraphs: ["Wayo Agency is responsible for the data collected on this site."] },
    { title: "Data collected", paragraphs: ["The form stores the name, email, chosen offer, tool or stack, message, consent, chosen language, and, when present, the campaign parameters.", "The IP address is not stored. It is turned into a SHA-256 fingerprint with a secret salt. That fingerprint is used only to count submissions: five messages per hour. The counter is removed at the end of that hour."] },
    { title: "Purpose", paragraphs: ["This data is used to read the request, reply to it, and limit automated submissions. The form asks for consent. The submission limit protects the site."] },
    { title: "Email", paragraphs: ["The message is sent to Wayo Agency's mailbox. An acknowledgement is sent to the visitor. If the email fails, the message stays recorded."] },
    { title: "Cookies", paragraphs: ["Two cookies are set for visitors: locale, which keeps the language, and theme, which keeps light or dark mode. They last one year. No advertising cookie is set. A session cookie exists only for the admin area, which is not open to visitors."] },
    { title: "Retention and recipients", paragraphs: ["Messages are kept for as long as it takes to handle the request and the follow-up. They are read by Wayo Agency and pass through its email provider. Booking opens on TidyCal, which applies its own rules."] },
    { title: "Your rights", paragraphs: ["You can ask for access, correction, deletion, restriction, or objection, and you can contact the CNIL. Write to the contact address shown on this page."] },
  ],
  privacyContact: "Contact",
  privacyContactEmpty: "The contact address has not been provided yet.",
  privacyOwner: "Owner",
  siteTitle: "Wayo Agency | Audit, repair, and production launch of AI-generated code",
  siteDescription: "Wayo Agency audits, repairs, and prepares for production the applications generated by Cursor, Lovable, Bolt, or Claude Code, without rewriting them.",
  notFound: "This address does not match a page.",
  backHome: "Back to the home page",
};

const ar: Ui = {
  skip: "تخطَّ إلى المحتوى",
  navLabel: "التنقل الرئيسي",
  langLabel: "اللغة",
  nav: { constat: "الواقع", method: "المنهج", offers: "العروض", faq: "أسئلة" },
  book: "احجز تدقيقاً",
  bookArrow: "احجز تدقيقاً ←",
  seeOffers: "شاهد العروض",
  hero1: "تطبيقك موجود.",
  hero2: "لنجعله متيناً.",
  heroIntro: "Cursor وLovable وBolt وClaude Code: منحكم الذكاء الاصطناعي منتجاً. Wayo Agency تراجع الكود، وتصحّح المخاطر الحرجة، وتجهّز تطبيقكم للإنتاج، دون إعادة كتابته.",
  statementKicker: "الواقع",
  statement: "بناء المنتج بالذكاء الاصطناعي يتيح إطلاقه في أيام. لكن حين تظهر الأخطاء، ويقلق الأمان، ولا يعود أحد يفهم الكود، يلزم من يستعيد السيطرة. هذا تحديداً عملنا.",
  statementEmphasis: "يستعيد السيطرة.",
  auditKicker: "التدقيق",
  auditTitleA: "ما يكتشفه",
  auditTitleB: "التدقيق.",
  auditBody: "مفاتيح مكشوفة، مسارات مفتوحة، مدفوعات هشّة، ولا اختبارات: نقرأ كودكم، ونرتّب المخاطر حسب شدّتها، ونصلح الحرجة أولاً.",
  auditNote: "نموذج تقرير. تقريركم يُبنى من كودكم نفسه.",
  auditOpen: "مفتوح",
  auditFixed: "تم الإصلاح ✓",
  auditFinal: "✓ لا مخاطر حرجة متبقية، جاهز للإنتاج",
  severity: { critique: "حرج", eleve: "مرتفع", moyen: "متوسط" },
  canvas: ["مفتاح API مكشوف", "مسار إدارة مفتوح", "webhook غير موثّق"],
  methodKicker: "المنهج، من النموذج إلى الإنتاج",
  scrollHint: "مرّر",
  scopeKicker: "النطاق",
  scopeTitleA: "كل ما يمكن",
  scopeTitleB: "أن ينكسر.",
  scopeQuote: "« نجحت في إنشاء المنتج، لكني لم أعد أعرف كيف أصونه. » نتولّى ما يحدث بعد ذلك.",
  offersKicker: "العروض",
  offersTitleA: "أربع طرق للعمل",
  offersTitleB: "معاً.",
  price: "السعر",
  delay: "المدة",
  onRequest: "حسب الطلب",
  flagshipKicker: "العرض الكامل",
  flagshipCta: "الانتقال إلى الإنتاج ←",
  faqKicker: "أسئلة",
  faqTitleA: "قبل أن",
  faqTitleB: "تكتبوا لنا.",
  contactTitleA: "نتحدث",
  contactTitleB: "في الأمر؟",
  call: "مكالمة",
  callBody: "30 دقيقة عبر الفيديو لرصد المخاطر الحرجة.",
  bookSlot: "احجز موعداً ←",
  form: {
    name: "الاسم",
    email: "البريد",
    offer: "العرض المطلوب",
    stack: "الأداة / التقنية",
    message: "المشكلة",
    consent: "أوافق على استخدام بياناتي للرد عليّ",
    send: "إرسال ←",
    sending: "جارٍ الإرسال…",
    success: "شكراً. نردّ خلال 48 ساعة عمل.",
    tooMany: "عدد كبير من الرسائل. أعيدوا المحاولة بعد ساعة.",
    failed: "تعذّر الإرسال. أعيدوا المحاولة.",
    offers: { audit: "Audit", rescue: "Rescue", hardening: "Hardening", maintenance: "Maintenance", "production-ready": "Production Ready", unknown: "لا أعرف" },
  },
  rail: { stacks: "التقنيات", pause: "إيقاف", resume: "استئناف", editor: "محرّر", tech: "تقنية" },
  footerLegal: "إشارات قانونية",
  footerPrivacy: "الخصوصية",
  socialLabel: "الشبكات",
  themeLight: "فاتح",
  themeDark: "داكن",
  themeLabel: "المظهر",
  legalTitle: "إشارات قانونية",
  legalEmpty: "الاسم التجاري والعنوان ورقم التسجيل: غير منشورة حالياً.",
  legalSections: [
    { title: "الناشر", paragraphs: ["Wayo Agency تنشر هذا الموقع. وهو يعرض تدقيق التطبيقات المولَّدة بالذكاء الاصطناعي وإصلاحها ونقلها إلى الإنتاج، دون إعادة كتابتها."] },
    { title: "اتصال", paragraphs: ["للمراسلة، استخدموا العنوان الظاهر في هذه الصفحة أو النموذج في الصفحة الرئيسية. يصل الرد خلال 48 ساعة عمل."] },
    { title: "الملكية الفكرية", paragraphs: ["النصوص واسم Wayo Agency وعناصر الموقع الرسومية محفوظة. النسخ غير المصرّح به ممنوع. أسماء الأدوات المذكورة تبقى ملك ناشريها."] },
    { title: "روابط", paragraphs: ["يربط الموقع إلى LinkedIn وInstagram وFacebook وإلى الحجز عبر TidyCal. هذه الخدمات تطبق شروطها. Wayo Agency غير مسؤولة عن محتواها."] },
    { title: "المسؤولية", paragraphs: ["تصف النصوص طريقة العمل. وهي ليست التزاماً بنتيجة قبل اتفاق. حين يظهر السعر أو المدة «حسب الطلب»، يُحدَّدان بعد دراسة المشروع."] },
    { title: "القانون", paragraphs: ["يخضع الموقع للقانون الفرنسي. معالجة البيانات الشخصية موضّحة في صفحة الخصوصية."] },
  ],
  privacyTitle: "الخصوصية",
  privacySections: [
    { title: "المسؤول", paragraphs: ["Wayo Agency مسؤولة عن البيانات المجمَّعة على هذا الموقع."] },
    { title: "البيانات المجمَّعة", paragraphs: ["يسجّل النموذج الاسم والبريد والعرض المطلوب والأداة أو التقنية ونص الرسالة والموافقة واللغة المختارة، وعند وجودها، معطيات الحملة.", "لا يُحفظ عنوان IP. يُحوَّل إلى بصمة SHA-256 بملح سرّي. تُستخدم البصمة فقط لعدّ الرسائل: خمس رسائل في الساعة. يختفي العدّاد في نهاية تلك الساعة."] },
    { title: "الغرض", paragraphs: ["تُستخدم هذه البيانات لقراءة الطلب والرد عليه والحد من الإرسال الآلي. النموذج يطلب الموافقة. حدّ الإرسال يحمي الموقع."] },
    { title: "البريد", paragraphs: ["تُرسل الرسالة إلى صندوق Wayo Agency. ويصل إشعار استلام إلى الزائر. إذا فشل إرسال البريد، تبقى الرسالة محفوظة."] },
    { title: "ملفات الارتباط", paragraphs: ["يُوضع ملفان للزوار: locale لحفظ اللغة، وtheme لحفظ الوضع الفاتح أو الداكن. يدومان سنة. لا يوجد ملف إعلاني. ملف الجلسة موجود فقط للإدارة، وهي غير متاحة للزوار."] },
    { title: "المدة والجهات", paragraphs: ["تُحفظ الرسائل طوال معالجة الطلب ومتابعته. تقرأها Wayo Agency وتمر عبر مزوّد بريدها. الحجز يُفتح على TidyCal، التي تطبق قواعدها."] },
    { title: "حقوقكم", paragraphs: ["يمكنكم طلب الاطلاع أو التصحيح أو الحذف أو التقييد أو الاعتراض، ومراجعة CNIL. اكتبوا إلى عنوان الاتصال الظاهر في هذه الصفحة."] },
  ],
  privacyContact: "اتصال",
  privacyContactEmpty: "عنوان الاتصال غير متوفر بعد.",
  privacyOwner: "المسؤول",
  siteTitle: "Wayo Agency | تدقيق وإصلاح وإطلاق إنتاج للكود المولَّد بالذكاء الاصطناعي",
  siteDescription: "Wayo Agency تدقّق وتصلح وتجهّز للإنتاج التطبيقات المولَّدة بـ Cursor أو Lovable أو Bolt أو Claude Code، دون إعادة كتابتها.",
  notFound: "هذا العنوان لا يطابق أي صفحة.",
  backHome: "العودة إلى الصفحة الرئيسية",
};

const catalogs: Record<"en" | "ar", Catalog> = {
  en: {
    offers: {
      audit: { shortDescription: "Code, security, architecture, performance.", description: "Audit of the code, security, architecture, performance, and technical debt.", includes: ["duplicates and unused dependencies", "secrets, auth, permissions", "prioritized report and roadmap"] },
      rescue: { shortDescription: "Repair what is broken or can no longer be deployed.", description: "Repair an application that is buggy or can no longer be deployed.", includes: ["bugs, 500 errors, broken forms", "problems after an update", "return to a stable state"] },
      hardening: { shortDescription: "Tests, monitoring, CI/CD, production.", description: "Tests, security, monitoring, CI/CD, and production readiness.", includes: ["unit, integration, and E2E tests", "Sentry, logs, alerts", "CI/CD, staging, rollback"] },
      maintenance: { shortDescription: "Bugs, updates, small changes.", description: "Monthly maintenance, bug fixes, updates, and small changes.", includes: ["fixes", "dependency updates", "small changes"] },
      "production-ready": { shortDescription: "From an AI-generated prototype to production.", description: "Audit, security, tests, optimization, CI/CD, monitoring, documentation, and a maintenance plan: one path from an AI-generated prototype to an application you control.", includes: [] },
    },
    faq: [
      { question: "Do I have to rewrite my application?", answer: "No. The goal is to keep what exists: we reorganize the architecture gradually and add tests before changing the critical parts." },
      { question: "Which tools and stacks do you take on?", answer: "Projects built with Cursor, Lovable, Bolt, or Claude Code, with Supabase, Firebase, Stripe, Next.js, Flutter, React Native, and hosting on Vercel, Netlify, AWS, or a VPS." },
      { question: "What does the audit include?", answer: "An analysis of the code, security, architecture, performance, and technical debt, with a prioritized report and an action plan." },
      { question: "And after production?", answer: "With Vibe Code Maintenance: bug fixes, dependency updates, and small changes, every month." },
    ],
    steps: [
      { label: "Audit", body: "Reading the code, the architecture, and the dependencies. Finding the technical debt and what already works." },
      { label: "Security", body: "Secrets, authentication, permissions, public endpoints, input validation, and rate limiting." },
      { label: "Tests", body: "Unit, integration, and E2E tests on the signup → payment → dashboard path." },
      { label: "Optimization", body: "Bundle, repeated queries, images, cache, database, and Core Web Vitals." },
      { label: "CI/CD", body: "Automated deployment, staging and production environments, environment variables, rollback." },
      { label: "Monitoring", body: "Sentry, server logs, alerts, and tracking of frontend and backend errors." },
      { label: "Documentation", body: "A clean README, architecture, deployment procedure, backup, and recovery." },
      { label: "Maintenance plan", body: "Fixes, dependency updates, and small changes over time." },
    ],
    domains: [
      { name: "Bugs & maintenance", detail: "500 errors, broken screens, forms, mobile crashes" },
      { name: "AI-generated code", detail: "duplicates, huge files, inconsistent logic, unused dependencies" },
      { name: "Security", detail: "API keys, auth, permissions, public endpoints, validation, rate limiting" },
      { name: "Performance", detail: "bundle, repeated queries, images, cache, Core Web Vitals" },
      { name: "Refactoring", detail: "reorganize without breaking what exists, tests before critical parts" },
      { name: "Database", detail: "migrations, relations, indexes, slow queries, backups" },
      { name: "Authentication", detail: "Google, Apple, email, password reset, sessions, roles, tokens" },
      { name: "Payments", detail: "Stripe, subscriptions, webhooks, invoices, synchronization" },
      { name: "Deployment", detail: "Vercel, Netlify, AWS, VPS, Docker, staging, rollback" },
      { name: "Tests", detail: "unit, integration, E2E" },
      { name: "Monitoring", detail: "Sentry, logs, alerts" },
      { name: "SEO", detail: "metadata, sitemap, canonical, SSR, non-indexable pages" },
      { name: "Mobile", detail: "Flutter, React Native, Expo, stores" },
      { name: "Migration", detail: "from Lovable or Bolt to a maintainable repository" },
      { name: "Dependencies", detail: "React, Next.js, Flutter, Node, vulnerable packages" },
      { name: "Features", detail: "admin, notifications, PDF/CSV export, emails, analytics, i18n" },
      { name: "Documentation", detail: "README, architecture, environment variables, deployment" },
      { name: "Project takeover", detail: "understand abandoned code, set a roadmap" },
    ],
    audit: [
      "API key present in the code sent to the browser",
      "Administration route reachable without authentication",
      "Stripe webhook not verified: subscriptions out of sync",
      "No request limit on sign-in",
      "Code not split up, images not optimized, repeated queries",
      "No tests on the signup → payment → dashboard path",
    ],
  },
  ar: {
    offers: {
      audit: { shortDescription: "الكود، الأمان، البنية، الأداء.", description: "تدقيق الكود والأمان والبنية والأداء والدين التقني.", includes: ["تكرار وتبعيات غير لازمة", "أسرار، مصادقة، صلاحيات", "تقرير مرتّب وخارطة طريق"] },
      rescue: { shortDescription: "إصلاح ما تعطّل أو لم يعد قابلاً للنشر.", description: "إصلاح تطبيق فيه أعطال أو لم يعد يمكن نشره.", includes: ["أعطال، أخطاء 500، نماذج مكسورة", "مشاكل بعد التحديث", "العودة إلى حالة مستقرة"] },
      hardening: { shortDescription: "اختبارات، مراقبة، CI/CD، إنتاج.", description: "اختبارات وأمان ومراقبة وCI/CD وتجهيز للإنتاج.", includes: ["اختبارات وحدة وتكامل وشاملة", "Sentry، سجلات، تنبيهات", "CI/CD، بيئة تجريبية، تراجع"] },
      maintenance: { shortDescription: "أعطال، تحديثات، تعديلات صغيرة.", description: "صيانة شهرية، إصلاح أعطال، تحديثات وتعديلات صغيرة.", includes: ["إصلاحات", "تحديث التبعيات", "تعديلات صغيرة"] },
      "production-ready": { shortDescription: "من نموذج مولَّد بالذكاء الاصطناعي إلى الإنتاج.", description: "تدقيق وتأمين واختبارات وتحسين وCI/CD ومراقبة وتوثيق وخطة صيانة: مسار واحد للانتقال من نموذج مولَّد بالذكاء الاصطناعي إلى تطبيق تسيطرون عليه.", includes: [] },
    },
    faq: [
      { question: "هل يجب أن أعيد كتابة تطبيقي؟", answer: "لا. الهدف هو الإبقاء على الموجود: نعيد تنظيم البنية تدريجياً ونضيف اختبارات قبل تعديل الأجزاء الحرجة." },
      { question: "ما الأدوات والتقنيات التي تتولّونها؟", answer: "المشاريع المبنية بـ Cursor أو Lovable أو Bolt أو Claude Code، مع Supabase وFirebase وStripe وNext.js وFlutter وReact Native، والاستضافة على Vercel أو Netlify أو AWS أو VPS." },
      { question: "ماذا يتضمن التدقيق؟", answer: "تحليل للكود والأمان والبنية والأداء والدين التقني، مع تقرير مرتّب وخطة عمل." },
      { question: "وماذا بعد الإنتاج؟", answer: "مع Vibe Code Maintenance: إصلاح الأعطال، وتحديث التبعيات، وتعديلات صغيرة، كل شهر." },
    ],
    steps: [
      { label: "تدقيق", body: "قراءة الكود والبنية والتبعيات. رصد الدين التقني وما يعمل أصلاً." },
      { label: "تأمين", body: "الأسرار، المصادقة، الصلاحيات، المسارات العامة، التحقق من المدخلات، وتحديد معدّل الطلبات." },
      { label: "اختبارات", body: "اختبارات وحدة وتكامل وشاملة على مسار التسجيل → الدفع → لوحة التحكم." },
      { label: "تحسين", body: "الحزمة، الاستعلامات المكررة، الصور، التخزين المؤقت، قاعدة البيانات، وCore Web Vitals." },
      { label: "CI/CD", body: "نشر آلي، بيئتا تجريب وإنتاج، متغيرات البيئة، والتراجع." },
      { label: "مراقبة", body: "Sentry، سجلات الخادم، تنبيهات، ومتابعة أخطاء الواجهة والخادم." },
      { label: "توثيق", body: "README واضح، البنية، إجراء النشر، النسخ الاحتياطي والاستعادة." },
      { label: "خطة صيانة", body: "إصلاحات، تحديث التبعيات، وتعديلات صغيرة على المدى." },
    ],
    domains: [
      { name: "أعطال وصيانة", detail: "أخطاء 500، شاشات مكسورة، نماذج، أعطال الجوّال" },
      { name: "كود مولَّد بالذكاء الاصطناعي", detail: "تكرار، ملفات ضخمة، منطق غير متّسق، تبعيات غير لازمة" },
      { name: "أمان", detail: "مفاتيح API، مصادقة، صلاحيات، مسارات عامة، تحقق، تحديد المعدّل" },
      { name: "أداء", detail: "الحزمة، استعلامات مكررة، صور، تخزين مؤقت، Core Web Vitals" },
      { name: "إعادة هيكلة", detail: "إعادة التنظيم دون كسر الموجود، اختبارات قبل الأجزاء الحرجة" },
      { name: "قاعدة البيانات", detail: "هجرات، علاقات، فهارس، استعلامات بطيئة، نسخ احتياطي" },
      { name: "مصادقة", detail: "Google، Apple، بريد، إعادة كلمة السر، جلسات، أدوار، رموز" },
      { name: "دفع", detail: "Stripe، اشتراكات، webhooks، فواتير، مزامنة" },
      { name: "نشر", detail: "Vercel، Netlify، AWS، VPS، Docker، تجريب، تراجع" },
      { name: "اختبارات", detail: "وحدة، تكامل، شاملة" },
      { name: "مراقبة", detail: "Sentry، سجلات، تنبيهات" },
      { name: "SEO", detail: "بيانات وصفية، خريطة موقع، canonical، SSR، صفحات غير مفهرسة" },
      { name: "جوّال", detail: "Flutter، React Native، Expo، المتاجر" },
      { name: "نقل", detail: "من Lovable أو Bolt إلى مستودع قابل للصيانة" },
      { name: "تبعيات", detail: "React، Next.js، Flutter، Node، حزم ضعيفة" },
      { name: "وظائف", detail: "إدارة، إشعارات، تصدير PDF/CSV، بريد، تحليلات، لغات" },
      { name: "توثيق", detail: "README، بنية، متغيرات البيئة، النشر" },
      { name: "استلام مشروع", detail: "فهم كود متروك، ووضع خارطة طريق" },
    ],
    audit: [
      "مفتاح API موجود في الكود المرسَل إلى المتصفح",
      "مسار الإدارة متاح دون مصادقة",
      "Webhook الخاص بـ Stripe غير موثّق: الاشتراكات غير متزامنة",
      "لا حد لطلبات تسجيل الدخول",
      "الكود غير مقسّم، الصور غير محسّنة، والاستعلامات مكررة",
      "لا اختبارات على مسار التسجيل → الدفع → لوحة التحكم",
    ],
  },
};

export function getUi(locale: Locale): Ui {
  if (locale === "en") return en;
  if (locale === "ar") return ar;
  return fr;
}

export function localizeContent(content: PageContent, locale: Locale): PageContent {
  if (locale === "fr") return content;
  const catalog = catalogs[locale];
  return {
    ...content,
    offers: content.offers.map((offer) => {
      const extra = catalog.offers[offer.slug as keyof Catalog["offers"]];
      return extra ? { ...offer, ...extra } : offer;
    }),
    flagship: catalog.offers[content.flagship.slug as keyof Catalog["offers"]]
      ? { ...content.flagship, ...catalog.offers[content.flagship.slug as keyof Catalog["offers"]] }
      : content.flagship,
    faq: content.faq.map((item, index) => ({ ...item, ...(catalog.faq[index] ?? {}) })),
    steps: content.steps.map((item, index) => ({ ...item, ...(catalog.steps[index] ?? {}) })),
    domains: content.domains.map((item, index) => ({ ...item, ...(catalog.domains[index] ?? {}) })),
    auditRows: content.auditRows.map((item, index) => ({ ...item, text: catalog.audit[index] ?? item.text })),
  };
}

export function visitorThanks(locale: Locale): { subject: string; text: string } {
  if (locale === "en") {
    return { subject: "Wayo Agency — message received", text: "Thank you. We will reply within 48 business hours.\n\nWayo Agency" };
  }
  if (locale === "ar") {
    return { subject: "Wayo Agency — تم استلام الرسالة", text: "شكراً. نردّ خلال 48 ساعة عمل.\n\nWayo Agency" };
  }
  return { subject: "Wayo Agency — message reçu", text: "Merci, on vous répond sous 48 h ouvrées.\n\nWayo Agency" };
}
