"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MessageCircle, ChevronLeft, ChevronRight, X, Eye } from "lucide-react";
import { NewsRule } from "../ui/NewsRule";
import type { EvoraEvent } from "@/types/evora";
import { formatWaNumber } from "@/lib/evora/contact";

interface MerchandiseItem {
  id: string;
  name: string;
  price: string;
  badge: string;
  shortDesc: string;
  material: string;
  images: {
    src: string;
    alt: string;
    title: string;
  }[];
  sizeChart: {
    size: string;
    chest: string;
    length: string;
    sleeve: string;
  }[];
  features: string[];
}

const OFFICIAL_TSHIRT: MerchandiseItem = {
  id: "kaos-bramasta-4",
  name: "Kaos Resmi LKBB Bramasta 4.0",
  price: "Rp 100.000",
  badge: "Edisi Terbatas",
  shortDesc: "Tampil kompak di arena lomba dengan kaos resmi edisi terbatas LKBB Bramasta 4.0. Pre-order dibuka selama stok tersedia.",
  material: "Cotton Combed 24s Premium Soft Reactive (Bahan tebal, adem, dan menyerap keringat saat aktivitas lapangan)",
  images: [
    {
      src: "/images/merch/tshirt-front.svg",
      alt: "Kaos Resmi LKBB Bramasta 4.0 - Tampak Depan",
      title: "Tampak Depan",
    },
    {
      src: "/images/merch/tshirt-back.svg",
      alt: "Kaos Resmi LKBB Bramasta 4.0 - Tampak Belakang",
      title: "Tampak Belakang",
    },
    {
      src: "/images/merch/tshirt-sizechart.svg",
      alt: "Panduan Detail Ukuran Kaos Resmi Bramasta 4.0",
      title: "Panduan Size Chart",
    },
  ],
  sizeChart: [
    { size: "S", chest: "47 cm", length: "67 cm", sleeve: "20 cm" },
    { size: "M", chest: "50 cm", length: "70 cm", sleeve: "22 cm" },
    { size: "L", chest: "53 cm", length: "73 cm", sleeve: "23 cm" },
    { size: "XL", chest: "56 cm", length: "75 cm", sleeve: "24 cm" },
    { size: "XXL", chest: "59 cm", length: "77 cm", sleeve: "25 cm" },
    { size: "3XL", chest: "62 cm", length: "80 cm", sleeve: "26 cm" },
  ],
  features: [
    "Bahan 100% Cotton Combed 24s Soft Reactive standar distro",
    "Sablon High-density Plastisol Ink tajam & tahan cuci berulang",
    "Jahitan rantai dobel di pundak dan leher (kuat & awet)",
    "Pilihan ukuran lengkap: S, M, L, XL, XXL, hingga 3XL (Unisex)",
  ],
};

interface BramastaMerchandiseProps {
  organizerInfo?: EvoraEvent["organizer_info"];
}

