import { KIND_LABEL, SOURCES } from "@/lib/data";
import { MUSIC_CREDITS, PHOTO_CREDITS } from "@/lib/credits";
import { KindLegend } from "@/components/ui/SourceNote";

export function References() {
  return (
    <section id="istochniki" aria-label="Источники" className="border-t border-white/10 bg-ink-2">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <p className="eyebrow text-accent">Исследование</p>
        <h2 className="mt-4 font-display text-[clamp(1.8rem,3.6vw,3rem)] font-extrabold uppercase tracking-[-0.03em]">Источники</h2>
        <p className="mt-4 max-w-2xl text-sm text-paper/65">
          Каждая цифра указана с годом, территорией и источником. Все фото и видео — реальная съёмка, без ИИ.
        </p>
        <KindLegend className="mt-6" />

        <ol className="mt-10 grid gap-x-10 gap-y-4 text-sm md:grid-cols-2">
          {Object.values(SOURCES).map((s) => (
            <li key={s.id} className="border-t border-white/10 pt-4">
              <a href={s.url} target="_blank" rel="noreferrer" className="font-semibold text-paper hover:text-accent">
                {s.publisher}
              </a>
              <p className="mt-1 text-paper/55">{s.title}</p>
              <p className="mt-1 text-xs text-mute">{KIND_LABEL[s.kind]}</p>
            </li>
          ))}
        </ol>

        <details className="mt-12 text-xs text-paper/60">
          <summary className="cursor-pointer select-none text-sm text-paper/80 hover:text-accent">Авторы фото, видео и музыки</summary>
          <ul className="mt-4 grid gap-x-8 gap-y-1.5 md:grid-cols-2">
            {PHOTO_CREDITS.map((c) => (
              <li key={c.file}>
                <a href={c.page} target="_blank" rel="noreferrer" className="underline decoration-white/20 underline-offset-2 hover:text-paper">
                  {c.title}
                </a>{" "}
                — {c.author}, {c.license}
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Видео: Mixkit (Stock Video Free License). Музыка: Mixkit (Stock Music Free License) —{" "}
            {MUSIC_CREDITS.map((m) => `«${m.track}» (${m.author})`).join(", ")}. Полный список — ASSET_SOURCES.md.
          </p>
        </details>

        <footer className="mt-16 flex flex-col justify-between gap-3 border-t border-white/10 pt-8 text-xs text-mute md:flex-row">
          <span className="font-grotesk font-bold tracking-[0.3em] text-paper">THE URBAN REALITY</span>
          <span>Стоимость жизни · Жильё · Транспорт · Урбанизация</span>
        </footer>
      </div>
    </section>
  );
}
