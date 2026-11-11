import { cookies, headers } from "next/headers";
import { isLocale, LOCALE_COOKIE, type Locale } from "@/lib/locale";

const crawler = /googlebot|bingbot|duckduckbot|applebot|slurp|yandex|baiduspider|facebookexternalhit|twitterbot|linkedinbot/i;

export async function getLocale(): Promise<Locale> {
  const requestHeaders = await headers();
  const fromPath = requestHeaders.get("x-locale");
  if (isLocale(fromPath)) return fromPath;
  if (crawler.test(requestHeaders.get("user-agent") ?? "")) return "fr";
  const saved = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(saved)) return saved;
  return "en";
}

export async function getPathname(): Promise<string> {
  const value = (await headers()).get("x-pathname");
  return value && value.startsWith("/") ? value : "/";
}
