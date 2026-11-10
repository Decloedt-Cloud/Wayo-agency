"use client";

import { useEffect, useState } from "react";
import { THEME_COOKIE, type Theme } from "@/lib/theme";

export function ThemeToggle({
  current,
  light,
  dark,
  label,
}: {
  current: Theme;
  light: string;
  dark: string;
  label: string;
}) {
  const [theme, setTheme] = useState<Theme>(current);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next: Theme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    document.cookie = `${THEME_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
    setTheme(next);
  }

  const lightOn = theme === "light";
  return (
    <button type="button" className="theme-toggle mono" onClick={toggle} aria-pressed={lightOn} aria-label={label}>
      {lightOn ? dark : light}
    </button>
  );
}
