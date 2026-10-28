import { getEventDetail, getEventCategories } from "@/lib/evora/events";
import { EventMasthead } from "@/components/bramasta/info/EventMasthead";
import { EventDescription } from "@/components/bramasta/info/EventDescription";
import { EventTimeline } from "@/components/bramasta/info/EventTimeline";
import { CategoryQuotaCards } from "@/components/bramasta/info/CategoryQuotaCards";
import { JudgesSection } from "@/components/bramasta/info/JudgesSection";
import { AdministrationGuide } from "@/components/bramasta/info/AdministrationGuide";
import { BramastaMerchandise } from "@/components/bramasta/info/BramastaMerchandise";
import { BramastaCtaSection } from "@/components/bramasta/info/BramastaCtaSection";

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 60;

export default async function BramastaPage() {
  const [event, categories] = await Promise.all([
    getEventDetail(),
    getEventCategories(),
  ]);

  // Structured Data JSON-LD untuk Event (Menggunakan data riil jika ada)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event?.name || "LKBB Bramasta 4.0",
    alternateName: "Barisan Semangat Paskibra Dewata",
    description:
      event?.description ||
      "Lomba Ketangkasan Baris-Berbaris tingkat pelajar se-Bali oleh Dwipara Dwisma SMAN 2 Mengwi.",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    ...(event?.start_date ? { startDate: event.start_date } : {}),
    ...(event?.end_date ? { endDate: event.end_date } : {}),
    location: {
      "@type": "Place",
      name: "SMAN 2 Mengwi",
      address: {
        "@type": "PostalAddress",
        addressRegion: "Bali",
        addressCountry: "ID",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Dwipara Dwisma — Paskibra SMAN 2 Mengwi",
      url: "https://dwiparadwisma.sch.id",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-[1152px] mx-auto flex flex-col gap-2 sm:gap-3">
        {/* Masthead Koran & Hero Utama */}
        <EventMasthead event={event} />

        {/* Laporan Utama & Deskripsi Lomba */}
        <EventDescription event={event} />

        {/* Agenda & Linimasa Pelaksanaan Resmi */}
        <EventTimeline event={event} />

        {/* Kategori Lomba & Alokasi Kuota Slot EVORA (Real data / Empty state) */}
        <CategoryQuotaCards
          categories={categories.length > 0 ? categories : (event?.categories || [])}
          event={event}
        />

        {/* Panel Dewan Juri Resmi */}
        <JudgesSection judges={event?.judges || []} />

        {/* Pedoman Administrasi & Syarat Berkas */}
        <AdministrationGuide event={event} />

        {/* Cenderamata & Merchandise Resmi Lomba (Menggunakan kontak alternatif panitia) */}
        <BramastaMerchandise organizerInfo={event?.organizer_info} />

        {/* Call to Action Pendaftaran Tim (Menggunakan kontak utama panitia) */}
        <BramastaCtaSection organizerInfo={event?.organizer_info} />
      </div>
    </>
  );
}
