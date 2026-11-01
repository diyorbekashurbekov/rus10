"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, Minimize2, VolumeX } from "lucide-react";
import { useAudio } from "@/components/audio/AudioProvider";
import { CHAPTERS } from "@/lib/chapters";

type Props = {
  visible: boolean;
  active: number;
  presenting: boolean;
  onTogglePresent: () => void;
  onGo: (i: number) => void;
};

export function Nav({ visible, active, presenting, onTogglePresent, onGo }: Props) {
  const audio = useAudio();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      });
    };
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !panelRef.current?.contains(e.target as Node)) setOpen(false);
    };
    addEventListener("mousedown", close);
    addEventListener("keydown", close);
    return () => {
      removeEventListener("mousedown", close);
      removeEventListener("keydown", close);
    };
  }, [open]);

  const ch = CHAPTERS[active];
  const silent = audio.muted || audio.volume === 0;

  return (
    <div
      className={`transition-opacity duration-1000 ${visible ? "opacity-100" : "pointer-events-none opacity-0"} ${
        presenting ? "[html.is-idle_&]:opacity-0" : ""
      }`}
    >
      <div className="fixed inset-x-0 top-0 z-50 h-px bg-white/10">
        <div ref={progressRef} className="h-full origin-left scale-x-0 bg-accent" />
      </div>

      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 text-white mix-blend-difference md:px-8 md:py-5">
        <button type="button" onClick={() => onGo(0)} className="font-grotesk text-[0.7rem] font-bold tracking-[0.3em]">
          THE URBAN REALITY
        </button>

        <p className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-3 text-xs md:flex" aria-live="polite">
          <span className="font-grotesk tabular tracking-[0.2em]">
            {ch.num} <span className="opacity-40">/ 08</span>
          </span>
          <span className="h-px w-8 bg-white/40" aria-hidden />
          <span className="opacity-80">{ch.title}</span>
        </p>

        <div className="flex items-center gap-1">
          {/* placeholder keeps layout; real controls are rendered outside the blend layer */}
          <span className="h-9 w-[4.5rem]" aria-hidden />
        </div>
      </header>

      <div ref={panelRef} className="fixed right-3 top-2.5 z-[55] flex items-center gap-1 md:right-6 md:top-3.5">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={silent ? "Звук выключен — открыть настройки звука" : "Звук включён — открыть настройки звука"}
          className="grid h-9 w-9 place-items-center rounded-full text-paper/90 transition-colors hover:bg-white/10"
        >
          {silent ? <VolumeX size={17} /> : <SoundBars />}
        </button>
        <button
          type="button"
          onClick={onTogglePresent}
          aria-pressed={presenting}
          aria-label={presenting ? "Выйти из режима презентации" : "Режим презентации (полный экран)"}
          title={presenting ? "Выйти из режима презентации" : "Режим презентации"}
          className="grid h-9 w-9 place-items-center rounded-full text-paper/90 transition-colors hover:bg-white/10"
        >
          {presenting ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-12 w-64 rounded-2xl border border-white/10 bg-ink-2/95 p-4 text-sm text-paper shadow-2xl backdrop-blur"
            >
              <div className="flex items-center justify-between">
                <span>Музыка</span>
                <Toggle checked={!audio.muted} onChange={(v) => audio.setMuted(!v)} label="Музыка" />
              </div>
              <label className="mt-3 block text-xs text-mute" htmlFor="vol">
                Громкость
              </label>
              <input
                id="vol"
                type="range"
                className="range text-paper/40"
                min={0}
                max={1}
                step={0.01}
                value={audio.volume}
                style={{ ["--fill" as string]: `${audio.volume * 100}%` }}
                onChange={(e) => audio.setVolume(Number(e.target.value))}
              />
              <div className="mt-2 flex items-center justify-between">
                <span>Звуковые эффекты</span>
                <Toggle checked={audio.sfx} onChange={audio.setSfx} label="Звуковые эффекты" />
              </div>
              <p className="mt-3 text-[0.68rem] leading-snug text-mute">
                Музыка: Mixkit (бесплатная лицензия). Эффекты синтезируются в браузере.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chapter rail */}
      <nav aria-label="Главы" className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
        {CHAPTERS.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onGo(i)}
            aria-label={`${c.num}. ${c.title}`}
            aria-current={i === active ? "step" : undefined}
            className="group flex items-center justify-end gap-3 py-0.5"
          >
            <span className="pointer-events-none whitespace-nowrap rounded bg-ink/80 px-2 py-0.5 text-[0.68rem] text-paper opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              {c.title}
            </span>
            <span
              className={`block h-px transition-all duration-500 ${
                i === active ? "w-8 bg-accent" : "w-4 bg-white/40 mix-blend-difference group-hover:w-6"
              }`}
            />
          </button>
        ))}
      </nav>
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 rounded-full transition-colors ${checked ? "bg-accent" : "bg-white/20"}`}
    >
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-paper transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  );
}

function SoundBars() {
  return (
    <span className="flex h-3.5 items-end gap-[2px]" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-[2px] rounded-full bg-current"
          style={{ height: "100%", animation: `sb 1.${i + 1}s ease-in-out ${i * 0.15}s infinite alternate`, transformOrigin: "bottom" }}
        />
      ))}
      <style>{`@keyframes sb{from{transform:scaleY(.25)}to{transform:scaleY(1)}}`}</style>
    </span>
  );
}
