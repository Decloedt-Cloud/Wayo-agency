import { MethodView } from "@/components/client/MethodView";
import type { StepRecord } from "@/lib/queries";

export function Method({ steps, kicker, scrollHint }: { steps: StepRecord[]; kicker: string; scrollHint: string }) {
  return <MethodView steps={steps} kicker={kicker} scrollHint={scrollHint} />;
}
