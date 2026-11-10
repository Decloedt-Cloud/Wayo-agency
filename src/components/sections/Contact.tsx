import { ContactForm } from "@/components/client/ContactForm";
import type { Ui } from "@/lib/copy";
import type { Locale } from "@/lib/locale";
import type { SettingsRecord } from "@/lib/queries";

export function Contact({ settings, ui, locale }: { settings: SettingsRecord; ui: Ui; locale: Locale }) {
  return (
    <section id="contact" className="section contact">
      <div className="wrap">
        <h2 className="serif reveal">{ui.contactTitleA} <span className="accent">{ui.contactTitleB}</span></h2>
        <div className="cols" style={{ marginTop: 64 }}>
          <div className="reveal" style={{ flex: "1.4 1 460px", minWidth: 0 }}>
            <ContactForm locale={locale} form={ui.form} privacy={ui.privacyTitle} />
          </div>
          <div className="reveal grow">
            <p className="mono faint">{ui.call}</p>
            <p className="serif" style={{ fontSize: 36, lineHeight: 1.05, margin: "10px 0 0" }}>{ui.callBody}</p>
            <a className="btn" href={settings.bookingUrl || "https://tidycal.com/wayoagency"} target="_blank" rel="noopener noreferrer" style={{ marginTop: 22 }}>
              {ui.bookSlot}
            </a>
            {settings.contactEmail ? (
              <p style={{ marginTop: 36 }}>
                <span className="mono faint">Email</span>
                <br />
                <a className="link" href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
