import { AuditReport } from "@/components/sections/AuditReport";
import { Band } from "@/components/sections/Band";
import { Contact } from "@/components/sections/Contact";
import { Domains } from "@/components/sections/Domains";
import { Faq } from "@/components/sections/Faq";
import { Flagship } from "@/components/sections/Flagship";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Method } from "@/components/sections/Method";
import { Offers } from "@/components/sections/Offers";
import { Statement } from "@/components/sections/Statement";
import { CursorRing } from "@/components/client/CursorRing";
import { ToolRail } from "@/components/client/ToolRail";
import { RevealOnView } from "@/components/client/RevealOnView";
import { ScrollVars } from "@/components/client/ScrollVars";
import { getUi, localizeContent } from "@/lib/copy";
import { getLocale, getPathname } from "@/lib/get-locale";
import { getTheme } from "@/lib/get-theme";
import { loadContent } from "@/lib/load-content";
import { homeJsonLd, jsonLd } from "@/lib/seo";

export const revalidate = 0;

export default async function HomePage() {
  const locale = await getLocale();
  const pathname = await getPathname();
  const theme = (await getTheme()) ?? "dark";
  const ui = getUi(locale);
  const content = localizeContent(await loadContent(), locale);
  const structuredData = homeJsonLd(locale, content);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      <main id="contenu">
        <Hero offers={content.offers} ui={ui} locale={locale} theme={theme} pathname={pathname} />
        <ToolRail labels={ui.rail} />
        <Statement text={ui.statement} kicker={ui.statementKicker} emphasis={ui.statementEmphasis} />
        <AuditReport rows={content.auditRows} ui={ui} />
        <Method steps={content.steps} kicker={ui.methodKicker} pause={ui.rail.pause} resume={ui.rail.resume} />
        <Domains domains={content.domains} ui={ui} />
        <Band />
        <Offers offers={content.offers} ui={ui} locale={locale} />
        <Flagship offer={content.flagship} ui={ui} />
        <Faq items={content.faq} ui={ui} />
        <Contact settings={content.settings} ui={ui} locale={locale} />
      </main>
      <Footer ui={ui} locale={locale} bookingUrl={content.settings.bookingUrl} />
      <ScrollVars />
      <RevealOnView />
      <CursorRing />
    </>
  );
}
