import { BOOKING_URL, founder } from "@/content";

const marks = ["mark-1", "mark-2", "mark-3"];

function highlight(text: string, start: number) {
  const parts = text.split(/\[\[(.+?)\]\]/);
  let n = start;
  return parts.map((p, i) =>
    i % 2 === 1 ? <mark key={i} className={`mark ${marks[n++ % marks.length]}`}>{p}</mark> : <span key={i}>{p}</span>,
  );
}

export function Founder() {
  let count = 0;
  return (
    <section id="story" className="on-paper frame bg-paper py-[clamp(72px,8vw,128px)] text-paper-ink" aria-labelledby="story-title">
      <div data-reveal>
        <h2 id="story-title" className="mb-10 text-[length:var(--text-head)] md:mb-14">{founder.heading}</h2>
        <div className="text-[clamp(1.25rem,2.1vw,2rem)] leading-[1.22] md:columns-2 md:gap-8 md:text-justify md:hyphens-auto">
          {founder.paragraphs.map((p, i) => {
            const nodes = highlight(p, count);
            count += (p.match(/\[\[/g) || []).length;
            return <p key={i} className="mb-[0.7em] break-inside-avoid-column">{nodes}</p>;
          })}
          <p className="mt-6 md:mt-0">
            <a href={BOOKING_URL} target="_blank" rel="noopener" className="mark mark-1 block py-2 no-underline hover:underline md:inline md:py-0">
              {founder.close}
            </a>
          </p>
          <p className="mt-4 text-[length:var(--text-body)] text-paper-muted md:text-left">{founder.sign}</p>
        </div>
      </div>
    </section>
  );
}
