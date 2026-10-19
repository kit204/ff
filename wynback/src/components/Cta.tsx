import { BOOKING_URL, cta } from "@/content";
import { Arrow } from "./Arrow";

// The whole band is the link.
export function Cta() {
  return (
    <section aria-labelledby="cta-word">
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener"
        className="group frame relative flex flex-col gap-10 bg-accent pt-6 pb-6 md:gap-16 text-accent-ink no-underline focus-visible:outline-offset-[-6px] focus-visible:outline-paper-ink hover:bg-bg hover:text-accent focus-visible:bg-bg focus-visible:text-accent md:min-h-[60svh]"
      >
        <span className="flex items-start gap-4">
          <span className="max-w-[34ch] text-[17px] md:text-[20px]">{cta.line}</span>
          <Arrow size={0} className="h-8 w-8 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 md:h-12 md:w-12" />
        </span>
        <h2 id="cta-word" className="text-[clamp(6rem,30vw,28rem)] leading-[0.78] font-semibold tracking-[-0.05em]">
          {cta.word}<span className="sr-only"> a demo</span>
        </h2>
      </a>
    </section>
  );
}
