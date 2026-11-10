import { sql } from "drizzle-orm";
import {
  bigserial,
  boolean,
  char,
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  smallserial,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const leadStatus = pgEnum("lead_status", [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
  "spam",
]);

export const offerSlug = pgEnum("offer_slug", [
  "audit",
  "rescue",
  "hardening",
  "maintenance",
  "production-ready",
  "unknown",
]);

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 254 }).notNull(),
    offer: offerSlug("offer").notNull().default("unknown"),
    stack: varchar("stack", { length: 200 }),
    message: text("message").notNull(),
    status: leadStatus("status").notNull().default("new"),
    ipHash: char("ip_hash", { length: 64 }),
    userAgent: varchar("user_agent", { length: 300 }),
    utmSource: varchar("utm_source", { length: 100 }),
    utmMedium: varchar("utm_medium", { length: 100 }),
    utmCampaign: varchar("utm_campaign", { length: 100 }),
    consentAt: timestamp("consent_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("leads_status_created_idx").on(table.status, table.createdAt),
    index("leads_email_idx").on(sql`lower(${table.email})`),
    check(
      "leads_message_length",
      sql`char_length(${table.message}) between 10 and 4000`,
    ),
  ],
);

export const leadNotes = pgTable("lead_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const rateLimits = pgTable(
  "rate_limits",
  {
    key: text("key").notNull(),
    windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
    count: integer("count").notNull().default(1),
  },
  (table) => [primaryKey({ columns: [table.key, table.windowStart] })],
);

export const offers = pgTable("offers", {
  id: smallserial("id").primaryKey(),
  slug: offerSlug("slug").notNull().unique(),
  position: smallint("position").notNull(),
  name: text("name").notNull(),
  shortLabel: text("short_label").notNull(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  includes: text("includes").array().notNull().default([]),
  priceLabel: text("price_label"),
  delayLabel: text("delay_label"),
  isFlagship: boolean("is_flagship").notNull().default(false),
  published: boolean("published").notNull().default(true),
});

export const faqItems = pgTable("faq_items", {
  id: smallserial("id").primaryKey(),
  position: smallint("position").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  published: boolean("published").notNull().default(true),
});

export const processSteps = pgTable(
  "process_steps",
  {
    id: smallserial("id").primaryKey(),
    position: smallint("position").notNull(),
    label: text("label").notNull(),
    body: text("body").notNull(),
  },
  (table) => [unique("process_steps_position_unique").on(table.position)],
);

export const domains = pgTable(
  "domains",
  {
    id: smallserial("id").primaryKey(),
    position: smallint("position").notNull(),
    name: text("name").notNull(),
    detail: text("detail").notNull(),
  },
  (table) => [unique("domains_position_unique").on(table.position)],
);

export const auditExampleRows = pgTable(
  "audit_example_rows",
  {
    id: smallserial("id").primaryKey(),
    position: smallint("position").notNull(),
    severity: text("severity").notNull(),
    text: text("text").notNull(),
  },
  (table) => [
    check(
      "audit_example_rows_severity",
      sql`${table.severity} in ('critique', 'eleve', 'moyen')`,
    ),
  ],
);

export const siteSettings = pgTable("site_settings", {
  id: boolean("id").primaryKey().default(true),
  contactEmail: text("contact_email"),
  bookingUrl: text("booking_url"),
  legalName: text("legal_name"),
  legalAddress: text("legal_address"),
  legalId: text("legal_id"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const adminAuditLog = pgTable("admin_audit_log", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  actor: text("actor").notNull(),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
