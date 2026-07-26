import Image from "next/image";
import Link from "next/link";
import { chapters } from "@/lib/data";

// Only show the first 3 chapters on the landing page (matching the Figma)
const PREVIEW_COUNT = 3;

export default function JejakTimeline() {
  const preview = chapters.slice(0, PREVIEW_COUNT);

  return (
    <section
      id="jejak"
      className="px-4 sm:px-8 lg:px-16 pt-8 lg:pt-12 overflow-hidden scroll-mt-24"
    >
      <div className="max-w-content mx-auto">
        {/* ── Header ── */}
        <div className="flex flex-col items-center gap-4 mb-10 lg:mb-8">
          <h2
            className="text-primary uppercase text-center font-normal leading-[1]"
            style={{ fontSize: "clamp(28px, 4.7vw, 60px)" }}
          >
            JEJAK DWIPARA
          </h2>
          <div className="flex items-center gap-2" aria-hidden="true">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <div className="w-12 h-3 bg-accent-orange rounded-full" />
          </div>
        </div>

        {/* ── Chapters ── */}
        <div className="flex flex-col gap-8 lg:gap-6">
          {/* ─── Chapter 1 — Image Left, Text Right ─── */}
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16">
            <div className="relative w-full lg:flex-1 overflow-hidden">
              <div
                className="absolute -left-10 -top-10 w-40 h-40 bg-primary/5 pointer-events-none hidden lg:block"
                style={{ borderRadius: "0 160px 0 0" }}
                aria-hidden="true"
              />
              <div
                className="relative border border-primary overflow-hidden"
                style={{ height: "clamp(200px, 30vw, 400px)" }}
              >
                {preview[0]?.image && (
                  <Image
                    src={preview[0].image}
                    alt={preview[0].imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />
                )}
              </div>
            </div>
            <div className="lg:flex-1 flex flex-col gap-4">
              <span
                className="text-accent-orange/20 font-normal leading-none select-none"
                style={{ fontSize: "clamp(48px, 5vw, 60px)" }}
              >
                {preview[0]?.num}
              </span>
              <h3 className="text-primary text-sm sm:text-base uppercase tracking-wide font-normal pb-2 border-b border-primary/20">
                {preview[0]?.title}
              </h3>
              <div className="border-l-4 border-primary pl-8">
                <p className="text-primary/70 text-base leading-6">
                  {preview[0]?.desc}
                </p>
              </div>
            </div>
          </div>

          {/* ─── Chapter 2 — Text Left, Image Right ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-0 lg:pt-8 relative">
            <div
              className="absolute right-0 top-16 w-48 h-48 pointer-events-none hidden lg:block"
              style={{
                background: "rgba(179,54,60,0.1)",
                borderRadius: "0 0 192px 0",
              }}
              aria-hidden="true"
            />
            <div className="lg:col-span-5 flex flex-col gap-4 lg:self-center">
              <span
                className="text-accent-orange/20 font-normal leading-none select-none"
                style={{ fontSize: "clamp(56px, 7vw, 96px)" }}
              >
                {preview[1]?.num}
              </span>
              <h3 className="text-primary text-sm sm:text-base uppercase tracking-wide font-normal pb-4">
                {preview[1]?.title}
              </h3>
              <div className="border-l-[2px] border-accent-orange pl-8">
                <p className="text-primary/70 text-base leading-6">
                  {preview[1]?.desc}
                </p>
              </div>
            </div>
            <div
              className="lg:col-span-6 lg:col-start-7 relative overflow-hidden"
              style={{ height: "clamp(200px, 28vw, 376px)" }}
            >
              {preview[1]?.image && (
                <Image
                  src={preview[1].image}
                  alt={preview[1].imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              )}
            </div>
          </div>

          {/* ─── Chapter 3 — Masonry ─── */}
          <div className="flex flex-col lg:flex-row gap-8 pt-0 lg:pt-12">
            <div className="lg:flex-[1.42] flex flex-col gap-8">
              <div className="relative">
                <div
                  className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full pointer-events-none hidden lg:block"
                  aria-hidden="true"
                />
                <div
                  className="relative overflow-hidden"
                  style={{ height: "clamp(200px, 28vw, 370px)" }}
                >
                  {preview[2]?.image && (
                    <Image
                      src={preview[2].image}
                      alt={preview[2].imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      className="object-cover"
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <span
                  className="text-accent-red/10 font-normal leading-none select-none"
                  style={{ fontSize: "clamp(56px, 7vw, 96px)" }}
                >
                  {preview[2]?.num}
                </span>
                <h3 className="text-primary text-sm sm:text-base uppercase tracking-wide font-normal">
                  {preview[2]?.title}
                </h3>
                <div className="max-w-[448px]">
                  <p className="text-primary/70 text-base leading-6">
                    {preview[2]?.desc}
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:flex-1 flex flex-col gap-8">
              <div
                className="relative overflow-hidden"
                style={{ height: "clamp(250px, 40vw, 577px)" }}
              >
                <Image
                  src="/images/chapter-3-legacy.png"
                  alt="Warisan Dwipara"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="relative bg-primary p-10 sm:p-12 overflow-hidden">
                <div
                  className="absolute top-[-32px] right-0 w-24 h-24 pointer-events-none"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "0 0 0 96px",
                  }}
                  aria-hidden="true"
                />
                <blockquote>
                  <p className="text-white text-base leading-[1.625] italic relative z-10">
                    &ldquo;Disiplin adalah jembatan antara tujuan dan
                    pencapaian.&rdquo;
                  </p>
                </blockquote>
              </div>
            </div>
          </div>
        </div>

        {/* ── "See All" CTA ── */}
        {/* <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-2 pt-0 border-t border-primary/20">
          <div>
            <p className="text-ink/40 text-[12px] uppercase tracking-[0.1em]">
              Menampilkan {PREVIEW_COUNT} dari {chapters.length} perjalanan
            </p>
            <p className="text-primary/60 text-sm mt-1">
              Masih ada {chapters.length - PREVIEW_COUNT} perjalanan lain yang belum
              terceritakan.
            </p>
          </div>
          <Link
            href="/jejak"
            className="group flex items-center gap-4 border border-primary text-primary text-[12px] uppercase tracking-[0.1em] px-10 py-5 hover:bg-primary hover:text-white transition-colors whitespace-nowrap"
          >
            Lihat Semua
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
            >
              <path
                d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
          </Link>
        </div> */}
      </div>
    </section>
  );
}
