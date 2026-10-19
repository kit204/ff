import Link from "next/link";
import { BOOKING_URL, CONTACT_EMAIL, footer, nav } from "@/content";
import { Arrow } from "./Arrow";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-paper frame flex flex-col bg-paper pt-10 pb-6 text-paper-ink">
      <div className="grid12 items-start gap-y-4 text-[length:var(--text-small)]">
        <p className="col-span-12 text-[length:var(--text-lead)] leading-none font-semibold md:col-span-3">Wynback</p>
        <p className="col-span-12 max-w-[36ch] md:col-span-5">{footer.about}</p>
        <a href="#main" className="link col-span-12 md:col-span-4 md:justify-self-end">Back to top</a>
      </div>
      <div className="pt-[clamp(96px,12vw,200px)]">
        <h2 className="sr-only">Get in touch</h2>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener"
          className="group flex items-end gap-[0.15em] text-[clamp(3rem,11vw,11rem)] leading-[0.9] font-medium tracking-[-0.04em] no-underline"
        >
          <span className="underline decoration-[0.04em] underline-offset-[0.12em] decoration-transparent transition-[text-decoration-color] duration-200 group-hover:decoration-current">
            {footer.contactLine}
          </span>
          <Arrow size={0} className="h-[0.6em] w-[0.6em] shrink-0 transition-transform duration-300 group-hover:translate-x-[0.05em] group-hover:-translate-y-[0.05em]" />
        </a>
        {CONTACT_EMAIL && (
          <a href={`mailto:${CONTACT_EMAIL}`} className="link mt-6 inline-block text-[length:var(--text-lead)]">{CONTACT_EMAIL}</a>
        )}
      </div>
      <div className="mt-12 flex flex-col gap-2 text-[length:var(--text-small)] md:flex-row md:items-end md:justify-between">
        <ul className="flex flex-wrap gap-x-6 gap-y-1">
          {nav.map((n) => (
            <li key={n.href}><Link className="link" href={n.href}>{n.label}</Link></li>
          ))}
        </ul>
        <p>© {year} Wynback</p>
        <p>{footer.place}</p>
      </div>
    </footer>
  );
}
