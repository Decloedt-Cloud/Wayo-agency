"use client";

import { useEffect, useState } from "react";

const labels: Record<string, string> = {
  fr: "Revenir en haut",
  en: "Back to the top",
  ar: "العودة إلى الأعلى",
};

export function ToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className="to-top"
      aria-label={labels[document.documentElement.lang] ?? labels.fr}
      onClick={() => {
        const reduce = document.documentElement.classList.contains("reduce");
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
    >
      <span aria-hidden="true" />
    </button>
  );
}
