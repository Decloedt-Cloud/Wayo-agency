import { unstable_cache } from "next/cache";
import { fallbackPageContent, queryPageContent, type PageContent } from "@/lib/queries";

const cachedContent = unstable_cache(queryPageContent, ["page-content"], {
  revalidate: 3600,
  tags: ["content"],
});

export async function loadContent(): Promise<PageContent> {
  if (!process.env.DATABASE_URL) return fallbackPageContent();
  try {
    return await cachedContent();
  } catch {
    console.error("content_load_failed");
    return fallbackPageContent();
  }
}
