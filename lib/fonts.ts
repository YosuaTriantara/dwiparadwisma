import { UnifrakturCook, Bodoni_Moda } from "next/font/google";

/**
 * Font khusus Masthead Koran Jadul (Old English / Blackletter)
 * Digunakan secara eksklusif di halaman LKBB Bramasta 4.0
 */
export const fontBlackletter = UnifrakturCook({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-blackletter",
  display: "swap",
});

/**
 * Font khusus Headline, Subtitle, dan Body Koran Jadul
 * Digunakan secara eksklusif di halaman LKBB Bramasta 4.0
 */
export const fontBodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
  adjustFontFallback: false,
});

