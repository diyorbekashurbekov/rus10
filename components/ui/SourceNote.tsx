import { KIND_LABEL, SOURCES, type SourceKind } from "@/lib/data";

const DOT: Record<SourceKind, string> = {
  official: "bg-hope",
  estimate: "bg-sky-400",
  forecast: "bg-amber-300",
  illustrative: "bg-accent",
};

/** Inline citation: value context + source link + type of figure. */
export function SourceNote({
  src,
  meta,
  kind,
  className = "",
}: {
  src: keyof typeof SOURCES | string;
  meta: string; // e.g. "2025 · Казахстан"
  kind?: SourceKind;
  className?: string;
}) {
  const s = SOURCES[src];
  if (!s) return null;
  const k = kind ?? s.kind;
  return (
    <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.7rem] leading-snug opacity-70 ${className}`}>
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${DOT[k]}`} aria-hidden />
      <span className="eyebrow !text-[0.6rem] !tracking-[0.2em]">{KIND_LABEL[k]}</span>
      <span>·</span>
      <span>{meta}</span>
      <span>·</span>
      <a href={s.url} target="_blank" rel="noreferrer" className="underline decoration-1 underline-offset-2 hover:opacity-100">
        {s.publisher}
      </a>
    </p>
  );
}

export function KindLegend({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-6 gap-y-2 text-xs opacity-80 ${className}`}>
      {(Object.keys(KIND_LABEL) as SourceKind[]).map((k) => (
        <li key={k} className="flex items-center gap-2">
          <span className={`inline-block h-2 w-2 rounded-full ${DOT[k]}`} aria-hidden />
          {KIND_LABEL[k]}
        </li>
      ))}
    </ul>
  );
}
