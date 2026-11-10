import type { Ui } from "@/lib/copy";
import type { OfferRecord } from "@/lib/queries";

export function Flagship({ offer, ui }: { offer: OfferRecord; ui: Ui }) {
  return (
    <section className="flagship">
      <div className="wrap">
        <p className="mono reveal">{ui.flagshipKicker}</p>
        <h2 className="serif reveal">
          Vibe Code
          <br />
          <span style={{ fontStyle: "italic" }}>→ Production Ready</span>
        </h2>
        <div className="cols reveal" style={{ marginTop: 40, alignItems: "flex-end" }}>
          <p style={{ margin: 0, maxWidth: 680, fontWeight: 500 }}>{offer.description}</p>
          <div>
            <p className="mono" style={{ letterSpacing: "0.06em", textTransform: "none" }}>
              {ui.price} : {offer.priceLabel?.trim() || ui.onRequest}
              <br />
              {ui.delay} : {offer.delayLabel?.trim() || ui.onRequest}
            </p>
            <a className="btn btn-dark" href="#contact">{ui.flagshipCta}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
