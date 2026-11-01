"use client";

import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  lenis = l;
}

export function getLenis() {
  return lenis;
}

export function scrollToChapter(id: string, immediate = false) {
  const el = document.getElementById(id);
  if (!el) return;
  // Pinned sections live inside a pin-spacer; scroll to the spacer's top.
  const target = (el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el) as HTMLElement;
  if (lenis) lenis.scrollTo(target, { duration: immediate ? 0 : 1.8, immediate });
  else target.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
}
