import Image from "next/image";
import Link from "next/link";

export default function CtaSection() {
  return (
    <section
      id="daftar"
      className="relative flex justify-center px-2 sm:px-4 lg:px-0 py-5 lg:py-12 overflow-hidden scroll-mt-24"
    >
      {/* Outer decorative shapes */}
      {/* Orange swoosh right */}
      <div
        className="absolute right-0 top-4 w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-accent-orange/20 pointer-events-none hidden sm:block"
        style={{ borderRadius: "0 0 0 500px" }}
        aria-hidden="true"
      />
      {/* Red circle left-bottom */}
      <div
        className="absolute -left-20 bottom-20 w-[250px] h-[250px] lg:w-[400px] lg:h-[400px] pointer-events-none rounded-full hidden sm:block"
        style={{ background: "rgba(179,54,60,0.2)" }}
        aria-hidden="true"
      />

      {/* Main bordered CTA box */}
      <div
        className="relative w-[85%] max-w-content border-2 border-primary overflow-hidden"
        style={{ minHeight: "clamp(300px, 40vw, 600px)" }}
      >
        {/* Inner decorative shapes */}
        {/* Orange circle top-right */}
        <div
          className="absolute right-[-80px] top-[-80px] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "rgba(243,154,46,0.3)" }}
          aria-hidden="true"
        />
        {/* Red arc bottom-left */}
        <div
          className="absolute left-[-80px] bottom-[112px] w-[400px] h-[400px] pointer-events-none"
          style={{
            background: "rgba(179,54,60,0.3)",
            borderRadius: "0 400px 0 0",
          }}
          aria-hidden="true"
        />

        {/* Solid green background */}
        <div className="absolute inset-0 bg-primary" aria-hidden="true" />

        {/* Team success image overlay */}
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="/images/cta-team.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-40"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full min-h-[200px] lg:min-h-[467px] flex flex-col items-center justify-center gap-10 sm:gap-12 px-6 sm:px-16 py-16">
          <h2
            className="text-white font-normal uppercase text-center leading-[1]"
            style={{
              fontSize: "clamp(48px, 10vw, 128px)",
              lineHeight: "1",
            }}
          >
            MULAI
            <br />
            CERITAMU!
          </h2>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
    
            <Link
              href="https://wa.me/6288219544105?text=Halo%2C%20saya%20ingin%20mendaftar%20sebagai%20anggota%20Dwipara%20Dwisma."
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-full sm:w-auto flex items-center justify-center gap-3 bg-accent-orange text-primary text-base sm:text-lg uppercase tracking-[0.1em] px-10 sm:px-16 py-6 sm:py-8 font-normal hover:bg-amber-400 transition-colors text-center"
              style={{ boxShadow: "0px 25px 50px -12px rgba(0,0,0,0.25)" }}
            >
              {/* WhatsApp icon */}
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.121 1.535 5.854L.057 23.882a.5.5 0 0 0 .61.61l6.056-1.476A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 0 1-5.031-1.377l-.361-.214-3.733.979.993-3.63-.235-.374A9.865 9.865 0 0 1 2.118 12C2.118 6.533 6.533 2.118 12 2.118S21.882 6.533 21.882 12 17.467 21.882 12 21.882z" />
              </svg>
              DAFTAR SEKARANG
            </Link>

            <Link
              href="https://wa.me/6288219544105?text=Halo%2C%20saya%20ingin%20bertanya%20lebih%20lanjut%20tentang%20Dwipara%20Dwisma."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-3 border-2 border-white text-white text-base sm:text-lg uppercase tracking-[0.1em] px-10 sm:px-16 py-6 sm:py-8 font-normal hover:bg-white/10 transition-colors text-center"
            >
              {/* WhatsApp icon */}
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.121 1.535 5.854L.057 23.882a.5.5 0 0 0 .61.61l6.056-1.476A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 0 1-5.031-1.377l-.361-.214-3.733.979.993-3.63-.235-.374A9.865 9.865 0 0 1 2.118 12C2.118 6.533 6.533 2.118 12 2.118S21.882 6.533 21.882 12 17.467 21.882 12 21.882z" />
              </svg>
              HUBUNGI KAMI
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
