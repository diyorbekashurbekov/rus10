"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { TRACKS, type TrackId } from "@/lib/chapters";

type AudioApi = {
  started: boolean;
  muted: boolean;
  volume: number;
  sfx: boolean;
  start: (withSound: boolean) => void;
  setMuted: (m: boolean) => void;
  toggleMuted: () => void;
  setVolume: (v: number) => void;
  setSfx: (on: boolean) => void;
  setTrack: (id: TrackId) => void;
  setSceneGain: (g: number) => void;
  playSfx: (kind: "whoosh" | "tick") => void;
};

const Ctx = createContext<AudioApi | null>(null);

export function useAudio() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAudio outside AudioProvider");
  return c;
}

const FADE_IN = 3;
const FADE_OUT = 2.4;
const MAX_LEVEL = 0.85; // music never reaches full output — it sits under the presenter's voice

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [started, setStarted] = useState(false);
  const [muted, setMutedState] = useState(false);
  const [volume, setVolumeState] = useState(0.6);
  const [sfx, setSfxState] = useState(true);

  const audios = useRef<Partial<Record<TrackId, HTMLAudioElement>>>({});
  const gains = useRef<Record<TrackId, { g: number }>>({
    intro: { g: 0 }, piano: { g: 0 }, tension: { g: 0 }, build: { g: 0 }, hope: { g: 0 },
  });
  const current = useRef<TrackId>("intro");
  const scene = useRef(1);
  const live = useRef({ muted: false, volume: 0.6, sfx: true, started: false });
  const ctx = useRef<AudioContext | null>(null);

  const apply = useCallback((id: TrackId) => {
    const a = audios.current[id];
    if (!a) return;
    const { muted, volume } = live.current;
    const sceneGain = id === current.current ? scene.current : 1;
    a.volume = Math.max(0, Math.min(1, gains.current[id].g * sceneGain * volume * MAX_LEVEL * (muted ? 0 : 1)));
  }, []);

  const ensure = useCallback((id: TrackId) => {
    let a = audios.current[id];
    if (!a) {
      a = new Audio(TRACKS[id]);
      a.loop = true;
      a.preload = "auto";
      a.volume = 0;
      audios.current[id] = a;
    }
    return a;
  }, []);

  const fadeTo = useCallback(
    (id: TrackId, target: number, duration: number) => {
      const a = ensure(id);
      gsap.killTweensOf(gains.current[id]);
      if (target > 0 && a.paused) a.play().catch(() => {});
      gsap.to(gains.current[id], {
        g: target,
        duration,
        ease: "sine.inOut",
        onUpdate: () => apply(id),
        onComplete: () => {
          if (target === 0) a.pause();
        },
      });
    },
    [apply, ensure],
  );

  const setTrack = useCallback(
    (id: TrackId) => {
      if (id === current.current && live.current.started) return;
      const prev = current.current;
      current.current = id;
      if (!live.current.started) return;
      if (prev !== id) fadeTo(prev, 0, FADE_OUT);
      fadeTo(id, 1, FADE_IN);
    },
    [fadeTo],
  );

  const start = useCallback(
    (withSound: boolean) => {
      live.current.started = true;
      live.current.muted = !withSound;
      setMutedState(!withSound);
      setStarted(true);
      try {
        ctx.current = new AudioContext();
      } catch {
        ctx.current = null;
      }
      // Must happen inside the click handler so the browser allows playback.
      const a = ensure(current.current);
      a.play().catch(() => {});
      fadeTo(current.current, 1, 4.5);
      // Warm up the next track so the first crossfade is instant.
      ensure("piano").load();
    },
    [ensure, fadeTo],
  );

  const setMuted = useCallback(
    (m: boolean) => {
      live.current.muted = m;
      setMutedState(m);
      (Object.keys(audios.current) as TrackId[]).forEach(apply);
    },
    [apply],
  );

  const setVolume = useCallback(
    (v: number) => {
      live.current.volume = v;
      setVolumeState(v);
      if (v > 0 && live.current.muted) {
        live.current.muted = false;
        setMutedState(false);
      }
      (Object.keys(audios.current) as TrackId[]).forEach(apply);
    },
    [apply],
  );

  const setSfx = useCallback((on: boolean) => {
    live.current.sfx = on;
    setSfxState(on);
  }, []);

  const setSceneGain = useCallback(
    (g: number) => {
      scene.current = g;
      apply(current.current);
    },
    [apply],
  );

  const playSfx = useCallback((kind: "whoosh" | "tick") => {
    const ac = ctx.current;
    const { sfx, muted, volume } = live.current;
    if (!ac || !sfx || muted || volume === 0) return;
    if (ac.state === "suspended") ac.resume();
    const now = ac.currentTime;
    const out = ac.createGain();
    out.connect(ac.destination);
    if (kind === "tick") {
      const o = ac.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(1180, now);
      o.frequency.exponentialRampToValueAtTime(520, now + 0.09);
      out.gain.setValueAtTime(0.0001, now);
      out.gain.exponentialRampToValueAtTime(0.05 * volume, now + 0.008);
      out.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      o.connect(out);
      o.start(now);
      o.stop(now + 0.14);
      return;
    }
    // Soft filtered-noise "air" transition
    const len = 1.1;
    const buf = ac.createBuffer(1, ac.sampleRate * len, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource();
    src.buffer = buf;
    const f = ac.createBiquadFilter();
    f.type = "bandpass";
    f.Q.value = 0.9;
    f.frequency.setValueAtTime(220, now);
    f.frequency.exponentialRampToValueAtTime(1800, now + 0.55);
    f.frequency.exponentialRampToValueAtTime(400, now + len);
    out.gain.setValueAtTime(0.0001, now);
    out.gain.exponentialRampToValueAtTime(0.07 * volume, now + 0.45);
    out.gain.exponentialRampToValueAtTime(0.0001, now + len);
    src.connect(f).connect(out);
    src.start(now);
  }, []);

  useEffect(() => {
    const all = audios.current;
    return () => {
      Object.values(all).forEach((a) => {
        a?.pause();
        if (a) a.src = "";
      });
      ctx.current?.close().catch(() => {});
    };
  }, []);

  const api = useMemo<AudioApi>(
    () => ({
      started, muted, volume, sfx, start, setMuted,
      toggleMuted: () => setMuted(!live.current.muted),
      setVolume, setSfx, setTrack, setSceneGain, playSfx,
    }),
    [started, muted, volume, sfx, start, setMuted, setVolume, setSfx, setTrack, setSceneGain, playSfx],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
