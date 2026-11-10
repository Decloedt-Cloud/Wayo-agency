export const locales = ["fr", "en", "ar"] as const;

export type Locale = (typeof locales)[number];

export const LOCALE_COOKIE = "locale";

const arabicCountries = new Set([
  "DZ", "BH", "KM", "DJ", "EG", "IQ", "JO", "KW", "LB", "LY", "MR", "MA",
  "OM", "PS", "QA", "SA", "SO", "SD", "SY", "TN", "AE", "YE",
]);

const frenchCountries = new Set([
  "FR", "BE", "CH", "LU", "MC", "SN", "CI", "CM", "ML", "BF", "NE", "TG",
  "BJ", "GA", "CG", "CD", "MG", "HT", "RW", "BI", "GN", "TD", "CF", "SC",
  "RE", "GP", "MQ", "GF", "YT", "PM", "BL", "MF", "NC", "PF", "WF",
]);

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "fr" || value === "en" || value === "ar";
}

export function localeFromCountry(country: string | null | undefined): Locale | null {
  if (!country) return null;
  const code = country.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code) || code === "XX" || code === "T1") return null;
  if (arabicCountries.has(code)) return "ar";
  if (frenchCountries.has(code)) return "fr";
  return "en";
}

/** Country comes from the host (Vercel or Cloudflare), which derives it from the IP. The address itself is not stored. */
export function localeFromHeaders(headers: Headers): Locale {
  const country = headers.get("x-vercel-ip-country") || headers.get("cf-ipcountry");
  return localeFromCountry(country) ?? "fr";
}

export function splitLocalePrefix(pathname: string): { locale: Locale | null; path: string } {
  const match = pathname.match(/^\/(fr|en|ar)(?=\/|$)/);
  if (!match) return { locale: null, path: pathname || "/" };
  const rest = pathname.slice(match[0].length);
  return { locale: match[1] as Locale, path: rest.length > 0 ? rest : "/" };
}

export function localePath(locale: Locale, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const normalized = clean.length > 1 && clean.endsWith("/") ? clean.slice(0, -1) : clean;
  if (locale === "fr") return normalized;
  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

export function direction(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}
