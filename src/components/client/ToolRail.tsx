"use client";

import { useEffect, useRef, useState } from "react";
import { wrapRail } from "@/lib/rail";

const tools = [
  { name: "Cursor", kind: "Éditeur", logo: "/logos/cursor.svg", ink: true },
  { name: "Lovable", kind: "Éditeur", logo: "/logos/lovable.svg" },
  { name: "Bolt", kind: "Éditeur", logo: "/logos/bolt.svg" },
  { name: "Claude Code", kind: "Éditeur", logo: "/logos/claude.svg" },
  { name: "Next.js", kind: "Techno", logo: "/logos/nextdotjs.svg", ink: true },
  { name: "Supabase", kind: "Techno", logo: "/logos/supabase.svg" },
  { name: "Firebase", kind: "Techno", logo: "/logos/firebase.svg" },
  { name: "Stripe", kind: "Techno", logo: "/logos/stripe.svg" },
  { name: "Flutter", kind: "Techno", logo: "/logos/flutter.svg" },
  { name: "React Native", kind: "Techno", logo: "/logos/react.svg" },
  { name: "Vercel", kind: "Techno", logo: "/logos/vercel.svg", ink: true },
  { name: "Netlify", kind: "Techno", logo: "/logos/netlify.svg" },
  { name: "AWS", kind: "Techno", logo: "/logos/aws.svg", ink: true },
] as const;

const speed = 42;

export function ToolRail({ labels }: { labels: { stacks: string; pause: string; resume: string; editor: string; tech: string } }) {
  const scroller = useRef<HTMLDivElement>(null);
  const half = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const reduced = useRef(false);
  const over = useRef(false);
  const drag = useRef({ active: false, x: 0, left: 0 });
  const [stopped, setStopped] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || document.documentElement.classList.contains("reduce")) {
      reduced.current = true;
      paused.current = true;
      setStopped(true);
    }

    const node = scroller.current;
    const onWheel = (event: WheelEvent) => {
      const span = half.current?.offsetWidth ?? 0;
      if (!node || span <= 0) return;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (delta === 0) return;
      event.preventDefault();
      node.scrollLeft = wrapRail(node.scrollLeft + delta, span);
    };
    node?.addEventListener("wheel", onWheel, { passive: false });

    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      const rail = scroller.current;
      const span = half.current?.offsetWidth ?? 0;
      if (rail && span > 0 && !paused.current && !over.current && !drag.current.active) {
        const delta = last ? Math.min(32, now - last) : 16;
        rail.scrollLeft = wrapRail(rail.scrollLeft + (delta * speed) / 1000, span);
      }
      last = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      node?.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(frame);
    };
  }, []);

  const resume = () => {
    if (reduced.current || drag.current.active) return;
    paused.current = false;
    setStopped(false);
  };

  const toggle = () => {
    paused.current = !paused.current;
    setStopped(paused.current);
  };

  return (
    <section
      className="tool-rail"
      aria-label="Technologies et éditeurs"
      onPointerEnter={() => {
        over.current = true;
      }}
      onPointerLeave={() => {
        over.current = false;
        resume();
      }}
    >
      <div className="tool-rail-bar">
        <span className="mono faint">{labels.stacks}</span>
        <button type="button" className="tool-toggle" aria-pressed={stopped} onClick={toggle}>
          {stopped ? labels.resume : labels.pause}
        </button>
      </div>
      <div
        className="tool-scroller"
        ref={scroller}
        tabIndex={0}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          const node = scroller.current;
          if (!node) return;
          drag.current = { active: true, x: event.clientX, left: node.scrollLeft };
          node.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const node = scroller.current;
          const span = half.current?.offsetWidth ?? 0;
          if (!node || !drag.current.active || span <= 0) return;
          const next = drag.current.left - (event.clientX - drag.current.x);
          node.scrollLeft = wrapRail(next, span);
        }}
        onPointerUp={() => {
          drag.current.active = false;
          if (!over.current) resume();
        }}
        onPointerCancel={() => {
          drag.current.active = false;
          if (!over.current) resume();
        }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="tool-track" ref={copy === 0 ? half : undefined} aria-hidden={copy === 1}>
            {tools.map((item) => (
              <span key={`${copy}-${item.name}`} className="tool-chip">
                <img className={"ink" in item && item.ink ? "tool-logo logo-ink" : "tool-logo"} src={item.logo} alt="" width={28} height={28} draggable={false} decoding="async" loading="lazy" />
                <span>
                  <span className="tool-name">{item.name}</span>
                  <span className="mono tool-kind">{item.kind === "Éditeur" ? labels.editor : labels.tech}</span>
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
