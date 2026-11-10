import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/sections/Footer";
import { getUi, localizeContent, offerPageTitle } from "@/lib/copy";
import { getLocale } from "@/lib/get-locale";
import { localePath } from "@/lib/locale";
import { loadContent } from "@/lib/load-content";
import { buildMetadata, jsonLd, serviceJsonLd } from "@/lib/seo";

export const revalidate = 0;

async function offerFor(slug: string) {
  const locale = await getLocale();
  const content = localizeContent(await loadContent(), locale);
  const offer = content.offers.find((item) => item.slug === slug && item.published && item.slug !== "unknown");
  return { locale, content, offer };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { locale, offer } = await offerFor(slug);
  if (!offer) return {};
  const description = offer.description.replace(/\s+/g, " ").trim().slice(0, 160);
  return buildMetadata(locale, `/offres/${slug}`, {
    title: offerPageTitle(locale, slug, `${offer.name} | Wayo Agency`).slice(0, 60),
    description,
  });
}

export default async function OfferPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { locale, content, offer } = await offerFor(slug);
  if (!offer) notFound();
  const ui = getUi(locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(serviceJsonLd(locale, offer)) }} />
      <main id="contenu" className="section">
        <article className="wrap legal">
          <p className="mono kicker"><a className="link" href={localePath(locale, "/")}>Wayo Agency</a></p>
          <h1 className="serif display">{offer.name}</h1>
          <p>{offer.description}</p>
          <h2 className="serif">{ui.offersKicker}</h2>
          <ul>
            {offer.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mono">
            {ui.price} : {offer.priceLabel?.trim() || ui.onRequest}
            <br />
            {ui.delay} : {offer.delayLabel?.trim() || ui.onRequest}
          </p>
          <p><a className="btn" href={`${localePath(locale, "/")}#contact`}>{ui.book}</a></p>
          <p><a className="link" href={`${localePath(locale, "/")}#faq`}>{ui.faqTitleA} {ui.faqTitleB}</a></p>
        </article>
      </main>
      <Footer ui={ui} locale={locale} bookingUrl={content.settings.bookingUrl} />
    </>
  );
}
