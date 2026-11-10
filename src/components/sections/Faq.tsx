import { FaqAccordion } from "@/components/client/FaqAccordion";
import type { Ui } from "@/lib/copy";
import type { FaqRecord } from "@/lib/queries";

export function Faq({ items, ui }: { items: FaqRecord[]; ui: Ui }) {
  return (
    <section id="faq" className="section">
      <div className="wrap cols">
        <div className="reveal grow">
          <p className="mono kicker"><span>§ 06</span> {ui.faqKicker}</p>
          <h2 className="serif display">{ui.faqTitleA} <span className="accent">{ui.faqTitleB}</span></h2>
        </div>
        <div className="reveal" style={{ flex: "2 1 520px", minWidth: 0 }}>
          <FaqAccordion items={items} />
        </div>
      </div>
    </section>
  );
}
