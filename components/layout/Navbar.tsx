"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "HOME", href: "/#hero" },
  { label: "TENTANG", href: "/#tentang" },
  { label: "PRESTASI", href: "/#prestasi" },
  { label: "JEJAK", href: "/#jejak" },
  { label: "BRAMASTA 4.0", href: "/lkbb-bramasta-4", badge: "SOON" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("HOME");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "tentang", "prestasi", "jejak", "alumni"];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY + 120 >= el.offsetTop) {
          setActive(id === "hero" ? "HOME" : id.toUpperCase());
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-[6px] border-b border-primary/10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/#hero" className="flex-shrink-0" onClick={() => setActive("HOME")}>
          <div className="text-accent-red font-extrabold text-2xl tracking-[-0.05em] uppercase leading-none">
            DWIPARA
          </div>
          <div className="text-primary text-[10px] font-bold tracking-[0.4em] uppercase mt-0.5 hidden sm:block leading-tight">
            PASKIBRA SMAN 2 MENGWI
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-stretch gap-8 xl:gap-10">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.label;
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setActive(link.label)}
                className={`flex items-center gap-1.5 text-xs uppercase tracking-wider transition-colors pb-1 ${
                  isActive
                    ? "text-primary font-black border-b-2 border-primary"
                    : "text-ink/60 hover:text-primary font-medium border-b-2 border-transparent"
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] font-bold bg-ink text-white px-1.5 py-0.5 rounded-full leading-none">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA + Hamburger */}
        <div className="flex items-center gap-4">
          <Link
            href="/#daftar"
            className="hidden sm:block bg-primary text-white text-[12px] uppercase tracking-[0.1em] px-8 py-3 hover:bg-primary-dark transition-colors"
          >
            DAFTAR
          </Link>

          {/* Hamburger */}
          <button
            className="lg:hidden p-2 flex flex-col justify-center items-center gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-ink transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-ink transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-ink transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-96" : "max-h-0"
        } bg-white border-t border-primary/10`}
      >
        <div className="px-4 py-6 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center justify-between text-ink text-sm uppercase tracking-[0.1em] py-3 border-b border-ink/10 hover:text-primary transition-colors"
              onClick={() => {
                setMenuOpen(false);
                setActive(link.label);
              }}
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="text-[10px] font-bold bg-ink text-white px-2 py-0.5 rounded-full">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
          <Link
            href="/#daftar"
            className="block text-center bg-primary text-white text-xs uppercase tracking-[0.1em] px-8 py-3 mt-4 hover:bg-primary-dark transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            DAFTAR
          </Link>
        </div>
      </div>
    </nav>
  );
}
