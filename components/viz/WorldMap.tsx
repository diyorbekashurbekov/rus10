"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import land110 from "world-atlas/land-110m.json";
import { MEGACITIES } from "@/lib/data";
import { fmt1 } from "@/lib/format";
import { gsap, prefersReducedMotion } from "@/lib/motion";

const W = 960;
const H = 470;

export function WorldMap() {
  const [sel, setSel] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const { landPath, points } = useMemo(() => {
    const topo = land110 as unknown as Topology<{ land: GeometryCollection }>;
    const land = feature(topo, topo.objects.land);
    const projection = geoEqualEarth().fitExtent([[10, 10], [W - 10, H - 10]], land);
    const path = geoPath(projection);
    return {
      landPath: path(land) ?? "",
      points: MEGACITIES.map((c) => {
        const [x, y] = projection([c.lon, c.lat]) ?? [0, 0];
        return { ...c, x, y, r: Math.sqrt(c.pop) * 2.1 };
      }),
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion() || !svgRef.current) return;
    const dots = svgRef.current.querySelectorAll(".city-dot");
    const tw = gsap.from(dots, {
      scale: 0, transformOrigin: "center", duration: 1.2, ease: "back.out(2)", stagger: 0.08,
      scrollTrigger: { trigger: svgRef.current, start: "top 75%", once: true },
    });
    return () => {
      tw.scrollTrigger?.kill();
      tw.kill();
    };
  }, []);

  const c = points[sel];
  const max = MEGACITIES[0].pop;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
      <div className="relative">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="group" aria-label="Карта десяти крупнейших городов мира, 2025">
          <path d={landPath} fill="#1d222a" stroke="#2a3039" strokeWidth={0.6} />
          {/* label connector for selected */}
          <line x1={c.x} y1={c.y} x2={c.x} y2={c.y - 46} stroke="#F5F5F2" strokeOpacity={0.5} strokeWidth={1} />
          {points.map((p, i) => (
            <g
              key={p.name}
              className="city-dot cursor-pointer outline-none"
              tabIndex={0}
              role="button"
              aria-pressed={i === sel}
              aria-label={`${i + 1}. ${p.name}, ${p.country}: ${fmt1(p.pop)} млн человек`}
              onMouseEnter={() => setSel(i)}
              onFocus={() => setSel(i)}
              onClick={() => setSel(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSel(i);
                }
              }}
            >
              {/* generous hit target */}
              <circle cx={p.x} cy={p.y} r={Math.max(p.r, 14)} fill="transparent" />
              <circle
                cx={p.x}
                cy={p.y}
                r={p.r}
                fill="#E66B45"
                fillOpacity={i === sel ? 0.9 : 0.35}
                stroke="#111419"
                strokeWidth={2}
                className="transition-[fill-opacity] duration-300"
              />
              {i === sel && (
                <circle cx={p.x} cy={p.y} r={p.r} fill="none" stroke="#E66B45" strokeWidth={1.5}>
                  <animate attributeName="r" from={p.r} to={p.r + 22} dur="2s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          ))}
          <text x={c.x} y={c.y - 54} textAnchor="middle" fill="#F5F5F2" fontSize={15} fontWeight={600} className="pointer-events-none">
            {c.name} · {fmt1(c.pop)} млн
          </text>
        </svg>
        <p className="mt-2 text-xs text-mute">Площадь круга пропорциональна населению агломерации.</p>
      </div>

      <ol className="flex flex-col" aria-label="Рейтинг городов">
        {points.map((p, i) => (
          <li key={p.name}>
            <button
              type="button"
              onClick={() => setSel(i)}
              onMouseEnter={() => setSel(i)}
              aria-pressed={i === sel}
              className={`group grid w-full grid-cols-[2rem_1fr_auto] items-center gap-3 border-b border-white/10 py-2.5 text-left transition-colors ${
                i === sel ? "text-paper" : "text-paper/55 hover:text-paper"
              }`}
            >
              <span className="font-grotesk text-xs tabular opacity-60">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="block text-sm font-semibold">
                  {p.name} <span className="font-normal opacity-60">· {p.country}</span>
                </span>
                <span className="mt-1.5 block h-[3px] rounded-r-full bg-white/10">
                  <span
                    className={`block h-full rounded-r-full transition-colors ${i === sel ? "bg-accent" : "bg-white/35"}`}
                    style={{ width: `${(p.pop / max) * 100}%` }}
                  />
                </span>
              </span>
              <span className="tabular font-display text-sm font-semibold">{fmt1(p.pop)}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
