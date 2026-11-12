import React from "react";
import type { EvoraEvent } from "@/types/evora";

interface EventMastheadProps {
  event: EvoraEvent | null;
}

export function EventMasthead({ event }: EventMastheadProps) {
  const isOpen = event?.registration_status === "registration_open";

  return (
    <section aria-labelledby="hero-title" className="text-center pt-2 sm:pt-4 pb-3 sm:pb-5 w-full">
      {/* ── Top Header: — Dwipara — present ── */}
      <div className="flex flex-col items-center justify-center gap-0.5 mb-2.5 sm:mb-3">
        <div className="flex items-center justify-center gap-2.5 sm:gap-4 w-full">
          <div className="h-[1.5px] bg-bramasta-ink flex-1" />
          <span className="font-masthead text-[32px] sm:text-[44px] lg:text-[56px] text-bramasta-ink px-2 select-none leading-[1.1]">
            Dwipara
          </span>
          <div className="h-[1.5px] bg-bramasta-ink flex-1" />
        </div>
        <span className="font-bodoni italic text-xs sm:text-sm text-bramasta-ink-soft tracking-[0.14em] uppercase -mt-0.5">
          present
        </span>
      </div>

      {/* ── COMING SOON / STATUS KICKER ── */}
      <div className="my-2.5 flex flex-wrap items-center justify-center gap-2">
        <span
          className={`font-bodoni font-bold text-xs sm:text-sm md:text-base uppercase tracking-[0.2em] leading-[1.2] px-3 py-1 rounded-sm ${
            isOpen
              ? "bg-bramasta-accent text-bramasta-accent-on"
              : "bg-bramasta-ink text-paper"
          }`}
        >
          {isOpen ? "PENDAFTARAN RESMI DIBUKA" : "COMING SOON"}
        </span>
        {!event && (
          <span className="text-xs font-bodoni uppercase tracking-wider bg-paper-dark border border-bramasta-ink px-2.5 py-1 font-bold text-bramasta-ink shadow-xs rounded-sm">
            Menunggu Rilis EVORA
          </span>
        )}
      </div>

      {/* ── Main Headline H1: LKBB BRAMASTA 4.0 ── */}
      <h1
        id="hero-title"
        className="font-bodoni font-bold text-[36px] sm:text-6xl md:text-7xl lg:text-[88px] uppercase tracking-[-0.01em] text-bramasta-ink leading-[1.02] sm:leading-[0.98] my-2.5 sm:my-3.5 w-full lining-nums"
      >
        {event?.name || "LKBB BRAMASTA 4.0"}
      </h1>

      {/* ── Double Rule Pembatas (Thick + Thin Sesuai Poster) ── */}
      <div className="w-full my-3 sm:my-4" aria-hidden="true">
        <div className="w-full border-t-[4px] border-bramasta-ink" />
        <div className="w-full border-t-[2px] border-bramasta-ink mt-1" />
      </div>

      {/* ── Subtitle: Barisan Semangat Paskibra Dewata ── */}
      <p className="font-bodoni font-bold text-xs sm:text-base md:text-lg uppercase tracking-[0.16em] text-bramasta-ink my-1.5 leading-[1.3]">
        Barisan Semangat Paskibra Dewata
      </p>

      {/* ── Tagline: Mencari sang pejuang dan sang pemenang - untuk 2027 ── */}
      <p className="font-bodoni italic font-normal text-[19px] sm:text-2xl md:text-[32px] text-bramasta-ink-soft mt-1.5 mb-1 leading-[1.3] max-w-2xl mx-auto lining-nums">
        Mencari sang pejuang dan sang pemenang &mdash; untuk 2027
      </p>
    </section>
  );
}
