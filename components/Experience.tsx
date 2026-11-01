"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { AnimatePresence, motion } from "framer-motion";
import { AudioProvider, useAudio } from "@/components/audio/AudioProvider";
import { CHAPTERS } from "@/lib/chapters";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";
import { getLenis, scrollToChapter, setLenis } from "@/lib/scroll";
import { Gate } from "@/components/Gate";
import { Nav } from "@/components/Nav";
import { Ch01Intro } from "@/components/chapters/Ch01Intro";
import { Ch02World } from "@/components/chapters/Ch02World";
import { Ch03Cost } from "@/components/chapters/Ch03Cost";
import { Ch04Housing } from "@/components/chapters/Ch04Housing";
import { Ch05Transport } from "@/components/chapters/Ch05Transport";
import { Ch06Urbanization } from "@/components/chapters/Ch06Urbanization";
import { Ch07Solutions } from "@/components/chapters/Ch07Solutions";
import { Ch08Final } from "@/components/chapters/Ch08Final";
import { References } from "@/components/chapters/References";

export type Phase = "gate" | "opening" | "ready";

export default function Experience() {
  return (
    <AudioProvider>
      <Shell />
    </AudioProvider>
  );
}

function Shell() {
  const [phase, setPhase] = useState<Phase>("gate");
  const [active, setActive] = useState(0);
  const [presenting, setPresenting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const audio = useAudio();
  const activeRef = useRef(0);

  // Always start at the top: the opening sequence is the entrance.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  // Smooth scrolling (desktop pointer only — touch keeps native scrolling)
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, anchors: false });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // Lock scrolling until the visitor enters the experience
  useEffect(() => {
    const ready = phase === "ready";
    document.documentElement.classList.toggle("is-locked", !ready);
    const l = getLenis();
    if (ready) {
      l?.start();
      ScrollTrigger.refresh();
    } else l?.stop();
  }, [phase]);

  // Which chapter is in the middle of the viewport
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.chapter);
            activeRef.current = i;
            setActive(i);
          }
        });
      },
      { rootMargin: "-49% 0px -49% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const { setTrack, playSfx, toggleMuted } = audio;
  useEffect(() => {
    setTrack(CHAPTERS[active].track);
    if (phase === "ready") playSfx("whoosh");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, setTrack]);

  const go = useCallback(
    (delta: number) => {
      const next = Math.max(0, Math.min(CHAPTERS.length - 1, activeRef.current + delta));
      if (next !== activeRef.current) scrollToChapter(CHAPTERS[next].id);
    },
    [],
  );

  const flash = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 3600);
  }, []);

  const togglePresent = useCallback(async () => {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      try {
        await el.requestFullscreen?.();
      } catch {
        /* fullscreen may be blocked — presentation mode still works windowed */
      }
      setPresenting(true);
      flash("Режим презентации · ← → главы · M звук · Esc выход");
    } else {
      await document.exitFullscreen?.().catch(() => {});
      setPresenting(false);
    }
  }, [flash]);

  useEffect(() => {
    const onFs = () => {
      if (!document.fullscreenElement) setPresenting(false);
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("presenting", presenting);
    if (!presenting) {
      document.documentElement.classList.remove("is-idle");
      return;
    }
    let t = 0;
    const wake = () => {
      document.documentElement.classList.remove("is-idle");
      window.clearTimeout(t);
      t = window.setTimeout(() => document.documentElement.classList.add("is-idle"), 2600);
    };
    wake();
    window.addEventListener("mousemove", wake);
    return () => {
      window.removeEventListener("mousemove", wake);
      window.clearTimeout(t);
    };
  }, [presenting]);

  // Keyboard: chapter navigation only in presentation mode, never while a control has focus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase !== "ready" || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [role='slider'], [contenteditable='true']")) return;
      if (!presenting) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "m" || e.key === "M" || e.key === "ь" || e.key === "Ь") {
        toggleMuted();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, presenting, go, toggleMuted]);

  return (
    <>
      <div className="grain" aria-hidden />

      <AnimatePresence>
        {phase === "gate" && (
          <Gate
            onStart={(withSound) => {
              audio.start(withSound);
              setPhase("opening");
            }}
          />
        )}
      </AnimatePresence>

      <Nav
        visible={phase === "ready"}
        active={active}
        presenting={presenting}
        onTogglePresent={togglePresent}
        onGo={(i) => scrollToChapter(CHAPTERS[i].id)}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-8 left-1/2 z-[70] -translate-x-1/2 rounded-full border border-white/15 bg-ink/85 px-5 py-2.5 text-xs tracking-wide text-paper backdrop-blur"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <Ch01Intro
          phase={phase}
          onEnter={() => {
            setPhase("ready");
            audio.playSfx("whoosh");
            window.setTimeout(() => scrollToChapter("mir"), 80);
          }}
          onSkip={() => setPhase("ready")}
        />
        <Ch02World />
        <Ch03Cost />
        <Ch04Housing />
        <Ch05Transport />
        <Ch06Urbanization />
        <Ch07Solutions />
        <Ch08Final />
        <References />
      </main>
    </>
  );
}
