const base = process.env.SEO_BASE_URL?.replace(/\/$/, "");

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

async function main() {
  if (!base) {
    console.log("seo-check non exécuté : SEO_BASE_URL est absent.");
    return;
  }
  const home = await fetch(`${base}/`);
  if (home.status !== 200) fail(`accueil ${home.status}`);
  const html = await home.text();
  const title = html.match(/<title>(.*?)<\/title>/)?.[1] ?? "";
  if (title.length < 50 || title.length > 60) fail(`title ${title.length} caractères : ${title}`);
  const descriptions = html.match(/name="description" content="([^"]*)"/)?.[1] ?? "";
  if (descriptions.length < 140 || descriptions.length > 160) fail(`description ${descriptions.length}`);
  if (!html.includes('rel="canonical" href="http')) fail("canonical non absolu");
  const h1 = html.match(/<h1\b/g)?.length ?? 0;
  if (h1 !== 1) fail(`h1 ${h1}`);
  const robots = await fetch(`${base}/robots.txt`);
  const robotsText = await robots.text();
  if (!robotsText.includes("Sitemap:")) fail("robots sans sitemap");
  const sitemap = await fetch(`${base}/sitemap.xml`);
  const xml = await sitemap.text();
  if (!xml.includes("<loc>")) fail("sitemap vide");
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1] ?? "");
  for (const url of urls) {
    const response = await fetch(url.replace("http://localhost:3000", base).replace("http://127.0.0.1:3000", base));
    if (response.status !== 200) fail(`${url} ${response.status}`);
  }
  console.log(`seo-check ok : ${urls.length} URL, title ${title.length}, description ${descriptions.length}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "seo-check échoué");
  process.exit(1);
});
