"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { requireAdmin, touchSettings, writeAudit } from "@/lib/audit";
import { signIn } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { faqItems, leadNotes, leads, offers, siteSettings } from "@/lib/schema";
import { emptyToNull } from "@/lib/validators";

const statuses = ["new", "contacted", "qualified", "won", "lost", "spam"] as const;

function redirectError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "digest" in error && String((error as { digest?: string }).digest).startsWith("NEXT_REDIRECT");
}

async function actor() {
  const session = await requireAdmin();
  if (!session?.user?.email) redirect("/admin/login");
  return session.user.email;
}

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (redirectError(error)) throw error;
    if (error instanceof AuthError) redirect("/admin/login?erreur=1");
    throw error;
  }
}

export async function updateLeadStatus(formData: FormData) {
  const email = await actor();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!(statuses as readonly string[]).includes(status)) return;
  await getDb().update(leads).set({ status: status as (typeof statuses)[number], updatedAt: new Date() }).where(eq(leads.id, id));
  await writeAudit(email, "status", "lead", id);
}

export async function addLeadNote(formData: FormData) {
  const email = await actor();
  const leadId = String(formData.get("id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (body.length < 1) return;
  await getDb().insert(leadNotes).values({ leadId, body });
  await writeAudit(email, "note", "lead", leadId);
}

export async function deleteLead(formData: FormData) {
  const email = await actor();
  const id = String(formData.get("id") ?? "");
  if (formData.get("confirm") !== "on") return;
  await getDb().delete(leads).where(eq(leads.id, id));
  await writeAudit(email, "delete", "lead", id);
}

export async function updateOffer(formData: FormData) {
  const email = await actor();
  const id = Number(formData.get("id"));
  const includes = String(formData.get("includes") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  await getDb()
    .update(offers)
    .set({
      name: String(formData.get("name") ?? ""),
      shortLabel: String(formData.get("shortLabel") ?? ""),
      shortDescription: String(formData.get("shortDescription") ?? ""),
      description: String(formData.get("description") ?? ""),
      includes,
      priceLabel: emptyToNull(String(formData.get("priceLabel") ?? "")),
      delayLabel: emptyToNull(String(formData.get("delayLabel") ?? "")),
      published: formData.get("published") === "on",
    })
    .where(eq(offers.id, id));
  await writeAudit(email, "update", "offer", id);
  revalidateTag("content");
}

export async function createFaq(formData: FormData) {
  const email = await actor();
  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  if (!question || !answer) return;
  const db = getDb();
  const [max] = await db.select({ value: sql<number>`coalesce(max(${faqItems.position}), 0)` }).from(faqItems);
  const [created] = await db
    .insert(faqItems)
    .values({ position: Number(max?.value ?? 0) + 1, question, answer, published: true })
    .returning({ id: faqItems.id });
  await writeAudit(email, "create", "faq", created?.id);
  revalidateTag("content");
}

export async function toggleFaq(formData: FormData) {
  const email = await actor();
  const id = Number(formData.get("id"));
  const published = formData.get("published") === "true";
  await getDb().update(faqItems).set({ published: !published }).where(eq(faqItems.id, id));
  await writeAudit(email, "publish", "faq", id);
  revalidateTag("content");
}

export async function moveFaq(formData: FormData) {
  const email = await actor();
  const id = Number(formData.get("id"));
  const delta = formData.get("direction") === "up" ? -1 : 1;
  const db = getDb();
  const [current] = await db.select().from(faqItems).where(eq(faqItems.id, id));
  if (!current) return;
  const [neighbor] = await db.select().from(faqItems).where(eq(faqItems.position, current.position + delta));
  if (!neighbor) return;
  await db.transaction(async (tx) => {
    await tx.update(faqItems).set({ position: -1 }).where(eq(faqItems.id, current.id));
    await tx.update(faqItems).set({ position: current.position }).where(eq(faqItems.id, neighbor.id));
    await tx.update(faqItems).set({ position: neighbor.position }).where(and(eq(faqItems.id, current.id)));
  });
  await writeAudit(email, "reorder", "faq", id);
  revalidateTag("content");
}

export async function updateSettings(formData: FormData) {
  const email = await actor();
  await getDb()
    .update(siteSettings)
    .set({
      contactEmail: emptyToNull(String(formData.get("contactEmail") ?? "")),
      bookingUrl: emptyToNull(String(formData.get("bookingUrl") ?? "")),
      legalName: emptyToNull(String(formData.get("legalName") ?? "")),
      legalAddress: emptyToNull(String(formData.get("legalAddress") ?? "")),
      legalId: emptyToNull(String(formData.get("legalId") ?? "")),
      updatedAt: new Date(),
    })
    .where(eq(siteSettings.id, true));
  await touchSettings();
  await writeAudit(email, "update", "settings", "1");
  revalidateTag("content");
}
