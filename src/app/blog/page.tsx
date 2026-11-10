import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { Footer } from "@/components/sections/Footer";
import { getUi } from "@/lib/copy";
import { getLocale } from "@/lib/get-locale";
import { localePath } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";

function posts() {
  const dir = path.join(process.cwd(), "content", "blog");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
    .map((name) => {
      const raw = readFileSync(path.join(dir, name), "utf8");
      const title = raw.match(/^#\s+(.+)$/m)?.[1]?.trim() || name.replace(/\.mdx?$/, "");
      const body = raw.replace(/^#\s+.+$/m, "").trim();
      return { slug: name.replace(/\.mdx?$/, ""), title, body };
    });
}

export async function generateMetadata(): Promise<Metadata> {
  const articles = posts();
  const metadata = buildMetadata(await getLocale(), "/blog", {
    title: "Journal | Wayo Agency",
    description: "Notes de Wayo Agency sur la sécurisation et la mise en production du code généré par IA.",
  });
  if (articles.length === 0) {
    return { ...metadata, robots: { index: false, follow: true } };
  }
  return metadata;
}

export default async function BlogPage() {
  const locale = await getLocale();
  const ui = getUi(locale);
  const articles = posts();
  return (
    <>
    <main id="contenu" className="section">
      <div className="wrap legal">
        <h1 className="serif display">Journal</h1>
        {articles.length === 0 ? (
          <p>Les articles seront publiés par l’équipe. Aucun texte n’est inventé ici.</p>
        ) : (
          articles.map((article) => (
            <article key={article.slug}>
              <h2 className="serif">{article.title}</h2>
              {article.body.split(/\n{2,}/).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          ))
        )}
        <p><a className="link" href={localePath(locale, "/")}>{ui.backHome}</a></p>
      </div>
    </main>
    <Footer ui={ui} locale={locale} />
    </>
  );
}
