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

function visitorLabel(lead: LeadMail) {
  const name = lead.name.replace(/[\r\n<>"]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
  const email = lead.email.replace(/[\r\n<>"]/g, "").trim();
  return name ? `${name} — ${email}` : email;
}

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
  const visitor = { name: visitorLabel(lead), address: smtp.from };

  const notice = [
    `Langue : ${locale}`,
    `Offre : ${lead.offer}`,
    `Nom : ${lead.name}`,
    `Email : ${lead.email}`,
    `Stack : ${lead.stack ?? "—"}`,
    "",
    lead.message,
  ].join("\n");
  const thanks = visitorThanks(locale);
  const jobs = [
    inbox
      ? transporter.sendMail({
          from: visitor,
          replyTo: lead.email,
          to: inbox,
          subject: "Nouveau message — Wayo Agency",
          text: notice,
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
