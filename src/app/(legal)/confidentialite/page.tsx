import { getUi } from "@/lib/copy";
import { getLocale } from "@/lib/get-locale";
import { localePath } from "@/lib/locale";
import { jsonLd, legalJsonLd } from "@/lib/seo";
import { LegalArticle } from "../article";
import { legalFields } from "../fields";

export default async function ConfidentialitePage() {
  const locale = await getLocale();
  const ui = getUi(locale);
  const settings = await legalFields();
  const email = settings.contactEmail?.trim() || process.env.CONTACT_TO_EMAIL?.trim() || "";
  return (
    <LegalArticle title={ui.privacyTitle} sections={ui.privacySections}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(legalJsonLd(locale, "/confidentialite")) }} />
      <div className="legal-id">
        <p>Wayo Agency</p>
        {settings.legalName ? <p>{ui.privacyOwner} : {settings.legalName}</p> : null}
        {email ? <p>{ui.privacyContact} : <a className="link" href={`mailto:${email}`}>{email}</a></p> : <p>{ui.privacyContactEmpty}</p>}
      </div>
      <p><a className="link" href={localePath(locale, "/mentions-legales")}>{ui.legalTitle}</a></p>
    </LegalArticle>
  );
}
