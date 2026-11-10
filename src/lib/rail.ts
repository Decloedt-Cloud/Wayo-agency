export function wrapRail(offset: number, half: number): number {
  if (half <= 0) return 0;
  let value = offset;
  while (value >= half) value -= half;
  while (value < 0) value += half;
  return value;
}
