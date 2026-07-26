import Image from "next/image";

function DisciplineIcon() {
  return (
    <svg
      width="16"
      height="20"
      viewBox="0 0 16 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 0L0 4V10C0 15.55 3.84 20.74 8 22C12.16 20.74 16 15.55 16 10V4L8 0Z"
        fill="white"
      />
    </svg>
  );
}

function SynergyIcon() {
  return (
    <svg
      width="24"
      height="12"
      viewBox="0 0 24 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0 6C0 2.69 2.69 0 6 0H18C21.31 0 24 2.69 24 6C24 9.31 21.31 12 18 12H6C2.69 12 0 9.31 0 6Z"
        fill="white"
      />
    </svg>
  );
}

export default function AboutSection() {
  return (
    <section
      id="tentang"
      className="relative px-4 sm:px-8 lg:px-16 py-4 scroll-mt-24"
    >
      <div className="max-w-content mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-start">
          {/* ── Left — Text (col span 6) ── */}
          <div className="lg:col-span-6 relative flex flex-col justify-center lg:py-[48px]">
            {/* Decorative red circle */}
            <div
              className="absolute -left-20 -top-20 w-[384px] h-[384px] rounded-full pointer-events-none hidden lg:block"
              style={{ background: "rgba(179,54,60,0.05)" }}
              aria-hidden="true"
            />

            <div className="relative z-10 pb-4 lg:pb-5">
              <h2
                className="text-primary uppercase font-normal"
                style={{
                  fontSize: "clamp(32px, 4.7vw, 60px)",
                  lineHeight: "1",
                }}
              >
                mengenal&nbsp;&nbsp;&nbsp;
                <br />
                <span className="text-accent-red">Dwipara.</span>
              </h2>
            </div>

            <div className="relative z-10 max-w-[512px] pb-6 lg:pb-8">
              <p className="text-primary/70 text-base leading-6">
                Dwipara Dwisma adalah unit Paskibraka kebanggaan SMA Negeri 2
                Mengwi, Bali. Kami hadir sebagai wadah pengembangan diri,
                membentuk generasi yang disiplin, kompak, dan siap mengharumkan
                nama sekolah maupun daerah melalui berbagai kompetisi dan
                kegiatan resmi Paskibraka.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-8">
              {/* Disiplin */}
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 bg-primary flex items-center justify-center flex-shrink-0">
                  <DisciplineIcon />
                </div>
                <div className="pt-3 border-t border-t-primary/20">
                  <h3 className="text-primary text-[12px] font-normal tracking-[0.1em] uppercase mb-2">
                    DISIPLIN
                  </h3>
                  <p className="text-primary/60 text-[14px] leading-5 max-w-[180px]">
                    Konsistensi sebagai fondasi utama setiap langkah.
                  </p>
                </div>
              </div>

              {/* Sinergi Tim */}
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 bg-accent-orange flex items-center justify-center flex-shrink-0">
                  <SynergyIcon />
                </div>
                <div className="pt-3 border-t border-t-primary/20">
                  <h3 className="text-primary text-[12px] font-normal tracking-[0.1em] uppercase mb-2">
                    SINERGI TIM
                  </h3>
                  <p className="text-primary/60 text-[14px] leading-5 max-w-[180px]">
                    Kekuatan kolektif dalam keselarasan gerak dan hati.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right — Images (col span 6) ──
              Each image container uses aspect-ratio so photos show at their
              natural proportions without being clipped by overflow-hidden.
              about-large.png  → 548×1200 (tall portrait, ratio ≈ 1:2.19)
              about-small-*.png → 548×584  (near-square, ratio ≈ 1:1.07)
          ── */}
          <div className="lg:col-span-6">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Large portrait image (green border) */}
              <div className="sm:flex-1 border border-primary">
                <div
                  className="relative w-full"
                  style={{ aspectRatio: "548 / 1200" }}
                >
                  <Image
                    src="/images/about-large.png"
                    alt="Anggota Dwipara Dwisma dalam kegiatan"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Stack of 2 near-square images */}
              <div className="flex flex-row sm:flex-col gap-3 sm:flex-1">
                {/* Top image (orange border) */}
                <div className="flex-1 sm:flex-none border border-accent-orange">
                  <div
                    className="relative w-full"
                    style={{ aspectRatio: "548 / 584" }}
                  >
                    <Image
                      src="/images/about-small-1.png"
                      alt="Kegiatan Dwipara Dwisma"
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Bottom image (red border) */}
                <div className="flex-1 sm:flex-none border border-accent-red">
                  <div
                    className="relative w-full"
                    style={{ aspectRatio: "548 / 584" }}
                  >
                    <Image
                      src="/images/about-small-2.png"
                      alt="Latihan Paskibraka"
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
