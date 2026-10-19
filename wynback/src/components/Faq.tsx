import { BOOKING_URL, faq } from "@/content";
import { Arrow } from "./Arrow";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title">
      <div className="on-accent frame grid12 items-end gap-y-4 bg-accent pt-16 pb-6 text-accent-ink md:pt-24 md:pb-8">
        <h2 id="faq-title" className="col-span-12 text-[clamp(3.5rem,13vw,7.5rem)] md:col-span-6 md:text-[7vw]">{faq.heading}</h2>
        <p className="col-span-12 max-w-[40ch] text-[length:var(--text-body)] md:col-span-5 md:col-start-8 md:pb-3">{faq.lead}</p>
      </div>
      {faq.items.map((f, i) => (
        <div key={f.q} className={`frame grid12 gap-y-4 py-8 md:py-14 ${i % 2 ? "bg-surface-2" : "bg-surface"}`}>
          <h3 className="col-span-12 text-[22px] leading-[1.15] font-semibold md:col-span-5 md:text-[30px]">{f.q}</h3>
          <p className="col-span-12 max-w-[60ch] text-[17px] leading-[1.5] md:col-span-6 md:col-start-7 md:text-[18px]">{f.a}</p>
        </div>
      ))}
      <div className={`frame grid12 gap-y-6 py-8 md:py-14 ${faq.items.length % 2 ? "bg-surface-2" : "bg-surface"}`}>
        <p className="col-span-12 text-[22px] leading-[1.15] font-semibold md:col-span-6 md:text-[30px]">{faq.more}</p>
        <div className="col-span-12 md:col-span-6 md:col-start-7">
          <a href={BOOKING_URL} target="_blank" rel="noopener" className="btn">Book a demo <Arrow /></a>
        </div>
      </div>
    </section>
  );
}
