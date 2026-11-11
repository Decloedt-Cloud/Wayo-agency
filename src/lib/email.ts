import nodemailer from "nodemailer";
import { visitorThanks } from "@/lib/copy";
import type { Locale } from "@/lib/locale";
import type { SettingsRecord } from "@/lib/queries";

type LeadMail = {
  name: string;
  email: string;
  offer: string;
  stack: string | null;
  message: string;
};

const offers: Record<string, string> = {
  audit: "Audit",
  rescue: "Rescue",
  hardening: "Hardening",
  maintenance: "Maintenance",
  "production-ready": "Production Ready",
  unknown: "Je ne sais pas",
};

const languages: Record<string, string> = {
  fr: "Français",
  en: "English",
  ar: "العربية",
};

function smtpSettings() {
  const host = process.env.CONTACT_SMTP_HOST?.trim();
  const port = Number.parseInt(process.env.CONTACT_SMTP_PORT || "587", 10);
  const user = process.env.CONTACT_SMTP_USER?.trim();
  const pass = process.env.CONTACT_SMTP_PASS;
  const from = user;
  const inbox = (process.env.CONTACT_SMTP_FROM || process.env.CONTACT_TO_EMAIL || user || "").trim();
  if (!host || !user || !pass || !from || !inbox || !Number.isFinite(port)) return null;
  return { host, port, user, pass, from, inbox };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function plain(value: string) {
  return value.replace(/[\r\n<>"]/g, " ").replace(/\s+/g, " ").trim();
}

export function renderLeadNotice(lead: LeadMail, locale: Locale) {
  const name = lead.name.trim();
  const email = lead.email.trim();
  const offer = offers[lead.offer] ?? lead.offer;
  const stack = lead.stack?.trim() || "—";
  const language = languages[locale] ?? locale;
  const sent = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }).format(new Date());
  const subject = `${plain(name)} — ${plain(email)}`;
  const text = [
    `De : ${name}`,
    `Email : ${email}`,
    `Offre : ${offer}`,
    `Stack : ${stack}`,
    `Langue : ${language}`,
    `Reçu : ${sent}`,
    "",
    "Problème",
    lead.message.trim(),
  ].join("\n");

  const rows = [
    ["Offre", offer],
    ["Stack", stack],
    ["Langue", language],
    ["Reçu", sent],
  ] as const;
  const facts = rows
    .map(
      ([label, value]) => `<tr>
        <td style="padding:11px 0;border-top:1px solid rgba(242,239,233,.16);font-family:Consolas,'Courier New',monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#a39d92;width:92px;vertical-align:top;">${label}</td>
        <td style="padding:11px 0;border-top:1px solid rgba(242,239,233,.16);font-family:Georgia,'Palatino Linotype',serif;font-size:16px;line-height:1.4;color:#f2efe9;">${escapeHtml(value)}</td>
      </tr>`,
    )
    .join("");
  const direction = locale === "ar" ? "rtl" : "ltr";
  const html = `<!doctype html>
<html lang="fr">
<body style="margin:0;padding:0;background:#0a0908;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0908;">
    <tr>
      <td align="center" style="padding:28px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#0e0c0b;border:1px solid rgba(242,239,233,.16);">
          <tr>
            <td style="padding:0;background:#ff5a1f;height:4px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:28px 32px 0;font-family:Consolas,'Courier New',monospace;font-size:12px;letter-spacing:.22em;color:#ff5a1f;">WAYO AGENCY</td>
          </tr>
          <tr>
            <td style="padding:18px 32px 0;font-family:Georgia,'Palatino Linotype',serif;font-size:34px;line-height:1.05;color:#f2efe9;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding:10px 32px 0;font-family:Georgia,'Palatino Linotype',serif;font-size:18px;line-height:1.4;">
              <a href="mailto:${encodeURIComponent(email)}" style="color:#ff8a4c;text-decoration:none;">${escapeHtml(email)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${facts}</table>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 0;font-family:Consolas,'Courier New',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#a39d92;">Problème</td>
          </tr>
          <tr>
            <td dir="${direction}" style="padding:12px 32px 0;font-family:Georgia,'Palatino Linotype',serif;font-size:18px;line-height:1.55;color:#f2efe9;white-space:pre-wrap;">${escapeHtml(lead.message.trim())}</td>
          </tr>
          <tr>
            <td style="padding:28px 32px 32px;">
              <a href="mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent("Wayo Agency — votre message")}" style="display:inline-block;background:#ff5a1f;color:#0a0908;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:1;text-decoration:none;padding:14px 18px;">Répondre à ${escapeHtml(email)}</a>
            </td>
          </tr>
        </table>
        <p style="margin:14px 0 0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.4;color:#8f897e;">Message reçu sur wayo.agency</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
  return { subject, text, html, email };
}

export async function sendLeadEmails(lead: LeadMail, settings: SettingsRecord, locale: Locale = "fr"): Promise<void> {
  const smtp = smtpSettings();
  if (!smtp) {
    console.error("email_skipped");
    return;
  }

  const inbox = smtp.inbox || settings.contactEmail?.trim() || process.env.CONTACT_TO_EMAIL?.trim();
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    requireTLS: smtp.port === 587,
    auth: { user: smtp.user, pass: smtp.pass },
    connectionTimeout: 10000,
    socketTimeout: 10000,
  });
  const agency = `Wayo Agency <${smtp.from}>`;
  const notice = renderLeadNotice(lead, locale);
  const thanks = visitorThanks(locale);
  const jobs = [
    inbox
      ? transporter.sendMail({
          from: { name: plain(lead.name), address: smtp.from },
          replyTo: notice.email,
          to: inbox,
          subject: notice.subject,
          text: notice.text,
          html: notice.html,
        })
      : Promise.resolve(),
    transporter.sendMail({ from: agency, to: lead.email, replyTo: inbox, subject: thanks.subject, text: thanks.text }),
  ];
  const results = await Promise.allSettled(jobs);
  for (const result of results) {
    if (result.status === "rejected") {
      const err = result.reason as { code?: string; responseCode?: number };
      console.error("email_failed", err.code ?? "", err.responseCode ?? "");
    }
  }
}
