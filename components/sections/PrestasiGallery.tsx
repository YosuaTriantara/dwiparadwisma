"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { prestasiList } from "@/lib/data";
import type { Achievement } from "@/lib/data";

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronLeft() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12.5 15L7.5 10L12.5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7.5 15L12.5 10L7.5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 4L16 16M16 4L4 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({
  achievement,
  num,
  onClose,
}: {
  achievement: Achievement;
  num: number;
  onClose: () => void;
}) {
  // Lock body scroll + ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/70 backdrop-blur-sm z-50 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                   w-[92vw] max-w-2xl max-h-[88vh] overflow-y-auto bg-white shadow-2xl border border-primary/20"
      >
        {/* Photo */}
        {achievement.image && (
          <div className="relative w-full aspect-video bg-primary/10">
            <Image
              src={achievement.image}
              alt={achievement.imageAlt}
              fill
              sizes="(max-width: 640px) 92vw, 672px"
              className="object-cover"
            />
            {/* Number badge overlaid on image */}
            <div className="absolute top-0 left-0 w-14 h-14 bg-accent-orange flex items-center justify-center">
              <span className="text-white text-base font-bold">
                {String(num).padStart(2, "0")}
              </span>
            </div>
            {/* Trophy count pill */}
            <div className="absolute top-3 right-3 bg-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 shadow-md flex items-center gap-1.5">
              <TrophyIcon />
              <span>{achievement.awardCount}</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Header row: badge (no-image case) + close */}
          <div className="flex items-start justify-between mb-4">
            {!achievement.image && (
              <div className="w-12 h-12 bg-accent-orange flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">
                  {String(num).padStart(2, "0")}
                </span>
              </div>
            )}
            <div className="flex-1" />
            <button
              onClick={onClose}
              aria-label="Tutup detail"
              className="p-2 text-ink/40 hover:text-ink transition-colors -mr-1 -mt-1 cursor-pointer"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-accent-red text-xs font-bold uppercase tracking-[0.15em]">
              {achievement.year}
            </span>
            <span className="text-ink/20">·</span>
            <span className="text-ink/60 text-xs uppercase tracking-wide font-medium">
              {achievement.subtitle}
            </span>
          </div>

          <h2
            id="modal-title"
            className="text-primary uppercase font-bold leading-tight mb-4"
            style={{ fontSize: "clamp(22px, 3.5vw, 28px)" }}
          >
            {achievement.title} {achievement.subtitle}
          </h2>

          {achievement.description && (
            <>
              <div
                className="w-16 h-0.5 bg-accent-orange mb-4"
                aria-hidden="true"
              />
              <p className="text-primary/75 text-sm sm:text-base leading-relaxed mb-6">
                {achievement.description}
              </p>
            </>
          )}

          {/* Full Trophy List */}
          {achievement.trophies && achievement.trophies.length > 0 && (
            <div className="pt-5 border-t border-primary/10 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-primary font-bold text-xs uppercase tracking-[0.15em] flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent-orange inline-block" />
                  Daftar Perolehan Piala ({achievement.trophies.length})
                </h3>
                <span className="text-[11px] font-bold text-accent-red uppercase tracking-wider">
                  Hasil Resmi
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {achievement.trophies.map((trophy, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 bg-primary/5 border border-primary/10 hover:border-primary/30 transition-colors"
                  >
                    <span className="w-6 h-6 flex-shrink-0 bg-accent-orange text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-primary text-xs font-semibold uppercase leading-snug tracking-wide">
                      {trophy}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Close CTA */}
          <button
            onClick={onClose}
            className="border border-primary text-primary text-[12px] uppercase tracking-[0.1em] px-8 py-3 hover:bg-primary hover:text-white transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PrestasiGallery() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<{
    achievement: Achievement;
    num: number;
  } | null>(null);

  const total = prestasiList.length; // Exactly 4 events

  const goTo = useCallback((index: number) => setCurrent(index), []);
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + total) % total),
    [total]
  );
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);

  const openDetail = useCallback((item: Achievement, num: number) => {
    setSelected({ achievement: item, num });
  }, []);

  // Keyboard slide navigation (when modal is closed)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (selected) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, selected]);

  const currentEvent = prestasiList[current];

  return (
    <>
      {/* ── Detail popup ── */}
      {selected && (
        <DetailModal
          achievement={selected.achievement}
          num={selected.num}
          onClose={() => setSelected(null)}
        />
      )}

      <section
        id="prestasi"
        className="relative bg-primary/5 px-4 sm:px-8 lg:px-16 py-10 lg:py-16 overflow-hidden scroll-mt-24"
      >
        {/* Decorative circle outline */}
        <div
          className="absolute -left-32 top-24 w-[384px] h-[384px] pointer-events-none hidden lg:block"
          style={{
            border: "40px solid rgba(243,154,46,0.1)",
            borderRadius: "9999px",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-content mx-auto lg:pt-4 lg:pb-8">
          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
            <div className="flex flex-col gap-3">
              <h2
                className="text-primary uppercase font-bold leading-tight"
                style={{
                  fontSize: "clamp(28px, 4.7vw, 54px)",
                }}
              >
                Galeri PRESTASI
              </h2>
              <p className="text-accent-red text-xs sm:text-sm tracking-[0.15em] uppercase font-semibold">
                Bukti nyata eksistensi di berbagai kompetisi
              </p>
            </div>
            <div className="flex items-center gap-3" aria-hidden="true">
              <div className="w-10 h-1 bg-ink" />
              <div className="w-20 h-1 bg-accent-orange" />
              <div className="w-36 h-1 bg-primary" />
            </div>
          </div>

          {/* ── Desktop Bento Slider (4 Events) ── */}
          <div className="hidden lg:block relative">
            {prestasiList.map((event, index) => {
              const isCurrent = index === current;
              return (
                <div
                  key={event.id}
                  aria-hidden={!isCurrent}
                  className="transition-opacity duration-500"
                  style={{
                    opacity: isCurrent ? 1 : 0,
                    position: isCurrent ? "relative" : "absolute",
                    inset: isCurrent ? "auto" : 0,
                    pointerEvents: isCurrent ? "auto" : "none",
                  }}
                >
                  <div
                    className="grid gap-4"
                    style={{
                      gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
                      gridTemplateRows: "repeat(6, minmax(0, 80px))",
                    }}
                  >
                    {/* ── Left Featured Event Card (7 Columns) ── */}
                    <div
                      className="relative bg-white border border-primary flex flex-col cursor-pointer group"
                      style={{
                        gridColumn: "1 / span 7",
                        gridRow: "1 / span 6",
                        minHeight: "510px",
                      }}
                      onClick={() => openDetail(event, index + 1)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Lihat detail event: ${event.subtitle}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openDetail(event, index + 1);
                        }
                      }}
                    >
                      {/* Image Cover */}
                      <div className="relative flex-1 overflow-hidden min-h-[340px] bg-primary/10">
                        {event.image ? (
                          <Image
                            src={event.image}
                            alt={event.imageAlt}
                            fill
                            sizes="(max-width: 1024px) 100vw, 58vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/5">
                            <span className="text-primary/30 text-xs uppercase tracking-widest">
                              Foto Prestasi
                            </span>
                          </div>
                        )}

                        {/* Top Left Number Badge */}
                        <div className="absolute top-0 left-0 w-14 h-14 bg-accent-orange flex items-center justify-center">
                          <span className="text-white text-base font-bold">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>

                        {/* Top Right Award Pill */}
                        <div className="absolute top-3 right-3 bg-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 shadow-md flex items-center gap-1.5">
                          <TrophyIcon />
                          <span>{event.awardCount}</span>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300 flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs uppercase tracking-[0.15em] bg-primary/80 px-4 py-2 font-medium">
                            Lihat Rincian Lengkap
                          </span>
                        </div>
                      </div>

                      {/* Info Row */}
                      <div className="p-5 flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary flex items-center justify-center flex-shrink-0 text-white">
                          <TrophyIcon />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-accent-red text-xs font-bold uppercase tracking-[0.1em]">
                              {event.year}
                            </span>
                            <span className="text-primary/30 text-xs">·</span>
                            <span className="text-primary/60 text-xs uppercase tracking-wider font-semibold">
                              {event.subtitle}
                            </span>
                          </div>
                          <h3 className="text-primary text-lg sm:text-xl uppercase font-bold leading-tight">
                            {event.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* ── Right Top: Trophy Highlights Card (5 Columns, Rows 1-3) ── */}
                    <div
                      className="relative bg-white border border-primary p-5 flex flex-col justify-between cursor-pointer group hover:border-accent-orange transition-colors"
                      style={{
                        gridColumn: "8 / span 5",
                        gridRow: "1 / span 3",
                      }}
                      onClick={() => openDetail(event, index + 1)}
                      role="button"
                      tabIndex={0}
                      aria-label="Lihat seluruh piala"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openDetail(event, index + 1);
                        }
                      }}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-primary/10">
                          <span className="text-primary text-xs font-bold uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-accent-orange inline-block" />
                            Daftar Penghargaan
                          </span>
                          <span className="text-accent-red text-[11px] font-bold uppercase tracking-wider">
                            {event.awardCount}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {event.trophies.slice(0, 3).map((trophy, tIdx) => (
                            <div
                              key={tIdx}
                              className="flex items-center gap-2 text-xs font-semibold text-primary uppercase bg-primary/5 p-2 border border-primary/10"
                            >
                              <span className="w-5 h-5 bg-accent-orange text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                {tIdx + 1}
                              </span>
                              <span className="truncate">{trophy}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-primary/60 text-[11px] uppercase font-semibold">
                          +{event.trophies.length > 3 ? event.trophies.length - 3 : 0} Kategori Lainnya
                        </span>
                        <span className="text-primary font-bold text-xs uppercase tracking-wider group-hover:text-accent-orange transition-colors">
                          Buka Semua Piala &rarr;
                        </span>
                      </div>
                    </div>

                    {/* ── Right Bottom: Overview & Navigation Row (5 Columns, Rows 4-6) ── */}
                    <div
                      className="relative bg-white border border-primary flex flex-col justify-between"
                      style={{
                        gridColumn: "8 / span 5",
                        gridRow: "4 / span 3",
                      }}
                    >
                      {/* Description body */}
                      <div
                        className="p-5 flex-1 cursor-pointer group"
                        onClick={() => openDetail(event, index + 1)}
                        role="button"
                        tabIndex={0}
                        aria-label="Lihat deskripsi lengkap"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            openDetail(event, index + 1);
                          }
                        }}
                      >
                        <span className="text-primary/60 text-[11px] font-bold uppercase tracking-[0.15em] block mb-2">
                          Ringkasan Event
                        </span>
                        <p className="text-primary/75 text-xs sm:text-sm leading-relaxed line-clamp-3">
                          {event.description}
                        </p>
                      </div>

                      {/* ── Slider Navigation Row ── */}
                      <div
                        className="flex items-center justify-between gap-3 px-4 py-3 border-t border-primary/10 bg-primary/5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Prev Button */}
                        <button
                          onClick={prev}
                          aria-label="Event sebelumnya"
                          className="w-9 h-9 border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer flex-shrink-0 bg-white"
                        >
                          <ChevronLeft />
                        </button>

                        {/* Dot indicators (4 events) */}
                        <div
                          className="flex items-center gap-2 flex-1 justify-center"
                          role="tablist"
                          aria-label="Navigasi event prestasi"
                        >
                          {prestasiList.map((_, dotIdx) => (
                            <button
                              key={dotIdx}
                              role="tab"
                              aria-selected={dotIdx === current}
                              aria-label={`Event ${dotIdx + 1} dari ${total}`}
                              onClick={() => goTo(dotIdx)}
                              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                                dotIdx === current
                                  ? "w-8 bg-accent-orange"
                                  : "w-2.5 bg-primary/25 hover:bg-primary/50"
                              }`}
                            />
                          ))}
                        </div>

                        {/* Counter badge */}
                        <span className="text-primary/50 text-xs font-mono font-bold">
                          {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                        </span>

                        {/* Next Button */}
                        <button
                          onClick={next}
                          aria-label="Event berikutnya"
                          className="w-9 h-9 border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer flex-shrink-0 bg-white"
                        >
                          <ChevronRight />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Mobile Slider (Stacked Layout with Controls) ── */}
          <div className="lg:hidden">
            {/* Nav controls row */}
            <div className="flex items-center justify-between mb-4 bg-white border border-primary p-2">
              <button
                onClick={prev}
                aria-label="Event sebelumnya"
                className="w-10 h-10 border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft />
              </button>

              <div className="flex items-center gap-2">
                {prestasiList.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Event ${i + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      i === current
                        ? "w-8 bg-accent-orange"
                        : "w-2.5 bg-primary/30"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                aria-label="Event berikutnya"
                className="w-10 h-10 border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight />
              </button>
            </div>

            {/* Current Mobile Event Card */}
            {currentEvent && (
              <div className="flex flex-col gap-3">
                <article
                  className="bg-white border border-primary flex flex-col cursor-pointer group"
                  onClick={() => openDetail(currentEvent, current + 1)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Lihat detail: ${currentEvent.subtitle}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openDetail(currentEvent, current + 1);
                    }
                  }}
                >
                  <div className="relative w-full aspect-video overflow-hidden bg-primary/10">
                    {currentEvent.image ? (
                      <Image
                        src={currentEvent.image}
                        alt={currentEvent.imageAlt}
                        fill
                        sizes="100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/5">
                        <span className="text-primary/30 text-xs uppercase tracking-widest">
                          Foto Prestasi
                        </span>
                      </div>
                    )}
                    <div className="absolute top-0 left-0 w-12 h-12 bg-accent-orange flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {String(current + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 bg-primary text-white text-[11px] font-bold uppercase tracking-wider px-2 py-1 shadow-sm">
                      {currentEvent.awardCount}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-accent-red text-xs font-bold uppercase tracking-[0.1em]">
                        {currentEvent.year}
                      </span>
                      <span className="text-primary/30 text-xs">·</span>
                      <span className="text-primary/60 text-xs uppercase tracking-wider font-semibold">
                        {currentEvent.subtitle}
                      </span>
                    </div>
                    <h3 className="text-primary text-base font-bold uppercase leading-tight">
                      {currentEvent.title}
                    </h3>
                    <p className="text-primary/70 text-xs leading-relaxed line-clamp-2">
                      {currentEvent.description}
                    </p>

                    <div className="pt-2 border-t border-primary/10 flex items-center justify-between">
                      <span className="text-primary font-bold text-xs uppercase tracking-wider text-accent-red">
                        Lihat Rincian ({currentEvent.trophies.length} Piala) &rarr;
                      </span>
                    </div>
                  </div>
                </article>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}