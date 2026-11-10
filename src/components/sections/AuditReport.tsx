import type { Ui } from "@/lib/copy";
import type { AuditRecord } from "@/lib/queries";

export function AuditReport({ rows, ui }: { rows: AuditRecord[]; ui: Ui }) {
  return (
    <section className="section">
      <div className="wrap cols" style={{ alignItems: "flex-start" }}>
        <div className="reveal grow">
          <p className="mono kicker"><span>§ 02</span> {ui.auditKicker}</p>
          <h2 className="serif display">{ui.auditTitleA} <span className="accent">{ui.auditTitleB}</span></h2>
          <p className="muted" style={{ maxWidth: 460 }}>{ui.auditBody}</p>
          <p className="mono faint" style={{ letterSpacing: "0.04em", textTransform: "none" }}>{ui.auditNote}</p>
        </div>
        <div className="reveal audit" style={{ flex: "1.3 1 520px", minWidth: 0 }}>
          <div className="mono faint" style={{ display: "flex", gap: 8, alignItems: "center", padding: "14px 18px", borderBottom: "1px solid var(--line)" }}>
            <i style={{ width: 9, height: 9, border: "1px solid var(--line-strong)" }} />
            <i style={{ width: 9, height: 9, border: "1px solid var(--line-strong)" }} />
            <i style={{ width: 9, height: 9, background: "var(--accent)" }} />
            <span style={{ marginLeft: 8 }}>wayo-audit / rapport</span>
          </div>
          <div className="audit-bar" />
          {rows.map((row, index) => {
            const severity = row.severity === "critique" || row.severity === "eleve" ? row.severity : "moyen";
            const kind = severity === "critique" ? "solid" : severity === "eleve" ? "high" : "mid";
            return (
              <div key={row.id} className="audit-row" style={{ ["--i" as string]: index }}>
                <span className={`mono badge ${kind}`}>{ui.severity[severity]}</span>
                <span style={{ flex: "1 1 220px", minWidth: 0, fontSize: 16 }}>{row.text}</span>
                <span className="mono status">
                  <span className="open">{ui.auditOpen}</span>
                  <span className="fixed">{ui.auditFixed}</span>
                </span>
              </div>
            );
          })}
          <p className="mono audit-final">{ui.auditFinal}</p>
        </div>
      </div>
    </section>
  );
}
