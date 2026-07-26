"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import { prestasiSlides } from "@/lib/data";
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

// ─── Detail popup ─────────────────────────────────────────────────────────────

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
        className="fixed inset-0 bg-ink/70 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                   w-[92vw] max-w-2xl max-h-[88vh] overflow-y-auto bg-white shadow-2xl"
      >
        {/* Photo */}
        {achievement.image && (
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
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
              className="p-2 text-ink/40 hover:text-ink transition-colors -mr-1 -mt-1"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-accent-red text-[12px] font-bold uppercase tracking-[0.15em]">
              {achievement.year}
            </span>
            {achievement.subtitle && (
              <>
                <span className="text-ink/20">·</span>
                <span className="text-ink/50 text-[12px] uppercase tracking-wide">
                  {achievement.subtitle}
                </span>
              </>
            )}
          </div>

          <h2
            id="modal-title"
            className="text-primary uppercase font-normal leading-tight mb-4"
            style={{ fontSize: "clamp(20px, 3vw, 28px)" }}
          >
            {achievement.title}
          </h2>

          {achievement.description && (
            <>
              <div
                className="w-16 h-0.5 bg-accent-orange mb-4"
                aria-hidden="true"
              />
              <p className="text-primary/70 text-base leading-7">
                {achievement.description}
              </p>
            </>
          )}

          {/* Close CTA */}
          <button
            onClick={onClose}
            className="mt-6 border border-primary text-primary text-[12px] uppercase tracking-[0.1em] px-8 py-3 hover:bg-primary hover:text-white transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Featured card (7-col) ────────────────────────────────────────────────────
// No nav arrows — only dots for slide pagination.

function FeaturedCard({
  item,
  num,
  slideTotal,
  currentSlide,
  onGoTo,
  onOpenDetail,
}: {
  item: Achievement;
  num: number;
  slideTotal: number;
  currentSlide: number;
  onGoTo: (i: number) => void;
  onOpenDetail: () => void;
}) {
  return (
    <div
      className="relative bg-white border border-primary flex flex-col cursor-pointer group"
      style={{
        gridColumn: "1 / span 7",
        gridRow: "1 / span 6",
        minHeight: "clamp(320px, 40vw, 650px)",
      }}
      onClick={onOpenDetail}
      role="button"
      tabIndex={0}
      aria-label={`Lihat detail: ${item.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenDetail();
        }
      }}
    >
      {/* Image */}
      <div
        className="relative flex-1 overflow-hidden"
        style={{ minHeight: "260px" }}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full bg-primary/5 flex items-center justify-center">
            <span className="text-primary/20 text-xs uppercase tracking-widest text-center px-4">
              Foto Prestasi
            </span>
          </div>
        )}

        {/* "Lihat detail" hover hint */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-[12px] uppercase tracking-[0.15em] bg-primary/80 px-4 py-2">
            Lihat Detail
          </span>
        </div>

        {/* Slide dot indicators — bottom centre */}
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10"
          onClick={(e) => e.stopPropagation()}
          role="tablist"
          aria-label="Slide prestasi"
        >
          {Array.from({ length: slideTotal }).map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === currentSlide}
              aria-label={`Slide ${i + 1}`}
              onClick={() => onGoTo(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? "w-10 bg-accent-orange"
                  : "w-2.5 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pt-4 pb-3 flex items-start gap-3">
        {/* Number badge */}
        <div className="w-12 h-12 bg-accent-orange flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">
            {String(num).padStart(2, "0")}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <h3 className="text-primary text-sm sm:text-base uppercase font-normal leading-tight">
            {item.title}
          </h3>
          <span className="text-accent-red text-[12px] font-bold uppercase tracking-[0.1em]">
            {item.year}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Supporting card (5-col, stacked) ────────────────────────────────────────
// The LAST supporting card hosts the prev / dots / next navigation row.

function SupportingCard({
  item,
  num,
  row,
  isLast,
  onOpenDetail,
  // navigation — only used when isLast=true
  slideTotal,
  currentSlide,
  onPrev,
  onNext,
  onGoTo,
}: {
  item: Achievement;
  num: number;
  row: 1 | 4;
  isLast: boolean;
  onOpenDetail: () => void;
  slideTotal: number;
  currentSlide: number;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (i: number) => void;
}) {
  return (
    <div
      className="relative bg-white border border-primary flex flex-col"
      style={{
        gridColumn: "8 / span 5",
        gridRow: `${row} / span 3`,
        minHeight: "clamp(140px, 20vw, 310px)",
      }}
    >
      {/* Clickable area (image + info) */}
      <div
        className="flex flex-col flex-1 cursor-pointer group"
        onClick={onOpenDetail}
        role="button"
        tabIndex={0}
        aria-label={`Lihat detail: ${item.title}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpenDetail();
          }
        }}
      >
        {/* Image */}
        <div
          className="relative overflow-hidden"
          style={{ minHeight: isLast ? "80px" : "100px", flex: 1 }}
        >
          {item.image ? (
            <Image
              src={item.image}
              alt={item.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="w-full h-full bg-primary/5 flex items-center justify-center">
              <span className="text-primary/20 text-[10px] uppercase tracking-widest text-center px-2">
                Foto
              </span>
            </div>
          )}
          {/* Hover hint */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-[11px] uppercase tracking-widest bg-primary/80 px-3 py-1">
              Detail
            </span>
          </div>
        </div>

        {/* Info row: badge + text */}
        <div className="px-3 py-2 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[11px] font-bold">
              {String(num).padStart(2, "0")}
            </span>
          </div>
          <div>
            <p className="text-primary text-[11px] sm:text-xs uppercase font-normal leading-tight tracking-wide">
              {item.title}
            </p>
            <p className="text-primary/40 text-[10px] uppercase tracking-wide">
              {item.year}
            </p>
          </div>
        </div>
      </div>

      {/* ── Navigation row — ONLY on the last supporting card ── */}
      {isLast && (
        <div
          className="flex items-center justify-between gap-2 px-3 pb-3 pt-1 border-t border-primary/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Prev */}
          <button
            onClick={onPrev}
            aria-label="Slide sebelumnya"
            className="w-8 h-8 border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors flex-shrink-0"
          >
            <ChevronLeft />
          </button>

          {/* Dot indicators */}
          <div
            className="flex items-center gap-1.5 flex-1 justify-center"
            role="tablist"
          >
            {Array.from({ length: slideTotal }).map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === currentSlide}
                aria-label={`Slide ${i + 1}`}
                onClick={() => onGoTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide
                    ? "w-8 bg-accent-orange"
                    : "w-2 bg-primary/25 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={onNext}
            aria-label="Slide berikutnya"
            className="w-8 h-8 border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors flex-shrink-0"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Mobile card ──────────────────────────────────────────────────────────────

function MobileCard({
  item,
  num,
  isFeatured,
  onOpenDetail,
}: {
  item: Achievement;
  num: number;
  isFeatured?: boolean;
  onOpenDetail: () => void;
}) {
  return (
    <div
      className="relative bg-white border border-primary flex flex-col cursor-pointer group"
      onClick={onOpenDetail}
      role="button"
      tabIndex={0}
      aria-label={`Lihat detail: ${item.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenDetail();
        }
      }}
    >
      <div
        className="relative overflow-hidden"
        style={{ height: isFeatured ? "200px" : "130px" }}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full bg-primary/5 flex items-center justify-center">
            <span className="text-primary/20 text-xs uppercase tracking-widest text-center px-2">
              Foto Prestasi
            </span>
          </div>
        )}
      </div>
      <div className="px-3 py-2 flex items-center gap-2">
        <div
          className={`flex items-center justify-center flex-shrink-0 ${isFeatured ? "w-10 h-10 bg-accent-orange" : "w-8 h-8 bg-primary"}`}
        >
          <span className="text-white text-[11px] font-bold">
            {String(num).padStart(2, "0")}
          </span>
        </div>
        <div>
          <p
            className={`text-primary uppercase font-normal leading-tight ${isFeatured ? "text-sm" : "text-[11px]"}`}
          >
            {item.title}
          </p>
          <p className="text-accent-red text-[11px] font-bold uppercase tracking-[0.1em]">
            {item.year}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export default function PrestasiGallery() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<{
    achievement: Achievement;
    num: number;
  } | null>(null);
  const total = prestasiSlides.length;

  // Compute global sequential number for every achievement
  const numMap = useMemo(() => {
    const map: Record<string, number> = {};
    let n = 1;
    for (const slide of prestasiSlides) {
      map[slide.featured.id] = n++;
      for (const s of slide.supporting) map[s.id] = n++;
    }
    return map;
  }, []);

  const goTo = useCallback((index: number) => setCurrent(index), []);
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + total) % total),
    [total],
  );
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);

  const openDetail = useCallback(
    (a: Achievement) => {
      setSelected({ achievement: a, num: numMap[a.id] ?? 0 });
    },
    [numMap],
  );

  // Keyboard slide navigation (only when modal is closed)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (selected) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, selected]);

  const slide = prestasiSlides[current];

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
        className="relative bg-primary/5 px-4 sm:px-8 lg:px-16 py-8 overflow-hidden scroll-mt-24"
      >
        {/* Decorative orange circle outline */}
        <div
          className="absolute -left-32 top-24 w-[384px] h-[384px] pointer-events-none hidden lg:block"
          style={{
            border: "40px solid rgba(243,154,46,0.1)",
            borderRadius: "9999px",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-content mx-auto lg:pt-10 lg:pb-12">
          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
            <div className="flex flex-col gap-4">
              <h2
                className="text-primary uppercase font-normal leading-[1]"
                style={{
                  fontSize: "clamp(28px, 4.7vw, 60px)",
                  lineHeight: "1",
                }}
              >
                Galeri PRESTASI
              </h2>
              <p className="text-accent-red text-sm sm:text-base tracking-[0.1em] uppercase">
                Bukti nyata eksistensi di berbagai tingkat
              </p>
            </div>
            <div className="flex items-center gap-4" aria-hidden="true">
              <div className="w-12 h-1 bg-ink" />
              <div className="w-24 h-1 bg-accent-orange" />
              <div className="w-48 h-1 bg-primary" />
            </div>
          </div>

          {/* ── Desktop bento carousel ── */}
          <div className="hidden lg:block relative">
            {prestasiSlides.map((s, i) => (
              <div
                key={s.featured.id}
                aria-hidden={i !== current}
                className="transition-opacity duration-500"
                style={{
                  opacity: i === current ? 1 : 0,
                  position: i === current ? "relative" : "absolute",
                  inset: i === current ? "auto" : 0,
                  pointerEvents: i === current ? "auto" : "none",
                }}
              >
                <div
                  className="grid gap-4"
                  style={{
                    gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
                    gridTemplateRows: "repeat(6, minmax(0, 75px))",
                  }}
                >
                  <FeaturedCard
                    item={s.featured}
                    num={numMap[s.featured.id] ?? i * 3 + 1}
                    slideTotal={total}
                    currentSlide={current}
                    onGoTo={goTo}
                    onOpenDetail={() => openDetail(s.featured)}
                  />
                  {s.supporting[0] && (
                    <SupportingCard
                      item={s.supporting[0]}
                      num={numMap[s.supporting[0].id] ?? i * 3 + 2}
                      row={1}
                      isLast={false}
                      onOpenDetail={() => openDetail(s.supporting[0])}
                      slideTotal={total}
                      currentSlide={current}
                      onPrev={prev}
                      onNext={next}
                      onGoTo={goTo}
                    />
                  )}
                  {s.supporting[1] && (
                    <SupportingCard
                      item={s.supporting[1]}
                      num={numMap[s.supporting[1].id] ?? i * 3 + 3}
                      row={4}
                      isLast={true}
                      onOpenDetail={() => openDetail(s.supporting[1])}
                      slideTotal={total}
                      currentSlide={current}
                      onPrev={prev}
                      onNext={next}
                      onGoTo={goTo}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── Mobile stacked ── */}
          <div className="lg:hidden">
            {/* Nav row */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prev}
                aria-label="Slide sebelumnya"
                className="w-10 h-10 border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
              >
                <ChevronLeft />
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: total }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      i === current
                        ? "w-10 bg-accent-orange"
                        : "w-2.5 bg-primary/30"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                aria-label="Slide berikutnya"
                className="w-10 h-10 border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
              >
                <ChevronRight />
              </button>
            </div>

            {slide && (
              <div className="flex flex-col gap-3">
                <MobileCard
                  item={slide.featured}
                  num={numMap[slide.featured.id] ?? 1}
                  isFeatured
                  onOpenDetail={() => openDetail(slide.featured)}
                />
                {slide.supporting.map((a) => (
                  <MobileCard
                    key={a.id}
                    item={a}
                    num={numMap[a.id] ?? 0}
                    onOpenDetail={() => openDetail(a)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
