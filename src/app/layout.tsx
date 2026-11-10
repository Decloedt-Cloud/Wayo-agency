import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { Instrument_Serif, Inter_Tight, JetBrains_Mono, Noto_Naskh_Arabic, Noto_Sans_Arabic } from "next/font/google";
import Script from "next/script";
import { getUi } from "@/lib/copy";
import { getLocale, getPathname } from "@/lib/get-locale";
import { getTheme } from "@/lib/get-theme";
import { direction } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import "./globals.css";

const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

const sans = Inter_Tight({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-mono",
});

const arabicSerif = Noto_Naskh_Arabic({
  weight: "400",
  subsets: ["arabic"],
  display: "swap",
  preload: false,
  variable: "--font-ar-serif",
});

const arabicSans = Noto_Sans_Arabic({
  weight: ["400", "600"],
  subsets: ["arabic"],
  display: "swap",
  preload: false,
  variable: "--font-ar-sans",
});

export async function generateViewport(): Promise<Viewport> {
  const theme = await getTheme();
  if (theme === "light") return { themeColor: "#f3efe6", colorScheme: "light", width: "device-width", initialScale: 1 };
  if (theme === "dark") return { themeColor: "#0a0908", colorScheme: "dark", width: "device-width", initialScale: 1 };
  return {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#f3efe6" },
      { media: "(prefers-color-scheme: dark)", color: "#0a0908" },
    ],
    colorScheme: "dark light",
    width: "device-width",
    initialScale: 1,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getLocale(), await getPathname());
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const locale = await getLocale();
  const theme = await getTheme();
  const ui = getUi(locale);
  return (
    <html lang={locale} dir={direction(locale)} data-theme={theme ?? undefined} className={`${serif.variable} ${sans.variable} ${mono.variable} ${arabicSerif.variable} ${arabicSans.variable}`} suppressHydrationWarning>
      <body>
        <Script id="html-flags" nonce={(await headers()).get("x-nonce") ?? undefined} strategy="beforeInteractive">
          {`document.documentElement.classList.add("js");if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("reduce");}if(!document.documentElement.dataset.theme){var m=document.cookie.match(/(?:^|; )theme=(light|dark)/);document.documentElement.dataset.theme=m?m[1]:(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");}`}
        </Script>
        <a className="skip" href="#contenu">{ui.skip}</a>
        {children}
      </body>
    </html>
  );
}
