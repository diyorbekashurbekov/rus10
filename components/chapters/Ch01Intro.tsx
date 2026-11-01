"use client";

import { BASE } from "@/lib/asset";

import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import type { Phase } from "@/components/Experience";

const BRAND = "THE URBAN REALITY";

export function Ch01Intro({ phase, onEnter, onSkip }: { phase: Phase; onEnter: () => void; onSkip: () => void }) {
  const root = useRef<HTMLElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const skipRef = useRef(onSkip);
  skipRef.current = onSkip;

  // Hidden initial state
  useEffect(() => {
    const q = gsap.utils.selector(root);
    gsap.set(q(".hero-media"), { autoAlpha: 0, scale: 1.18 });
    gsap.set(q(".l1 .mask-line > span, .l2 .mask-line > span"), { yPercent: 110 });
    gsap.set(q(".brand-ch"), { autoAlpha: 0, yPercent: 60 });
    gsap.set(q(".hero-sub, .hero-cta, .hero-meta, .scroll-cue"), { autoAlpha: 0, y: 16 });
  }, []);

  // Opening sequence — roughly 16 seconds
  useEffect(() => {
    if (phase !== "opening") return;
    const q = gsap.utils.selector(root);
    videoRef.current?.play().catch(() => {});
    if (prefersReducedMotion()) {
      gsap.set(q(".hero-media"), { autoAlpha: 1, scale: 1 });
      gsap.set(q(".brand-ch, .hero-sub, .hero-cta, .hero-meta"), { autoAlpha: 1, y: 0, yPercent: 0 });
      return;
    }
    const t = gsap.timeline();
    t.to(q(".hero-media"), { autoAlpha: 1, duration: 2.6, ease: "power1.inOut" }, 0.3)
      .to(q(".hero-media"), { scale: 1.02, duration: 12, ease: "none" }, 0.3)
      .to(q(".l1 .mask-line > span"), { yPercent: 0, duration: 1.3, stagger: 0.14, ease: "expo.out" }, 1.1)
      .to(q(".l1"), { autoAlpha: 0, y: -20, duration: 0.8, ease: "power2.in" }, 4)
      .to(q(".l2 .mask-line > span"), { yPercent: 0, duration: 1.3, stagger: 0.14, ease: "expo.out" }, 4.7)
      .to(q(".l2"), { autoAlpha: 0, y: -20, duration: 0.8, ease: "power2.in" }, 7.6)
      .to(q(".brand-ch"), { autoAlpha: 1, yPercent: 0, duration: 1.4, stagger: 0.04, ease: "expo.out" }, 8.3)
      .to(q(".hero-sub"), { autoAlpha: 1, y: 0, duration: 1.2, ease: "power3.out" }, 9.3)
      .to(q(".hero-cta"), { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" }, 9.9)
      .to(q(".skip"), { autoAlpha: 0, duration: 0.5 }, 9.9);
    tl.current = t;
    // Never hold the visitor hostage: any scroll, swipe or key ends the opening.
    const skip = () => skipRef.current();
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " ", "Enter", "Escape", "ArrowRight"].includes(e.key)) skip();
    };
    const arm = window.setTimeout(() => {
      addEventListener("wheel", skip, { passive: true });
      addEventListener("touchmove", skip, { passive: true });
      addEventListener("keydown", onKey);
    }, 600);
    return () => {
      t.kill();
      clearTimeout(arm);
      removeEventListener("wheel", skip);
      removeEventListener("touchmove", skip);
      removeEventListener("keydown", onKey);
    };
  }, [phase]);

  // Jump to the final frame when the visitor skips or enters
  useEffect(() => {
    if (phase !== "ready") return;
    const q = gsap.utils.selector(root);
    tl.current?.kill();
    gsap.to(q(".l1, .l2"), { autoAlpha: 0, duration: 0.4 });
    gsap.to(q(".hero-media"), { autoAlpha: 1, duration: 0.8 });
    gsap.to(q(".brand-ch"), { autoAlpha: 1, yPercent: 0, duration: 0.9, stagger: 0.02, ease: "power3.out" });
    gsap.to(q(".hero-sub, .hero-meta, .scroll-cue"), { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" });
    gsap.to(q(".hero-cta, .skip"), { autoAlpha: 0, duration: 0.4 });
    videoRef.current?.play().catch(() => {});

    if (prefersReducedMotion()) return;
    // Scroll-away: the title lifts off while the city keeps drifting
    const ctx = gsap.context(() => {
      gsap.to(q(".hero-title-wrap"), {
        yPercent: -35, autoAlpha: 0, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(q(".hero-media-inner"), {
        scale: 1.12, yPercent: 12, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, [phase]);

  return (
    <section
      ref={root}
      id="vhod"
      data-chapter="0"
      aria-label="Глава 01. Вход в реальность"
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink"
    >
      <div className="hero-media vignette absolute inset-0">
        <div className="hero-media-inner absolute inset-0">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={`${BASE}/assets/videos/city-night-aerial.mp4`}
            poster={`${BASE}/assets/videos/city-night-aerial-poster.webp`}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
            onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.7)}
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,transparent_20%,rgba(8,10,13,0.55)_80%)]" />
      </div>

      <div className="relative z-10 flex h-full items-center justify-center px-5 text-center">
        <h2 className="l1 absolute font-display text-[clamp(1.6rem,4.6vw,4.4rem)] font-light uppercase leading-[1.08] tracking-[-0.01em]">
          <span className="mask-line"><span>Каждый день миллионы людей</span></span>
          <span className="mask-line"><span>просыпаются в городах.</span></span>
        </h2>
        <h2 className="l2 absolute font-display text-[clamp(1.6rem,4.6vw,4.4rem)] font-light uppercase leading-[1.08] tracking-[-0.01em]">
          <span className="mask-line"><span>Но все ли они могут назвать их</span></span>
          <span className="mask-line"><span className="text-accent">комфортным местом для жизни?</span></span>
        </h2>

        <div className="hero-title-wrap flex flex-col items-center [text-shadow:0_2px_28px_rgba(0,0,0,0.65)]">
          <p className="hero-meta eyebrow mb-6 text-mute">Глава 01 · Вход в реальность</p>
          <h1 className="font-grotesk text-[clamp(2.6rem,10.5vw,10.5rem)] font-bold leading-[0.88] tracking-[-0.04em]" aria-label={BRAND}>
            {BRAND.split(" ").map((w, wi) => (
              <span key={wi} className="inline-block whitespace-nowrap px-[0.12em]" aria-hidden>
                {w.split("").map((c, ci) => (
                  <span key={ci} className="brand-ch inline-block">
                    {c}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className="hero-sub mt-6 max-w-xl font-display text-[clamp(1rem,1.6vw,1.35rem)] font-light text-paper/85">
            Главные вызовы современной городской жизни
          </p>
          <button
            type="button"
            onClick={onEnter}
            className="hero-cta group mt-12 flex items-center gap-4 font-grotesk text-xs tracking-[0.34em] text-paper"
          >
            <span className="h-px w-10 bg-paper/60 transition-all duration-700 group-hover:w-16 group-hover:bg-accent" />
            ENTER THE EXPERIENCE
            <span className="h-px w-10 bg-paper/60 transition-all duration-700 group-hover:w-16 group-hover:bg-accent" />
          </button>
        </div>
      </div>

      {phase === "opening" && (
        <button
          type="button"
          onClick={onSkip}
          className="skip absolute bottom-8 right-6 z-20 text-xs tracking-[0.2em] text-paper/50 hover:text-paper md:right-10"
        >
          ПРОПУСТИТЬ →
        </button>
      )}

      <div className="scroll-cue absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] tracking-[0.3em] text-paper/60">
        ЛИСТАЙТЕ
        <ArrowDown size={14} className="animate-bounce" />
      </div>
    </section>
  );
}
