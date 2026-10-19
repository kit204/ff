import { BOOKING_URL, benefits } from "@/content";
import { Arrow } from "./Arrow";

export function Benefits() {
  const align = ["text-left", "text-right"];
  return (
    <section id="benefits" className="grid lg:grid-cols-2" aria-labelledby="benefits-title">
      <div className="on-accent flex min-h-[60svh] flex-col justify-between gap-12 bg-accent px-[var(--margin)] py-16 text-accent-ink lg:sticky lg:top-0 lg:h-[100svh] lg:self-start lg:py-20">
        <h2 id="benefits-title" className="text-[clamp(2.75rem,5vw,5rem)]">
          {benefits.headingLines.map((l, i) => (
            <span key={l} className={`block ${align[i]}`}>{l}</span>
          ))}
        </h2>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-[30ch] text-[length:var(--text-body)]">{benefits.intro}</p>
          <a href={BOOKING_URL} target="_blank" rel="noopener" className="btn shrink-0 bg-surface text-accent hover:bg-accent-soft">
            Book a demo <Arrow />
          </a>
        </div>
      </div>
      <ul data-reveal className="grid bg-surface">
        {benefits.items.map((b, i) => (
          <li key={b.name} className={`grid gap-3 px-[var(--margin)] py-7 md:grid-cols-12 md:gap-6 md:py-8 ${i % 2 ? "bg-surface-2" : "bg-surface"}`}>
            <h3 className="text-[26px] leading-[1.05] md:col-span-5 md:text-[28px]">{b.name}</h3>
            <p className="text-[16px] leading-[1.5] md:col-span-4">{b.body}</p>
            <p className="text-[15px] text-muted md:col-span-3 md:hidden">{b.terms.join(", ")}</p>
            <ul className="hidden text-[15px] text-muted md:col-span-3 md:block">
              {b.terms.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
