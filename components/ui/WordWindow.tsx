"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, useCinematic } from "@/lib/motion";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { Photo } from "@/components/ui/Photo";

type Props = {
  word: string;
  eyebrow: string;
  video?: string;
  photo?: string;
  alt: string;
  children: React.ReactNode; // the statement revealed over the footage
};

/**
 * Chapter opener. A single giant word on black — the footage plays inside its letters.
 * Scrolling flies the camera through the word until the film fills the screen
 * and the chapter's one statement appears.
 */
export function WordWindow({ word, eyebrow, video, photo, alt, children }: Props) {
  const scene = useRef<HTMLDivElement>(null);
  const cinematic = useCinematic();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(scene);
      if (prefersReducedMotion()) {
        gsap.set(q(".ww-mask, .ww-eyebrow"), { autoAlpha: 0 });
        gsap.set(q(".ww-shade"), { opacity: 1 });
        return;
      }
      gsap.set(q(".ww-content > *"), { autoAlpha: 0, y: 40 });

      if (cinematic) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: scene.current, start: "top top", end: "+=160%", scrub: 0.7, pin: true, anticipatePin: 1 },
        });
        tl.fromTo(q(".ww-word"), { scale: 1 }, { scale: 9, ease: "power3.in", duration: 1 }, 0)
          .to(q(".ww-eyebrow"), { autoAlpha: 0, duration: 0.15 }, 0.05)
          .to(q(".ww-mask"), { opacity: 0, ease: "power1.in", duration: 0.45 }, 0.5)
          .fromTo(q(".ww-media"), { scale: 1.3 }, { scale: 1, ease: "power2.out", duration: 1.1 }, 0)
          .to(q(".ww-shade"), { opacity: 1, duration: 0.3 }, 0.8)
          .to(q(".ww-content > *"), { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.3, ease: "power3.out" }, 0.9);
      } else {
        // Phones / small screens: the same reveal plays once, no pinning
        const tl = gsap.timeline({ paused: true });
        tl.to(q(".ww-word"), { scale: 3, duration: 1.4, ease: "power3.in" }, 0)
          .to(q(".ww-mask, .ww-eyebrow"), { autoAlpha: 0, duration: 0.8 }, 0.6)
          .to(q(".ww-shade"), { opacity: 1, duration: 0.6 }, 1)
          .to(q(".ww-content > *"), { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.8, ease: "power3.out" }, 1.1);
        gsap.timeline({ scrollTrigger: { trigger: scene.current, start: "top 15%", once: true, onEnter: () => tl.play() } });
      }
    }, scene);
    return () => ctx.revert();
  }, [cinematic]);

  return (
    <div ref={scene} className="relative isolate h-[100svh] min-h-[560px] overflow-hidden bg-ink">
      <div className="ww-media absolute inset-0">
        {video ? <LazyVideo name={video} label={alt} /> : <Photo name={photo!} alt={alt} className="h-full w-full" />}
      </div>
      <div className="ww-shade absolute inset-0 bg-[linear-gradient(to_top,rgba(8,10,13,0.92),rgba(8,10,13,0.35)_55%,rgba(8,10,13,0.5))] opacity-0" />

      <div className="ww-mask word-mask absolute inset-0 flex items-center justify-center">
        <span
          className="ww-word block select-none whitespace-nowrap font-display font-extrabold uppercase leading-none tracking-[-0.06em]"
          style={{ fontSize: `min(${Math.round(118 / Math.max(word.length, 3))}vw, 46vh)` }}
          aria-hidden
        >
          {word}
        </span>
      </div>

      <div className="ww-mask pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
        <span
          className="ww-word block select-none whitespace-nowrap font-display font-extrabold uppercase leading-none tracking-[-0.06em] text-transparent"
          style={{ fontSize: `min(${Math.round(118 / Math.max(word.length, 3))}vw, 46vh)`, WebkitTextStroke: "1px rgba(245,245,242,0.35)" }}
        >
          {word}
        </span>
      </div>

      <p className="ww-eyebrow eyebrow absolute inset-x-0 top-[16%] text-center text-mute">{eyebrow}</p>

      <div className="ww-content absolute inset-x-0 bottom-0 z-10 mx-auto max-w-7xl px-5 pb-16 md:px-10 md:pb-24">{children}</div>
    </div>
  );
}
