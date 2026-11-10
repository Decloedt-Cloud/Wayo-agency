export const themes = ["light", "dark"] as const;

export type Theme = (typeof themes)[number];

export const THEME_COOKIE = "theme";

export function isTheme(value: string | null | undefined): value is Theme {
  return value === "light" || value === "dark";
}
