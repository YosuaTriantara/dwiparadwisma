import Link from "next/link";

const navLinks = [
  { label: "BERANDA", href: "#hero" },
  { label: "TENTANG", href: "#tentang" },
  { label: "PRESTASI", href: "#prestasi" },
  { label: "ALUMNI", href: "#alumni" },
];

const contactLinks = [
  { label: "INSTAGRAM", href: "#" },
  { label: "YOUTUBE", href: "#" },
  { label: "EMAIL KAMI", href: "mailto:dwipara@sman2mengwi.sch.id" },
];

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        ry="5"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="17.5" cy="6.5" r="1" fill="white" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47a2.78 2.78 0 0 0-1.95 1.95A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"
        fill="white"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-primary border-t-[6px] border-accent-red">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-8 lg:py-10">
        {/* ── Main row ── */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8">
          {/* Left — Brand + Social */}
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-white font-bold text-2xl lg:text-3xl tracking-[-0.05em] uppercase leading-none">
                DWIPARA
              </p>
              <p className="text-white/50 text-[10px] font-bold tracking-[0.35em] uppercase mt-0.5">
                SMA NEGERI 2 MENGWI
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="#"
                aria-label="Instagram"
                className="hover:opacity-70 transition-opacity"
              >
                <InstagramIcon />
              </Link>
              <Link
                href="#"
                aria-label="Youtube"
                className="hover:opacity-70 transition-opacity"
              >
                <YoutubeIcon />
              </Link>
              <Link
                href="#"
                aria-label="TikTok"
                className="hover:opacity-70 transition-opacity"
              >
                <TiktokIcon />
              </Link>
            </div>
          </div>

          {/* Centre — Tagline (hidden on small mobile) */}
          <p className="hidden sm:block text-white/40 text-xs leading-5 uppercase tracking-wider lg:self-center">
            Membangun Karakter,
            <br />
            Mengukir Prestasi
          </p>

          {/* Right — Nav + Contact columns */}
          <div className="flex gap-8 sm:gap-12">
            <div className="flex flex-col gap-3">
              <span className="text-accent-orange text-[10px] tracking-[0.25em] uppercase">
                NAVIGASI
              </span>
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-white/80 text-[11px] font-bold uppercase hover:text-accent-orange transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-accent-orange text-[10px] tracking-[0.25em] uppercase">
                KONTAK
              </span>
              {contactLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-white/80 text-[11px] font-bold uppercase hover:text-accent-orange transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Copyright bar ── */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-white/30 text-[10px] font-bold tracking-[0.1em] uppercase">
            © 2026 DWIPARA DWISMA · @yosua_triantara
          </p>
        </div>
      </div>
    </footer>
  );
}
