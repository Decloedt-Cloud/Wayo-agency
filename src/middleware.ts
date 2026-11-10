import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { contentSecurityPolicy } from "@/lib/csp";
import { isLocale, localeFromHeaders, localePath, LOCALE_COOKIE, splitLocalePrefix } from "@/lib/locale";

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

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const development = process.env.NODE_ENV !== "production";
  const redirect = canonicalRedirect(request);
  if (redirect) return redirect;

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
    const url = request.nextUrl.clone();
    url.pathname = localePath(requested, path);
    url.searchParams.delete("lang");
    const redirect = NextResponse.redirect(url);
    redirect.cookies.set(LOCALE_COOKIE, requested, cookie);
    return redirect;
  }

  if (prefix === "fr") {
    const url = request.nextUrl.clone();
    url.pathname = path;
    const redirect = NextResponse.redirect(url);
    redirect.cookies.set(LOCALE_COOKIE, "fr", cookie);
    return redirect;
  }

  if (prefix === "en" || prefix === "ar") {
    const url = request.nextUrl.clone();
    url.pathname = path;
    const headers = withPath(request, path, prefix);
    const policy = policyFor(headers, development);
    const response = NextResponse.rewrite(url, { request: { headers } });
    response.headers.set("Content-Security-Policy", policy);
    response.cookies.set(LOCALE_COOKIE, prefix, cookie);
    return response;
  }

  const headers = withPath(request, path);
  const policy = policyFor(headers, development);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Security-Policy", policy);
  if (!isLocale(request.cookies.get(LOCALE_COOKIE)?.value)) {
    response.cookies.set(LOCALE_COOKIE, localeFromHeaders(request.headers), cookie);
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logos/).*)"],
};
