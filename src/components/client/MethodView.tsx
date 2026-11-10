"use client";

import { useRef } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { slabPose, type SlabPose } from "@/lib/method";
import type { StepRecord } from "@/lib/queries";

function paintSlab(node: HTMLDivElement, pose: SlabPose) {
  node.style.transform = `translate3d(${pose.x}px, ${pose.y}px, ${pose.z}px) rotateX(${pose.tilt}deg)`;
  node.style.opacity = String(pose.opacity);
  node.style.background = pose.fill > 0 ? `rgba(255, 90, 31, ${(0.1 + pose.fill * 0.78).toFixed(3)})` : "transparent";
  node.style.borderColor = pose.fill > 0.04 ? `rgba(255, 90, 31, ${(0.35 + pose.fill * 0.65).toFixed(3)})` : "var(--slab-line)";
}

export function MethodView({ steps, kicker, scrollHint }: { steps: StepRecord[]; kicker: string; scrollHint: string }) {
  const ref = useRef<HTMLElement>(null);
  const slabs = useRef<Array<HTMLDivElement | null>>([]);
  const rail = useRef<HTMLDivElement>(null);
  const step = useScrollProgress(ref, steps.length, (phase) => {
    for (let index = 0; index < steps.length; index += 1) {
      const node = slabs.current[index];
      if (node) paintSlab(node, slabPose(index, phase));
    }
    const fraction = phase - Math.floor(phase);
    rail.current?.style.setProperty("--fill", Math.max(0.08, fraction).toFixed(3));
  });
  const current = steps[step] ?? steps[0];
  const next = steps[step + 1];
  if (!current) return null;

  return (
    <section id="methode" className="method" ref={ref}>
      <div className="method-sticky wrap" style={{ width: "100%", gap: 40 }}>
        <div className="scene" aria-hidden="true">
          <div className="stack">
            {steps.map((item, index) => (
              <div
                key={item.id}
                className="slab live"
                ref={(node) => {
                  slabs.current[index] = node;
                }}
              >
                <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                  <i className="slab-mark strong" />
                  <i className="slab-mark" style={{ width: "80%" }} />
                  <i className="slab-mark" style={{ width: "40%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="method-copy">
          <p className="mono kicker"><span>§ 03</span> {kicker}</p>
          <div key={current.id} className="method-live">
            <div className="serif step-no">
              {String(step + 1).padStart(2, "0")}
              <span className="mono faint" style={{ fontSize: 16, marginLeft: 12 }}>/ {String(steps.length).padStart(2, "0")}</span>
            </div>
            <h3 className="serif" style={{ margin: "12px 0 0", fontSize: "clamp(34px, 4vw, 60px)", lineHeight: 1 }}>{current.label}</h3>
            <p className="muted" style={{ minHeight: 84 }}>{current.body}</p>
          </div>
          <div className="rail" ref={rail}>
            {steps.map((item, index) => (
              <span key={item.id} style={{ flex: 1 }}>
                <i className={index < step ? "done" : index === step ? "now" : ""} />
              </span>
            ))}
          </div>
          {next ? (
            <p className="mono method-hint">
              <span className="method-hint-line" aria-hidden="true" />
              {scrollHint}
              <span className="method-hint-next">{next.label}</span>
            </p>
          ) : null}
        </div>
      </div>
      <div className="method-static wrap">
        <p className="mono kicker"><span>§ 03</span> {kicker}</p>
        <div className="scene" aria-hidden="true" style={{ height: 280, marginTop: 24 }}>
          <div className="stack" style={{ transform: "rotateX(60deg) rotateZ(-32deg) scale(.55)" }}>
            {steps.map((item, index) => (
              <div key={item.id} className="slab past" style={{ ["--z" as string]: index * 30 }} />
            ))}
          </div>
        </div>
        {steps.map((item, index) => (
          <article key={item.id} className="method-item">
            <p className="mono" style={{ color: "var(--accent)" }}>{String(index + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</p>
            <h3 className="serif" style={{ fontSize: 40, margin: "8px 0" }}>{item.label}</h3>
            <p className="muted">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
