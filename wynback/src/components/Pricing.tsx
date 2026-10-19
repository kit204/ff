"use client";

import { BOOKING_URL, plans, pricing } from "@/content";
import { formatGBP, monthlyPrice, useBilling } from "./Billing";

const looks = [
  { tile: "bg-paper-2 text-paper-ink", strip: "bg-surface-3 text-paper-ink hover:bg-accent-soft", h: "lg:h-[400px] lg:row-start-2 lg:col-start-1 lg:self-end" },
  { tile: "bg-accent text-accent-ink", strip: "bg-accent-deep text-accent-ink hover:bg-[#431c8f]", h: "lg:h-[500px] lg:row-start-2 lg:col-start-2 lg:self-end" },
  { tile: "bg-paper-3 text-paper-ink", strip: "bg-[#ddd4f3] text-paper-ink hover:bg-accent-soft", h: "lg:h-[640px] lg:row-span-2 lg:row-start-1 lg:col-start-3 lg:self-end" },
];

export function Pricing() {
  const { billing, setBilling } = useBilling();
  return (
    <section id="pricing" className="on-paper frame bg-paper pt-[var(--gap-section)] pb-[clamp(72px,8vw,128px)] text-paper-ink" aria-labelledby="pricing-title">
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-3 lg:grid-rows-[auto_auto]">
        <div data-reveal className="mb-8 lg:col-span-2 lg:row-start-1 lg:mb-0 lg:pr-8 lg:pb-12">
          <h2 id="pricing-title" className="text-[length:var(--text-head)]">{pricing.heading}</h2>
          <p className="mt-5 max-w-[44ch] text-[length:var(--text-body)]">{pricing.intro}</p>
          <fieldset className="mt-7 inline-flex rounded-full bg-paper-3 p-1">
            <legend className="sr-only">Billing period</legend>
            {(["monthly", "annual"] as const).map((b) => (
              <label key={b} className={`cursor-pointer rounded-full px-5 py-3 text-[length:var(--text-body)] font-medium transition-colors duration-[var(--t-hover)] has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-accent ${billing === b ? "bg-accent text-accent-ink" : "hover:bg-paper"}`}>
                <input type="radio" name="billing" value={b} checked={billing === b} onChange={() => setBilling(b)} className="sr-only" />
                {b === "monthly" ? "Billed monthly" : "Billed annually, save 20%"}
              </label>
            ))}
          </fieldset>
        </div>

        {plans.map((p, i) => {
          const price = monthlyPrice(p.monthly, billing);
          return (
            <article key={p.id} className={`flex flex-col overflow-hidden rounded-[24px] ${looks[i].tile} ${looks[i].h}`}>
              <div className="flex flex-1 flex-col gap-2 p-7">
                <h3 className="text-[28px] leading-none font-semibold">{p.name}</h3>
                <p className="tnum mt-3 text-[44px] leading-none font-medium tracking-[-0.03em] lg:text-[56px]" aria-live="polite">
                  {formatGBP(price)}<span className="text-[length:var(--text-body)] font-normal tracking-normal"> /month</span>
                </p>
                <p className="tnum min-h-[1.5em] text-[17px]">
                  {billing === "annual" ? `${formatGBP(Math.round(price * 12 * 100) / 100)} billed once a year` : "Billed monthly"}
                </p>
                <ul className="mt-4 flex flex-col gap-1 text-[17px]">
                  <li>{p.stock}</li>
                  {p.note && <li>{p.note}</li>}
                  <li>Everything listed below</li>
                  <li>{pricing.terms}</li>
                </ul>
              </div>
              <a href={BOOKING_URL} target="_blank" rel="noopener" className={`group flex h-16 shrink-0 items-center justify-between px-7 text-[length:var(--text-body)] font-semibold no-underline transition-colors duration-[var(--t-hover)] ${looks[i].strip}`}>
                <span>Book a demo<span className="sr-only"> for {p.name}</span></span>
                <span aria-hidden="true">{p.name}</span>
              </a>
            </article>
          );
        })}
      </div>

      <div className="mt-20 grid12 gap-y-6">
        <h3 className="col-span-12 text-[clamp(1.75rem,2.6vw,2.5rem)] md:col-span-4">{pricing.includesHeading}</h3>
        <ul data-reveal className="col-span-12 grid gap-x-10 gap-y-5 text-[length:var(--text-body)] md:col-span-8 md:grid-cols-2">
          {pricing.includes.map((x) => (
            <li key={x} className="max-w-[44ch]">{x}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
