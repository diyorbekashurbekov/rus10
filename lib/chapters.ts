import { BASE } from "@/lib/asset";

export type TrackId = "intro" | "piano" | "tension" | "build" | "hope";

export const CHAPTERS: { id: string; num: string; title: string; track: TrackId }[] = [
  { id: "vhod", num: "01", title: "Вход в реальность", track: "intro" },
  { id: "mir", num: "02", title: "Мир становится городским", track: "intro" },
  { id: "stoimost", num: "03", title: "Стоимость жизни", track: "piano" },
  { id: "zhilyo", num: "04", title: "Жильё", track: "piano" },
  { id: "transport", num: "05", title: "Транспорт", track: "tension" },
  { id: "urbanizaciya", num: "06", title: "Урбанизация", track: "build" },
  { id: "resheniya", num: "07", title: "Пути решения", track: "hope" },
  { id: "final", num: "08", title: "Финал", track: "hope" },
];

export const TRACKS: Record<TrackId, string> = {
  intro: `${BASE}/assets/audio/intro-vastness.mp3`,
  piano: `${BASE}/assets/audio/piano-charlotte.mp3`,
  tension: `${BASE}/assets/audio/tension-cyberpunk-city.mp3`,
  build: `${BASE}/assets/audio/build-red-lights.mp3`,
  hope: `${BASE}/assets/audio/hope-what-it-takes.mp3`,
};
