"use client";

import { useEffect } from "react";
import { notifyScroll } from "@/lib/scroll-bus";

export function ScrollVars() {
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const y = window.scrollY || 0;
      document.documentElement.style.setProperty("--sy", String(Math.round(y)));
      const section = document.getElementById("constat");
      if (section) {
        if (reduced) {
          section.style.setProperty("--p", "1");
        } else {
          const rect = section.getBoundingClientRect();
          const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.85 - rect.top) / (rect.height * 0.9)));
          section.style.setProperty("--p", progress.toFixed(4));
        }
      }
      notifyScroll();
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
