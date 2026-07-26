import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { chapters } from "@/lib/data";
import type { AccentColor } from "@/lib/data";

export const metadata = {
  title: "Jejak Dwipara — Perjalanan & Program Kegiatan",
  description:
    "Seluruh perjalanan dan program kegiatan Dwipara Dwisma, pasukan bendera SMA Negeri 2 Mengwi, dari tahun ke tahun.",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const accentBorder: Record<AccentColor, string> = {
  orange: "border-accent-orange",
  red: "border-accent-red",
  green: "border-primary",
};

const accentText: Record<AccentColor, string> = {
  orange: "text-accent-orange",
  red: "text-accent-red",
  green: "text-primary",
};

const tagBg: Record<AccentColor, string> = {
  orange: "bg-accent-orange/10 text-accent-orange",
  red: "bg-accent-red/10 text-accent-red",
  green: "bg-primary/10 text-primary",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JejakPage() {
  return (
    <>
      <Navbar />

      <main className="pt-[96px]">
        {/* ── Page Hero Banner ── */}
        <div className="relative overflow-hidden bg-primary px-4 sm:px-8 lg:px-16 py-20 lg:py-32">
          {/* Bauhaus decorations */}
          <div
            className="absolute top-0 right-0 w-[300px] h-[300px] lg:w-[480px] lg:h-[480px] bg-white/5 pointer-events-none"
            style={{ borderRadius: "0 0 0 480px" }}
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-accent-orange/20 pointer-events-none"
            style={{ borderRadius: "0 200px 0 0" }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-content mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
            <div className="flex flex-col gap-4">
              {/* Kicker */}
              <span className="text-accent-orange text-[12px] tracking-[0.3em] uppercase">
                DWIPARA DWISMA
              </span>
              {/* Heading */}
              <h1
                className="text-white font-normal uppercase leading-[1]"
                style={{ fontSize: "clamp(40px, 6vw, 96px)" }}
              >
                JEJAK
                <br />
                <span className="text-accent-orange">DWIPARA</span>
              </h1>
              {/* Accent bars */}
              <div className="flex items-center gap-3 mt-2" aria-hidden="true">
                <div className="w-3 h-3 bg-accent-red rounded-full" />
                <div className="w-12 h-3 bg-accent-orange rounded-full" />
              </div>
            </div>

            <div className="max-w-sm">
              <p className="text-white/60 text-base leading-6">
                Setiap kegiatan adalah cerita. Setiap langkah adalah sejarah.
                Inilah perjalanan lengkap Dwipara Dwisma dari tahun ke tahun.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-accent-orange text-[12px] uppercase tracking-[0.1em] mt-4 hover:text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M13 8H3M3 8L7.5 3.5M3 8L7.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
                </svg>
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>

        {/* ── Timeline ── */}
        <div className="px-4 sm:px-8 lg:px-16 py-16 lg:py-24">
          <div className="max-w-content mx-auto">
            {chapters.map((chapter, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div key={chapter.num}>
                  {/* Year separator between chapters of different years */}
                  {(idx === 0 ||
                    chapters[idx - 1]?.year !== chapter.year) && (
                    <div
                      className={`flex items-center gap-6 ${
                        idx === 0 ? "mb-12" : "my-16"
                      }`}
                    >
                      <div
                        className={`text-[11px] font-bold tracking-[0.3em] uppercase px-4 py-2 border ${accentBorder[chapter.accentColor]} ${accentText[chapter.accentColor]}`}
                      >
                        {chapter.year}
                      </div>
                      <div className="flex-1 h-px bg-primary/10" aria-hidden="true" />
                    </div>
                  )}

                  {/* Chapter row — alternates image side */}
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center mb-16 lg:mb-24 ${
                      isEven ? "" : "lg:[direction:rtl]"
                    }`}
                  >
                    {/* Image (span 6) */}
                    <div
                      className="lg:col-span-6 relative"
                      style={{ direction: "ltr" }}
                    >
                      {/* Chapter number watermark */}
                      <span
                        className={`absolute -top-6 -left-4 lg:-top-8 lg:-left-6 font-normal leading-none select-none pointer-events-none z-0 ${accentText[chapter.accentColor]}`}
                        style={{
                          fontSize: "clamp(80px, 10vw, 140px)",
                          opacity: 0.08,
                          lineHeight: 1,
                        }}
                        aria-hidden="true"
                      >
                        {chapter.num}
                      </span>

                      {/* Photo */}
                      <div
                        className={`relative z-10 overflow-hidden border ${accentBorder[chapter.accentColor]}`}
                        style={{ height: "clamp(220px, 30vw, 460px)" }}
                      >
                        {chapter.image ? (
                          <Image
                            src={chapter.image}
                            alt={chapter.imageAlt}
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                            <span className="text-primary/20 text-sm uppercase tracking-widest">
                              Foto Kegiatan
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Text (span 6) */}
                    <div
                      className="lg:col-span-6 flex flex-col gap-5"
                      style={{ direction: "ltr" }}
                    >
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {chapter.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-[10px] font-bold tracking-[0.1em] uppercase px-3 py-1 ${tagBg[chapter.accentColor]}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h2
                        className="text-primary uppercase font-normal leading-tight"
                        style={{ fontSize: "clamp(20px, 2.5vw, 36px)" }}
                      >
                        {chapter.title}
                      </h2>

                      {/* Divider */}
                      <div
                        className={`border-l-4 ${accentBorder[chapter.accentColor]} pl-6`}
                      >
                        <p className="text-primary/70 text-base leading-7">
                          {chapter.fullDesc}
                        </p>
                      </div>

                      {/* Chapter number label */}
                      <div className="flex items-center gap-3 pt-2">
                        <div
                          className={`w-8 h-8 flex items-center justify-center text-white text-[12px] font-bold ${
                            chapter.accentColor === "orange"
                              ? "bg-accent-orange"
                              : chapter.accentColor === "red"
                              ? "bg-accent-red"
                              : "bg-primary"
                          }`}
                        >
                          {chapter.num}
                        </div>
                        <span className="text-ink/30 text-[11px] uppercase tracking-widest">
                          {chapter.year}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* ── End of timeline CTA ── */}
            <div className="border-t border-primary/20 pt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
              <div>
                <p className="text-ink/30 text-[11px] uppercase tracking-[0.1em] mb-2">
                  Itulah seluruh jejak Dwipara — sejauh ini.
                </p>
                <h3
                  className="text-primary font-normal uppercase"
                  style={{ fontSize: "clamp(20px, 3vw, 36px)" }}
                >
                  Cerita masih terus berjalan.
                </h3>
              </div>
              <Link
                href="/#daftar"
                className="bg-primary text-white text-[12px] uppercase tracking-[0.1em] px-10 py-5 hover:bg-primary-dark transition-colors whitespace-nowrap"
              >
                Gabung Bersama Kami
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
