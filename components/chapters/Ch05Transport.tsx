"use client";

import { useEffect, useRef } from "react";
import { gsap, revealFades, revealLines, useCinematic } from "@/lib/motion";
import { WordWindow } from "@/components/ui/WordWindow";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { Credit, Photo } from "@/components/ui/Photo";
import { SourceNote } from "@/components/ui/SourceNote";

const PANELS = [
  {
    kind: "video" as const,
    media: "bus-window",
    alt: "Девушка смотрит в окно автобуса",
    t: "Каждый день",
    d: "Часы жизни уходят на дорогу, которую никто не выбирал.",
  },
  {
    kind: "photo" as const,
    media: "bangkok-traffic",
    alt: "Вечерняя пробка в Бангкоке",
    place: "Бангкок",
    t: "Машин больше, чем дорог",
    d: "В час пик город превращается в парковку.",
  },
  {
    kind: "photo" as const,
    media: "almaty-metro",
    alt: "Станция метро «Абай» в Алматы",
    place: "Метро Алматы",
    t: "51,6%",
    d: "горожан мира имеют удобный доступ к общественному транспорту. Остальные — нет.",
    src: { id: "sdg2023", meta: "2022 · мир" },
  },
];

export function Ch05Transport() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const cinematic = useCinematic();

  useEffect(() => {
    const el = root.current!;
    const ctx = gsap.context(() => {
      revealLines(el);
      revealFades(el);
      if (!cinematic || !track.current) return;
      // Vertical scroll drives a horizontal documentary strip
      const distance = () => track.current!.scrollWidth - innerWidth;
      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: { trigger: strip.current, start: "top top", end: () => `+=${distance()}`, scrub: 0.6, pin: true, invalidateOnRefresh: true },
      });
      gsap.utils.toArray<HTMLElement>(".h-panel-media").forEach((m) => {
        gsap.fromTo(m, { xPercent: -8 }, {
          xPercent: 8, ease: "none",
          scrollTrigger: { trigger: m.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
        });
      });
    }, el);
    return () => ctx.revert();
  }, [cinematic]);

  return (
    <section ref={root} id="transport" data-chapter="4" aria-label="Глава 05. Транспорт" className="relative bg-ink">
      <WordWindow word="Пробка" eyebrow="Глава 05 · Транспорт" video="traffic-night-aerial" alt="Ночной поток машин на развязке, вид сверху">
        <h2 className="max-w-5xl font-display text-[clamp(2.4rem,7vw,7rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.04em]">
          Мы теряем время, <span className="text-accent">пока город стоит.</span>
        </h2>
      </WordWindow>

      <div ref={strip} className={cinematic ? "h-screen overflow-hidden" : ""}>
        <div ref={track} className={cinematic ? "flex h-full w-max" : "flex flex-col"}>
          {PANELS.map((p) => (
            <article key={p.t} className={`relative shrink-0 overflow-hidden ${cinematic ? "h-full w-[82vw] border-r-4 border-ink" : "h-[90svh]"}`}>
              <div className={`h-panel-media absolute ${cinematic ? "inset-y-0 -left-[10%] -right-[10%]" : "inset-0"}`}>
                {p.kind === "video" ? (
                  <LazyVideo name={p.media} label={p.alt} />
                ) : (
                  <Photo name={p.media} alt={p.alt} className="h-full w-full object-[50%_35%]" sizes="85vw" />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-14">
                <h3 className="font-display text-[clamp(2.6rem,6vw,6rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.04em]">{p.t}</h3>
                <p className="mt-4 max-w-xl font-display text-[clamp(1.1rem,1.8vw,1.6rem)] font-light leading-snug text-paper/90">{p.d}</p>
                {p.src && <SourceNote src={p.src.id} meta={p.src.meta} className="mt-4" />}
                {p.kind === "photo" && <Credit name={p.media} place={p.place} className="mt-3" />}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <LazyVideo name="subway" label="Поезд метро отходит от станции" />
        </div>
        <div className="absolute inset-0 bg-ink/65" />
        <div className="relative mx-auto max-w-7xl px-5 py-32 md:px-10 md:py-48">
          <h3 className="max-w-5xl font-display text-[clamp(2rem,5vw,4.6rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]">
            <span className="mask-line"><span>Вопрос не в том,</span></span>
            <span className="mask-line"><span>как построить больше дорог.</span></span>
            <span className="mask-line"><span className="text-accent">А как перевезти больше людей.</span></span>
          </h3>
        </div>
      </div>
    </section>
  );
}
