import { describe, expect, it } from "vitest";
import { submittedTooFast, validateLead } from "@/lib/validators";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  offer: "audit",
  stack: "Next.js",
  message: "Le déploiement échoue depuis la dernière génération.",
  consent: true,
  startedAt: 1_700_000_000_000,
};

describe("validateLead", () => {
  it("accepte un message complet", () => {
    const result = validateLead(valid);
    expect(result.ok).toBe(true);
  });

  it("refuse un nom trop court, un email invalide et un message trop court", () => {
    const result = validateLead({ ...valid, name: "A", email: "pas-un-email", message: "court" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.name).toBeTruthy();
      expect(result.errors.email).toBeTruthy();
      expect(result.errors.message).toBeTruthy();
    }
  });

  it("exige le consentement", () => {
    const result = validateLead({ ...valid, consent: false });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.consent).toBeTruthy();
  });

  it("refuse un champ inconnu et conserve une chaîne SQL comme texte", () => {
    const hostile = "'; DROP TABLE leads; --";
    const extra = validateLead({ ...valid, extra: "non" });
    expect(extra.ok).toBe(false);
    const stored = validateLead({ ...valid, message: `${valid.message} ${hostile}` });
    expect(stored.ok).toBe(true);
    if (stored.ok) expect(stored.data.message).toContain(hostile);
  });

  it("refuse un envoi fait en moins de 3 secondes", () => {
    expect(submittedTooFast(1_000, 2_000)).toBe(true);
    expect(submittedTooFast(1_000, 5_000)).toBe(false);
  });

  it("refuse une offre hors enum", () => {
    const result = validateLead({ ...valid, offer: "gratuit" });
    expect(result.ok).toBe(false);
  });
});
