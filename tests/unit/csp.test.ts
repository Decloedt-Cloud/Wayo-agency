import { describe, expect, it } from "vitest";
import { contentSecurityPolicy, securityHeaders } from "@/lib/csp";
import { isAllowedOrigin } from "@/lib/site";

describe("en-têtes de sécurité", () => {
  it("pose les en-têtes demandés et réserve HSTS à la production", () => {
    const names = securityHeaders(false).map((header) => header.key);
    expect(names).toEqual(expect.arrayContaining([
      "X-Content-Type-Options",
      "Referrer-Policy",
      "Permissions-Policy",
      "X-Frame-Options",
      "Cross-Origin-Opener-Policy",
      "Strict-Transport-Security",
    ]));
    expect(securityHeaders(true).some((header) => header.key === "Strict-Transport-Security")).toBe(false);
    const hsts = securityHeaders(false).find((header) => header.key === "Strict-Transport-Security");
    expect(hsts?.value).toBe("max-age=63072000; includeSubDomains; preload");
  });

  it("utilise un nonce en production et unsafe-inline seulement en développement", () => {
    const prod = contentSecurityPolicy({ development: false, nonce: "abc" });
    expect(prod).toContain("script-src 'self' 'nonce-abc' 'strict-dynamic'");
    expect(prod).toContain("upgrade-insecure-requests");
    expect(prod).not.toContain("unsafe-eval");
    const dev = contentSecurityPolicy({ development: true });
    expect(dev).toContain("'unsafe-inline'");
    expect(dev).toContain("'unsafe-eval'");
  });

  it("accepte localhost et 127.0.0.1 sur le même port, et refuse un autre site", () => {
    expect(isAllowedOrigin("http://127.0.0.1:3010", "http://localhost:3010")).toBe(true);
    expect(isAllowedOrigin(null, "http://localhost:3010")).toBe(false);
    expect(isAllowedOrigin("https://evil.example", "http://localhost:3010")).toBe(false);
  });
});
