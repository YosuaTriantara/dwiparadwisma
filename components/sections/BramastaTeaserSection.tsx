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
                EDISI RESMI KE-IV · 2027
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
                &ldquo;Mencari sang pejuang dan sang pemenang — panggung pembuktian ketegasan formasi dan wibawa komando Paskibra terbaik Bali.&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-[#3A362B]/90 leading-relaxed mt-1">
                Setelah kesuksesan edisi sebelumnya, Dwipara Dwisma kembali membuka arena kompetisi ketangkasan baris-berbaris bagi jenjang SMP dan SMA/SMK se-Bali. Dapatkan informasi resmi mengenai jadwal, dewan juri, kuota slot, dan panduan administrasi.
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

            {/* Sisi Kanan: Foto Sepia Podium Bramasta (5 Kolom) */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] border-2 border-[#141210] bg-[#C9C28A] overflow-hidden shadow-[2px_2px_0px_#141210]">
                <Image
                  src="/images/bpc2026.jpg"
                  alt="Dokumentasi LKBB Bramasta Dwipara"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover filter grayscale contrast-105 brightness-95 sepia-[0.35]"
                />
              </div>
              <span className="block text-right text-[10px] text-[#6B6548] italic mt-1.5">
                Dokumentasi: Gelora Kejuaraan LKBB Bramasta Dwipara
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
