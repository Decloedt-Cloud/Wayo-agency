import { describe, expect, it } from "vitest";
import { getUi } from "@/lib/copy";
import { localeFromCountry, localeFromHeaders, localePath, splitLocalePrefix } from "@/lib/locale";
import { jsonLd } from "@/lib/seo";

describe("langue selon le pays de l'IP", () => {
  it("choisit l'arabe, le français ou l'anglais", () => {
    expect(localeFromCountry("SA")).toBe("ar");
    expect(localeFromCountry("ma")).toBe("ar");
    expect(localeFromCountry("FR")).toBe("fr");
    expect(localeFromCountry("SN")).toBe("fr");
    expect(localeFromCountry("US")).toBe("en");
    expect(localeFromCountry("GB")).toBe("en");
    expect(localeFromCountry(null)).toBeNull();
    expect(localeFromCountry("XX")).toBeNull();
  });

  it("lit le pays fourni par l'hébergeur sans garder l'adresse", () => {
    const headers = new Headers({ "x-vercel-ip-country": "AE" });
    expect(localeFromHeaders(headers)).toBe("ar");
    expect(localeFromHeaders(new Headers({ "cf-ipcountry": "FR" }))).toBe("fr");
    expect(localeFromHeaders(new Headers())).toBe("fr");
  });

  it("donne une adresse stable par langue", () => {
    expect(localePath("fr", "/")).toBe("/");
    expect(localePath("en", "/")).toBe("/en");
    expect(localePath("ar", "/confidentialite")).toBe("/ar/confidentialite");
    expect(splitLocalePrefix("/en/mentions-legales")).toEqual({ locale: "en", path: "/mentions-legales" });
    expect(splitLocalePrefix("/")).toEqual({ locale: null, path: "/" });
  });

  it("garde un titre français de 50 à 60 caractères et échappe le JSON-LD", () => {
    const title = getUi("fr").siteTitle;
    expect(title.length).toBeGreaterThanOrEqual(50);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(jsonLd({ name: "</script><script>alert(1)</script>" })).not.toContain("<");
  });
});
