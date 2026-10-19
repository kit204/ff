"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Staggered entrances for every [data-reveal] block. Without script, nothing is hidden.
// A block enters once its top passes 92% of the viewport, including blocks the visitor
// jumped past (an anchor link, a fast fling), so nothing is ever left invisible.
export function RevealScript() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let pending = [...document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)")];
    pending.forEach((b) => [...b.children].forEach((c, i) => (c as HTMLElement).style.setProperty("--i", String(i))));
    let frame = 0;
    const check = () => {
      frame = 0;
      const line = window.innerHeight * 0.92;
      pending = pending.filter((b) => {
        if (b.getBoundingClientRect().top < line) { b.classList.add("is-in"); return false; }
        return true;
      });
      if (!pending.length) window.removeEventListener("scroll", onScroll);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(check); };
    document.documentElement.classList.add("js-reveal");
    requestAnimationFrame(check);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);
  return null;
}
