import { loadContent } from "@/lib/load-content";

export async function legalFields() {
  const content = await loadContent();
  return content.settings;
}
