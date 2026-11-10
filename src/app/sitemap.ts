import { statSync } from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { loadContent } from "@/lib/load-content";
import { locales, localePath } from "@/lib/locale";
import { siteOrigin } from "@/lib/site";

const pages = ["/", "/mentions-legales", "/confidentialite"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteOrigin();
  const modified = statSync(path.join(process.cwd(), "src", "lib", "content.ts")).mtime;
  const content = await loadContent();
  const paths = [
    ...pages,
    ...content.offers
      .filter((offer) => offer.published && offer.slug !== "unknown")
      .map((offer) => `/offres/${offer.slug}`),
  ];
  return paths.flatMap((page) =>
    locales.map((locale) => ({
      url: `${origin}${localePath(locale, page)}`,
      lastModified: modified,
      changeFrequency: page === "/" ? "weekly" as const : "yearly" as const,
      priority: page === "/" ? 1 : 0.3,
      alternates: {
        languages: {
          fr: `${origin}${localePath("fr", page)}`,
          en: `${origin}${localePath("en", page)}`,
          ar: `${origin}${localePath("ar", page)}`,
          "x-default": `${origin}${localePath("fr", page)}`,
        },
      },
    })),
  );
}
