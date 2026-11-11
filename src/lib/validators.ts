import { z } from "zod";
import { emailLooksValid } from "@/lib/email-address";
import { formErrors } from "@/lib/form-messages";
import type { Locale } from "@/lib/locale";

export const offerSlugs = [
  "audit",
  "rescue",
  "hardening",
  "maintenance",
  "production-ready",
  "unknown",
] as const;

export type OfferSlug = (typeof offerSlugs)[number];

const messages = formErrors.fr;

export const leadSchema = z.object({
  name: z.string().trim().min(2, messages.name).max(120, messages.name),
  email: z.string().trim().email(messages.email).max(254, messages.email),
  offer: z.enum(offerSlugs, { message: messages.offer }),
  stack: z
    .string()
    .trim()
    .max(200, messages.stack)
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(10, messages.message).max(4000, messages.message),
  consent: z.literal(true, { message: messages.consent }),
  website: z.string().optional(),
  utmSource: z.string().trim().max(100).optional().or(z.literal("")),
  utmMedium: z.string().trim().max(100).optional().or(z.literal("")),
  utmCampaign: z.string().trim().max(100).optional().or(z.literal("")),
  locale: z.string().optional(),
  startedAt: z.number().int().positive(),
}).strict();

export type LeadInput = z.infer<typeof leadSchema>;

function schemaFor(locale: Locale) {
  const copy = formErrors[locale];
  return leadSchema.extend({
    name: z.string().trim().min(2, copy.name).max(120, copy.name),
    email: z.string().trim().email(copy.email).max(254, copy.email).refine(emailLooksValid, copy.email),
    offer: z.enum(offerSlugs, { message: copy.offer }),
    stack: z.string().trim().max(200, copy.stack).optional().or(z.literal("")),
    message: z.string().trim().min(10, copy.message).max(4000, copy.message),
    consent: z.literal(true, { message: copy.consent }),
  }).strict();
}

export function validateLead(
  input: unknown,
  locale: Locale = "fr",
): { ok: true; data: LeadInput } | { ok: false; errors: Record<string, string> } {
  const parsed = schemaFor(locale).safeParse(input);
  if (parsed.success) return { ok: true, data: parsed.data };
  const errors: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors };
}

export const MIN_FILL_MS = 3000;

export function submittedTooFast(startedAt: number, now: number): boolean {
  return now - startedAt < MIN_FILL_MS;
}

export function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
