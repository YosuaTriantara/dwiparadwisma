import React from "react";
import Image from "next/image";
import type { EvoraEvent } from "@/types/evora";

interface EventDescriptionProps {
  event: EvoraEvent | null;
}

export function EventDescription({ event }: EventDescriptionProps) {
  return (
    <section id="deskripsi" className="scroll-mt-20">
      {/* ── 1. Hero Photo Full-Width (Foto Podium Bramasta 3.0) ── */}
      <div className="w-full border-2 border-bramasta-ink rounded-md bg-paper-dark relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[2.1/1] overflow-hidden mb-6 sm:mb-8 shadow-xs">
        <Image
          src="/images/bramasta-hero.jpg"
          alt="Para Juara LKBB Bramasta berdiri di podium kehormatan bersama panitia Dwipara Dwisma"
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1150px"
          className="object-cover filter grayscale contrast-105 brightness-95 sepia-[0.35]"
        />
      </div>

      {/* ── Warta Resmi jika API EVORA Menyediakan event.description ── */}
      {event?.description && (
        <div className="mb-6 sm:mb-8 p-4 sm:p-5 bg-paper-light border-2 border-bramasta-ink rounded-md shadow-[3px_3px_0px_#141210]">
          <span className="font-bodoni font-bold text-xs uppercase tracking-widest text-bramasta-ink-mute block mb-1">
            WARTA RESMI PANITIA 
          </span>
          <p className="font-bodoni text-sm sm:text-base text-bramasta-ink leading-relaxed text-left lg:text-justify">
            {event.description}
          </p>
        </div>
      )}

      {/* ── 2. Artikel Berita Surat Kabar (Mobile-First: 1 Kolom di Mobile, 2 Kolom di Desktop) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
        {/* ── Kolom Kiri: BRAMASTA - BUKAN SEKEDAR LOMBA BIASA ── */}
        <div className="flex flex-col">
          <h2 className="font-bodoni font-bold text-lg sm:text-xl lg:text-2xl uppercase tracking-wider text-bramasta-ink pb-2 border-b-2 border-bramasta-ink mb-4 sm:mb-5">
            BRAMASTA - BUKAN SEKEDAR LOMBA BIASA
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            {/* Sub-kiri: Foto dokumentasi + Kutipan tebal */}
            <div className="md:col-span-5 flex flex-col gap-2.5">
              <div className="relative aspect-[4/3] border-2 border-bramasta-ink rounded-sm overflow-hidden bg-paper-dark shadow-xs">
                <Image
                  src="/images/bramasta-article-1.jpg"
                  alt="Dokumentasi Penyerahan Piala LKBB Bramasta"
                  fill
                  sizes="(max-width: 768px) 100vw, 260px"
                  className="object-cover filter grayscale contrast-105 brightness-95 sepia-[0.35]"
                />
              </div>
              <p className="font-bodoni font-bold text-sm sm:text-base text-bramasta-ink leading-snug text-left">
                BRAMASTA bukan sekadar perlombaan baris-berbaris. Ia adalah panggung tempat disiplin bertemu semangat, kekompakan bertemu perjuangan, dan generasi muda membuktikan bahwa prestasi lahir dari proses yang tidak pernah mudah.
              </p>
            </div>

            {/* Sub-kanan: 3 Paragraf Narasi Artikel */}
            <div className="md:col-span-7 flex flex-col gap-3 font-bodoni text-sm sm:text-[15px] lg:text-base text-bramasta-ink leading-relaxed text-left lg:text-justify">
              <p>
                Bagi Paskibra SMAN 2 Mengwi, penyelenggaraan BRAMASTA menjadi bagian dari upaya menghadirkan kegiatan yang mampu mempertemukan para pelajar dan insan paskibra dalam suasana kompetitif yang sehat. Ajang ini juga menjadi ruang untuk bertukar pengalaman, memperluas persaudaraan antarpelajar, serta memperkuat budaya disiplin dan sportivitas.
              </p>
              <p>
                Lebih jauh, LKBB BRAMASTA menunjukkan bahwa kegiatan paskibra memiliki peran penting dalam pembentukan karakter pelajar. Latihan yang dilakukan secara berulang mengajarkan arti ketepatan waktu, kepatuhan terhadap instruksi, kekuatan mental, serta pentingnya komunikasi dan kepercayaan dalam sebuah tim.
              </p>
              <p>
                Nama BRAMASTA sendiri diharapkan tidak hanya menjadi identitas sebuah perlombaan, tetapi juga merepresentasikan semangat, keberanian, dan daya juang generasi muda.
              </p>
            </div>
          </div>
        </div>

        {/* ── Kolom Kanan: PERJALANAN LKBB BRAMASTA (Dengan Border Pembatas di Desktop) ── */}
        <div className="flex flex-col lg:border-l lg:border-bramasta-ink/40 lg:pl-8 pt-6 lg:pt-0 border-t lg:border-t-0 border-bramasta-ink/30">
          <h2 className="font-bodoni font-bold text-lg sm:text-xl lg:text-2xl uppercase tracking-wider text-bramasta-ink pb-2 border-b-2 border-bramasta-ink mb-4 sm:mb-5">
            PERJALANAN LKBB BRAMASTA
          </h2>

          {/* Dua Foto Dokumentasi Berjejer */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-3 sm:mb-4">
            <div className="relative aspect-[16/10] border-2 border-bramasta-ink overflow-hidden bg-paper-dark">
              <Image
                src="/images/bramasta-article-2.jpg"
                alt="Dokumentasi Pasukan Paskibra Bramasta"
                fill
                sizes="(max-width: 640px) 50vw, 240px"
                className="object-cover filter grayscale contrast-105 brightness-95 sepia-[0.35]"
              />
            </div>
            <div className="relative aspect-[16/10] border-2 border-bramasta-ink overflow-hidden bg-paper-dark">
              <Image
                src="/images/bramasta-article-3.jpg"
                alt="Dokumentasi Arena Perlombaan Bramasta"
                fill
                sizes="(max-width: 640px) 50vw, 240px"
                className="object-cover filter grayscale contrast-105 brightness-95 sepia-[0.35]"
              />
            </div>
          </div>

          {/* Teks Perjalanan: 1 Kolom di Mobile, 2 Kolom di Layar Lebar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 font-bodoni text-sm sm:text-[15px] lg:text-base text-bramasta-ink leading-relaxed text-justify">
            <div className="flex flex-col gap-3">
              <p>
                BRAMASTA pertama menjadi titik awal lahirnya sebuah ajang yang mempertemukan para pelajar melalui semangat baris-berbaris. Berangkat dari keinginan untuk menciptakan ruang kompetisi yang positif bagi generasi muda, Paskibra SMAN 2 Mengwi mulai membangun sebuah kegiatan yang tidak hanya berorientasi pada kemenangan, tetapi juga pada pembentukan karakter.
              </p>
              <p>
                Tantangan terbesar bukan sekadar menghadirkan perlombaan, melainkan bagaimana membangun identitas BRAMASTA itu sendiri. Setiap proses menjadi pengalaman baru bagi panitia, mulai dari menyusun konsep, mempersiapkan teknis perlombaan, hingga memastikan seluruh rangkaian kegiatan dapat berjalan dengan baik.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p>
                Berbekal pengalaman dari penyelenggaraan pertama, BRAMASTA 2.0 hadir dengan semangat untuk melakukan pembenahan dan pengembangan. Evaluasi dari pelaksanaan sebelumnya menjadi modal penting untuk menghadirkan penyelenggaraan yang lebih matang.
              </p>
              <p>
                Kini, ketika perjalanan BRAMASTA telah melewati tiga penyelenggaraan, pertanyaan yang muncul bukan hanya tentang bagaimana BRAMASTA dimulai, tetapi juga sejauh mana perjalanan tersebut akan terus dilanjutkan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
