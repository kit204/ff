import type { heroEmails } from "@/content";

type Email = (typeof heroEmails)[number];

// A cropped piece of the product: one milestone email waiting for approval.
export function EmailCard({ email, className = "" }: { email: Email; className?: string }) {
  return (
    <div
      data-ui
      className={`flex h-full flex-col overflow-hidden bg-surface text-ink ${className}`}
      style={{ fontSize: "max(13px, min(3.4vw, 0.72vw + 4px))" }}
    >
      <div className="flex items-center justify-between gap-3 bg-surface-2 px-[1.4em] py-[0.9em]">
        <span className="font-semibold">{email.dealer}</span>
        <span className="tnum bg-accent px-[0.6em] py-[0.15em] font-semibold text-accent-ink">{email.months} months</span>
      </div>
      <div className="flex flex-1 flex-col gap-[0.9em] px-[1.4em] pt-[1.2em] pb-[1.4em]">
        <div className="flex flex-col gap-[0.2em] text-muted">
          <span>To: {email.to}</span>
          <span>{email.car}</span>
        </div>
        <p className="text-[1.65em] leading-[1.05] font-medium tracking-[-0.02em]">{email.subject}</p>
        {email.body.map((line) => (
          <p key={line} className="leading-[1.45]">{line}</p>
        ))}
        <p className="text-muted">{email.sign}</p>
        <div className="mt-auto flex gap-[0.5em]">
          <span className="bg-accent px-[1em] py-[0.55em] font-semibold text-accent-ink">Approve</span>
          <span className="bg-surface-3 px-[1em] py-[0.55em]">Edit</span>
        </div>
      </div>
    </div>
  );
}
