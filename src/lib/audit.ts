import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { adminAuditLog } from "@/lib/schema";

export async function writeAudit(
  actor: string,
  action: string,
  entity: string,
  entityId?: string | number | null,
) {
  const db = getDb();
  await db.insert(adminAuditLog).values({
    actor,
    action,
    entity,
    entityId: entityId == null ? null : String(entityId),
  });
}

export async function requireAdmin() {
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  if (!session?.user?.email) return null;
  return session;
}

export async function touchSettings() {
  const { siteSettings } = await import("@/lib/schema");
  const db = getDb();
  await db
    .update(siteSettings)
    .set({ updatedAt: new Date() })
    .where(eq(siteSettings.id, true));
}
