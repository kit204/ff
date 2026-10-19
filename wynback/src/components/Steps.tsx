"use client";

import { useState } from "react";
import { BOOKING_URL, heroEmails, steps } from "@/content";
import { EmailCard } from "./EmailCard";
import { Arrow } from "./Arrow";

// Dark to light, one hue: order is carried by colour, not by numbers.
const tones = [
  { bg: "#2a1561", ink: "#ffffff", sub: "#d9cdf8" },
  { bg: "#6431c1", ink: "#ffffff", sub: "#ede7fb" },
  { bg: "#e6dcfb", ink: "#161224", sub: "#3a2a6b" },
];

function CsvFragment() {
  const rows = [
    ["Sarah Moss", "Ford Focus", "10/2023"],
    ["Raj Patel", "Skoda Octavia", "10/2021"],
    ["Emma Wood", "Mini Cooper", "10/2021"],
    ["Tom Briggs", "VW Golf", "10/2024"],
    ["Aisha Khan", "Toyota Yaris", "04/2025"],
  ];
  return (
    <div data-ui className="h-full rounded-[16px] bg-surface p-5 text-[14px] text-ink md:text-[15px]">
      <p className="mb-3 font-semibold">sales-export.csv</p>
      <table className="tnum w-full border-collapse text-left">
        <thead className="text-muted">
          <tr>{["Customer", "Car", "Sold"].map((h) => <th key={h} className="pb-2 font-normal">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="odd:bg-surface-2">
              {r.map((c, i) => <td key={i} className="py-2 pr-2 first:pl-2">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-muted">1,284 past sales imported</p>
    </div>
  );
}

function ReplyFragment() {
  return (
    <div data-ui className="flex h-full flex-col gap-3 rounded-[16px] bg-surface p-5 text-[15px] text-ink">
      <p className="font-semibold">Inbox</p>
      <div className="rounded-[10px] bg-surface-2 p-4">
        <p className="text-muted">Sarah Moss · Re: Three years in the Focus</p>
        <p className="mt-2">Funny you should ask. What would you give me for it? Looking at something bigger.</p>
      </div>
      <div className="rounded-[10px] bg-surface-2 p-4">
        <p className="text-muted">Raj Patel · Re: Five years with the Octavia</p>
        <p className="mt-2">Yes please, send them over. Free Saturday morning.</p>
      </div>
      <div className="mt-auto flex gap-2">
        <span className="rounded-[10px] bg-accent px-3 py-2 font-medium text-accent-ink">Reply</span>
        <span className="rounded-[10px] bg-surface-2 px-3 py-2">Book a viewing</span>
      </div>
    </div>
  );
}

const fragments = [<CsvFragment key="csv" />, <EmailCard key="email" email={heroEmails[1]} />, <ReplyFragment key="reply" />];

export function Steps() {
  const [open, setOpen] = useState(0);
  return (
    <section id="how-it-works" className="on-paper frame bg-paper py-[var(--gap-section)] text-paper-ink" aria-labelledby="steps-title">
      <div data-reveal className="grid12 gap-y-6">
        <h2 id="steps-title" className="col-span-12 text-[length:var(--text-head)] md:col-span-6">{steps.heading}</h2>
        <p className="col-span-12 max-w-[44ch] self-end text-[length:var(--text-body)] md:col-span-5 md:col-start-8">{steps.intro}</p>
      </div>

      <ol className="mt-12 flex flex-col overflow-hidden rounded-[24px] lg:mt-16 lg:h-[560px] lg:flex-row">
        {steps.items.map((s, i) => {
          const t = tones[i];
          const on = i === open;
          return (
            <li
              key={s.name}
              className="relative shrink-0 overflow-hidden transition-[flex-basis] lg:basis-[var(--basis)] duration-[450ms] ease-[var(--ease-in-out)] lg:h-full"
              style={{ background: t.bg, color: t.ink, ["--basis" as string]: on ? "62%" : "19%" }}
            >
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`step-${i}`}
                onClick={() => setOpen(i)}
                className={`flex w-full items-center px-5 text-left text-[18px] font-semibold lg:absolute lg:inset-0 lg:items-end lg:p-6 lg:text-[20px] ${on ? "h-16 lg:pointer-events-none lg:opacity-0" : "h-16 hover:opacity-80"}`}
              >
                <span className="lg:rotate-180 lg:whitespace-nowrap lg:[writing-mode:vertical-rl]">{s.name}</span>
              </button>
              <div
                id={`step-${i}`}
                hidden={!on}
                className="grid gap-6 px-5 pb-6 md:grid-cols-2 lg:absolute lg:inset-0 lg:gap-8 lg:p-8"
              >
                <div className="flex flex-col justify-between gap-6">
                  <h3 className="hidden text-[40px] leading-[1] lg:block">{s.name}</h3>
                  <p className="max-w-[36ch] text-[17px] md:text-[18px]" style={{ color: t.ink }}>{s.body}</p>
                </div>
                <div className="h-[320px] lg:h-full">{fragments[i]}</div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-12 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <p className="max-w-[52ch] text-[length:var(--text-lead)] leading-[1.3]">{steps.close}</p>
        <a href={BOOKING_URL} target="_blank" rel="noopener" className="btn shrink-0">
          {steps.action} <Arrow />
        </a>
      </div>
    </section>
  );
}
