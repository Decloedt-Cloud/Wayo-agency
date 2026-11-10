import type { Ui } from "@/lib/copy";
import { localePath, type Locale } from "@/lib/locale";
import type { OfferRecord } from "@/lib/queries";

export function Offers({ offers, ui, locale }: { offers: OfferRecord[]; ui: Ui; locale: Locale }) {
  return (
    <section id="offres" className="section">
      <div className="wrap">
        <div className="reveal">
          <p className="mono kicker"><span>§ 05</span> {ui.offersKicker}</p>
          <h2 className="serif display">{ui.offersTitleA} <span className="accent">{ui.offersTitleB}</span></h2>
        </div>
        <div className="offers" style={{ marginTop: 56 }}>
          {offers.map((offer) => (
            <a key={offer.slug} className="offer" href={offer.slug === "unknown" ? "#contact" : localePath(locale, `/offres/${offer.slug}`)}>
              <span className="mono accent" style={{ flex: "0 0 40px", paddingTop: 14 }}>{String(offer.position).padStart(2, "0")}</span>
              <span className="serif title">{offer.name}</span>
              <span className="body">
                <span className="muted" style={{ display: "block", fontSize: 18 }}>{offer.description}</span>
                <span className="mono faint" style={{ display: "block", marginTop: 10, letterSpacing: "0.04em", textTransform: "none", lineHeight: 1.7 }}>
                  {offer.includes.join(" · ")}
                </span>
              </span>
              <span className="mono meta">
                {ui.price} : {offer.priceLabel?.trim() || ui.onRequest}
                <br />
                {ui.delay} : {offer.delayLabel?.trim() || ui.onRequest}
              </span>
              <span className="arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
