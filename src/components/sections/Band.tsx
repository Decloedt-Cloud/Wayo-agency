const line = "Audit — Rescue — Hardening — Maintenance — ";
const repeated = line.repeat(8);

export function Band() {
  return (
    <section className="marquee" aria-hidden="true">
      <div className="serif marquee-line a"><span>{repeated}</span><span>{repeated}</span></div>
      <div className="serif marquee-line b"><span>{repeated}</span><span>{repeated}</span></div>
    </section>
  );
}
