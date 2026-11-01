"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Dark entrance. Visible straight from the server HTML (CSS animation, no JS needed);
 * the button only becomes active once the page is interactive, so a click is never lost.
 * That click is also what lets the browser start the soundtrack.
 */
export function Gate({ onStart }: { onStart: (withSound: boolean) => void }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-ink px-6 text-center"
      exit={{ opacity: 0, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } }}
    >
      <p className="gate-in eyebrow text-mute" style={{ animationDelay: "0.2s" }}>
        Кинематографическое исследование
      </p>
      <p className="gate-in mt-5 font-grotesk text-[clamp(1.8rem,5vw,3.4rem)] font-bold tracking-[-0.03em]" style={{ animationDelay: "0.4s" }}>
        THE URBAN REALITY
      </p>

      <div className="gate-in my-10 h-14 w-px bg-gradient-to-b from-transparent via-paper/50 to-transparent" style={{ animationDelay: "0.6s" }} aria-hidden />

      <button
        type="button"
        disabled={!ready}
        onClick={() => onStart(true)}
        className="gate-in group relative overflow-hidden rounded-full border border-paper/30 px-9 py-4 font-grotesk text-sm tracking-[0.28em] text-paper transition-colors enabled:hover:border-accent disabled:opacity-50"
        style={{ animationDelay: "0.8s" }}
        autoFocus
      >
        <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[var(--ease-cinema)] group-enabled:group-hover:scale-x-100" />
        <span className="relative transition-colors duration-500 group-enabled:group-hover:text-ink">
          {ready ? "НАЧАТЬ ПУТЕШЕСТВИЕ" : "ЗАГРУЗКА…"}
        </span>
      </button>

      <div className="gate-in mt-8 flex flex-col items-center gap-3 text-xs text-mute" style={{ animationDelay: "1.1s" }}>
        <p>Включите звук — история рассказана музыкой</p>
        <button
          type="button"
          disabled={!ready}
          onClick={() => onStart(false)}
          className="underline decoration-mute/50 underline-offset-4 hover:text-paper disabled:opacity-40"
        >
          Продолжить без звука
        </button>
      </div>
    </motion.div>
  );
}
