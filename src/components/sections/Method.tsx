import dynamic from "next/dynamic";

const MethodView = dynamic(() => import("@/components/client/MethodView").then((mod) => mod.MethodView));
import type { StepRecord } from "@/lib/queries";

export function Method({
  steps,
  kicker,
  pause,
  resume,
}: {
  steps: StepRecord[];
  kicker: string;
  pause: string;
  resume: string;
}) {
  return (
    <section id="methode" className="section method">
      <MethodView steps={steps} kicker={kicker} pause={pause} resume={resume} />
      <ol className="method-index wrap">
        {steps.map((item, index) => (
          <li key={item.id}>
            <span className="mono">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="serif">{item.label}</h3>
            <p className="muted">{item.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
