import type { Metadata } from "next";
import { getUi } from "@/lib/copy";
import { localePath, type Locale } from "@/lib/locale";
import type { PageContent } from "@/lib/queries";
import { siteOrigin } from "@/lib/site";

export const sameAs = [
  "https://www.linkedin.com/company/wayoagency/",
  "https://www.instagram.com/wayo.agency/",
  "https://www.facebook.com/people/Wayo-Agency/61582773413129/",
];

const keywords: Record<Locale, string[]> = {
  fr: [
    "audit code généré par IA",
    "vibe coding",
    "réparation application Cursor",
    "Lovable",
    "Bolt",
    "Claude Code",
    "mise en production application IA",
    "sécurité code généré",
    "dette technique",
    "Wayo Agency",
  ],
  en: [
    "AI generated code audit",
    "vibe coding",
    "Cursor app repair",
    "Lovable",
    "Bolt",
    "Claude Code",
    "production ready AI app",
    "AI code security",
    "technical debt",
    "Wayo Agency",
  ],
  ar: [
    "تدقيق كود الذكاء الاصطناعي",
    "vibe coding",
    "إصلاح تطبيق Cursor",
    "Lovable",
    "Bolt",
    "Claude Code",
    "تطبيق جاهز للإنتاج",
    "أمان الكود المولَّد",
    "دين تقني",
    "Wayo Agency",
  ],
};

const legalDescription: Record<Locale, { mentions: string; privacy: string }> = {
  fr: {
    mentions: "Éditeur, contact, propriété intellectuelle et responsabilité du site Wayo Agency.",
    privacy: "Données du formulaire, empreinte d'adresse IP, cookies de langue et de thème, et vos droits.",
  },
  en: {
    mentions: "Publisher, contact, intellectual property, and liability for the Wayo Agency site.",
    privacy: "Form data, IP fingerprint, language and theme cookies, and your rights.",
  },
  ar: {
    mentions: "الناشر والاتصال والملكية الفكرية ومسؤولية موقع Wayo Agency.",
    privacy: "بيانات النموذج وبصمة العنوان وملفات اللغة والمظهر وحقوقكم.",
  },
};

function pageCopy(locale: Locale, path: string): { title: string; description: string } {
  const ui = getUi(locale);
  if (path === "/mentions-legales") {
    return { title: `${ui.legalTitle} | Wayo Agency`, description: legalDescription[locale].mentions };
  }
  if (path === "/confidentialite") {
    return { title: `${ui.privacyTitle} | Wayo Agency`, description: legalDescription[locale].privacy };
  }
  return { title: ui.siteTitle, description: ui.siteDescription };
}

export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replaceAll("<", "\\u003c");
}

export function buildMetadata(locale: Locale, path: string, override?: { title: string; description: string }): Metadata {
  const { title, description } = override ?? pageCopy(locale, path);
  const canonical = `${siteOrigin()}${localePath(locale, path)}`;
    const languages = {
    fr: `${siteOrigin()}${localePath("fr", path)}`,
    en: `${siteOrigin()}${localePath("en", path)}`,
    ar: `${siteOrigin()}${localePath("ar", path)}`,
    "x-default": `${siteOrigin()}${localePath("fr", path)}`,
  } as const;
  const ogLocale = locale === "ar" ? "ar_AR" : locale === "en" ? "en_US" : "fr_FR";
  return {
    metadataBase: new URL(siteOrigin()),
    title,
    description,
    keywords: path === "/" ? keywords[locale] : undefined,
    alternates: { canonical, languages: { ...languages } },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Wayo Agency",
      locale: ogLocale,
      alternateLocale: ["fr_FR", "en_US", "ar_AR"].filter((code) => code !== ogLocale),
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Wayo Agency" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export function homeJsonLd(locale: Locale, content: PageContent) {
  const ui = getUi(locale);
  const origin = siteOrigin();
  const url = `${origin}${localePath(locale, "/")}`;
  const email = content.settings.contactEmail?.trim();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Wayo Agency",
        url: origin,
        logo: `${origin}/favicon.ico`,
        description: ui.siteDescription,
        ...(email ? { email } : {}),
        sameAs,
      },
      {
        "@type": "WebSite",
        name: "Wayo Agency",
        url: origin,
        inLanguage: ["fr", "en", "ar"],
        publisher: { "@type": "Organization", name: "Wayo Agency" },
      },
      {
        "@type": "ProfessionalService",
        name: "Wayo Agency",
        url,
        description: ui.siteDescription,
        areaServed: "Worldwide",
        inLanguage: locale,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Vibe Code",
          itemListElement: content.offers.map((offer) => ({
            "@type": "Offer",
            name: offer.name,
            description: offer.description,
          })),
        },
      },
      {
        "@type": "FAQPage",
        inLanguage: locale,
        mainEntity: content.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}

export function serviceJsonLd(locale: Locale, offer: { name: string; description: string; slug: string }) {
  const origin = siteOrigin();
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: offer.name,
    description: offer.description,
    serviceType: offer.name,
    url: `${origin}${localePath(locale, `/offres/${offer.slug}`)}`,
    provider: { "@type": "Organization", name: "Wayo Agency", url: origin },
    areaServed: "Worldwide",
  };
}

export function legalJsonLd(locale: Locale, path: "/mentions-legales" | "/confidentialite") {
  const { title } = pageCopy(locale, path);
  const origin = siteOrigin();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Wayo Agency", item: `${origin}${localePath(locale, "/")}` },
      { "@type": "ListItem", position: 2, name: title, item: `${origin}${localePath(locale, path)}` },
    ],
  };
}
