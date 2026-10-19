import type { Metadata } from "next";
import { BOOKING_URL, CONTACT_EMAIL, contactPage, heroEmails } from "@/content";
import { EmailCard } from "@/components/EmailCard";
import { Arrow } from "@/components/Arrow";

export const metadata: Metadata = {
  title: "Contact Wynback",
  description: "Book a 20-minute call to see Wynback running on your own sales list.",
};

export default function Contact() {
  return (
    <>
      <section className="frame grid12 min-h-[100svh] items-center gap-y-12 bg-bg pt-[120px] pb-20" aria-labelledby="contact-title">
        <div data-reveal className="col-span-12 lg:col-span-7">
          <h1 id="contact-title" className="text-[clamp(3rem,8vw,8rem)] leading-[0.92]">{contactPage.title}</h1>
          <p className="mt-6 max-w-[44ch] text-[length:var(--text-lead)] leading-[1.35]">{contactPage.line}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a href={BOOKING_URL} target="_blank" rel="noopener" className="btn">Book a 20-minute call <Arrow /></a>
            {CONTACT_EMAIL && <a href={`mailto:${CONTACT_EMAIL}`} className="link text-[length:var(--text-body)]">{CONTACT_EMAIL}</a>}
          </div>
        </div>
        <div className="col-span-12 mx-auto aspect-[4/5] w-full max-w-[420px] lg:col-span-4 lg:col-start-9">
          <EmailCard email={heroEmails[0]} />
        </div>
      </section>
      <section className="on-paper frame bg-paper py-[var(--gap-section)] text-paper-ink" aria-labelledby="agenda-title">
        <h2 id="agenda-title" className="mb-12 text-[length:var(--text-head)]">{contactPage.agendaHeading}</h2>
        <ol data-reveal className="grid gap-2 md:grid-cols-3">
          {contactPage.agenda.map((a, i) => (
            <li key={a.name} className={`flex min-h-[260px] flex-col justify-between gap-8 p-7 ${["bg-paper-2", "bg-paper-3", "bg-accent"][i]}`}>
              <h3 className="text-[clamp(1.75rem,2.6vw,2.5rem)]">{a.name}</h3>
              <p className="text-[length:var(--text-body)]">{a.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
