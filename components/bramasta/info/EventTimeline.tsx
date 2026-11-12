import React from "react";
import { NewsRule } from "../ui/NewsRule";
import type { EvoraEvent } from "@/types/evora";

interface EventTimelineProps {
  event: EvoraEvent | null;
}

function formatDate(dateString?: string | null): string | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;

  const day = date.getDate().toString().padStart(2, "0");
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export function EventTimeline({ event }: EventTimelineProps) {
  // 1. Jika API mengirimkan event.timeline terstruktur
  let timelineItems: {
    stage: string;
    title: string;
    badge: string;
    dateRange: string;
    desc?: string;
  }[] = [];

  if (event?.timeline && event.timeline.length > 0) {
    timelineItems = event.timeline.map((item, idx) => ({
      stage: String(idx + 1).padStart(2, "0"),
      title: item.title,
      badge: `Tahap ${idx + 1}`,
      dateRange: item.date ? formatDate(item.date) || item.date : "",
      desc: item.description || "",
    }));
  } else {
    // 2. Hanya bangun item yang benar-benar ada nilainya di API (tanpa penambahan dummy/coming soon)
    let step = 1;

    if (event?.registration_start_date) {
      timelineItems.push({
        stage: String(step++).padStart(2, "0"),
        title: "Pembukaan Pendaftaran",
        badge: "Tahap 1",
        dateRange: formatDate(event.registration_start_date)!,
        desc: "Pembukaan pendaftaran akun ketua tim dan reservasi kuota peleton.",
      });
    }

    if (event?.registration_end_date) {
      timelineItems.push({
        stage: String(step++).padStart(2, "0"),
        title: "Batas Akhir Pendaftaran",
        badge: `Tahap ${step - 1}`,
        dateRange: formatDate(event.registration_end_date)!,
        desc: "Batas pengunggahan kelengkapan berkas anggota dan penguncian roster.",
      });
    }

    if (event?.technical_meeting_date) {
      timelineItems.push({
        stage: String(step++).padStart(2, "0"),
        title: "Technical Meeting (TM)",
        badge: `Tahap ${step - 1}`,
        dateRange: formatDate(event.technical_meeting_date)!,
        desc: "Penjelasan petunjuk teknis perlombaan dan pengundian nomor urut tampil.",
      });
    }

    if (event?.start_date) {
      const start = formatDate(event.start_date)!;
      const end = formatDate(event.end_date);
      timelineItems.push({
        stage: String(step++).padStart(2, "0"),
        title: "Hari Perlombaan",
        badge: "Puncak Acara",
        dateRange: end ? `${start} – ${end}` : start,
        desc: "Pelaksanaan lomba ketangkasan baris-berbaris dan penyerahan piala juara.",
      });
    }
  }

  return (
    <section id="agenda" aria-labelledby="agenda-title" className="scroll-mt-20">
      <div className="bg-paper-light border-2 border-bramasta-ink rounded-md p-4 sm:p-6 md:p-7 shadow-[3px_3px_0px_#141210]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2.5 mb-3 sm:mb-4">
          <div>
            <span className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-[0.18em] text-bramasta-accent block">
              WARTA AGENDA RESMI KOMPETISI
            </span>
            <h2
              id="agenda-title"
              className="font-bodoni font-bold text-[26px] sm:text-[32px] lg:text-[38px] uppercase tracking-tight text-bramasta-ink leading-[1.12] mt-1"
            >
             Agenda Penting
            </h2>
          </div>
          <span className="hidden sm:inline-block text-xs font-bodoni text-bramasta-ink bg-paper border border-bramasta-ink rounded-sm px-3 py-1 uppercase font-bold tracking-[0.14em] shrink-0">
            Jadwal Kegiatan
          </span>
        </div>

        <NewsRule variant="std" className="my-3" />

        {timelineItems.length === 0 ? (
          <div className="bg-paper border border-bramasta-ink/40 rounded-md p-5 text-left sm:text-center">
            <p className="font-bodoni text-base text-bramasta-ink-soft max-w-md sm:mx-auto leading-[1.65] text-justify sm:text-center hyphens-auto">
              Jadwal pelaksanaan belum diatur oleh panitia di sistem EVORA.
            </p>
          </div>
        ) : (
          <div
            className={`relative pl-5 border-l-2 border-bramasta-ink space-y-4 sm:space-y-0 sm:pl-0 sm:border-l-0 sm:grid sm:grid-cols-2 ${
              timelineItems.length === 3
                ? "lg:grid-cols-3"
                : timelineItems.length >= 4
                ? "lg:grid-cols-4"
                : "lg:grid-cols-2"
            } sm:gap-5 mt-4`}
          >
            {timelineItems.map((item) => (
              <div
                key={item.stage}
                className="flex flex-col border-2 border-bramasta-ink bg-paper p-4 rounded-md relative shadow-xs"
              >
                {/* Titik penanda timeline vertikal pada tampilan mobile */}
                <span
                  aria-hidden="true"
                  className="sm:hidden absolute -left-[27px] top-5 w-3 h-3 rounded-full bg-bramasta-accent border-2 border-paper-light"
                />

                <div className="flex justify-between items-center mb-2.5">
                  <span className="font-bodoni font-bold text-2xl text-bramasta-ink lining-nums">
                    {item.stage}
                  </span>
                  <span className="text-xs font-bodoni font-bold uppercase tracking-wider bg-bramasta-ink text-[#F4F1DC] px-2.5 py-0.5 rounded-sm lining-nums">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-bodoni font-bold text-xl uppercase tracking-[0.02em] text-bramasta-ink leading-[1.2] mb-1">
                  {item.title}
                </h3>
                <p className="font-bodoni font-bold text-base text-bramasta-accent lining-nums mb-2">
                  {item.dateRange}
                </p>
                <NewsRule variant="thin" className="my-1.5 border-t-bramasta-ink/25" />
                {item.desc && (
                  <p className="font-bodoni text-base text-bramasta-ink-soft leading-[1.6] text-justify hyphens-auto mt-1.5 oldstyle-nums">
                    {item.desc}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
