import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  seedAuditRows,
  seedDomains,
  seedFaq,
  seedOffers,
  seedSteps,
} from "../src/lib/content";
import {
  auditExampleRows,
  domains,
  faqItems,
  offers,
  processSteps,
  siteSettings,
} from "../src/lib/schema";
import { loadLocalEnv } from "../src/lib/site";

loadLocalEnv();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL manquant");
  process.exit(1);
}

const sql = postgres(url, { max: 1, prepare: false });
const db = drizzle(sql);

async function upsertByPosition<T extends { position: number }>(
  rows: T[],
  find: (position: number) => Promise<{ id: number } | undefined>,
  insert: (row: T) => Promise<void>,
  update: (id: number, row: T) => Promise<void>,
) {
  for (const row of rows) {
    const existing = await find(row.position);
    if (existing) await update(existing.id, row);
    else await insert(row);
  }
}

async function main() {
  for (const offer of seedOffers) {
    await db
      .insert(offers)
      .values({
        slug: offer.slug,
        position: offer.position,
        name: offer.name,
        shortLabel: offer.shortLabel,
        shortDescription: offer.shortDescription,
        description: offer.description,
        includes: offer.includes,
        priceLabel: null,
        delayLabel: null,
        isFlagship: offer.isFlagship,
        published: true,
      })
      .onConflictDoUpdate({
        target: offers.slug,
        set: {
          position: offer.position,
          name: offer.name,
          shortLabel: offer.shortLabel,
          shortDescription: offer.shortDescription,
          description: offer.description,
          includes: offer.includes,
          isFlagship: offer.isFlagship,
          published: true,
        },
      });
  }

  await upsertByPosition(
    seedFaq,
    async (position) => {
      const [row] = await db.select({ id: faqItems.id }).from(faqItems).where(eq(faqItems.position, position));
      return row;
    },
    async (row) => {
      await db.insert(faqItems).values({ ...row, published: true });
    },
    async (id, row) => {
      await db.update(faqItems).set({ question: row.question, answer: row.answer }).where(eq(faqItems.id, id));
    },
  );

  await upsertByPosition(
    seedSteps,
    async (position) => {
      const [row] = await db
        .select({ id: processSteps.id })
        .from(processSteps)
        .where(eq(processSteps.position, position));
      return row;
    },
    async (row) => {
      await db.insert(processSteps).values(row);
    },
    async (id, row) => {
      await db.update(processSteps).set({ label: row.label, body: row.body }).where(eq(processSteps.id, id));
    },
  );

  await upsertByPosition(
    seedDomains,
    async (position) => {
      const [row] = await db.select({ id: domains.id }).from(domains).where(eq(domains.position, position));
      return row;
    },
    async (row) => {
      await db.insert(domains).values(row);
    },
    async (id, row) => {
      await db.update(domains).set({ name: row.name, detail: row.detail }).where(eq(domains.id, id));
    },
  );

  await upsertByPosition(
    [...seedAuditRows],
    async (position) => {
      const [row] = await db
        .select({ id: auditExampleRows.id })
        .from(auditExampleRows)
        .where(eq(auditExampleRows.position, position));
      return row;
    },
    async (row) => {
      await db.insert(auditExampleRows).values(row);
    },
    async (id, row) => {
      await db
        .update(auditExampleRows)
        .set({ severity: row.severity, text: row.text })
        .where(eq(auditExampleRows.id, id));
    },
  );

  await db.insert(siteSettings).values({ id: true }).onConflictDoNothing();
}

main()
  .then(async () => {
    await sql.end();
  })
  .catch(async (error: unknown) => {
    console.error("seed_failed");
    console.error(error instanceof Error ? error.name : "error");
    await sql.end();
    process.exit(1);
  });
