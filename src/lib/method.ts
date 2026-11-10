export function methodProgress(scrolled: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(0.9999, Math.max(0, scrolled / total));
}

export function methodPhase(progress: number, count = 8): number {
  const bounded = Math.min(0.9999, Math.max(0, progress));
  const total = count > 0 ? count : 1;
  return bounded * total;
}

export function methodStep(progress: number): number {
  return Math.min(7, Math.floor(methodPhase(progress)));
}

export type SlabPose = {
  x: number;
  y: number;
  z: number;
  tilt: number;
  opacity: number;
  fill: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function lerp(from: number, to: number, amount: number): number {
  return from + (to - from) * amount;
}

function smooth(amount: number): number {
  const value = clamp(amount, 0, 1);
  return value * value * (3 - 2 * value);
}

/** Distance along the scroll: negative is already stacked, zero is the active sheet, positive is still waiting. */
export function slabPose(index: number, phase: number): SlabPose {
  const distance = index - phase;
  const pile = index * 18;

  if (distance >= 1) {
    const ahead = distance;
    return {
      x: 36 + ahead * 18,
      y: -28 - ahead * 10,
      z: pile + 70,
      tilt: -62,
      opacity: clamp(0.9 - (ahead - 1) * 0.12, 0.28, 0.9),
      fill: 0,
    };
  }

  if (distance >= 0) {
    const arrived = smooth(1 - distance);
    return {
      x: lerp(54, 0, arrived),
      y: lerp(-38, 0, arrived),
      z: lerp(pile + 70, pile + 46, arrived),
      tilt: lerp(-62, 0, arrived),
      opacity: lerp(0.85, 1, arrived),
      fill: arrived,
    };
  }

  if (distance > -1) {
    const settled = smooth(-distance);
    return {
      x: 0,
      y: lerp(0, 6, settled),
      z: lerp(pile + 46, pile, settled),
      tilt: 0,
      opacity: 1,
      fill: lerp(1, 0.14, settled),
    };
  }

  return {
    x: 0,
    y: 6,
    z: pile,
    tilt: 0,
    opacity: 0.92,
    fill: 0.14,
  };
}

export function quoteLabel(value: string | null | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "Sur devis";
}
