"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, LogIn, MessageCircle, ShieldCheck } from "lucide-react";
import { NewsRule } from "../ui/NewsRule";
import type { EvoraEvent } from "@/types/evora";
import { formatWaNumber } from "@/lib/evora/contact";
import { isAuthenticated } from "@/lib/evora/auth";
import { EVORA_AUTH_EVENT } from "@/lib/evora/client";

interface BramastaCtaSectionProps {
  organizerInfo?: EvoraEvent["organizer_info"];
}

export function BramastaCtaSection({ organizerInfo }: BramastaCtaSectionProps = {}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const syncAuth = () => setIsLoggedIn(isAuthenticated());
    syncAuth();

    window.addEventListener(EVORA_AUTH_EVENT, syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener(EVORA_AUTH_EVENT, syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  // Kontak panitia utama untuk pertanyaan dan informasi umum pendaftaran lomba
  const primaryContact = organizerInfo?.whatsapp || organizerInfo?.phone || "081236345679";
  const waNumber = formatWaNumber(primaryContact, "6281236345679");
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    "Halo Panitia LKBB Bramasta 4.0, saya ingin bertanya mengenai pendaftaran lomba."
  )}`;

  const handleDaftarClick = (e: React.MouseEvent) => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname.replace(/\/$/, "");
      if (path === "/lkbb-bramasta-4") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("open-bramasta-registration", { detail: {} }));
      }
    }
  };

  return (
    <section aria-labelledby="cta-title">
      <div className="bg-paper-light text-bramasta-ink border-2 border-bramasta-ink rounded-md p-5 sm:p-8 md:p-10 text-left sm:text-center shadow-[3px_3px_0px_#141210]">
        <span className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-[0.18em] text-bramasta-accent block mb-1.5">
          PANGGUNG KEHORMATAN MENANTI ANDA
        </span>

        <h2
          id="cta-title"
          className="font-bodoni font-bold text-[26px] sm:text-3xl lg:text-4xl uppercase tracking-tight text-bramasta-ink leading-[1.12] mb-2.5 sm:mb-3"
        >
          Siap Jadi Sang Pemenang?
        </h2>

        <p className="font-bodoni text-base sm:text-[17px] text-bramasta-ink-soft max-w-lg sm:mx-auto mb-6 leading-[1.65] text-justify sm:text-center hyphens-auto lining-nums">
          Amankan kuota sekolah Anda sekarang! Bergabunglah bersama puluhan tim terbaik se-Bali di LKBB Bramasta 4.0.
        </p>

        <NewsRule variant="thin" className="max-w-xs sm:mx-auto border-t-bramasta-ink/25 my-5" />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-lg sm:mx-auto">
          <Link
            href="/lkbb-bramasta-4/daftar"
            onClick={handleDaftarClick}
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-bramasta-accent text-bramasta-accent-on font-bodoni font-bold text-sm uppercase tracking-[0.1em] hover:bg-bramasta-accent-hover transition-all rounded-md shadow-sm text-center cursor-pointer active:translate-y-px focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
          >
            <span>Daftar Tim Sekarang</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-bramasta-ink text-bramasta-ink font-bodoni font-bold text-sm uppercase tracking-wider hover:bg-bramasta-ink hover:text-[#F4F1DC] rounded-md transition-colors text-center cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>Hubungi Panitia</span>
          </a>
        </div>

        <div className="mt-5 pt-4 border-t border-bramasta-ink/15 flex flex-wrap items-center justify-start sm:justify-center gap-1.5 text-sm font-bodoni text-bramasta-ink-soft">
          {isLoggedIn ? (
            <>
              <span>Akun tim Anda sudah masuk.</span>
              <Link
                href="/lkbb-bramasta-4/daftar"
                className="inline-flex items-center gap-1 font-bold text-bramasta-accent hover:underline underline-offset-4 min-h-[44px] px-1"
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Buka Dashboard Kontingen Tim &rarr;</span>
              </Link>
            </>
          ) : (
            <>
              <span>Sudah pernah mendaftarkan tim?</span>
              <Link
                href="/lkbb-bramasta-4/daftar?mode=login"
                className="inline-flex items-center gap-1 font-bold text-bramasta-accent hover:underline underline-offset-4 min-h-[44px] px-1"
              >
                <LogIn className="w-4 h-4 shrink-0" />
                <span>Masuk ke Dashboard Tim &rarr;</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
