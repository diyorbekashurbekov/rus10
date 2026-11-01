"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, revealFades, revealLines } from "@/lib/motion";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { Credit, Photo } from "@/components/ui/Photo";

const DIRECTIONS = [
  { n: "01", t: "Доступное жильё", city: "Вена", d: "Город десятилетиями строит муниципальное жильё — с арендой, доступной обычной семье.", photo: "vienna-housing", alt: "Арка жилого комплекса Karl-Marx-Hof в Вене", place: "Karl-Marx-Hof, Вена" },
  { n: "02", t: "Транспорт для всех", city: "Богота", d: "Автобусы на выделенных полосах проезжают мимо пробки — как метро, только на улице.", photo: "bogota-brt", alt: "Автобус TransMilenio на выделенной полосе рядом с пробкой в Боготе", place: "TransMilenio, Богота" },
  { n: "03", t: "Город для людей", city: "Сеул", d: "Эстакаду снесли — и в центре города снова течёт река.", photo: "seoul-stream", alt: "Ручей Чхонгечхон с деревьями на рассвете в Сеуле", place: "Чхонгечхон, Сеул" },
  { n: "04", t: "Зелёные улицы", city: "Копенгаген", d: "Велосипед стал обычным транспортом — круглый год, для всех возрастов.", photo: "copenhagen-cyclist", alt: "Велосипедистка на улице Копенгагена", place: "Копенгаген" },
];

export function Ch07Solutions() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    const ctx = gsap.context(() => {
      revealLines(el);
      revealFades(el);
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>(".sol-media").forEach((m, i) => {
        gsap.fromTo(
          m,
          { clipPath: i % 2 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0%)", duration: 1.5, ease: "expo.inOut", scrollTrigger: { trigger: m, start: "top 78%", once: true } },
        );
        gsap.fromTo(m.querySelector("img"), { scale: 1.2 }, {
          scale: 1, ease: "none",
          scrollTrigger: { trigger: m, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="resheniya" data-chapter="6" aria-label="Глава 07. Пути решения" className="on-paper relative bg-paper text-ink">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-36 md:px-10 md:pb-24 md:pt-48">
        <p className="eyebrow text-[#B4441F]">Глава 07 · Пути решения</p>
        <h2 className="mt-6 font-display text-[clamp(2.8rem,9vw,9.5rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.05em]">
          <span className="mask-line"><span>Города могут</span></span>
          <span className="mask-line"><span className="text-[#B4441F]">быть другими.</span></span>
        </h2>
      </div>

      {DIRECTIONS.map((d, i) => (
        <article key={d.n} className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:px-10 md:py-20 lg:grid-cols-12 lg:items-end lg:gap-14">
          <div className={`sol-media relative aspect-[16/10] overflow-hidden lg:col-span-7 ${i % 2 ? "lg:order-2" : ""}`}>
            <Photo name={d.photo} alt={d.alt} className="absolute inset-0 h-full w-full" sizes="(min-width:1024px) 60vw, 100vw" />
          </div>
          <div className={`lg:col-span-5 ${i % 2 ? "lg:order-1" : ""}`}>
            <p className="font-grotesk text-sm tracking-[0.2em] text-[#B4441F]">
              {d.n} · {d.city.toUpperCase()}
            </p>
            <h3 className="mt-3 font-display text-[clamp(2.2rem,4.4vw,4rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.04em]">
              <span className="mask-line"><span>{d.t}</span></span>
            </h3>
            <p data-fade className="mt-5 font-display text-xl font-light leading-snug text-ink/80 md:text-2xl">{d.d}</p>
            <Credit name={d.photo} place={d.place} className="mt-6" />
          </div>
        </article>
      ))}

      <div className="relative mt-20 h-[90svh] overflow-hidden">
        <LazyVideo name="park-bikes" label="Велосипедисты в зелёном городском парке" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
        <div className="absolute bottom-12 left-5 right-5 text-paper md:bottom-20 md:left-10">
          <p className="max-w-4xl font-display text-[clamp(2rem,5vw,4.6rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.04em]">
            Лучший город — тот, где хочется <span className="text-accent">жить</span>, а не только работать.
          </p>
        </div>
      </div>
    </section>
  );
}
