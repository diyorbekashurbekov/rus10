"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, revealFades, revealLines, useCinematic } from "@/lib/motion";
import { WordWindow } from "@/components/ui/WordWindow";
import { Credit, Photo } from "@/components/ui/Photo";
import { SourceNote } from "@/components/ui/SourceNote";
import { KZ_HOUSING, KZ_WAGE } from "@/lib/data";
import { fmt, fmt1 } from "@/lib/format";

export function Ch04Housing() {
  const root = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const cinematic = useCinematic();

  useEffect(() => {
    const el = root.current!;
    const ctx = gsap.context(() => {
      revealLines(el);
      revealFades(el);

      if (!prefersReducedMotion()) {
        gsap.fromTo(".dharavi-img", { scale: 1.15 }, {
          scale: 1, ease: "none",
          scrollTrigger: { trigger: ".dharavi-wrap", start: "top bottom", end: "bottom top", scrub: true },
        });
      }

      if (!cinematic) return;
      // A small window into a wall of homes opens to full screen; the number lands
      const q = gsap.utils.selector(scene);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: scene.current, start: "top top", end: "+=170%", scrub: 0.7, pin: true, anticipatePin: 1 },
      });
      tl.fromTo(q(".expand-frame"), { clipPath: "inset(12% 45% 12% 45%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 1 }, 0)
        .fromTo(q(".expand-img"), { scale: 1.4 }, { scale: 1, ease: "power2.inOut", duration: 1 }, 0)
        .fromTo(q(".expand-shade"), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.6)
        .fromTo(q(".expand-num"), { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power3.out" }, 0.75)
        .fromTo(q(".expand-text"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.95);
    }, el);
    return () => ctx.revert();
  }, [cinematic]);

  const flat = 50 * KZ_HOUSING.almatyResale;
  const years = flat / KZ_WAGE.avg2025 / 12;

  return (
    <section ref={root} id="zhilyo" data-chapter="3" aria-label="Глава 04. Жильё" className="relative bg-ink">
      <WordWindow word="Дом" eyebrow="Глава 04 · Жильё" photo="hk-yick-cheong" alt="Тысячи окон жилого дома в Гонконге">
        <h2 className="max-w-5xl font-display text-[clamp(2.4rem,7vw,7rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.04em]">
          Дом — это не роскошь. <span className="text-accent">Или уже роскошь?</span>
        </h2>
      </WordWindow>

      {/* Expanding window → years of work */}
      <div ref={scene} className="relative h-[100svh] min-h-[560px] overflow-hidden">
        <div className="expand-frame absolute inset-0" style={cinematic ? { clipPath: "inset(12% 45% 12% 45%)" } : undefined}>
          <Photo name="hk-monster" alt="Тысячи окон жилого комплекса в Гонконге, вид снизу вверх" className="expand-img absolute inset-0 h-full w-full" />
          <div className="expand-shade absolute inset-0 bg-ink/65" style={cinematic ? { opacity: 0 } : undefined} />
        </div>
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
          <p className="expand-num tabular font-display text-[clamp(6rem,22vw,20rem)] font-extrabold leading-[0.8] tracking-[-0.06em]" data-fade={cinematic ? undefined : ""}>
            {fmt1(years)}
            <span className="ml-4 text-[0.25em] tracking-normal text-accent">лет</span>
          </p>
          <div className="expand-text mt-8 max-w-2xl" data-fade={cinematic ? undefined : ""}>
            <p className="font-display text-[clamp(1.2rem,2.4vw,2.1rem)] font-light leading-snug">
              работы без единой траты — столько стоит квартира 50 м² в Алматы.
            </p>
            <p className="mt-4 text-xs text-paper/60">
              50 м² × {fmt(KZ_HOUSING.almatyResale)} ₸ ÷ средняя зарплата {fmt(KZ_WAGE.avg2025)} ₸
            </p>
            <SourceNote src="bnsHousing" meta="цена м², январь 2025 · Алматы" className="mt-3 justify-center" />
          </div>
        </div>
        <div className="absolute bottom-5 left-5 z-10 md:left-10">
          <Credit name="hk-monster" place="Куорри-Бэй, Гонконг" />
        </div>
      </div>

      {/* The global picture */}
      <div className="dharavi-wrap relative h-[100svh] min-h-[560px] overflow-hidden">
        <Photo name="dharavi" alt="Крыши трущоб Дхарави в Мумбаи" className="dharavi-img absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/10" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-16 md:px-10 md:pb-24">
          <p data-fade className="tabular font-display text-[clamp(5rem,15vw,14rem)] font-extrabold leading-[0.82] tracking-[-0.06em]">
            1,1 <span className="text-[0.4em]">млрд</span>
          </p>
          <p data-fade className="mt-5 max-w-2xl font-display text-[clamp(1.3rem,2.6vw,2.4rem)] font-light leading-tight">
            горожан живут в трущобах. Через 30 лет их может стать на 2 млрд больше.
          </p>
          <SourceNote src="sdg2023" meta="2020 · мир; прогноз — 30 лет" className="mt-5" />
          <Credit name="dharavi" place="Дхарави, Мумбаи" className="mt-4" />
        </div>
      </div>
    </section>
  );
}
