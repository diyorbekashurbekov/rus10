import { BASE } from "@/lib/asset";
import { PHOTO_CREDITS } from "@/lib/credits";

type Props = {
  name: string; // file stem in /assets/images
  alt: string;
  className?: string;
  sizes?: string;
  eager?: boolean;
  style?: React.CSSProperties;
};

export function Photo({ name, alt, className = "", sizes = "100vw", eager = false, style }: Props) {
  return (
    <img
      src={`${BASE}/assets/images/${name}.webp`}
      srcSet={`${BASE}/assets/images/${name}-sm.webp 1200w, ${BASE}/assets/images/${name}.webp 2400w`}
      sizes={sizes}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`object-cover ${className}`}
      style={style}
    />
  );
}

/** Small attribution line required by CC BY / CC BY-SA licences. */
export function Credit({ name, place, className = "" }: { name: string; place?: string; className?: string }) {
  const c = PHOTO_CREDITS.find((p) => p.file === name);
  if (!c) return null;
  return (
    <p className={`text-[0.68rem] leading-snug tracking-wide opacity-60 ${className}`}>
      {place && <span>{place} · </span>}
      Фото: {c.author} ·{" "}
      <a href={c.licenseUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
        {c.license}
      </a>{" "}
      ·{" "}
      <a href={c.page} target="_blank" rel="noreferrer" className="underline underline-offset-2">
        Wikimedia Commons
      </a>
    </p>
  );
}
