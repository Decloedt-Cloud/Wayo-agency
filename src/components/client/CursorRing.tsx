"use client";

import { useEffect, useRef } from "react";

export function CursorRing() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ref.current;
    if (!ring) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    let x = -100;
    let y = -100;
    let cx = -100;
    let cy = -100;
    let scale = 1;
    let drawn = 1;
    let raf = 0;

    const frame = () => {
      raf = 0;
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      drawn += (scale - drawn) * 0.2;
      ring.style.opacity = "1";
      ring.style.transform = `translate(${cx}px, ${cy}px) scale(${drawn})`;
      if (Math.abs(x - cx) > 0.4 || Math.abs(y - cy) > 0.4 || Math.abs(scale - drawn) > 0.02) {
        raf = requestAnimationFrame(frame);
      }
    };
    const move = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      const target = event.target;
      const hot = target instanceof Element && Boolean(target.closest("a, button, input, textarea, select, label"));
      scale = hot ? 1.7 : 1;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return <div ref={ref} className="ring" aria-hidden="true" />;
}
