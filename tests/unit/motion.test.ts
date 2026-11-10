import { describe, expect, it } from "vitest";
import { anomalyIndexes, createField, structureProgress } from "@/lib/hero-motion";
import { methodPhase, methodStep, slabPose } from "@/lib/method";
import { wrapRail } from "@/lib/rail";
import { contrastRatio } from "@/lib/contrast";

describe("structure du canvas", () => {
  it("suit le cycle de 15 secondes", () => {
    expect(structureProgress(0)).toBe(0);
    expect(structureProgress(2.8)).toBeCloseTo(0, 5);
    expect(structureProgress(4.6)).toBeCloseTo(0.5, 5);
    expect(structureProgress(6.4)).toBe(1);
    expect(structureProgress(11.6)).toBe(1);
    expect(structureProgress(14.2)).toBeCloseTo(0, 5);
    expect(structureProgress(15)).toBe(0);
    expect(structureProgress(21.4)).toBeCloseTo(structureProgress(6.4), 5);
  });

  it("reproduit le même champ avec une graine fixe", () => {
    const first = createField(10, 1103);
    const second = createField(10, 1103);
    expect(first).toHaveLength(1000);
    expect(first[0]).toEqual(second[0]);
    expect(anomalyIndexes(first)).toHaveLength(3);
  });
});

describe("étape de la méthode", () => {
  it("découpe la progression en 8 étapes", () => {
    expect(methodStep(0)).toBe(0);
    expect(methodStep(0.125)).toBe(1);
    expect(methodStep(0.9999)).toBe(7);
    expect(methodStep(1)).toBe(7);
    expect(methodStep(-1)).toBe(0);
  });

  it("fait avancer les feuilles avec le scroll", () => {
    expect(methodPhase(0)).toBe(0);
    expect(methodPhase(0.125)).toBe(1);
    expect(methodPhase(0.9999)).toBeCloseTo(7.9992, 3);

    const current = slabPose(4, 4);
    const incoming = slabPose(5, 4);
    const midFlight = slabPose(5, 4.5);
    const settled = slabPose(4, 5);

    expect(current.fill).toBe(1);
    expect(current.tilt).toBe(0);
    expect(incoming.fill).toBe(0);
    expect(incoming.tilt).toBe(-62);
    expect(midFlight.x).toBeGreaterThan(0);
    expect(midFlight.x).toBeLessThan(incoming.x);
    expect(midFlight.fill).toBeGreaterThan(0.4);
    expect(midFlight.fill).toBeLessThan(0.6);
    expect(settled.fill).toBeCloseTo(0.14, 5);
    expect(settled.z).toBeLessThan(current.z);
  });
});

describe("bande des stacks", () => {
  it("boucle le défilement sans saut", () => {
    expect(wrapRail(0, 400)).toBe(0);
    expect(wrapRail(420, 400)).toBe(20);
    expect(wrapRail(-30, 400)).toBe(370);
    expect(wrapRail(800, 400)).toBe(0);
    expect(wrapRail(10, 0)).toBe(0);
  });
});

describe("contraste", () => {
  it("garde le texte muted au-dessus de 4.5:1", () => {
    expect(contrastRatio("#8f897e", "#0a0908")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio("#a39d92", "#0a0908")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio("#cfc9be", "#0a0908")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio("#0a0908", "#ff5a1f")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio("#0a0908", "#f2efe9")).toBeGreaterThanOrEqual(4.5);
  });
});
