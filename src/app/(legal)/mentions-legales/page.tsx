import { getUi } from "@/lib/copy";
import { getLocale } from "@/lib/get-locale";
import { localePath } from "@/lib/locale";
import { jsonLd, legalJsonLd } from "@/lib/seo";
import { LegalArticle } from "../article";
import { legalFields } from "../fields";

export default async function MentionsPage() {
  const locale = await getLocale();
  const ui = getUi(locale);
  const settings = await legalFields();
  const email = settings.contactEmail?.trim() || process.env.CONTACT_TO_EMAIL?.trim() || "";
  const filled = settings.legalName || settings.legalAddress || settings.legalId;
  return (
    <LegalArticle title={ui.legalTitle} sections={ui.legalSections}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(legalJsonLd(locale, "/mentions-legales")) }} />
      <div className="legal-id">
        <p>Wayo Agency</p>
        {settings.legalName ? <p>{settings.legalName}</p> : null}
        {settings.legalAddress ? <p>{settings.legalAddress}</p> : null}
        {settings.legalId ? <p>{settings.legalId}</p> : null}
        {email ? <p><a className="link" href={`mailto:${email}`}>{email}</a></p> : null}
        {filled ? null : <p>{ui.legalEmpty}</p>}
      </div>
      <p><a className="link" href={localePath(locale, "/confidentialite")}>{ui.privacyTitle}</a></p>
    </LegalArticle>
  );
}