export function BramastaMerchandise({ organizerInfo }: BramastaMerchandiseProps = {}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Swipe gesture tracking
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const openModal = (initialSlide = 0) => {
    setCurrentSlide(initialSlide);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentSlide(0);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % OFFICIAL_TSHIRT.images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + OFFICIAL_TSHIRT.images.length) % OFFICIAL_TSHIRT.images.length);
  };

  // Close modal on Escape / Arrow keys & lock body scroll safely
  useEffect(() => {
    if (!modalOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModalOpen(false);
        setCurrentSlide(0);
      } else if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => (prev - 1 + OFFICIAL_TSHIRT.images.length) % OFFICIAL_TSHIRT.images.length);
      } else if (e.key === "ArrowRight") {
        setCurrentSlide((prev) => (prev + 1) % OFFICIAL_TSHIRT.images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Kontak alternatif khusus pemesanan merchandise sesuai arahan
  const merchPhone = organizerInfo?.phone || "089676364321";
  const waNumber = formatWaNumber(merchPhone, "6289676364321");
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    "Halo Panitia LKBB Bramasta 4.0, saya ingin memesan Kaos Resmi LKBB Bramasta 4.0. Mohon informasi ketersediaan ukuran dan rekening pembayarannya."
  )}`;

  return (
    <section id="merchandise" aria-labelledby="merchandise-title" className="scroll-mt-20">
      <div className="border-2 border-bramasta-ink bg-paper-light rounded-md p-4 sm:p-6 shadow-[3px_3px_0px_#141210]">
        {/* Header Section */}
        <div className="text-left sm:text-center mb-3 sm:mb-5">
          <span className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-[0.18em] text-bramasta-accent block">
            WARTA CENDERAMATA
          </span>
          <h2
            id="merchandise-title"
            className="font-bodoni font-bold text-[26px] sm:text-[32px] lg:text-[38px] uppercase tracking-tight text-bramasta-ink leading-[1.12] mt-1"
          >
            Official Merchandise
          </h2>
          <p className="font-bodoni text-base sm:text-[17px] text-bramasta-ink-soft max-w-xl sm:mx-auto mt-2 leading-[1.65] text-justify sm:text-center hyphens-auto">
            Dukung kontingen Anda dengan kaos resmi edisi terbatas LKBB Bramasta 4.0.
          </p>
        </div>

        <NewsRule variant="std" className="my-3.5" />

        {/* Spotlight Showcase 1 Produk (Ringkas di Mobile, Informatif di Desktop) */}
        <div className="bg-paper border-2 border-bramasta-ink rounded-md p-4 sm:p-6 shadow-[3px_3px_0px_#141210]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-8 items-center">
            {/* Sisi Kiri: Preview Gambar Produk (Klik untuk Modal) */}
            <div className="md:col-span-5 flex flex-col items-center">
              <button
                type="button"
                onClick={() => openModal(0)}
                className="relative aspect-square w-full max-w-[260px] sm:max-w-[320px] border-2 border-bramasta-ink bg-paper-dark rounded-none overflow-hidden cursor-pointer group shadow-sm focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
                title="Klik untuk membuka detail & geser foto"
                aria-label="Lihat detail foto dan panduan ukuran kaos resmi"
              >
                <Image
                  src={OFFICIAL_TSHIRT.images[0].src}
                  alt={OFFICIAL_TSHIRT.images[0].alt}
                  fill
                  sizes="(max-width: 768px) 260px, 320px"
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="font-bodoni font-bold text-xs uppercase tracking-wider bg-bramasta-ink text-[#F4F1DC] px-2.5 py-1 rounded-sm">
                    {OFFICIAL_TSHIRT.badge}
                  </span>
                </div>
                <div className="absolute inset-0 bg-bramasta-ink/10 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center">
                  <span className="bg-paper border border-bramasta-ink text-bramasta-ink px-3 py-1.5 text-xs sm:text-sm font-bodoni font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span>Lihat Detail Foto & Ukuran</span>
                  </span>
                </div>
              </button>

              {/* Strip Mini Thumbnail */}
              <div className="flex gap-2.5 mt-3 justify-center">
                {OFFICIAL_TSHIRT.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => openModal(idx)}
                    className="relative w-12 h-12 sm:w-14 sm:h-14 min-w-[44px] min-h-[44px] border border-bramasta-ink bg-paper-light rounded-none overflow-hidden hover:border-bramasta-accent transition-colors cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
                    title={img.title}
                    aria-label={`Lihat ${img.title}`}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="56px"
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Sisi Kanan: Ringkasan Produk & Tombol Aksi */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-bodoni uppercase px-2.5 py-0.5 bg-bramasta-accent-soft text-bramasta-accent border border-bramasta-accent/30 rounded-sm font-bold tracking-wider">
                    Pre-Order Dibuka
                  </span>
                </div>

                <h3 className="font-bodoni font-bold text-xl sm:text-2xl uppercase tracking-[0.02em] text-bramasta-ink leading-[1.2] mb-2">
                  {OFFICIAL_TSHIRT.name}
                </h3>

                <div className="inline-block border-b-2 border-bramasta-ink pb-1 mb-3">
                  <span className="font-bodoni font-bold text-2xl sm:text-3xl text-bramasta-ink lining-nums">
                    {OFFICIAL_TSHIRT.price}
                  </span>
                  <span className="font-bodoni font-semibold text-sm text-bramasta-ink-soft ml-2">
                    / pcs
                  </span>
                </div>

                <p className="font-bodoni text-base text-bramasta-ink-soft leading-[1.65] text-justify hyphens-auto mb-3.5 oldstyle-nums">
                  {OFFICIAL_TSHIRT.shortDesc}
                </p>

                {/* Ringkasan Spesifikasi Singkat (Padat di Mobile, Tidak Penuh Teks) */}
                <div className="bg-paper-light border border-bramasta-ink/35 rounded-sm px-3.5 py-2.5 mb-4 font-bodoni text-sm text-bramasta-ink-soft space-y-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <span className="font-bold text-bramasta-ink uppercase text-xs tracking-wider">
                      Ukuran
                    </span>
                    <span className="font-semibold text-bramasta-ink lining-nums">
                      S – 3XL (Unisex)
                    </span>
                  </div>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 pt-1 border-t border-bramasta-ink/15">
                    <span className="font-bold text-bramasta-ink uppercase text-xs tracking-wider">
                      Bahan
                    </span>
                    <span className="font-semibold text-bramasta-ink">
                      Cotton Combed 24s Soft Reactive
                    </span>
                  </div>
                </div>
              </div>

              {/* Dua Tombol Aksi */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-3 border-t border-bramasta-ink/20">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 min-h-[48px] flex items-center justify-center gap-2 py-3 px-5 bg-bramasta-accent text-bramasta-accent-on font-bodoni font-bold text-sm uppercase tracking-[0.1em] hover:bg-bramasta-accent-hover transition-all rounded-md shadow-sm text-center focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Beli via WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => openModal(0)}
                  className="sm:w-auto min-h-[48px] px-5 py-3 border-2 border-bramasta-ink text-bramasta-ink bg-paper-light font-bodoni font-bold text-sm uppercase tracking-wider hover:bg-bramasta-ink hover:text-[#F4F1DC] transition-colors rounded-md flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
                >
                  <Eye className="w-4 h-4 shrink-0" />
                  <span>Detail & Size Chart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── POP-UP MODAL DETAIL, SLIDER & SIZE CHART ── */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 bg-bramasta-ink/75 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={closeModal}
        >
          <div
            className="bg-paper-light border-2 sm:border-[3px] border-bramasta-ink rounded-xl p-4 sm:p-6 shadow-[4px_4px_0px_#141210] max-w-lg w-full max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal & Tombol Close */}
            <div className="flex justify-between items-start gap-3 pb-2.5 border-b-2 border-bramasta-ink">
              <div>
                <span className="font-bodoni font-bold text-xs uppercase tracking-[0.16em] text-bramasta-accent block">
                  DETAIL MERCHANDISE 
                </span>
                <h3 id="modal-title" className="font-bodoni font-bold text-lg sm:text-xl uppercase text-bramasta-ink mt-0.5 leading-[1.2]">
                  {OFFICIAL_TSHIRT.name}
                </h3>
                <span className="font-bodoni font-bold text-xl text-bramasta-ink block mt-0.5 lining-nums">
                  {OFFICIAL_TSHIRT.price}
                </span>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 border border-bramasta-ink hover:bg-bramasta-ink hover:text-[#F4F1DC] rounded-md transition-colors cursor-pointer shrink-0 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
                aria-label="Tutup pop-up"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slider Container dengan Swipe Touch */}
            <div className="mt-3.5">
              <div
                className="relative aspect-square w-full max-w-[260px] sm:max-w-[320px] mx-auto border-2 border-bramasta-ink bg-paper rounded-none overflow-hidden select-none touch-pan-y"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <Image
                  src={OFFICIAL_TSHIRT.images[currentSlide].src}
                  alt={OFFICIAL_TSHIRT.images[currentSlide].alt}
                  fill
                  sizes="(max-width: 640px) 260px, 320px"
                  className="object-contain p-2"
                />

                {/* Badge Posisi Slide */}
                <div className="absolute top-2 left-2 bg-bramasta-ink text-[#F4F1DC] px-2.5 py-0.5 text-xs font-bodoni font-bold uppercase tracking-wider rounded-sm lining-nums">
                  {OFFICIAL_TSHIRT.images[currentSlide].title} ({currentSlide + 1}/{OFFICIAL_TSHIRT.images.length})
                </div>

                {/* Tombol Navigasi Kiri / Kanan */}
                <button
                  type="button"
                  onClick={prevSlide}
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center bg-paper/95 border border-bramasta-ink text-bramasta-ink hover:bg-bramasta-ink hover:text-[#F4F1DC] rounded-sm transition-colors cursor-pointer shadow-sm focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
                  aria-label="Foto sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center bg-paper/95 border border-bramasta-ink text-bramasta-ink hover:bg-bramasta-ink hover:text-[#F4F1DC] rounded-sm transition-colors cursor-pointer shadow-sm focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
                  aria-label="Foto berikutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Petunjuk Swipe di Smartphone */}
                <div className="absolute bottom-1.5 inset-x-0 text-center pointer-events-none">
                  <span className="text-xs font-bodoni font-bold text-bramasta-ink bg-paper/95 border border-bramasta-ink/60 px-2 py-0.5 inline-block rounded-sm">
                    Geser foto (swipe)
                  </span>
                </div>
              </div>

              {/* Slide Indicator Dots (Target Sentuh Nyaman) */}
              <div className="flex items-center justify-center gap-1 mt-1.5">
                {OFFICIAL_TSHIRT.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className="min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
                    aria-label={`Lihat ${img.title}`}
                  >
                    <span
                      className={`h-2.5 transition-all border border-bramasta-ink rounded-full block ${
                        currentSlide === idx
                          ? "w-7 bg-bramasta-ink"
                          : "w-2.5 bg-paper hover:bg-bramasta-ink/40"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Detail Spesifikasi & Tabel Size Chart */}
            <div className="mt-2.5 space-y-3.5 font-bodoni text-sm sm:text-base text-bramasta-ink">
              <div>
                <span className="font-bold uppercase tracking-wider block text-xs text-bramasta-accent mb-0.5">
                  Bahan Kain
                </span>
                <p className="text-bramasta-ink-soft text-sm sm:text-base leading-[1.65] text-justify hyphens-auto">
                  {OFFICIAL_TSHIRT.material}
                </p>
              </div>

              {/* Tabel Detail Ukuran */}
              <div>
                <span className="font-bold uppercase tracking-wider block text-xs text-bramasta-accent mb-1.5">
                  Panduan Ukuran (Centimeter)
                </span>
                <div className="border-2 border-bramasta-ink bg-paper rounded-none overflow-x-auto lining-nums">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="bg-bramasta-ink text-[#F4F1DC] font-bold uppercase text-xs">
                        <th className="p-2 border-r border-paper/20">Size</th>
                        <th className="p-2 border-r border-paper/20">Lebar Dada</th>
                        <th className="p-2 border-r border-paper/20">Panjang</th>
                        <th className="p-2">Lengan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {OFFICIAL_TSHIRT.sizeChart.map((row, i) => (
                        <tr
                          key={row.size}
                          className={`border-t border-bramasta-ink/20 ${
                            i % 2 === 1 ? "bg-paper-dark/30" : ""
                          }`}
                        >
                          <td className="p-2 font-bold border-r border-bramasta-ink/20">{row.size}</td>
                          <td className="p-2 border-r border-bramasta-ink/20">{row.chest}</td>
                          <td className="p-2 border-r border-bramasta-ink/20">{row.length}</td>
                          <td className="p-2">{row.sleeve}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Fitur Kaos Ringkas */}
              <div>
                <span className="font-bold uppercase tracking-wider block text-xs text-bramasta-accent mb-1">
                  Keunggulan
                </span>
                <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-bramasta-ink-soft leading-[1.55]">
                  {OFFICIAL_TSHIRT.features.map((feat, i) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div className="mt-4 pt-3 border-t-2 border-bramasta-ink flex gap-2.5">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="flex-1 min-h-[48px] flex items-center justify-center gap-1.5 py-2.5 bg-bramasta-accent text-bramasta-accent-on font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-bramasta-accent-hover rounded-md transition-colors shadow-sm text-center focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Pesan via WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={closeModal}
                className="min-h-[48px] px-5 py-2.5 border-2 border-bramasta-ink text-bramasta-ink font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-bramasta-ink hover:text-[#F4F1DC] rounded-md transition-colors cursor-pointer shrink-0 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
