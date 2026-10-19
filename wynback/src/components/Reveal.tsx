"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Staggered entrances for every [data-reveal] block. Without script, nothing is hidden.
export function RevealScript() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const blocks = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    blocks.forEach((b) => [...b.children].forEach((c, i) => (c as HTMLElement).style.setProperty("--i", String(i))));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      }),
      { rootMargin: "0px 0px -10% 0px" },
    );
    // Anything already on screen enters on the first frame instead of waiting for a scroll.
    blocks.forEach((b) => {
      if (b.getBoundingClientRect().top < window.innerHeight * 0.9) requestAnimationFrame(() => b.classList.add("is-in"));
      else io.observe(b);
    });
    document.documentElement.classList.add("js-reveal");
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
