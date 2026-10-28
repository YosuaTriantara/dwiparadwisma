import React from "react";
import type { EvoraEvent } from "@/types/evora";

interface EventMastheadProps {
  event: EvoraEvent | null;
}

export function EventMasthead({ event }: EventMastheadProps) {
  const isOpen = event?.registration_status === "registration_open";

  return (
    <section className="text-center pt-2 sm:pt-4 pb-3 sm:pb-5 px-1 w-full">
      {/* ── Top Header: — Dwipara — present ── */}
      <div className="flex flex-col items-center justify-center gap-0 mb-2 sm:mb-3">
        <div className="flex items-center justify-center gap-2 sm:gap-4 w-full">
          <div className="h-[1.5px] bg-bramasta-ink flex-1" />
          <span className="font-masthead text-2xl sm:text-4xl md:text-5xl text-bramasta-ink px-2 select-none leading-none">
            Dwipara
          </span>
          <div className="h-[1.5px] bg-bramasta-ink flex-1" />
        </div>
        <span className="font-bodoni italic text-xs sm:text-sm text-bramasta-ink-soft tracking-wider -mt-0.5">
          present
        </span>
      </div>

      {/* ── COMING SOON / STATUS ── */}
      <div className="my-2 flex flex-wrap items-center justify-center gap-2">
        <span className="font-bodoni font-bold text-xs sm:text-base md:text-lg uppercase tracking-[0.2em] text-bramasta-ink block">
          {isOpen ? "PENDAFTARAN RESMI DIBUKA" : "COMING SOON"}
        </span>
        {!event && (
          <span className="text-[11px] sm:text-xs font-bodoni uppercase tracking-wider bg-paper-dark border border-bramasta-ink px-2.5 py-1 font-bold text-bramasta-ink shadow-xs rounded-sm">
            Menunggu Rilis EVORA
          </span>
        )}
      </div>

      {/* ── Main Headline H1: LKBB BRAMASTA 4.0 ── */}
      <h1 className="font-bodoni font-bold text-3xl sm:text-5xl md:text-7xl lg:text-8xl uppercase tracking-tight text-bramasta-ink leading-[1.05] sm:leading-[0.95] my-2 sm:my-3 w-full">
        {event?.name || "LKBB BRAMASTA 4.0"}
      </h1>

      {/* ── Double Rule Pembatas (Thick + Thin Sesuai Poster) ── */}
      <div className="w-full my-3 sm:my-4" aria-hidden="true">
        <div className="w-full border-t-[3px] border-bramasta-ink" />
        <div className="w-full border-t-[1px] border-bramasta-ink mt-[2.5px]" />
      </div>

      {/* ── Subtitle: Barisan Semangat Paskibra Dewata ── */}
      <p className="font-bodoni font-bold text-xs sm:text-base md:text-lg uppercase tracking-[0.15em] text-bramasta-ink my-1 leading-snug">
        Barisan Semangat Paskibra Dewata
      </p>

      {/* ── Tagline: Mencari sang pejuang dan sang pemenang - untuk 2027 ── */}
      <p className="font-bodoni text-sm sm:text-lg md:text-2xl text-bramasta-ink mt-1.5 mb-1 leading-relaxed max-w-xl mx-auto">
        Mencari sang pejuang dan sang pemenang - untuk 2027
      </p>
    </section>
  );
}
