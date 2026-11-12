"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, LogIn, Menu, ShieldCheck, X } from "lucide-react";
import { isAuthenticated } from "@/lib/evora/auth";
import { EVORA_AUTH_EVENT } from "@/lib/evora/client";

const NAV_LINKS = [
  { href: "/lkbb-bramasta-4#deskripsi", label: "Tentang Lomba", mobileLabel: "Tentang Lomba" },
  { href: "/lkbb-bramasta-4#agenda", label: "Agenda", mobileLabel: "Agenda" },
  { href: "/lkbb-bramasta-4#kategori", label: "Kategori & Kuota", mobileLabel: "Kategori & Kuota Slot" },
  { href: "/lkbb-bramasta-4#juri", label: "Dewan Juri", mobileLabel: "Dewan Juri" },
  { href: "/lkbb-bramasta-4#administrasi", label: "Syarat Berkas", mobileLabel: "Syarat Berkas & Administrasi" },
  { href: "/lkbb-bramasta-4#merchandise", label: "Merchandise", mobileLabel: "Merchandise Resmi" },
];

export function BramastaNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const normalizedPath = pathname?.replace(/\/$/, "") || "";
  const isDaftarPage = normalizedPath === "/lkbb-bramasta-4/daftar";

  useEffect(() => {
    const syncAuth = () => {
      setIsLoggedIn(isAuthenticated());
    };
    syncAuth();

    window.addEventListener(EVORA_AUTH_EVENT, syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener(EVORA_AUTH_EVENT, syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, [pathname]);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const handleDaftarClick = (e: React.MouseEvent) => {
    if (normalizedPath === "/lkbb-bramasta-4") {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("open-bramasta-registration", { detail: {} }));
    }
  };

  if (isDaftarPage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm border-b-4 border-bramasta-ink">
      <div className="max-w-[1152px] mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2 sm:gap-4">
        {/* Sisi Kiri: Tombol Kembali ke Halaman Sebelumnya (Hanya Ikon <-) */}
        <button
          type="button"
          onClick={handleBack}
          className="group flex items-center justify-center min-w-[44px] min-h-[44px] p-2 border border-bramasta-ink/60 bg-paper hover:bg-bramasta-ink hover:text-[#F4F1DC] rounded-sm transition-colors cursor-pointer shrink-0 shadow-xs focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
          aria-label="Kembali ke halaman sebelumnya"
          title="Kembali ke halaman sebelumnya"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
        </button>

        {/* Menu Navigasi Tengah: Satu Baris Penuh Bersih */}
        <nav
          aria-label="Navigasi utama"
          className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs sm:text-sm uppercase tracking-wider font-bodoni font-bold text-bramasta-ink whitespace-nowrap"
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-bramasta-accent transition-colors py-1 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sisi Kanan: Tombol Login / Dashboard & Daftar Tim */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {isLoggedIn ? (
            <Link
              href="/lkbb-bramasta-4/daftar"
              className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-2.5 sm:px-3.5 py-2 border-2 border-bramasta-ink bg-paper text-bramasta-ink font-bodoni font-bold text-xs uppercase tracking-wider hover:bg-bramasta-ink hover:text-[#F4F1DC] rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
              title="Buka Dashboard Kontingen Tim"
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              href="/lkbb-bramasta-4/daftar?mode=login"
              className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-2.5 sm:px-3.5 py-2 border-2 border-bramasta-ink bg-paper text-bramasta-ink font-bodoni font-bold text-xs uppercase tracking-wider hover:bg-bramasta-ink hover:text-[#F4F1DC] rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
              title="Masuk bagi peserta atau tim yang sudah terdaftar"
            >
              <LogIn className="w-4 h-4 shrink-0" />
              <span>Masuk</span>
            </Link>
          )}

          <Link
            href="/lkbb-bramasta-4/daftar"
            onClick={handleDaftarClick}
            className="flex items-center justify-center gap-1.5 min-h-[44px] px-3 sm:px-4 py-2 border-2 border-bramasta-ink bg-bramasta-ink text-[#F4F1DC] font-bodoni font-bold text-xs uppercase tracking-wider hover:bg-bramasta-ink-soft rounded-md transition-colors shadow-sm whitespace-nowrap shrink-0 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
          >
            <span>Daftar</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>

          {/* Tombol Hamburger di Layar Ponsel / Tablet */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex items-center justify-center min-w-[44px] min-h-[44px] p-2 text-bramasta-ink hover:bg-bramasta-ink/10 rounded-sm transition-colors shrink-0 cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menu Drawer Khusus Layar Kecil & Tablet */}
      {mobileOpen && (
        <nav
          aria-label="Navigasi mobile"
          className="lg:hidden bg-paper-light border-t-2 border-bramasta-ink px-4 py-3 flex flex-col gap-1 font-bodoni text-sm uppercase font-bold text-bramasta-ink"
        >
          <Link
            href={isLoggedIn ? "/lkbb-bramasta-4/daftar" : "/lkbb-bramasta-4/daftar?mode=login"}
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between min-h-[44px] py-2.5 px-3 mb-1.5 border-2 border-bramasta-ink bg-paper text-bramasta-ink hover:bg-bramasta-ink hover:text-[#F4F1DC] rounded-md transition-colors"
          >
            <span className="flex items-center gap-2">
              {isLoggedIn ? <ShieldCheck className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              <span>{isLoggedIn ? "Buka Dashboard Tim" : "Masuk Akun Terdaftar"}</span>
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="min-h-[44px] flex items-center py-2 border-b border-bramasta-ink/15 hover:text-bramasta-accent transition-colors"
            >
              {item.mobileLabel}
            </Link>
          ))}

          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              handleBack();
            }}
            className="min-h-[44px] flex items-center gap-2 py-2 text-bramasta-ink font-bold text-left hover:text-bramasta-accent cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Halaman Sebelumnya</span>
          </button>
        </nav>
      )}
    </header>
  );
}
