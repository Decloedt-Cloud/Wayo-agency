import { cookies } from "next/headers";
import { isTheme, THEME_COOKIE, type Theme } from "@/lib/theme";

export async function getTheme(): Promise<Theme | null> {
  const saved = (await cookies()).get(THEME_COOKIE)?.value;
  return isTheme(saved) ? saved : null;
}
