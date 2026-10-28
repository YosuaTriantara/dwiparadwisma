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
    <section id="agenda" className="scroll-mt-20">
      <div className="bg-paper-light border-2 border-bramasta-ink rounded-md p-4 sm:p-6 md:p-7 shadow-[3px_3px_0px_#141210]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2 sm:mb-3">
          <div>
            <span className="font-bodoni font-bold text-xs uppercase tracking-widest text-bramasta-ink-mute">
              WARTA AGENDA RESMI KOMPETISI
            </span>
            <h2 className="font-bodoni font-bold text-lg sm:text-xl lg:text-2xl uppercase tracking-tight text-bramasta-ink mt-0.5">
              Linimasa & Jadwal Pelaksanaan
            </h2>
          </div>
          <span className="text-xs sm:text-sm font-bodoni text-bramasta-ink border border-bramasta-ink rounded-sm px-2.5 py-1 uppercase font-bold tracking-wider">
            Jadwal Kegiatan 
          </span>
        </div>

        <NewsRule variant="thin" className="my-2.5" />

        {timelineItems.length === 0 ? (
          <div className="bg-paper border border-bramasta-ink/40 rounded-md p-5 text-center">
            <p className="font-bodoni text-xs sm:text-sm text-bramasta-ink-soft max-w-md mx-auto leading-relaxed">
              Jadwal pelaksanaan belum diatur oleh panitia di sistem EVORA.
            </p>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 ${
              timelineItems.length === 3
                ? "lg:grid-cols-3"
                : timelineItems.length >= 4
                ? "lg:grid-cols-4"
                : "lg:grid-cols-2"
            } gap-4 sm:gap-5`}
          >
            {timelineItems.map((item) => (
              <div
                key={item.stage}
                className="flex flex-col border-2 border-bramasta-ink bg-paper p-4 rounded-md relative shadow-xs"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bodoni font-bold text-xl sm:text-2xl text-bramasta-ink">
                    {item.stage}
                  </span>
                  <span className="text-[11px] font-bodoni font-bold uppercase tracking-wider bg-bramasta-ink text-white px-2.5 py-0.5 rounded-sm">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-bodoni font-bold text-base sm:text-lg uppercase text-bramasta-ink mb-1">
                  {item.title}
                </h3>
                <p className="font-bodoni font-bold text-sm sm:text-base text-bramasta-ink mb-2">
                  {item.dateRange}
                </p>
                <NewsRule variant="thin" className="my-1.5 border-t-bramasta-ink/20" />
                {item.desc && (
                  <p className="font-bodoni text-xs sm:text-sm text-bramasta-ink leading-relaxed mt-1">
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
