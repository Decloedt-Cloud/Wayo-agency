"use client";

import { useState } from "react";
import type { FaqRecord } from "@/lib/queries";

export function FaqAccordion({ items }: { items: FaqRecord[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div>
      {items.map((item, index) => {
        const expanded = open === index;
        const panelId = `faq-panel-${item.id}`;
        const buttonId = `faq-button-${item.id}`;
        return (
          <div key={item.id}>
            <button
              id={buttonId}
              type="button"
              className="faq-q serif"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => setOpen(expanded ? -1 : index)}
            >
              <span>{item.question}</span>
              <span className={expanded ? "plus open" : "plus"} aria-hidden="true" />
            </button>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!expanded}>
              <p className="faq-a">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
