import type { Ui } from "@/lib/copy";
import type { DomainRecord } from "@/lib/queries";

export function Domains({ domains, ui }: { domains: DomainRecord[]; ui: Ui }) {
  return (
    <section className="section">
      <div className="wrap">
        <div className="reveal cols" style={{ alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <p className="mono kicker"><span>§ 04</span> {ui.scopeKicker}</p>
            <h2 className="serif display">{ui.scopeTitleA} <span className="accent">{ui.scopeTitleB}</span></h2>
          </div>
          <p className="muted" style={{ maxWidth: 440, margin: 0 }}>{ui.scopeQuote}</p>
        </div>
        <div className="domains" style={{ marginTop: 64 }}>
          {domains.map((domain) => (
            <div key={domain.id} className="domain">
              <span className="mono num faint" style={{ flex: "0 0 32px" }}>{String(domain.position).padStart(2, "0")}</span>
              <div style={{ minWidth: 0 }}>
                <div className="serif name">{domain.name}</div>
                <div className="detail">{domain.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
