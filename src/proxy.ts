import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { contentSecurityPolicy } from "@/lib/csp";
import { isLocale, localePath, LOCALE_COOKIE, splitLocalePrefix } from "@/lib/locale";

const handleAuth = NextAuth(authConfig).auth as unknown as (
  request: NextRequest,
  event: NextFetchEvent,
) => Promise<Response> | Response;

const cookie = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax" as const,
};

function withPath(request: NextRequest, pathname: string, locale?: string) {
  const headers = new Headers(request.headers);
  headers.set("x-pathname", pathname);
  if (locale) headers.set("x-locale", locale);
  return headers;
}

function policyFor(headers: Headers, development: boolean) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const policy = contentSecurityPolicy({ development, nonce });
  if (!development) headers.set("x-nonce", nonce);
  headers.set("Content-Security-Policy", policy);
  return policy;
}

function canonicalRedirect(request: NextRequest): NextResponse | null {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured?.startsWith("https://")) return null;
  let expected: URL;
  try {
    expected = new URL(configured);
  } catch {
    return null;
  }
  const host = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "").split(":")[0] ?? "";
  if (!host || host === "localhost" || host === "127.0.0.1") return null;
  const proto = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
  const stripWww = host === `www.${expected.hostname}`;
  const bare = stripWww ? expected.hostname : host;
  if (bare !== expected.hostname) return null;
  if (proto === "https" && !stripWww) return null;
  const url = request.nextUrl.clone();
  url.protocol = "https:";
  url.hostname = expected.hostname;
  url.port = expected.port;
  return NextResponse.redirect(url, 301);
}

function redirectTarget(request: NextRequest, pathname: string) {
  const headerHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const hostname = headerHost.split(":")[0];
  const internal = !hostname || hostname === "localhost" || hostname === "127.0.0.1";
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!internal) {
    const proto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() === "http" ? "http" : "https";
    const url = new URL(pathname, `${proto}://${headerHost}`);
    url.search = request.nextUrl.search;
    return url;
  }
  if (configured?.startsWith("https://")) {
    const url = new URL(pathname, configured);
    url.search = request.nextUrl.search;
    return url;
  }
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.protocol = "http:";
  return url;
}

function rewriteTarget(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return url;
}

function isPrefetch(request: NextRequest) {
  return request.headers.get("next-router-prefetch") === "1" || request.headers.get("purpose") === "prefetch";
}

const crawler = /googlebot|bingbot|duckduckbot|applebot|slurp|yandex|baiduspider|facebookexternalhit|twitterbot|linkedinbot/i;

export function proxy(request: NextRequest, event: NextFetchEvent) {
  const development = process.env.NODE_ENV !== "production";
  const redirect = canonicalRedirect(request);
  if (redirect) return redirect;

  if (request.nextUrl.pathname === "/_wayo/live" || request.nextUrl.pathname === "/wayo-live") {
    const response = request.nextUrl.pathname === "/wayo-live"
      ? NextResponse.next()
      : NextResponse.rewrite(rewriteTarget(request, "/wayo-live"));
    response.headers.set("Cache-Control", "private, no-cache, no-store, max-age=0, must-revalidate");
    return response;
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const response = handleAuth(request, event);
    if (response instanceof Response) {
      response.headers.set("Content-Security-Policy", contentSecurityPolicy({ development, nonce: Buffer.from(crypto.randomUUID()).toString("base64") }));
    }
    return response;
  }

  const { locale: prefix, path } = splitLocalePrefix(request.nextUrl.pathname);
  const requested = request.nextUrl.searchParams.get("lang");

  if (isLocale(requested)) {
    const url = redirectTarget(request, localePath(requested, path));
    url.searchParams.delete("lang");
    const redirect = NextResponse.redirect(url);
    if (!isPrefetch(request)) redirect.cookies.set(LOCALE_COOKIE, requested, cookie);
    return redirect;
  }

  if (prefix === "fr") {
    const url = redirectTarget(request, path);
    const redirect = NextResponse.redirect(url);
    if (!isPrefetch(request)) redirect.cookies.set(LOCALE_COOKIE, "fr", cookie);
    return redirect;
  }

  if (prefix === "en" || prefix === "ar") {
    const url = rewriteTarget(request, path);
    const headers = withPath(request, path, prefix);
    const policy = policyFor(headers, development);
    const response = NextResponse.rewrite(url, { request: { headers } });
    response.headers.set("Content-Security-Policy", policy);
    if (!isPrefetch(request)) response.cookies.set(LOCALE_COOKIE, prefix, cookie);
    return response;
  }

  if (request.nextUrl.pathname.startsWith("/api/") || /\.[a-z0-9]+$/i.test(request.nextUrl.pathname)) {
    const headers = withPath(request, path);
    const policy = policyFor(headers, development);
    const response = NextResponse.next({ request: { headers } });
    response.headers.set("Content-Security-Policy", policy);
    return response;
  }

  const hinted = request.headers.get("x-locale");
  if (isLocale(hinted)) {
    const headers = withPath(request, path, hinted);
    const policy = policyFor(headers, development);
    const response = NextResponse.next({ request: { headers } });
    response.headers.set("Content-Security-Policy", policy);
    return response;
  }

  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const bot = crawler.test(request.headers.get("user-agent") ?? "");
  if (!bot && saved !== "fr") {
    const locale = saved === "ar" ? "ar" : "en";
    const url = redirectTarget(request, localePath(locale, path));
    const redirect = NextResponse.redirect(url);
    if (!isPrefetch(request) && !isLocale(saved)) redirect.cookies.set(LOCALE_COOKIE, "en", cookie);
    return redirect;
  }

  const headers = withPath(request, path);
  const policy = policyFor(headers, development);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Security-Policy", policy);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|logos/).*)"],
};
