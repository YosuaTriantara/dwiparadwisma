import Link from "next/link";

const navLinks = [
  { label: "BERANDA", href: "/#hero" },
  { label: "TENTANG", href: "/#tentang" },
  { label: "PRESTASI", href: "/#prestasi" },
  { label: "JEJAK", href: "/#jejak" },
  { label: "LKBB BRAMASTA 4.0", href: "/lkbb-bramasta-4" },
];

const contactLinks = [
  { label: "INSTAGRAM", href: "https://instagram.com/paskibradwissma" },
  { label: "TIKTOK", href: "https://tiktok.com/@dwipara_" },
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
        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76c-.41 0-.81-.02-1.2-.07z"
        fill="white"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 pt-8 pb-4">
        {/* ── Top row ── */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-8 pb-12 border-b border-white/10">
          {/* Left — Logo + School info */}
          <div className="flex flex-col gap-4 max-w-sm">
            <div>
              <div className="text-accent-red font-extrabold text-2xl tracking-[-0.05em] uppercase leading-none">
                DWIPARA
              </div>
              <div className="text-white/60 text-[10px] font-bold tracking-[0.4em] uppercase mt-0.5">
                PASKIBRA SMAN 2 MENGWI
              </div>
            </div>

            <p className="text-white/60 text-xs leading-5">
              Wadah pengembangan diri melalui kedisiplinan Paskibraka.
              Membentuk generasi berkarakter, tangguh, dan berprestasi sejak
              2003.
            </p>

            <div className="text-white/40 text-[11px] leading-4">
              <p>SMA Negeri 2 Mengwi</p>
              <p>Kabupaten Badung, Bali</p>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-4 pt-1">
              <a
                href="https://instagram.com/paskibradwissma"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="hover:opacity-70 transition-opacity"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://tiktok.com/@dwipara_"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="hover:opacity-70 transition-opacity"
              >
                <TiktokIcon />
              </a>
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
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  className="text-white/80 text-[11px] font-bold uppercase hover:text-accent-orange transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Copyright bar ── */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-white/30 text-[10px] font-bold tracking-[0.1em] uppercase">
            © 2026 DWIPARA DWISMA · Pasukan Bendera SMAN 2 Mengwi
          </p>
        </div>
      </div>
    </footer>
  );
}
