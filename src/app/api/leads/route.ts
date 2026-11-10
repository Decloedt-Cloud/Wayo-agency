import { NextResponse } from "next/server";
import { sendLeadEmails } from "@/lib/email";
import { hashIp, clientIp } from "@/lib/ip";
import { getDb } from "@/lib/db";
import { LEAD_LIMIT, LEAD_WINDOW_MS, consumeRateLimit } from "@/lib/rate-limit";
import { leads, siteSettings } from "@/lib/schema";
import { isAllowedOrigin } from "@/lib/site";
import { isLocale } from "@/lib/locale";
import { emptyToNull, submittedTooFast, validateLead } from "@/lib/validators";

const MAX_BYTES = 10 * 1024;

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const requestOrigin = new URL(request.url).origin;
  if (!isAllowedOrigin(origin, requestOrigin)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json({ ok: false }, { status: 415 });
  }

  const raw = await request.text();
  if (Buffer.byteLength(raw) > MAX_BYTES) {
    return NextResponse.json({ ok: false }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ errors: { message: "Message illisible." } }, { status: 400 });
  }

  if (body && typeof body === "object" && "website" in body && String((body as { website?: string }).website ?? "").trim()) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const requestedLocale = body && typeof body === "object" && "locale" in body ? String((body as { locale?: string }).locale ?? "") : "";
  const locale = isLocale(requestedLocale) ? requestedLocale : "fr";
  const parsed = validateLead(body, locale);
  if (!parsed.ok) return NextResponse.json({ errors: parsed.errors }, { status: 400 });
  if (submittedTooFast(parsed.data.startedAt, Date.now())) {
    return NextResponse.json({ errors: { message: "Message illisible." } }, { status: 400 });
  }

  const salt = process.env.IP_HASH_SALT;
  if (!salt) {
    console.error("config_missing");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const ipHash = hashIp(clientIp(request.headers), salt);
  const lead = {
    name: parsed.data.name,
    email: parsed.data.email,
    offer: parsed.data.offer,
    stack: emptyToNull(parsed.data.stack),
    message: parsed.data.message,
  };

  try {
    const limit = await consumeRateLimit(`lead:${ipHash}`, LEAD_LIMIT, LEAD_WINDOW_MS);
    if (!limit.allowed) {
      return NextResponse.json(
        { ok: false },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
      );
    }

    const db = getDb();
    await db.transaction(async (tx) => {
      await tx.insert(leads).values({
        ...lead,
        ipHash,
        userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
        utmSource: emptyToNull(parsed.data.utmSource),
        utmMedium: emptyToNull(parsed.data.utmMedium),
        utmCampaign: emptyToNull(parsed.data.utmCampaign),
      });
    });
    const [settings] = await db.select().from(siteSettings).limit(1);
    try {
      await sendLeadEmails(lead, {
        contactEmail: settings?.contactEmail ?? null,
        bookingUrl: settings?.bookingUrl ?? null,
        legalName: settings?.legalName ?? null,
        legalAddress: settings?.legalAddress ?? null,
        legalId: settings?.legalId ?? null,
      }, locale);
    } catch {
      console.error("email_failed");
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    console.error("lead_insert_failed");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
