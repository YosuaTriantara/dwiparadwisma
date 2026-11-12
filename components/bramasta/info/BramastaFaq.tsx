import React from "react";
import { NewsRule } from "../ui/NewsRule";

export function BramastaFaq() {
  const faqs = [
    {
      q: "Bagaimana alur pendaftaran tim di LKBB Bramasta 4.0?",
      a: "Pendaftaran dilakukan secara online. Pertama, ketua tim atau pembina membuat akun peserta (atau login jika sudah memiliki akun). Kedua, pilih kategori lomba (SMP atau SMA) dan daftarkan nama tim serta unggah bukti pembayaran. Ketiga, isi data seluruh anggota peleton (termasuk komandan peleton dan official) dan unggah pas foto seragam. Terakhir, klik 'Kunci & Submit Roster' untuk diverifikasi panitia.",
    },
    {
      q: "Berapa jumlah personil maksimal dalam satu peleton?",
      a: "Untuk kategori SMP/MTs, kuota anggota adalah 13 hingga 16 orang termasuk Danton. Untuk kategori SMA/SMK, kuota adalah 16 hingga 20 orang termasuk Danton. Anda juga dapat menambahkan data pelatih/official pendamping.",
    },
    {
      q: "Apakah satu sekolah boleh mengirimkan lebih dari satu peleton?",
      a: "Boleh, selama kuota slot kategori di sistem EVORA masih tersedia. Setiap peleton harus didaftarkan dengan nama pembeda (misalnya: Paskibra SMAN 2 Mengwi Tim A dan Tim B).",
    },
    {
      q: "Kapan berkas tim dinyatakan sah dan resmi terdaftar?",
      a: "Setelah tombol 'Submit Roster' ditekan, tim berstatus 'roster_submitted'. Panitia verifikator akan memeriksa kesesuaian berkas dan bukti pembayaran dalam waktu 1x24 jam. Jika lolos, status tim akan berubah menjadi 'verified' (Sah) dan nomor undian dapat diakses.",
    },
    {
      q: "Apakah berkas atau foto anggota masih bisa diubah setelah di-submit?",
      a: "Bisa, sebelum panitia mengunci verifikasi final. Anda dapat melakukan 'Unsubmit Roster' di dashboard tim, melakukan perbaikan berkas, lalu menekan submit ulang.",
    },
  ];

  return (
    <section id="faq" aria-labelledby="faq-title" className="my-1 sm:my-2 scroll-mt-20">
      <div className="border-2 border-bramasta-ink bg-paper-light rounded-md p-4 sm:p-6 shadow-[3px_3px_0px_#141210]">
        <div className="text-left sm:text-center mb-3 sm:mb-4">
          <span className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-[0.18em] text-bramasta-accent block">
            PERTANYAAN UMUM PESERTA
          </span>
          <h2
            id="faq-title"
            className="font-bodoni font-bold text-[26px] sm:text-[32px] lg:text-[38px] uppercase tracking-tight text-bramasta-ink leading-[1.12] mt-1"
          >
            Tanya Jawab Teknis Perlombaan
          </h2>
        </div>

        <NewsRule variant="std" className="my-3" />

        <div className="flex flex-col gap-3">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group border-2 border-bramasta-ink bg-paper p-3.5 sm:p-4 rounded-md transition-all duration-200 open:shadow-[2px_2px_0px_#141210]"
            >
              <summary className="flex justify-between items-center min-h-[44px] cursor-pointer font-bodoni font-bold text-base sm:text-lg text-bramasta-ink uppercase tracking-[0.02em] leading-[1.3] list-none select-none">
                <span>{faq.q}</span>
                <span className="text-xl font-bold transition-transform duration-200 group-open:rotate-45 ml-3 shrink-0">
                  +
                </span>
              </summary>
              <div className="mt-2.5 pt-2.5 border-t border-bramasta-ink/20 font-bodoni text-base text-bramasta-ink-soft leading-[1.65] text-justify hyphens-auto oldstyle-nums">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
