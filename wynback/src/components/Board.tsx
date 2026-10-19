"use client";

import { useState } from "react";

// Sample data: a month of milestone emails at an example dealership.
const rows = [
  { name: "Hannah Clarke", car: "2021 Kia Sportage", months: 12, status: "Sent", subject: "A year in the Sportage", detail: "Sent Tuesday 08:10. Not opened yet." },
  { name: "Tom Briggs", car: "2020 VW Golf", months: 24, status: "Opened", subject: "Two years in the Golf", detail: "Opened twice, Wednesday evening." },
  { name: "Aisha Khan", car: "2022 Toyota Yaris", months: 18, status: "To approve", subject: "Eighteen months with the Yaris", detail: "Written, waiting for your approval." },
  { name: "Sarah Moss", car: "2019 Ford Focus", months: 36, status: "Replied", subject: "Three years in the Focus", detail: "“Funny you should ask. What would you give me for it?”" },
  { name: "Raj Patel", car: "2018 Skoda Octavia", months: 60, status: "Booked", subject: "Five years with the Octavia", detail: "Coming in Saturday 10:30 to look at estates." },
  { name: "Liam Hughes", car: "2021 Nissan Qashqai", months: 36, status: "Sent", subject: "Three years in the Qashqai", detail: "Sent Monday 08:10." },
  { name: "Emma Wood", car: "2017 Mini Cooper", months: 60, status: "Replied", subject: "Five years with the Mini", detail: "“Still love it, but we need something bigger now.”" },
  { name: "Gary Shaw", car: "2020 BMW 1 Series", months: 48, status: "Opened", subject: "Four years in the 1 Series", detail: "Opened Thursday lunchtime." },
  { name: "Megan Ross", car: "2022 Hyundai Tucson", months: 12, status: "To approve", subject: "A year in the Tucson", detail: "Written, waiting for your approval." },
];

const statusClass: Record<string, string> = {
  Booked: "bg-accent text-accent-ink",
  Replied: "bg-paper text-paper-ink",
  Opened: "bg-surface-3 text-ink",
  Sent: "bg-surface-3 text-muted",
  "To approve": "bg-muted text-paper-ink",
};

export function Board() {
  const [open, setOpen] = useState(3);
  return (
    <section className="bg-bg pb-[var(--gap-section)]" aria-labelledby="board-title">
      <div data-reveal className="frame grid12 items-end gap-y-6 pb-10">
        <h2 id="board-title" className="col-span-12 text-[length:var(--text-head)] md:col-span-7">This month&rsquo;s milestones</h2>
        <p className="col-span-12 max-w-[42ch] md:col-span-5 md:col-start-8">
          Every customer who reaches a milestone this month, written to, approved and tracked. Opens, replies and bookings, at a glance.
        </p>
      </div>
      <div className="frame relative overflow-hidden">
        <ul data-ui className="-my-[36px] flex flex-col gap-[4px] md:-my-[36px]" aria-label="Milestone emails this month (example dealership)">
          {rows.map((r, i) => {
            const isOpen = i === open;
            return (
              <li key={r.name}>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-expanded={isOpen}
                  className={`grid w-full grid-cols-12 items-start gap-x-4 px-4 text-left transition-[height,background-color] duration-[450ms] ease-[var(--ease-in-out)] md:px-6 ${
                    isOpen ? "h-[200px] bg-accent text-accent-ink md:h-[216px]" : "h-[64px] bg-surface text-ink hover:bg-surface-2 md:h-[72px]"
                  }`}
                >
                  <span className={`col-span-8 truncate pt-[18px] text-[20px] font-medium md:col-span-4 md:pt-[18px] md:text-[length:var(--text-lead)] ${isOpen ? "text-[28px] md:text-[length:var(--text-head)] md:leading-[1]" : ""}`}>
                    {r.name}
                  </span>
                  <span className="hidden truncate pt-[22px] text-[length:var(--text-body)] md:col-span-3 md:block">{r.car}</span>
                  <span className="tnum hidden pt-[22px] text-[length:var(--text-body)] md:col-span-2 md:block">{r.months} months</span>
                  <span className="col-span-4 flex justify-end pt-[14px] md:col-span-3 md:pt-[16px]">
                    <span className={`px-3 py-[8px] text-[length:var(--text-small)] font-semibold ${isOpen ? "bg-accent-ink text-accent" : statusClass[r.status]}`}>
                      {r.status}
                    </span>
                  </span>
                  {isOpen && (
                    <span className="col-span-12 mt-3 flex flex-col gap-1 text-[16px] md:col-span-8 md:mt-4 md:text-[17px]">
                      <span className="md:hidden">{r.car}, {r.months} months</span>
                      <span>Subject: {r.subject}</span>
                      <span>{r.detail}</span>
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
