"use client";

import { useEffect, useRef, useState } from "react";
import { BASE } from "@/lib/asset";

type Props = {
  name: string; // file stem in /assets/videos
  className?: string;
  eager?: boolean;
  rate?: number;
  label?: string;
};

/**
 * Background video that only loads near the viewport and only plays while visible,
 * so at most one or two videos decode at any time. Falls back to its poster on error.
 */
export function LazyVideo({ name, className = "", eager = false, rate = 1, label }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | undefined>(eager ? `${BASE}/assets/videos/${name}.mp4` : undefined);
  const [failed, setFailed] = useState(false);
  const poster = `${BASE}/assets/videos/${name}-poster.webp`;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const near = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSrc(`${BASE}/assets/videos/${name}.mp4`);
          near.disconnect();
        }
      },
      { rootMargin: "60% 100%" },
    );
    const vis = new IntersectionObserver(
      ([e]) => {
        if (reduced) return;
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.05 },
    );
    near.observe(v);
    vis.observe(v);
    return () => {
      near.disconnect();
      vis.disconnect();
    };
  }, [name]);

  useEffect(() => {
    if (ref.current) ref.current.playbackRate = rate;
  }, [rate, src]);

  if (failed) {
    return <img src={poster} alt={label ?? ""} className={`h-full w-full object-cover ${className}`} />;
  }

  return (
    <video
      ref={ref}
      className={`h-full w-full object-cover ${className}`}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload={eager ? "auto" : "none"}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      onLoadedData={(e) => {
        e.currentTarget.playbackRate = rate;
        const r = e.currentTarget.getBoundingClientRect();
        if (r.bottom > 0 && r.top < innerHeight && !matchMedia("(prefers-reduced-motion: reduce)").matches)
          e.currentTarget.play().catch(() => {});
      }}
      onError={() => setFailed(true)}
    />
  );
}
