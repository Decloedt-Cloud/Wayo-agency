import { asc, eq } from "drizzle-orm";
import {
  seedAuditRows,
  seedDomains,
  seedFaq,
  seedOffers,
  seedSteps,
} from "@/lib/content";
import { getDb } from "@/lib/db";
import {
  auditExampleRows,
  domains,
  faqItems,
  offers,
  processSteps,
  siteSettings,
} from "@/lib/schema";

export type OfferRecord = {
  id: number;
  slug: string;
  position: number;
  name: string;
  shortLabel: string;
  shortDescription: string;
  description: string;
  includes: string[];
  priceLabel: string | null;
  delayLabel: string | null;
  isFlagship: boolean;
  published: boolean;
};

export type FaqRecord = {
  id: number;
  position: number;
  question: string;
  answer: string;
  published: boolean;
};

export type StepRecord = { id: number; position: number; label: string; body: string };
export type DomainRecord = { id: number; position: number; name: string; detail: string };
export type AuditRecord = { id: number; position: number; severity: string; text: string };
export type SettingsRecord = {
  contactEmail: string | null;
  bookingUrl: string | null;
  legalName: string | null;
  legalAddress: string | null;
  legalId: string | null;
};

export type PageContent = {
  offers: OfferRecord[];
  flagship: OfferRecord;
  faq: FaqRecord[];
  steps: StepRecord[];
  domains: DomainRecord[];
  auditRows: AuditRecord[];
  settings: SettingsRecord;
};

const emptySettings: SettingsRecord = {
  contactEmail: null,
  bookingUrl: null,
  legalName: null,
  legalAddress: null,
  legalId: null,
};

export function fallbackPageContent(): PageContent {
  const offers = seedOffers
    .filter((offer) => !offer.isFlagship)
    .map((offer, index) => ({ ...offer, id: index + 1, priceLabel: null, delayLabel: null, published: true }));
  const flagshipSource = seedOffers.find((offer) => offer.isFlagship);
  if (!flagshipSource) throw new Error("Offre phare absente");
  return {
    offers,
    flagship: { ...flagshipSource, id: 5, priceLabel: null, delayLabel: null, published: true },
    faq: seedFaq.map((item, index) => ({ ...item, id: index + 1, published: true })),
    steps: seedSteps.map((item, index) => ({ ...item, id: index + 1 })),
    domains: seedDomains.map((item, index) => ({ ...item, id: index + 1 })),
    auditRows: seedAuditRows.map((item, index) => ({ ...item, id: index + 1 })),
    settings: emptySettings,
  };
}

export async function queryPageContent(): Promise<PageContent> {
  const db = getDb();
  const [offerRows, faqRows, stepRows, domainRows, auditRows, settingsRows] = await Promise.all([
    db.select().from(offers).where(eq(offers.published, true)).orderBy(asc(offers.position)),
    db.select().from(faqItems).where(eq(faqItems.published, true)).orderBy(asc(faqItems.position)),
    db.select().from(processSteps).orderBy(asc(processSteps.position)),
    db.select().from(domains).orderBy(asc(domains.position)),
    db.select().from(auditExampleRows).orderBy(asc(auditExampleRows.position)),
    db.select().from(siteSettings).limit(1),
  ]);

  const mappedOffers = offerRows.map(mapOffer);
  const regular = mappedOffers.filter((offer) => !offer.isFlagship);
  const flagship = mappedOffers.find((offer) => offer.isFlagship) ?? fallbackPageContent().flagship;
  const settings = settingsRows[0];

  return {
    offers: regular,
    flagship,
    faq: faqRows.map((item) => ({
      id: item.id,
      position: item.position,
      question: item.question,
      answer: item.answer,
      published: item.published,
    })),
    steps: stepRows.map((item) => ({
      id: item.id,
      position: item.position,
      label: item.label,
      body: item.body,
    })),
    domains: domainRows.map((item) => ({
      id: item.id,
      position: item.position,
      name: item.name,
      detail: item.detail,
    })),
    auditRows: auditRows.map((item) => ({
      id: item.id,
      position: item.position,
      severity: item.severity,
      text: item.text,
    })),
    settings: settings
      ? {
          contactEmail: settings.contactEmail,
          bookingUrl: settings.bookingUrl,
          legalName: settings.legalName,
          legalAddress: settings.legalAddress,
          legalId: settings.legalId,
        }
      : emptySettings,
  };
}

function mapOffer(offer: typeof offers.$inferSelect): OfferRecord {
  return {
    id: offer.id,
    slug: offer.slug,
    position: offer.position,
    name: offer.name,
    shortLabel: offer.shortLabel,
    shortDescription: offer.shortDescription,
    description: offer.description,
    includes: offer.includes ?? [],
    priceLabel: offer.priceLabel,
    delayLabel: offer.delayLabel,
    isFlagship: offer.isFlagship,
    published: offer.published,
  };
}
