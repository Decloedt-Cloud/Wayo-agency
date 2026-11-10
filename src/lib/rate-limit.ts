import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { rateLimits } from "@/lib/schema";

export const LEAD_LIMIT = 5;
export const LEAD_WINDOW_MS = 60 * 60 * 1000;
export const LOGIN_LIMIT = 5;
export const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export function floorWindow(now: Date, windowMs: number): Date {
  return new Date(Math.floor(now.getTime() / windowMs) * windowMs);
}

export function retryAfterSeconds(now: Date, windowStart: Date, windowMs: number): number {
  const end = windowStart.getTime() + windowMs;
  return Math.max(1, Math.ceil((end - now.getTime()) / 1000));
}

export function evaluateAttempt(previousCount: number, limit: number): {
  count: number;
  allowed: boolean;
} {
  const count = previousCount + 1;
  return { count, allowed: count <= limit };
}

export async function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now = new Date(),
): Promise<{ allowed: boolean; retryAfter: number }> {
  const windowStart = floorWindow(now, windowMs);
  const db = getDb();
  const [row] = await db
    .insert(rateLimits)
    .values({ key, windowStart, count: 1 })
    .onConflictDoUpdate({
      target: [rateLimits.key, rateLimits.windowStart],
      set: { count: sql`${rateLimits.count} + 1` },
    })
    .returning({ count: rateLimits.count });

  const count = row?.count ?? 1;
  return {
    allowed: count <= limit,
    retryAfter: retryAfterSeconds(now, windowStart, windowMs),
  };
}
