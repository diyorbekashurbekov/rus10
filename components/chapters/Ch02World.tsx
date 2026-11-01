"use client";

import { useEffect, useRef } from "react";
import { gsap, revealFades, revealLines } from "@/lib/motion";
import { WordWindow } from "@/components/ui/WordWindow";
import { SourceNote } from "@/components/ui/SourceNote";
import { WorldMap } from "@/components/viz/WorldMap";

export function Ch02World() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    const ctx = gsap.context(() => {
      revealLines(el);
      revealFades(el);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="mir" data-chapter="1" aria-label="Глава 02. Мир становится городским" className="relative bg-ink">
      <WordWindow word="Город" eyebrow="Глава 02 · Мир становится городским" video="world-night" alt="Ночная панорама небоскрёбов большого города">
        <p className="eyebrow text-mute">2025 · мир</p>
        <p className="mt-2 font-display text-[clamp(6rem,20vw,18rem)] font-extrabold leading-[0.82] tracking-[-0.06em]">
          45<span className="text-accent">%</span>
        </p>
        <p className="mt-4 max-w-2xl font-display text-[clamp(1.3rem,2.6vw,2.4rem)] font-light leading-tight">
          человечества живёт в городах. В 1950 году — лишь 20%.
        </p>
        <SourceNote src="wup2025" meta="1950 и 2025 · мир" className="mt-5" />
      </WordWindow>

      <div className="bg-ink-2">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
          <h3 className="font-display text-[clamp(2.2rem,5vw,4.6rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.035em]">
            <span className="mask-line"><span>33 мегаполиса.</span></span>
            <span className="mask-line"><span className="text-accent">Вот самые большие.</span></span>
          </h3>
          <div data-fade className="mt-14">
            <WorldMap />
          </div>
          <SourceNote src="wup2025data" meta="2025 · городские агломерации, млн человек" className="mt-8" />

          <div data-fade className="mt-20 flex flex-col gap-4 border-t border-white/10 pt-10 md:flex-row md:items-end md:gap-10">
            <p className="font-display text-[clamp(4rem,9vw,8rem)] font-extrabold leading-none tracking-[-0.05em]">
              63<span className="text-accent">%</span>
            </p>
            <div className="pb-2">
              <p className="font-display text-xl md:text-3xl">казахстанцев — горожане.</p>
              <SourceNote src="bnsUrban" meta="начало 2025 · Казахстан" className="mt-3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
