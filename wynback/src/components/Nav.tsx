"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BOOKING_URL, nav } from "@/content";
import { Arrow } from "./Arrow";

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="frame absolute inset-x-0 top-0 z-40 flex h-[72px] items-center justify-between gap-6 md:h-[88px]">
      <Link href="/" className="shrink-0" aria-label="Wynback home">
        <Image src="/wynback-logo.png" alt="Wynback" width={281} height={78} priority className="h-8 w-auto md:h-9" />
      </Link>
      <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className="text-[length:var(--text-body)] font-medium no-underline transition-colors duration-[var(--t-hover)] hover:text-accent">
            {n.label}
          </Link>
        ))}
        <a href={BOOKING_URL} className="btn" target="_blank" rel="noopener">
          Book a demo <Arrow />
        </a>
      </nav>
      <button
        type="button"
        className="btn lg:hidden"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "Close" : "Menu"}
      </button>
      {open && (
        <div id="mobile-menu" className="frame fixed inset-x-0 top-[72px] bottom-0 z-40 flex flex-col gap-2 bg-surface pt-6 pb-10 lg:hidden">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-3 text-[length:var(--text-head)] leading-none no-underline">
              {n.label}
            </Link>
          ))}
          <a href={BOOKING_URL} className="btn mt-auto w-full" target="_blank" rel="noopener">
            Book a demo <Arrow />
          </a>
        </div>
      )}
    </header>
  );
}
