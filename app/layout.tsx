import { BASE } from "@/lib/asset";
import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin", "cyrillic"], weight: ["300", "400", "600", "800"] });
const space = Space_Grotesk({ variable: "--font-space", subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "THE URBAN REALITY — Главные вызовы современной городской жизни",
  description:
    "Кинематографическое исследование основных проблем города: стоимость жизни, жильё, транспорт и урбанизация населения.",
};

export const viewport: Viewport = {
  themeColor: "#080A0D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${manrope.variable} ${space.variable}`}>
      <head>
        <link rel="preload" as="image" href={`${BASE}/assets/videos/city-night-aerial-poster.webp`} />
      </head>
      <body>{children}</body>
    </html>
  );
}
