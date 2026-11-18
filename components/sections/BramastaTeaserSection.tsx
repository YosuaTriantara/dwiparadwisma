import Image from "next/image";
import Link from "next/link";

export default function BramastaTeaserSection() {
  return (
    <section className="px-4 sm:px-8 lg:px-16 py-6 lg:py-10 scroll-mt-24">
      <div className="max-w-content mx-auto">
        {/* Newspaper Clipping Card (Elemen Kliping Surat Kabar di Landing Page) */}
        <div className="bg-[#D9D3A1] border-2 border-[#141210] p-5 sm:p-8 lg:p-10 shadow-[4px_4px_0px_#141210] relative">
          {/* Tag & Kicker */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#141210] pb-3 mb-5">
            <div className="flex items-center gap-2.5">
              <span className="bg-[#141210] text-[#D9D3A1] text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5">
                COMING SOON
              </span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#3A362B]">
                BRAMASTA 4.0 · 2027
              </span>
            </div>
            <span className="text-xs italic text-[#6B6548] hidden sm:inline">
              Dwipara Present: Barisan Semangat Paskibra Dewata
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Sisi Kiri: Teks & Informasi (7 Kolom) */}
            <div className="lg:col-span-7 flex flex-col gap-2.5">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#0F5257] font-bold">
                KEJUARAAN BARIS-BERBARIS SE-BALI
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#141210] leading-tight">
                LKBB BRAMASTA 4.0
              </h2>
              <p className="text-[#3A362B] text-xs sm:text-sm font-medium italic leading-relaxed">
                &ldquo;Mencari sang pejuang dan sang pemenang.&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-[#3A362B]/90 leading-relaxed mt-1">
                Setelah kesuksesan edisi sebelumnya, Dwipara Dwisma kembali membuka arena kompetisi ketangkasan baris-berbaris bagi jenjang SD, SMP dan SMA/SMK se-Bali (open). Dapatkan informasi resmi mengenai jadwal, dewan juri, kuota slot, dan panduan administrasi.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-3">
                <Link
                  href="/lkbb-bramasta-4"
                  className="w-full sm:w-auto px-6 py-3 bg-[#0F5257] text-[#F4F1DC] font-bold text-xs uppercase tracking-widest hover:bg-[#0B3F43] transition-colors text-center shadow-sm"
                >
                  LIHAT BRAMASTA 4.0 &rarr;
                </Link>
                <Link
                  href="#jejak"
                  className="w-full sm:w-auto px-5 py-3 border-2 border-[#141210] text-[#141210] font-bold text-xs uppercase tracking-widest hover:bg-[#141210] hover:text-[#D9D3A1] transition-colors text-center"
                >
                  Lihat Edisi Sebelumnya
                </Link>
              </div>
            </div>

            {/* Sisi Kanan: Poster Resmi Coming Soon LKBB Bramasta 4.0 (5 Kolom) */}
            <div className="lg:col-span-5 flex justify-center">
              <Link
                href="/lkbb-bramasta-4"
                className="group relative w-full max-w-[320px] sm:max-w-[340px] lg:max-w-full aspect-[766/1024] border-2 border-[#141210] bg-[#141210] overflow-hidden shadow-[4px_4px_0px_#141210] block focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0F5257]"
                title="Lihat detail lengkap LKBB Bramasta 4.0"
              >
                <Image
                  src="/images/coming-soon.jpg"
                  alt="Poster Resmi Coming Soon LKBB Bramasta 4.0 Dwipara Dwisma"
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 340px, 420px"
                  className="object-contain group-hover:scale-[1.02] transition-transform duration-300 ease-out"
                  priority
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
