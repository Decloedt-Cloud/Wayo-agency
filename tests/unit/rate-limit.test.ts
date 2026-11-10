import { describe, expect, it } from "vitest";
import { hashIp } from "@/lib/ip";
import {
  evaluateAttempt,
  floorWindow,
  LEAD_LIMIT,
  LEAD_WINDOW_MS,
  retryAfterSeconds,
} from "@/lib/rate-limit";

describe("rate limiter", () => {
  it("autorise 5 envois et refuse le 6e", () => {
    let previous = 0;
    for (let attempt = 1; attempt <= LEAD_LIMIT; attempt += 1) {
      const result = evaluateAttempt(previous, LEAD_LIMIT);
      expect(result.allowed).toBe(true);
      previous = result.count;
    }
    expect(evaluateAttempt(previous, LEAD_LIMIT).allowed).toBe(false);
  });

  it("aligne la fenêtre sur une heure UTC", () => {
    const start = floorWindow(new Date("2026-11-10T10:42:12.000Z"), LEAD_WINDOW_MS);
    expect(start.toISOString()).toBe("2026-11-10T10:00:00.000Z");
    expect(retryAfterSeconds(new Date("2026-11-10T10:42:12.000Z"), start, LEAD_WINDOW_MS)).toBe(1068);
  });

  it("hash l'adresse avec le sel sans la conserver", () => {
    const hash = hashIp("203.0.113.10", "sel");
    expect(hash).toHaveLength(64);
    expect(hash).not.toContain("203.0.113.10");
    expect(hashIp("203.0.113.10", "sel")).toBe(hash);
    expect(hashIp("203.0.113.10", "autre")).not.toBe(hash);
  });
});
