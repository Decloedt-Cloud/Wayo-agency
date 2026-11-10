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

function smtpSettings() {
  const host = process.env.CONTACT_SMTP_HOST?.trim();
  const port = Number.parseInt(process.env.CONTACT_SMTP_PORT || "587", 10);
  const user = process.env.CONTACT_SMTP_USER?.trim();
  const pass = process.env.CONTACT_SMTP_PASS;
  const from = (process.env.CONTACT_SMTP_FROM || user || "").trim();
  if (!host || !user || !pass || !from || !Number.isFinite(port)) return null;
  return { host, port, user, pass, from };
}

export async function sendLeadEmails(lead: LeadMail, settings: SettingsRecord, locale: Locale = "fr"): Promise<void> {
  const smtp = smtpSettings();
  if (!smtp) {
    console.error("email_skipped");
    return;
  }

  const inbox = settings.contactEmail?.trim() || process.env.CONTACT_TO_EMAIL?.trim();
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    requireTLS: smtp.port === 587,
    auth: { user: smtp.user, pass: smtp.pass },
    connectionTimeout: 10000,
    socketTimeout: 10000,
  });
  const from = `Wayo Agency <${smtp.from}>`;

  try {
    if (inbox) {
      await transporter.sendMail({
        from,
        to: inbox,
        replyTo: lead.email,
        subject: "Nouveau message — Wayo Agency",
        text: [
          `Langue : ${locale}`,
          `Offre : ${lead.offer}`,
          `Nom : ${lead.name}`,
          `Email : ${lead.email}`,
          `Stack : ${lead.stack ?? "—"}`,
          "",
          lead.message,
        ].join("\n"),
      });
    }
    const thanks = visitorThanks(locale);
    await transporter.sendMail({
      from,
      to: lead.email,
      subject: thanks.subject,
      text: thanks.text,
    });
  } catch {
    console.error("email_failed");
  }
}
