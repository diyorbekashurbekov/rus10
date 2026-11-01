"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export function useMatchMedia(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatch(mq.matches);
    const on = () => setMatch(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

/** True once the element has scrolled into view (used to start chart animations). */
export function useInView<T extends Element>(ref: React.RefObject<T | null>, margin = "0px 0px -15% 0px") {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin, seen]);
  return seen;
}

/** Pinned / heavy scenes only run on wide screens without reduced motion. */
export const CINEMATIC_MQ = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";
export const SIMPLE_MQ = "(max-width: 899px), (prefers-reduced-motion: reduce)";

export const useCinematic = () => useMatchMedia(CINEMATIC_MQ);

/** Standard masked headline reveal for every `.mask-line > span` inside `root`. */
export function revealLines(root: Element, opts: { start?: string; stagger?: number } = {}) {
  // Scenes that drive their own lines (pinned timelines) opt out with data-noreveal
  const lines = Array.from(root.querySelectorAll(".mask-line > span")).filter((l) => !l.closest("[data-noreveal]"));
  if (!lines.length) return;
  if (prefersReducedMotion()) return;
  gsap.from(lines, {
    yPercent: 110,
    duration: 1.3,
    ease: "expo.out",
    stagger: opts.stagger ?? 0.09,
    scrollTrigger: { trigger: root, start: opts.start ?? "top 78%", once: true },
  });
}

/** Fade-up for `[data-fade]` children. */
export function revealFades(root: Element) {
  if (prefersReducedMotion()) return;
  root.querySelectorAll<HTMLElement>("[data-fade]").forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0,
      y: 40,
      duration: 1.2,
      ease: "power3.out",
      delay: Number(el.dataset.fade) || 0,
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });
}
