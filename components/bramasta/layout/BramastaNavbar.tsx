"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Menu, X } from "lucide-react";

export function BramastaNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

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
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm border-b-2 border-bramasta-ink">
      <div className="max-w-[1152px] mx-auto px-2.5 sm:px-6 py-2 flex items-center justify-between gap-2 sm:gap-4">
        {/* Sisi Kiri: Tombol Kembali ke Halaman Sebelumnya (Hanya Ikon <-) */}
        <button
          type="button"
          onClick={handleBack}
          className="group flex items-center justify-center p-1.5 sm:p-2 border border-bramasta-ink/50 bg-paper hover:bg-bramasta-ink hover:text-white transition-colors cursor-pointer shrink-0 shadow-xs"
          aria-label="Kembali ke halaman sebelumnya"
          title="Kembali ke halaman sebelumnya"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-0.5" />
        </button>

        {/* Menu Navigasi Tengah: Satu Baris Penuh Bersih */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-xs sm:text-sm uppercase tracking-wider font-bodoni font-bold text-bramasta-ink whitespace-nowrap">
          <Link href="#deskripsi" className="hover:text-bramasta-ink-soft transition-colors">
            Tentang Lomba
          </Link>
          <Link href="#agenda" className="hover:text-bramasta-ink-soft transition-colors">
            Agenda
          </Link>
          <Link href="#kategori" className="hover:text-bramasta-ink-soft transition-colors">
            Kategori & Kuota
          </Link>
          <Link href="#juri" className="hover:text-bramasta-ink-soft transition-colors">
            Dewan Juri
          </Link>
          <Link href="#administrasi" className="hover:text-bramasta-ink-soft transition-colors">
            Syarat Berkas
          </Link>
          <Link href="#merchandise" className="hover:text-bramasta-ink-soft transition-colors">
            Merchandise
          </Link>
        </nav>

        {/* Sisi Kanan: Tombol Aksi Daftar Tim */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link
            href="/lkbb-bramasta-4/daftar"
            onClick={handleDaftarClick}
            className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-bramasta-ink text-white font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-bramasta-ink/90 transition-colors shadow-sm whitespace-nowrap shrink-0"
          >
            <span>Daftar Tim</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          </Link>

          {/* Tombol Hamburger di Layar Ponsel */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 text-bramasta-ink hover:bg-bramasta-ink/10 transition-colors shrink-0"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menu Drawer Khusus Layar Sangat Kecil */}
      {mobileOpen && (
        <div className="md:hidden bg-paper-light border-t border-bramasta-ink/30 px-5 py-3 flex flex-col gap-2.5 font-bodoni text-sm uppercase font-bold text-bramasta-ink">
          <Link
            href="#deskripsi"
            onClick={() => setMobileOpen(false)}
            className="py-1.5 border-b border-bramasta-ink/10"
          >
            Tentang Lomba
          </Link>
          <Link
            href="#agenda"
            onClick={() => setMobileOpen(false)}
            className="py-1.5 border-b border-bramasta-ink/10"
          >
            Agenda
          </Link>
          <Link
            href="#kategori"
            onClick={() => setMobileOpen(false)}
            className="py-1.5 border-b border-bramasta-ink/10"
          >
            Kategori & Kuota Slot
          </Link>
          <Link
            href="#juri"
            onClick={() => setMobileOpen(false)}
            className="py-1.5 border-b border-bramasta-ink/10"
          >
            Dewan Juri
          </Link>
          <Link
            href="#administrasi"
            onClick={() => setMobileOpen(false)}
            className="py-1.5 border-b border-bramasta-ink/10"
          >
            Syarat Berkas & Administrasi
          </Link>
          <Link
            href="#merchandise"
            onClick={() => setMobileOpen(false)}
            className="py-1.5 border-b border-bramasta-ink/10"
          >
            Merchandise Resmi
          </Link>
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              handleBack();
            }}
            className="flex items-center gap-2 py-2 text-bramasta-ink font-bold text-left hover:text-bramasta-ink-soft cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Halaman Sebelumnya</span>
          </button>
        </div>
      )}
    </header>
  );
}
