import type { heroEmails } from "@/content";

type Email = (typeof heroEmails)[number];

// A cropped piece of the product: one milestone email waiting for approval.
export function EmailCard({ email, className = "" }: { email: Email; className?: string }) {
  return (
    <div
      data-ui
      className={`flex h-full flex-col overflow-hidden rounded-[20px] bg-surface text-ink shadow-[0_30px_70px_-30px_rgba(76,36,170,0.35)] ${className}`}
      style={{ fontSize: "max(13px, min(3.4vw, 0.72vw + 4px))" }}
    >
      <div className="flex items-center justify-between gap-3 bg-surface-2 px-[1.4em] py-[0.9em]">
        <span className="font-semibold">{email.dealer}</span>
        <span className="tnum rounded-full bg-accent-soft px-[0.8em] py-[0.2em] font-semibold text-accent">{email.months} months</span>
      </div>
      <div className="flex flex-1 flex-col gap-[0.9em] px-[1.4em] pt-[1.2em] pb-[1.4em]">
        <div className="flex flex-col gap-[0.2em] text-muted">
          <span>To: {email.to}</span>
          <span>{email.car}</span>
        </div>
        <p className="text-[1.5em] leading-[1.1] font-semibold tracking-[-0.025em]">{email.subject}</p>
        {email.body.map((line) => (
          <p key={line} className="leading-[1.45]">{line}</p>
        ))}
        <p className="text-muted">{email.sign}</p>
        <div className="mt-auto flex gap-[0.5em]">
          <span className="rounded-[10px] bg-accent px-[1em] py-[0.55em] font-medium text-accent-ink">Approve</span>
          <span className="rounded-[10px] bg-surface-2 px-[1em] py-[0.55em]">Edit</span>
        </div>
      </div>
    </div>
  );
}
