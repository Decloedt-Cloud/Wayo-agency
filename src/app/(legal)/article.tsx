import type { ReactNode } from "react";
import type { CopySection } from "@/lib/copy";

export function LegalArticle({
  title,
  sections,
  children,
}: {
  title: string;
  sections: CopySection[];
  children?: ReactNode;
}) {
  return (
    <article className="legal">
      <h1 className="serif display">{title}</h1>
      {children}
      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="serif">{section.title}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
    </article>
  );
}
