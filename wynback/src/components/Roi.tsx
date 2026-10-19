"use client";

import { useId, useState } from "react";
import { BOOKING_URL, plans, roi, type PlanId } from "@/content";
import { formatGBP, monthlyPrice, useBilling } from "./Billing";
import { Arrow } from "./Arrow";

const clamp = (n: number, lo: number, hi: number) => (Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : lo);
const fmtNum = (n: number) => new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 }).format(n);

function NumberField({ label, value, onChange, min, max, step = 1, prefix, suffix }: {
  label: string; value: number; onChange: (n: number) => void; min: number; max: number; step?: number; prefix?: string; suffix?: string;
}) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[length:var(--text-body)]">{label}</label>
      <div className="flex h-14 items-center rounded-[12px] bg-surface px-4 focus-within:outline-3 focus-within:outline-accent">
        {prefix && <span className="text-muted" aria-hidden="true">{prefix}</span>}
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
          className="tnum w-full min-w-0 bg-transparent px-1 text-[length:var(--text-lead)] outline-none"
          value={draft ?? String(value)}
          onChange={(e) => {
            setDraft(e.target.value);
            const n = Number(e.target.value.replace(/[^\d.]/g, ""));
            if (e.target.value.trim() !== "" && Number.isFinite(n)) onChange(clamp(n, min, max));
          }}
          onBlur={() => setDraft(null)}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
              e.preventDefault();
              setDraft(null);
              onChange(clamp(value + (e.key === "ArrowUp" ? step : -step), min, max));
            }
          }}
          aria-describedby={`${id}-range`}
        />
        {suffix && <span className="shrink-0 text-muted" aria-hidden="true">{suffix}</span>}
      </div>
      <span id={`${id}-range`} className="sr-only">
        {prefix}{fmtNum(min)}{suffix} to {prefix}{fmtNum(max)}{suffix}
      </span>
    </div>
  );
}

