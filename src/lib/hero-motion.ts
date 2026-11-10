const CYCLE_SECONDS = 15;

function easeInOutCubic(value: number): number {
  return value < 0.5 ? 4 * value * value * value : 1 - (-2 * value + 2) ** 3 / 2;
}

export function structureProgress(timeSeconds: number): number {
  const cycle = ((timeSeconds % CYCLE_SECONDS) + CYCLE_SECONDS) % CYCLE_SECONDS;
  if (cycle < 2.8) return 0;
  if (cycle < 6.4) return easeInOutCubic((cycle - 2.8) / 3.6);
  if (cycle < 11.6) return 1;
  if (cycle < 14.2) return 1 - easeInOutCubic((cycle - 11.6) / 2.6);
  return 0;
}

export type FieldPoint = {
  ox: number;
  oy: number;
  oz: number;
  cx: number;
  cy: number;
  cz: number;
  phase: number;
  anomaly: boolean;
};

export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createField(grid: number, seed = 1103): FieldPoint[] {
  const random = mulberry32(seed);
  const center = (grid - 1) / 2;
  const points: FieldPoint[] = [];
  for (let x = 0; x < grid; x += 1) {
    for (let y = 0; y < grid; y += 1) {
      for (let z = 0; z < grid; z += 1) {
        const theta = random() * Math.PI * 2;
        const phi = Math.acos(2 * random() - 1);
        const radius = 2.2 + random() * (9.4 - 2.2);
        points.push({
          ox: x - center,
          oy: y - center,
          oz: z - center,
          cx: radius * Math.sin(phi) * Math.cos(theta),
          cy: radius * Math.sin(phi) * Math.sin(theta) * 0.8,
          cz: radius * Math.cos(phi),
          phase: random() * Math.PI * 2,
          anomaly: random() < 0.055,
        });
      }
    }
  }
  return points;
}

export function anomalyIndexes(points: FieldPoint[], count = 3): number[] {
  const indexes: number[] = [];
  for (let index = 0; index < points.length && indexes.length < count; index += 1) {
    if (points[index]?.anomaly) indexes.push(index);
  }
  return indexes;
}
