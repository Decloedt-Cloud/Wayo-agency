export function Statement({ text, kicker, emphasis }: { text: string; kicker: string; emphasis: string }) {
  const words = text.split(" ");
  const phrase = emphasis.split(" ");
  const highlighted = new Set<number>();
  const start = words.findIndex((_, index) => words.slice(index, index + phrase.length).join(" ") === emphasis);
  if (start >= 0) {
    phrase.forEach((_, offset) => highlighted.add(start + offset));
  }
  highlighted.add(words.length - 2);
  highlighted.add(words.length - 1);

  return (
    <section id="constat" className="section" style={{ ["--n" as string]: words.length }}>
      <div className="wrap cols">
        <p className="mono kicker" style={{ flex: "0 0 180px" }}><span>§ 01</span> {kicker}</p>
        <p className="serif statement" style={{ flex: "1 1 560px", margin: 0 }}>
          {words.map((word, index) => (
            <span key={`${word}-${index}`} className={highlighted.has(index) ? "word accent" : "word"} style={{ ["--i" as string]: index }}>
              {word}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
