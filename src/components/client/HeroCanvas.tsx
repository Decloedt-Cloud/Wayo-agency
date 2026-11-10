"use client";

import { useEffect, useRef } from "react";
import { anomalyIndexes, createField, structureProgress, type FieldPoint } from "@/lib/hero-motion";

const LABELS = ["clé API exposée", "route admin ouverte", "webhook non vérifié"] as const;

export function HeroCanvas({ labels = LABELS }: { labels?: readonly [string, string, string] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef(labels);
  labelsRef.current = labels;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx = context;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ink = "242, 239, 233";
    let accent = "255, 90, 31";
    let muted = "#a39d92";
    const readPalette = () => {
      const palette = getComputedStyle(document.documentElement);
      ink = palette.getPropertyValue("--ink-rgb").trim() || ink;
      accent = palette.getPropertyValue("--accent-rgb").trim() || accent;
      muted = palette.getPropertyValue("--muted").trim() || muted;
    };
    readPalette();
    let width = 0;
    let height = 0;
    let points: FieldPoint[] = [];
    let bugs: number[] = [];
    let grid = 10;
    let raf = 0;
    let bandHeight = 0;
    let visible = true;
    let hidden = document.hidden;
    const mouse = { x: 0, y: 0, sx: 0, sy: 0 };

    const rebuild = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bandHeight = canvas.parentElement?.querySelector(".hero-band")?.getBoundingClientRect().height ?? 0;
      const next = width < 820 ? 6 : 10;
      if (next !== grid || points.length === 0) {
        grid = next;
        points = createField(grid);
        bugs = anomalyIndexes(points);
      }
    };

    const draw = (time: number) => {
      if (!width || !height) return;
      const e = reduced ? 1 : structureProgress(time / 1000);
      mouse.sx += (mouse.x - mouse.sx) * 0.05;
      mouse.sy += (mouse.y - mouse.sy) * 0.05;
      const t = time / 1000;
      const rotY = (reduced ? 0.6 : t * 0.16) + mouse.sx * 1.1;
      const rotX = -0.42 + mouse.sy * 0.6;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const scale = Math.min(width, height * 1.25) * 0.042;
      const narrow = width < 820;
      const band = bandHeight;
      const originX = narrow ? width * 0.5 : width * 0.68;
      const originY = narrow ? height - band - 150 : height * 0.46;
      const projected: { x: number; y: number; k: number }[] = [];

      ctx.clearRect(0, 0, width, height);
      for (const point of points) {
        const noise = 0.45 * (1 - e);
        const x = point.cx * (1 - e) + point.ox * e + Math.sin(t * 0.7 + point.phase) * noise;
        const y = point.cy * (1 - e) + point.oy * e + Math.cos(t * 0.6 + point.phase) * noise;
        const z = point.cz * (1 - e) + point.oz * e + Math.sin(t * 0.5 + point.phase * 0.7) * noise;
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        const y1 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        const depth = 17 + z2;
        if (depth <= 0.5) {
          projected.push({ x: -9999, y: -9999, k: 0 });
          continue;
        }
        const k = 17 / depth;
        projected.push({ x: originX + x1 * scale * k, y: originY + y1 * scale * k, k });
      }

      const lightPaper = ink.split(",").reduce((sum, part) => sum + Number(part), 0) < 380;
      if (e > 0.45) {
        const cap = lightPaper ? 0.55 : 0.2;
        const alpha = Math.min(cap, ((e - 0.45) / 0.55) * cap);
        ctx.strokeStyle = `rgba(${ink},${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        const index = (x: number, y: number, z: number) => (x * grid + y) * grid + z;
        for (let x = 0; x < grid; x += 1) {
          for (let y = 0; y < grid; y += 1) {
            for (let z = 0; z < grid; z += 1) {
              const a = projected[index(x, y, z)];
              if (!a || a.k === 0) continue;
              if (x + 1 < grid) line(a, projected[index(x + 1, y, z)]);
              if (y + 1 < grid) line(a, projected[index(x, y + 1, z)]);
              if (z + 1 < grid) line(a, projected[index(x, y, z + 1)]);
            }
          }
        }
        ctx.stroke();
      }

      points.forEach((point, i) => {
        const p = projected[i];
        if (!p || p.k === 0) return;
        const anomaly = bugs.includes(i) && e <= 0.92;
        const alpha = Math.max(0.15, Math.min(0.9, (p.k - 0.45) * 1.2));
        if (anomaly) {
          const blink = 0.55 + 0.45 * Math.abs(Math.sin(t * 5 + point.phase));
          ctx.fillStyle = `rgba(${accent},${alpha * blink})`;
          dot(p.x, p.y, 2.6 * p.k);
        } else {
          ctx.fillStyle = `rgba(${ink},${alpha})`;
          dot(p.x, p.y, 1.35 * p.k);
        }
      });

      if (e <= 0.55 && width >= 820) {
        ctx.font = '11px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillStyle = `rgba(${accent},1)`;
        ctx.strokeStyle = `rgba(${accent},.8)`;
        bugs.slice(0, 3).forEach((index, n) => {
          const p = projected[index];
          if (!p || p.k === 0) return;
          const dx = 28 + n * 6;
          const dy = -24 - n * 8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + dx, p.y + dy);
          ctx.lineTo(p.x + dx + 10, p.y + dy);
          ctx.stroke();
          ctx.fillText(labelsRef.current[n] ?? "", p.x + dx + 14, p.y + dy + 4);
        });
      }

      const hudX = width - 28;
      const hudY = 120;
      if (width < 820) {
        ctx.textAlign = "left";
        return;
      }
      ctx.textAlign = "right";
      ctx.font = '11px "JetBrains Mono", ui-monospace, monospace';
      ctx.fillStyle = muted;
      ctx.fillText("STRUCTURE", hudX, hudY);
      ctx.fillStyle = `rgba(${accent},1)`;
      ctx.font = '500 13px "JetBrains Mono", ui-monospace, monospace';
      ctx.fillText(`${String(Math.round(e * 100)).padStart(3, "0")} %`, hudX, hudY + 20);
      ctx.fillStyle = `rgba(${ink},.18)`;
      ctx.fillRect(hudX - 120, hudY + 30, 120, 2);
      ctx.fillStyle = `rgba(${accent},1)`;
      ctx.fillRect(hudX - 120, hudY + 30, 120 * e, 2);
      ctx.textAlign = "left";

      function line(a: { x: number; y: number; k: number } | undefined, b: { x: number; y: number; k: number } | undefined) {
        if (!a || !b || a.k === 0 || b.k === 0) return;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
      function dot(x: number, y: number, radius: number) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const frame = (time: number) => {
      raf = 0;
      if (!visible || hidden) return;
      draw(time);
      if (!reduced) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (raf || reduced || !visible || hidden) return;
      raf = requestAnimationFrame(frame);
    };

    const onMove = (event: MouseEvent) => {
      mouse.x = event.clientX / Math.max(1, window.innerWidth) - 0.5;
      mouse.y = event.clientY / Math.max(1, window.innerHeight) - 0.5;
    };
    rebuild();
    if (reduced) draw(0);
    else start();

    const resize = new ResizeObserver(rebuild);
    resize.observe(canvas);
    const view = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) start();
    });
    view.observe(canvas);
    const theme = new MutationObserver(() => {
      readPalette();
      draw(performance.now());
      start();
    });
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("mousemove", onMove, { passive: true });
    const onVisibility = () => {
      hidden = document.hidden;
      if (!hidden) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      view.disconnect();
      theme.disconnect();
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}
