"use client";

import { useEffect, useRef } from "react";
import { gsap, revealFades, useCinematic } from "@/lib/motion";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { useAudio } from "@/components/audio/AudioProvider";

export function Ch08Final() {
  const root = useRef<HTMLElement>(null);
  const cinematic = useCinematic();
  const { setSceneGain } = useAudio();

  useEffect(() => {
    const el = root.current!;
    const ctx = gsap.context(() => {
      revealFades(el);
      const q = gsap.utils.selector(el);

      // The soundtrack slowly settles as the film ends (works on every device)
      gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top center",
          end: "bottom bottom",
          onUpdate: (st) => setSceneGain(1 - st.progress * 0.75),
          onLeaveBack: () => setSceneGain(1),
        },
      });

      if (!cinematic) return;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: q(".final-scene")[0], start: "top top", end: "+=300%", scrub: 1, pin: true },
      });
      tl.fromTo(q(".final-media"), { scale: 1.15 }, { scale: 1, duration: 4, ease: "none" }, 0)
        .fromTo(q(".final-dim"), { opacity: 0.35 }, { opacity: 0.65, duration: 4, ease: "none" }, 0)
        .fromTo(q(".f1"), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.2)
        .to(q(".f1"), { autoAlpha: 0, y: -30, duration: 0.4 }, 1.1)
        .fromTo(q(".f2"), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 1.4)
        .to(q(".f2"), { autoAlpha: 0, y: -30, duration: 0.4 }, 2.3)
        .fromTo(q(".f3"), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 2.6)
        .fromTo(q(".f-brand"), { autoAlpha: 0, letterSpacing: "0.4em" }, { autoAlpha: 1, letterSpacing: "-0.03em", duration: 0.9 }, 3.1);
    }, el);
    return () => ctx.revert();
  }, [cinematic, setSceneGain]);

  const line = "font-display text-[clamp(2rem,5.8vw,6rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.035em]";

  return (
    <section ref={root} id="final" data-chapter="7" aria-label="Глава 08. Финал" className="relative bg-ink">
      <div className={`final-scene relative overflow-hidden ${cinematic ? "h-screen" : ""}`}>
        <div className="final-media absolute inset-0">
          <LazyVideo name="sunrise-city" label="Солнце поднимается над небоскрёбами города" rate={0.8} />
        </div>
        <div className={`final-dim absolute inset-0 bg-ink ${cinematic ? "" : "opacity-60"}`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(8,10,13,0.7)_100%)]" />

        <div className={`relative z-10 px-5 text-center [text-shadow:0_2px_30px_rgba(0,0,0,0.75)] ${cinematic ? "flex h-full items-center justify-center" : "flex flex-col gap-28 py-32"}`}>
          <p className={`f1 ${line} ${cinematic ? "absolute" : ""}`} data-fade={cinematic ? undefined : ""}>
            Город — это не просто здания.
          </p>
          <p className={`f2 ${line} ${cinematic ? "absolute" : ""}`} data-fade={cinematic ? undefined : ""}>
            Это <span className="text-accent">качество жизни</span> людей.
          </p>
          <div className={`f3 max-w-5xl ${cinematic ? "absolute" : ""}`} data-fade={cinematic ? undefined : ""}>
            <p className="font-display text-[clamp(1.4rem,3.4vw,3.2rem)] font-light uppercase leading-[1.1] tracking-[-0.01em]">
              Будущее городов начинается с решений, которые мы принимаем сегодня.
            </p>
            <p className="f-brand mt-14 font-grotesk text-[clamp(2.2rem,7vw,6.5rem)] font-bold leading-none tracking-[-0.03em]">
              THE URBAN REALITY
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 px-5 py-24 text-center">
        <p className="eyebrow text-mute">Спасибо за внимание</p>
        <a href="#istochniki" className="text-sm text-paper/70 underline underline-offset-4 hover:text-accent">
          Исследование и источники ↓
        </a>
      </div>
    </section>
  );
}
