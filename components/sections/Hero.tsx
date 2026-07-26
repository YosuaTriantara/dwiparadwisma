"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Photos for the hero portrait carousel ────────────────────────────────────
// Add more entries here to grow the slideshow — no other code changes needed.
const heroPhotos = [
  { src: "/images/slider1.jpg", alt: "Carousel Dwisma" },
  { src: "/images/slider2.jpg", alt: "Carousel Dwisma" },
  { src: "/images/slider3.jpg", alt: "Carousel Dwisma" },
];

const AUTO_MS = 3000; // 3 seconds between slides

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const total = heroPhotos.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);

  // Auto-advance
  useEffect(() => {
    const id = setInterval(next, AUTO_MS);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section
      id="hero"
      className="relative px-4 sm:px-8 lg:px-16 min-h-[60vh] lg:min-h-[680px] flex items-center scroll-mt-24"
    >
      {/* ── Bauhaus 1: Giant green swoosh (top-right) ── */}
      <div
        className="absolute top-0 right-0 w-[200px] h-[194px] sm:w-[320px] sm:h-[311px] bg-primary/5 pointer-events-none lg:hidden"
        style={{ borderRadius: "0 0 0 320px" }}
        aria-hidden="true"
      />
      <div
        className="absolute -top-[68px] -right-[64px] w-[512px] h-[497px] bg-primary/5 pointer-events-none hidden lg:block"
        style={{ borderRadius: "0 0 0 512px" }}
        aria-hidden="true"
      />

      {/* ── Bauhaus 2: Orange pill (bottom, bleeds below hero) ── */}
      <div
        className="absolute hidden lg:block w-[128px] h-[124px] bg-accent-orange/20 rounded-full pointer-events-none"
        style={{ left: "35%", bottom: "-34px" }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-content mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center lg:min-h-[680px] py-12 lg:py-0">
          {/* ── Left — Content (col 1–5) ── */}
          <div className="lg:col-span-5 flex flex-col gap-3.5 lg:self-center">
            <span className="text-accent-red text-[11px] sm:text-[12px] font-normal tracking-[0.3em] uppercase">
              DWIPARA DWISMA
            </span>

            <div style={{ paddingBottom: "17.29px" }}>
              <h1
                className="font-extrabold uppercase tracking-[-0.05em] text-ink"
                style={{ lineHeight: "0.95" }}
              >
                <span
                  className="block"
                  style={{ fontSize: "clamp(40px, 6vw, 80px)" }}
                >
                  MEMBANGUN
                </span>
                <span
                  className="block"
                  style={{ fontSize: "clamp(44px, 6.5vw, 84px)" }}
                >
                  KARAKTER,
                </span>
                <span
                  className="block text-primary"
                  style={{ fontSize: "clamp(44px, 6.5vw, 84px)" }}
                >
                  MENGUKIR
                </span>
                <span
                  className="block"
                  style={{ fontSize: "clamp(44px, 6.5vw, 84px)" }}
                >
                  PRESTASI
                </span>
              </h1>
            </div>

            <div className="max-w-[384px] border-l-2 border-accent-orange pl-6">
              <p className="text-primary/70 text-base leading-6">
                Wadah pengembangan diri melalui kedisiplinan Paskibraka,
                membentuk generasi yang disiplin, bangga, dan berprestasi untuk
                Bangsa.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="#daftar"
                className="bg-primary text-white text-[12px] uppercase tracking-[0.1em] px-10 py-5 hover:bg-primary-dark transition-colors whitespace-nowrap"
              >
                GABUNG
              </Link>
              <Link
                href="#tentang"
                className="border border-primary text-primary text-[12px] uppercase tracking-[0.1em] px-10 py-5 hover:bg-primary hover:text-white transition-colors whitespace-nowrap"
              >
                KEGIATAN
              </Link>
            </div>
          </div>

          {/* ── Right — Portrait carousel (col 7–12) ── */}
          <div className="lg:col-span-6 lg:col-start-7 relative flex justify-center lg:justify-end lg:self-stretch">
            {/* Bauhaus 3: Orange L-frame top-right of portrait */}
            <div
              className="absolute hidden lg:block pointer-events-none z-10"
              style={{
                top: "-48px",
                right: "-48px",
                width: "256px",
                height: "256px",
                borderTop: "20px solid rgba(243,154,46,0.3)",
                borderRight: "20px solid rgba(243,154,46,0.3)",
              }}
              aria-hidden="true"
            />

            {/* ── Photo carousel container ── */}
            <div className="relative w-full max-w-[420px] lg:max-w-none lg:w-[560px] aspect-[3/4] lg:aspect-auto lg:h-[95%] overflow-hidden">
              {/* Crossfade slides */}
              {heroPhotos.map((photo, i) => (
                <div
                  key={photo.src}
                  className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                  style={{ opacity: i === current ? 1 : 0 }}
                  aria-hidden={i !== current}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 1024px) 420px, 560px"
                    className="object-cover object-top"
                    unoptimized
                    priority={i === 0}
                  />
                </div>
              ))}

              {/* Dot indicators — overlaid at bottom of photo */}
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20"
                role="tablist"
                aria-label="Pilih foto"
              >
                {heroPhotos.map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={i === current}
                    aria-label={`Foto ${i + 1}`}
                    onClick={() => setCurrent(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === current
                        ? "w-8 bg-white"
                        : "w-2 bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Red accent bar (below portrait, matching Figma) */}
            <div
              className="absolute hidden lg:block bg-accent-red pointer-events-none"
              style={{
                bottom: "-8px",
                left: "-80px",
                width: "320px",
                height: "4px",
              }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
