"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { methodPhase, methodProgress, methodStep } from "@/lib/method";
import { subscribeScroll } from "@/lib/scroll-bus";

export function useScrollProgress(ref: RefObject<HTMLElement | null>, count: number, onPhase: (phase: number) => void) {
  const [step, setStep] = useState(0);
  const onPhaseRef = useRef(onPhase);
  onPhaseRef.current = onPhase;

  useLayoutEffect(() => {
    const measure = () => {
      const node = ref.current;
      if (!node) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const narrow = window.matchMedia("(max-width: 819px)").matches;
      if (reduced || narrow) return;
      const rect = node.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight);
      const progress = methodProgress(-rect.top, total);
      const phase = methodPhase(progress, count);
      onPhaseRef.current(phase);
      const next = Math.min(count - 1, methodStep(progress));
      setStep((current) => (current === next ? current : next));
    };
    measure();
    return subscribeScroll(measure);
  }, [count, ref]);

  return step;
}
