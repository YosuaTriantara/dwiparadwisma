"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, ArrowRight, Compass, Sparkles, Award } from "lucide-react";
import { startBramastaTour } from "@/lib/tour/tourStorage";

interface BramastaWelcomeModalProps {
  bannerUrl?: string | null;
  eventName?: string | null;
}

export function BramastaWelcomeModal({
  bannerUrl,
  eventName = "LKBB Bramasta 4.0",
}: BramastaWelcomeModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset status error jika bannerUrl dari props berubah
  useEffect(() => {
    setImageError(false);
  }, [bannerUrl]);

  useEffect(() => {
    setMounted(true);
    // Bersihkan flag penyimpanan lama jika ada
    try {
      localStorage.removeItem("dwipara_welcome_bramasta_dismissed_v1");
      sessionStorage.removeItem("dwipara_welcome_bramasta_session_v1");
    } catch {
      // Ignore storage errors
    }

    // Selalu tampilkan pop-up pengumuman saat halaman dimuat / direfresh
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleGuideToBramasta = useCallback(() => {
    startBramastaTour();
    setIsOpen(false);
    router.push("/lkbb-bramasta-4?tour=start");
  }, [router]);

  const handleExploreDwipara = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Semua hooks di atas telah dipanggil sebelum conditional return
  if (!mounted || !isOpen) return null;

  // Gunakan banner resmi dari EVORA API jika ada dan tidak error, atau fallback dokumentasi podium Bramasta
  const visualBannerSrc = !imageError && bannerUrl ? bannerUrl : "/images/bramasta-hero.jpg";
  const isRemoteUrl = Boolean(visualBannerSrc && visualBannerSrc.startsWith("http"));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
      aria-describedby="welcome-modal-desc"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 -z-10"
        aria-hidden="true"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg md:max-w-xl max-h-[min(92dvh,760px)] flex flex-col bg-paper-light border-2 border-bramasta-ink rounded-lg shadow-[6px_6px_0px_#141210] overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Tombol Tutup (X) - 44x44px touch target dengan kontras tinggi */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Tutup pemberitahuan"
          className="absolute top-2.5 right-2.5 z-30 min-w-[44px] min-h-[44px] flex items-center justify-center bg-paper-light/95 hover:bg-bramasta-ink hover:text-paper-light border-2 border-bramasta-ink rounded-full text-bramasta-ink transition-colors cursor-pointer shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-bramasta-accent"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* ── VISUAL BANNER RESMI (Dapat diklik untuk langsung menuju pendaftaran) ── */}
        <div
          onClick={handleGuideToBramasta}
          className="group relative w-full bg-paper-dark border-b-2 border-bramasta-ink shrink-0 overflow-hidden cursor-pointer"
          title="Klik banner untuk melihat detail & panduan pendaftaran"
        >
          {isRemoteUrl ? (
            /* Menampilkan banner resmi EVORA/ImageKit secara proporsional penuh (Full Aspect Ratio tanpa terpotong) */
            <div className="relative w-full bg-[#141210] flex items-center justify-center overflow-hidden">
              <img
                src={visualBannerSrc}
                alt={eventName || "Banner Resmi LKBB Bramasta 4.0"}
                onError={() => setImageError(true)}
                className="w-full h-auto max-h-[300px] sm:max-h-[360px] object-contain block group-hover:scale-[1.01] transition-transform duration-300 ease-out"
              />
            </div>
          ) : (
            /* Fallback foto dokumentasi podium jika belum ada banner resmi dari API */
            <div className="relative w-full h-36 sm:h-48 md:h-52 bg-paper-dark overflow-hidden">
              <Image
                src={visualBannerSrc}
                alt={eventName || "Banner Resmi LKBB Bramasta 4.0"}
                fill
                priority
                sizes="(max-width: 640px) 100vw, 600px"
                className="object-cover filter contrast-105 brightness-95 group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Vignette Gelap & Aksen Tekstur Vintage khusus fallback */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/25 pointer-events-none" />

              {/* Label Header Warta di Atas Banner */}
              <div className="absolute top-3 left-3 sm:top-3.5 sm:left-4 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-xs border border-white/20 rounded text-paper-light">
                <span className="font-bodoni font-bold text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#d6b258]">
                  Warta Resmi Kompetisi
                </span>
              </div>

              {/* Info Banner di Bagian Bawah Gambar */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-3.5 sm:left-4 sm:right-4 z-10 flex items-end justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mb-1 bg-bramasta-accent text-bramasta-accent-on font-bodoni font-bold text-[10px] sm:text-[11px] uppercase tracking-[0.14em] rounded shadow-xs">
                    <Award className="w-3 h-3 shrink-0" />
                    <span>LKBB Bramasta 4.0</span>
                  </div>
                  <p className="font-bodoni text-xs sm:text-sm text-paper-light/95 font-medium tracking-wide drop-shadow-sm">
                    Barisan Semangat Paskibra Dewata se-Bali
                  </p>
                </div>

                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bodoni font-bold text-[#d6b258] underline underline-offset-2 shrink-0 group-hover:translate-x-0.5 transition-transform">
                  <span>Buka Info</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Isi Modal: scrollable secara internal jika layar ponsel sangat pendek */}
        <div className="p-4 sm:p-6 md:p-7 text-bramasta-ink overflow-y-auto overscroll-contain flex-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
            <span className="inline-block px-2 py-0.5 text-[10px] sm:text-[11px] font-bodoni font-bold uppercase tracking-wider bg-bramasta-accent text-bramasta-accent-on rounded">
              Pendaftaran Dibuka
            </span>
            <span className="text-[11px] sm:text-xs font-bodoni text-bramasta-ink-soft">
              Tingkat SMP & SMA se-Bali
            </span>
          </div>

          <h2
            id="welcome-modal-title"
            className="font-bodoni font-bold text-xl sm:text-2xl md:text-[26px] uppercase tracking-tight text-bramasta-ink leading-[1.18]"
          >
            Selamat Datang di Portal Dwipara Dwisma!
          </h2>

          <p
            id="welcome-modal-desc"
            className="font-bodoni text-xs sm:text-sm md:text-[15px] text-bramasta-ink-soft mt-2.5 sm:mt-3 leading-[1.6] text-justify hyphens-auto"
          >
            Pendaftaran kompetisi akbar{" "}
            <strong className="text-bramasta-ink font-bold">
              {eventName || "LKBB Bramasta 4.0"}
            </strong>{" "}
            telah resmi dibuka. Apakah Anda ingin langsung dipandu menuju informasi
            lengkap dan langkah pendaftaran tim, atau ingin menjelajahi profil organisasi
            Dwipara Dwisma terlebih dahulu?
          </p>

          {/* Pemisah Garis Koran */}
          <hr className="border-t border-bramasta-ink/20 my-4 sm:my-5" />

          {/* Opsi Akomodasi Kedua Kebutuhan User */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            {/* Opsi 1: Menuju Panduan Pendaftaran LKBB Bramasta 4.0 */}
            <button
              type="button"
              onClick={handleGuideToBramasta}
              className="w-full sm:flex-1 min-h-[46px] inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-bramasta-accent text-bramasta-accent-on font-bodoni font-bold text-xs sm:text-sm uppercase tracking-[0.06em] hover:bg-bramasta-accent-hover transition-colors rounded-md shadow-xs text-center cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-bramasta-ink"
            >
              <span>Pandu ke Pendaftaran</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            {/* Opsi 2: Tetap di dwiparadwisma.com */}
            <button
              type="button"
              onClick={handleExploreDwipara}
              className="w-full sm:flex-1 min-h-[46px] inline-flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-bramasta-ink text-bramasta-ink font-bodoni font-bold text-xs sm:text-sm uppercase tracking-[0.06em] hover:bg-bramasta-ink hover:text-paper-light transition-colors rounded-md text-center cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-bramasta-accent"
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>Jelajahi Profil Dwipara</span>
            </button>
          </div>

          <p className="font-bodoni text-[11px] sm:text-xs text-bramasta-ink-soft text-center mt-3">
            Warta resmi LKBB Bramasta 4.0 · Dwipara Dwisma SMAN 2 Mengwi
          </p>
        </div>
      </div>
    </div>
  );
}
