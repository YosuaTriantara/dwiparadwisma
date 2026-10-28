import React from "react";
import Link from "next/link";
import { MessageCircle, ArrowLeft } from "lucide-react";
import type { EvoraEvent } from "@/types/evora";
import { formatWaNumber, formatDisplayPhone } from "@/lib/evora/contact";

interface BramastaFooterProps {
  organizerInfo?: EvoraEvent["organizer_info"];
}

export function BramastaFooter({ organizerInfo }: BramastaFooterProps = {}) {
  // Kontak utama panitia untuk saluran komunikasi resmi
  const primaryPhone = organizerInfo?.whatsapp || organizerInfo?.phone || "081236345679";
  const waNumber = formatWaNumber(primaryPhone, "6281236345679");
  const displayPhone = formatDisplayPhone(primaryPhone, "+62 812-3634-5679");

  return (
    <footer className="bg-sepia-2 text-[#F4F1DC] py-6 sm:py-7 px-4 sm:px-6 border-t-2 border-bramasta-ink">
      <div className="max-w-[1152px] mx-auto flex flex-col items-center text-center gap-3.5">
        {/* Identitas Sederhana */}
        <div>
          <span className="font-masthead text-2xl sm:text-3xl text-[#F4F1DC] block leading-none mb-1">
            Dwipara Dwisma
          </span>
          <p className="font-bodoni text-xs sm:text-sm text-[#F4F1DC]/80 tracking-wider">
            LKBB Bramasta 4.0 · Paskibra SMAN 2 Mengwi, Badung, Bali
          </p>
        </div>

        {/* Kontak & Media Sosial Ringkas dalam 1 Baris */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-6 font-bodoni text-xs sm:text-sm font-medium text-white">
          <a
            href="https://instagram.com/paskibradwissma"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-white/80 transition-colors"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span>@paskibradwissma</span>
          </a>

          <a
            href="https://tiktok.com/@dwipara_"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-white/80 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
            </svg>
            <span>@dwipara_</span>
          </a>

          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-white font-bold hover:underline"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{displayPhone}</span>
          </a>

          <Link
            href="/"
            className="inline-flex items-center gap-1 text-white font-bold hover:underline border-l border-[#F4F1DC]/30 pl-3.5 sm:pl-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Dwipara</span>
          </Link>
        </div>

        <div className="w-full max-w-sm border-t border-[#F4F1DC]/20 my-0.5" />

        {/* Hak Cipta & Powered by */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs font-bodoni text-[#F4F1DC]/80 w-full">
          <span>
            &copy; 2026-2027 LKBB Bramasta 4.0 · Dwipara Dwisma. All rights reserved.
          </span>
          <span className="uppercase tracking-wider">
            Powered by EVORA Engine
          </span>
        </div>
      </div>
    </footer>
  );
}
