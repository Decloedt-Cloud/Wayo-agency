"use client";

import { useEffect, useRef, useState } from "react";
import { slabPose, type SlabPose } from "@/lib/method";
import type { StepRecord } from "@/lib/queries";

const STEP_MS = 4200;

function paintSlab(node: HTMLDivElement, pose: SlabPose) {
  node.style.transform = `translate3d(${pose.x}px, ${pose.y}px, ${pose.z}px) rotateX(${pose.tilt}deg)`;
  node.style.opacity = String(pose.opacity);
  node.style.background = pose.fill > 0 ? `rgba(255, 90, 31, ${(0.1 + pose.fill * 0.78).toFixed(3)})` : "transparent";
  node.style.borderColor = pose.fill > 0.04 ? `rgba(255, 90, 31, ${(0.35 + pose.fill * 0.65).toFixed(3)})` : "var(--slab-line)";
}

export function MethodView({
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
  const slabs = useRef<Array<HTMLDivElement | null>>([]);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [reduced, setReduced] = useState(false);
  const current = steps[step] ?? steps[0];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches || document.documentElement.classList.contains("reduce"));
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    for (let index = 0; index < steps.length; index += 1) {
      const node = slabs.current[index];
      if (node) paintSlab(node, slabPose(index, step));
    }
  }, [step, steps.length]);

  useEffect(() => {
    if (reduced || paused || steps.length < 2) return;
    const timer = window.setInterval(() => {
      setStep((value) => (value + 1) % steps.length);
    }, STEP_MS);
    return () => window.clearInterval(timer);
  }, [paused, reduced, steps.length, run]);

  if (!current) return null;

  return (
    <div className="wrap method-stage">
      <div className="method-head">
        <p className="mono kicker"><span>§ 03</span> {kicker}</p>
        <button type="button" className="theme-toggle mono" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
          {paused || reduced ? resume : pause}
        </button>
      </div>
      <div className="method-grid">
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
          <div key={current.id} className="method-live">
            <div className="serif step-no">
              {String(step + 1).padStart(2, "0")}
              <span className="mono faint" style={{ fontSize: 16, marginLeft: 12 }}>/ {String(steps.length).padStart(2, "0")}</span>
            </div>
            <h3 className="serif" id={`methode-titre-${current.id}`} style={{ margin: "12px 0 0", fontSize: "clamp(34px, 4vw, 60px)", lineHeight: 1 }}>{current.label}</h3>
            <p className="muted">{current.body}</p>
          </div>
          {reduced ? null : <i className="method-meter" key={`meter-${step}-${paused}`} data-paused={paused ? "true" : "false"} />}
        </div>
      </div>
      <div className="method-picks" role="tablist" aria-label={kicker}>
        {steps.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            className="method-pick"
            aria-selected={index === step}
            aria-current={index === step ? "step" : undefined}
            onClick={() => {
              setStep(index);
              setRun((value) => value + 1);
            }}
          >
            <span className="mono">{String(index + 1).padStart(2, "0")}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
