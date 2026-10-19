"use client";

import { useState } from "react";
import { leaks } from "@/content";

export function Leaks() {
  const [sel, setSel] = useState(0);
  return (
    <section id="leaks" className="on-paper frame bg-paper-2 py-[var(--gap-section)] text-paper-ink" aria-labelledby="leaks-title">
      <h2 id="leaks-title" className="mb-10 max-w-[18ch] text-[length:var(--text-head)] md:mb-14">{leaks.heading}</h2>
      <ul data-reveal className="flex flex-col gap-[4px]">
        {leaks.items.map((l, i) => {
          const on = i === sel;
          return (
            <li key={l.name}>
              <button
                type="button"
                aria-expanded={on}
                onClick={() => setSel(i)}
                onMouseEnter={() => setSel(i)}
                onFocus={() => setSel(i)}
                className={`grid w-full grid-cols-12 gap-x-4 px-4 py-4 text-left transition-colors duration-[var(--t-ui)] md:px-6 md:py-5 ${
                  on ? "bg-accent text-accent-ink" : "bg-paper-3 hover:bg-paper"
                }`}
              >
                <span className="col-span-12 text-[clamp(1.875rem,4.6vw,4.75rem)] leading-[1.05] font-medium tracking-[-0.03em]">
                  {l.name}
                </span>
                {on && <span className="col-span-12 mt-3 max-w-[60ch] text-[length:var(--text-body)] md:col-span-8">{l.line}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
