import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Dwipara Dwisma — Pasukan Bendera SMAN 2 Mengwi",
  description:
    "Wadah pengembangan diri melalui kedisiplinan Paskibraka. Membangun karakter, mengukir prestasi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${jakartaSans.variable} font-jakarta antialiased bg-white text-ink`}
      >
        {children}
      </body>
    </html>
  );
}
