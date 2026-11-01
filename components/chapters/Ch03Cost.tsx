"use client";

import { useEffect, useRef } from "react";
import { gsap, revealFades, revealLines } from "@/lib/motion";
import { WordWindow } from "@/components/ui/WordWindow";
import { SourceNote } from "@/components/ui/SourceNote";
import { KZ_WAGE } from "@/lib/data";
import { fmt } from "@/lib/format";

export function Ch03Cost() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    const ctx = gsap.context(() => {
      revealLines(el);
      revealFades(el);
    }, el);
    return () => ctx.revert();
  }, []);

  const gap = Math.round((KZ_WAGE.q4avg / KZ_WAGE.q4median - 1) * 100);

  return (
    <section ref={root} id="stoimost" data-chapter="2" aria-label="Глава 03. Стоимость жизни" className="relative bg-ink">
      <WordWindow word="Цена" eyebrow="Глава 03 · Стоимость жизни" video="wallet" alt="Человек открывает кошелёк и видит, что денег больше нет">
        <h2 className="max-w-5xl font-display text-[clamp(2.4rem,7vw,7rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.04em]">
          Сколько стоит <span className="text-accent">жить в городе?</span>
        </h2>
      </WordWindow>

      {/* Average vs median: inequality in two numbers */}
      <div className="mx-auto max-w-7xl px-5 py-28 md:px-10 md:py-40">
        <p data-fade className="eyebrow text-mute">Зарплата в Казахстане · IV квартал 2025</p>
        <div className="mt-12 grid gap-14 md:grid-cols-2 md:gap-10">
          <div data-fade>
            <p className="tabular font-display text-[clamp(3rem,7.5vw,7rem)] font-extrabold leading-none tracking-[-0.05em] text-paper/35">
              {fmt(KZ_WAGE.q4avg)}<span className="ml-2 text-[0.4em]">₸</span>
            </p>
            <p className="mt-4 text-lg text-paper/60">средняя — так выглядит статистика</p>
          </div>
          <div data-fade={0.15}>
            <p className="tabular font-display text-[clamp(3rem,7.5vw,7rem)] font-extrabold leading-none tracking-[-0.05em]">
              {fmt(KZ_WAGE.q4median)}<span className="ml-2 text-[0.4em] text-accent">₸</span>
            </p>
            <p className="mt-4 text-lg">медианная — половина людей получает меньше</p>
          </div>
        </div>
        <SourceNote src="bnsWage" meta="IV кв. 2025 · Казахстан" className="mt-10" />

        <h3 className="mt-28 max-w-5xl font-display text-[clamp(2rem,5vw,4.6rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]">
          <span className="mask-line"><span>Разница — {gap}%.</span></span>
          <span className="mask-line"><span className="text-accent">Это и есть неравенство.</span></span>
        </h3>
      </div>
    </section>
  );
}
