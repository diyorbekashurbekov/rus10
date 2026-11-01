"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

type Side = { src: string; srcSm: string; label: string; alt: string };

/** Drag / click / keyboard comparison of two images. */
export function BeforeAfter({ before, after }: { before: Side; after: Side }) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const fromEvent = (clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };

  // A slow sweep when the frame appears: the city grows in front of the audience
  useEffect(() => {
    if (prefersReducedMotion() || !box.current) return;
    const o = { p: 100 };
    setPos(100);
    const tl = gsap.timeline({
      scrollTrigger: { trigger: box.current, start: "top 65%", once: true },
      onUpdate: () => setPos(o.p),
    });
    tl.to(o, { p: 0, duration: 3.2, ease: "power2.inOut", delay: 0.4 }).to(o, { p: 50, duration: 1.4, ease: "power2.inOut" });
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={box}
      className="relative aspect-[1280/650] w-full touch-pan-y select-none overflow-hidden bg-ink-2"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        fromEvent(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && fromEvent(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <img src={after.src} srcSet={`${after.srcSm} 1200w, ${after.src} 2400w`} sizes="100vw" alt={after.alt} className="absolute inset-0 h-full w-full object-cover" draggable={false} loading="lazy" decoding="async" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={before.src} srcSet={`${before.srcSm} 1200w, ${before.src} 2400w`} sizes="100vw" alt={before.alt} className="absolute inset-0 h-full w-full object-cover" draggable={false} loading="lazy" decoding="async" />
      </div>

      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-ink/75 px-4 py-1.5 font-grotesk text-lg font-bold tracking-wider">{before.label}</span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-ink/75 px-4 py-1.5 font-grotesk text-lg font-bold tracking-wider">{after.label}</span>

      <div
        role="slider"
        tabIndex={0}
        aria-label={`Сравнение снимков ${before.label} и ${after.label}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); setPos((p) => Math.max(0, p - 5)); }
          if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); setPos((p) => Math.min(100, p + 5)); }
        }}
        className="absolute inset-y-0 -ml-5 flex w-10 cursor-ew-resize justify-center"
        style={{ left: `${pos}%` }}
      >
        <span className="h-full w-0.5 bg-paper shadow-[0_0_12px_rgba(0,0,0,.6)]" />
        <span className="absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink shadow-xl">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </div>
  );
}
