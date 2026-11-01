"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, revealFades, revealLines } from "@/lib/motion";
import { BASE } from "@/lib/asset";
import { WordWindow } from "@/components/ui/WordWindow";
import { Credit, Photo } from "@/components/ui/Photo";
import { SourceNote } from "@/components/ui/SourceNote";
import { BeforeAfter } from "@/components/viz/BeforeAfter";

export function Ch06Urbanization() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    const ctx = gsap.context(() => {
      revealLines(el);
      revealFades(el);
      if (prefersReducedMotion()) return;
      gsap.fromTo(".smog-img", { scale: 1.2 }, {
        scale: 1, ease: "none",
        scrollTrigger: { trigger: ".smog-wrap", start: "top bottom", end: "bottom top", scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="urbanizaciya" data-chapter="5" aria-label="Глава 06. Урбанизация" className="relative bg-ink">
      <WordWindow word="Рост" eyebrow="Глава 06 · Урбанизация" video="construction-aerial" alt="Строящиеся многоэтажки, вид с высоты">
        <h2 className="max-w-5xl font-display text-[clamp(2.4rem,7vw,7rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.04em]">
          Города растут. <span className="text-accent">Успевает ли инфраструктура?</span>
        </h2>
      </WordWindow>

      <div className="mx-auto max-w-7xl px-5 py-28 md:px-10 md:py-36">
        <p data-fade className="eyebrow text-mute">Казахстан · доля горожан</p>
        <p data-fade className="tabular mt-6 font-display text-[clamp(3.6rem,10vw,9rem)] font-extrabold leading-none tracking-[-0.05em]">
          <span className="text-paper/35">60%</span>
          <span className="mx-4 text-accent md:mx-8">→</span>
          62,4%
        </p>
        <p data-fade className="mt-6 max-w-2xl font-display text-[clamp(1.2rem,2.2vw,2rem)] font-light">
          за пять лет, 2020 → 2025. Люди едут из сёл в города — быстрее, чем строятся школы, дороги и больницы.
        </p>
        <SourceNote src="wbUrban" meta="2020 и 2025 · Казахстан" className="mt-5" />

        <h3 className="mt-32 font-display text-[clamp(2.2rem,5vw,4.6rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.035em]">
          <span className="mask-line"><span>52 года.</span></span>
          <span className="mask-line"><span className="text-mute">Один город.</span></span>
        </h3>
        <p data-fade className="mt-5 max-w-2xl text-paper/75">
          Лас-Вегас из космоса, 1972 и 2024. Сетка улиц заполнила всю пустынную долину.
        </p>
        <div data-fade className="mt-10">
          <BeforeAfter
            before={{ src: `${BASE}/assets/images/vegas-1972.webp`, srcSm: `${BASE}/assets/images/vegas-1972-sm.webp`, label: "1972", alt: "Лас-Вегас на снимке Landsat 1972 года: небольшой город в пустыне" }}
            after={{ src: `${BASE}/assets/images/vegas-2024.webp`, srcSm: `${BASE}/assets/images/vegas-2024-sm.webp`, label: "2024", alt: "Лас-Вегас на снимке Landsat 2024 года: застройка заполнила всю долину" }}
          />
        </div>
        <SourceNote src="nasaLandsat" meta="Landsat, условные цвета · общественное достояние" className="mt-5" />
      </div>

      <div className="smog-wrap relative h-[100svh] min-h-[560px] overflow-hidden">
        <Photo name="almaty-smog" alt="Смог над Алматы на фоне гор" className="smog-img absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-16 md:px-10 md:pb-24">
          <h3 className="max-w-4xl font-display text-[clamp(2.2rem,6vw,5.6rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.04em]">
            <span className="mask-line"><span>Цена роста —</span></span>
            <span className="mask-line"><span className="text-accent">воздух, которым мы дышим.</span></span>
          </h3>
          <p data-fade className="mt-5 max-w-xl text-paper/80">Города потребляют 78% энергии мира и дают более 60% выбросов парниковых газов.</p>
          <SourceNote src="unCities" meta="мир · UN-Habitat" className="mt-4" />
          <Credit name="almaty-smog" place="Смог над Алматы" className="mt-3" />
        </div>
      </div>
    </section>
  );
}
