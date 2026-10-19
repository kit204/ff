"use client";

import { useEffect, useState } from "react";
import { BOOKING_URL, hero, heroEmails, plans } from "@/content";
import { EmailCard } from "./EmailCard";
import { Arrow } from "./Arrow";

export function Hero() {
  const [active, setActive] = useState(0);

  // Signature move: the email on the counter quietly changes, like light shifting in a room.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: number | undefined;
    const start = () => { timer = window.setInterval(() => setActive((a) => (a + 1) % heroEmails.length), 5600); };
    const stop = () => window.clearInterval(timer);
    const onVis = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVis);
    return () => { stop(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  const from = Math.min(...plans.map((p) => p.monthly));

  return (
    <section className="frame flex min-h-[100svh] flex-col items-center bg-bg pt-[104px] pb-[12svh] md:pt-[112px]" aria-labelledby="hero-title">
      <div
        className="relative aspect-[4/5] w-[78%] max-w-[400px] sm:w-[48%] lg:w-[24vw] lg:max-w-[400px]"
        aria-roledescription="carousel"
        aria-label="Emails Wynback writes at three ownership milestones"
      >
        {heroEmails.map((e, i) => (
          <div
            key={e.months}
            className={`xfade absolute inset-0 ${i === active ? "is-on visible" : "invisible"}`}
            style={{ opacity: i === active ? 1 : 0 }}
            aria-hidden={i !== active}
          >
            <EmailCard email={e} />
          </div>
        ))}
      </div>

      <p className="wordmark-wide mt-10 max-w-[1040px] md:mt-12" aria-hidden="true">Wynback</p>

      <div data-reveal className="mt-8 flex max-w-[44rem] flex-col items-center text-center md:mt-10">
        <h1 id="hero-title" className="text-[clamp(2.25rem,3.4vw,3.25rem)] leading-[1.02] font-medium">
          {hero.title}
        </h1>
        <p className="mt-6 max-w-[52ch] text-[length:var(--text-body)]">{hero.line}</p>
      </div>

      <div className="mt-9 flex w-full flex-col items-center gap-4 text-[length:var(--text-body)] sm:w-auto sm:flex-row sm:gap-12">
        <span className="order-2 text-muted sm:order-1">{hero.specLeft}</span>
        <a href={BOOKING_URL} target="_blank" rel="noopener" className="btn order-1 w-full sm:order-2 sm:w-auto">
          Book a demo, from £{from}/mo <Arrow />
        </a>
        <span className="order-3 text-muted">{hero.specRight}</span>
      </div>
    </section>
  );
}
