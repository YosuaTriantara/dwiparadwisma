"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { NewsRule } from "../ui/NewsRule";
import type { EvoraEvent } from "@/types/evora";
import { formatWaNumber } from "@/lib/evora/contact";

interface BramastaCtaSectionProps {
  organizerInfo?: EvoraEvent["organizer_info"];
}

export function BramastaCtaSection({ organizerInfo }: BramastaCtaSectionProps = {}) {
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
    <section>
      <div className="bg-paper-light text-bramasta-ink border-2 border-bramasta-ink rounded-md p-6 sm:p-8 md:p-10 text-center shadow-[3px_3px_0px_#141210]">
        <span className="font-bodoni font-bold text-xs uppercase tracking-wider text-bramasta-ink-mute block mb-2">
          PANGGUNG KEHORMATAN MENANTI ANDA
        </span>

        <h2 className="font-bodoni font-bold text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-bramasta-ink mb-2 sm:mb-3">
          Siap Jadi Sang Pemenang?
        </h2>

        <p className="font-bodoni text-sm sm:text-base text-bramasta-ink max-w-lg mx-auto mb-6 leading-relaxed">
          Amankan kuota sekolah Anda sekarang! Bergabunglah bersama puluhan tim terbaik se-Bali di LKBB Bramasta 4.0.
        </p>

        <NewsRule variant="thin" className="max-w-xs mx-auto border-t-bramasta-ink/20 my-5" />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-lg mx-auto">
          <Link
            href="/lkbb-bramasta-4/daftar"
            onClick={handleDaftarClick}
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-bramasta-accent text-bramasta-accent-on font-bodoni font-bold text-xs sm:text-sm uppercase tracking-[0.1em] hover:bg-bramasta-accent-hover transition-all rounded-md shadow-sm text-center cursor-pointer active:translate-y-px"
          >
            <span>Daftar Tim Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-bramasta-ink text-bramasta-ink font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-bramasta-ink hover:text-white rounded-md transition-colors text-center cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Hubungi Panitia</span>
          </a>
        </div>
      </div>
    </section>
  );
}