export function Roi() {
  const { billing } = useBilling();
  const { defaults: d, limits: L } = roi;
  const [cars, setCars] = useState(d.carsPerMonth);
  const [profit, setProfit] = useState(d.profitPerCar);
  const [rate, setRate] = useState(d.winBackRate);
  const [planId, setPlanId] = useState<PlanId>(d.plan);
  const carsId = useId();

  const plan = plans.find((p) => p.id === planId)!;
  const perYear = cars * 12;
  const extra = Math.round(perYear * rate) / 100;
  const gross = Math.round(extra * profit);
  const planCost = Math.round(monthlyPrice(plan.monthly, billing) * 12 * 100) / 100;
  const net = Math.round((gross - planCost) * 100) / 100;
  const multiple = planCost > 0 ? gross / planCost : 0;
  const planLabel = `Wynback ${plan.name}, 12 months${billing === "annual" ? " (annual)" : ""}`;

  const groups: { name: string; rows: [string, string][] }[] = [
    { name: "Your sales", rows: [["Cars sold a month", fmtNum(cars)], ["Cars sold a year", fmtNum(perYear)]] },
    { name: "Coming back", rows: [["Win-back rate", `${fmtNum(rate)}%`], ["Extra sales a year", fmtNum(extra)], ["Profit per sale", formatGBP(profit)]] },
    { name: "The sum", rows: [["Gross profit", formatGBP(gross)], [planLabel, `−${formatGBP(planCost)}`]] },
  ];

  return (
    <section id="roi" className="frame bg-tint pt-[clamp(72px,8vw,128px)] pb-[clamp(72px,8vw,128px)]" aria-labelledby="roi-title">
      <div className="grid12 gap-y-14">
        <div className="col-span-12 flex flex-col lg:col-span-6">
          <div data-reveal>
            <h2 id="roi-title" className="text-[length:var(--text-head)]">{roi.heading}</h2>
            <p className="mt-5 max-w-[46ch] text-[length:var(--text-body)]">{roi.note}</p>
          </div>

          <form className="mt-12 flex flex-col gap-8" onSubmit={(e) => e.preventDefault()} aria-label="ROI calculator">
            <div className="flex flex-col gap-3">
              <label htmlFor={carsId} className="flex items-baseline justify-between gap-4 text-[length:var(--text-body)]">
                <span>Average cars sold per month</span>
                <span className="tnum text-[length:var(--text-lead)]" aria-hidden="true">{cars}</span>
              </label>
              <input
                id={carsId}
                type="range"
                className="range"
                min={L.carsMin}
                max={L.carsMax}
                value={cars}
                onChange={(e) => setCars(Number(e.target.value))}
                style={{ accentColor: "var(--color-accent)" }}
              />
            </div>

            <fieldset className="flex flex-col gap-3">
              <legend className="mb-3 text-[length:var(--text-body)]">Your Wynback plan</legend>
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
                {plans.map((p) => (
                  <label
                    key={p.id}
                    className={`flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-[12px] px-4 py-3 transition-colors duration-[var(--t-hover)] has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-accent ${
                      planId === p.id ? "bg-accent text-accent-ink" : "bg-surface hover:bg-accent-soft"
                    }`}
                  >
                    <input type="radio" name="roi-plan" value={p.id} checked={planId === p.id} onChange={() => setPlanId(p.id)} className="sr-only" />
                    <span className="font-semibold">{p.name}</span>
                    <span className="tnum">{formatGBP(monthlyPrice(p.monthly, billing))}/mo</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-6 sm:grid-cols-2">
              <NumberField label="Profit per car" value={profit} onChange={setProfit} min={L.profitMin} max={L.profitMax} step={50} prefix="£" />
              <NumberField label="Customers who come back" value={rate} onChange={setRate} min={L.rateMin} max={L.rateMax} step={0.5} suffix="%" />
            </div>
          </form>

          <div className="mt-14" aria-live="polite">
            <p className="tnum text-[clamp(3.5rem,17vw,6rem)] leading-[0.9] font-semibold tracking-[-0.05em] text-accent md:text-[clamp(5rem,8.5vw,9rem)]">
              {formatGBP(Math.round(net))}
            </p>
            <p className="tnum mt-5 max-w-[48ch] text-[17px]">
              Net profit a year: {formatGBP(gross)} gross, minus {formatGBP(planCost)} for {plan.name}
              {billing === "annual" ? " billed annually" : ""}, leaves {formatGBP(net)}.
            </p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 lg:col-start-8">
          <div className="slip tnum w-full max-w-[460px] px-6 pt-7 pb-12 text-[16px] lg:ml-auto" aria-label="How the figure adds up">
            <p className="mb-5 flex justify-between font-semibold"><span>Wynback</span><span>Estimate</span></p>
            {groups.map((g) => (
              <div key={g.name} className="mb-5">
                <p className="mb-2 font-semibold">{g.name}</p>
                <dl>
                  {g.rows.map(([k, v]) => (
                    <div key={k} className="flex items-baseline py-[3px]">
                      <dt className="shrink-0">{k}</dt>
                      <span className="leader" aria-hidden="true" />
                      <dd className="m-0 shrink-0 text-right">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
            <div className="-mx-3 flex items-baseline rounded-[8px] bg-accent px-3 py-3 font-semibold text-accent-ink">
              <span className="shrink-0">Net profit a year</span>
              <span className="flex-1" />
              <span>{formatGBP(net)}</span>
            </div>
            <p className="mt-4">
              {multiple >= 1 ? `That's ${fmtNum(Math.round(multiple * 10) / 10)}× what the plan costs.` : "Below the cost of the plan at these numbers."}
            </p>
            <p className="mt-1 text-paper-muted">An estimate from your own numbers, not a promise.</p>
          </div>
          <a href={BOOKING_URL} target="_blank" rel="noopener" className="btn mt-8 w-full max-w-[460px] lg:ml-auto lg:flex">
            Check it against your real list <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}
