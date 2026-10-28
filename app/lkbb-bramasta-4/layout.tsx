import type { Metadata } from "next";
import { fontBlackletter, fontBodoni } from "@/lib/fonts";
import { getEventDetail } from "@/lib/evora/events";
import { BramastaNavbar } from "@/components/bramasta/layout/BramastaNavbar";
import { BramastaFooter } from "@/components/bramasta/layout/BramastaFooter";

export const metadata: Metadata = {
  title: "LKBB Bramasta 4.0 — Lomba Baris-Berbaris Paskibra Bali | Dwipara Dwisma",
  description:
    "Portal resmi LKBB Bramasta 4.0 oleh Dwipara Dwisma (Paskibra SMAN 2 Mengwi). Barisan Semangat Paskibra Dewata: Jadwal agenda, kategori, kuota slot, dewan juri, administrasi berkas, dan pendaftaran tim.",
  keywords: [
    "LKBB Bramasta 4.0",
    "LKBB Bali",
    "Lomba Baris Berbaris Bali",
    "Paskibra SMAN 2 Mengwi",
    "Dwipara Dwisma",
    "EVORA Paskibra",
  ],
  alternates: {
    canonical: "/lkbb-bramasta-4",
  },
};

export default async function BramastaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const event = await getEventDetail();

  return (
    <div
      className={`${fontBlackletter.variable} ${fontBodoni.variable} bg-paper text-bramasta-ink min-h-screen font-bodoni selection:bg-bramasta-accent selection:text-[#F4F1DC] flex flex-col p-0 sm:p-2 md:p-4`}
    >
      {/* Bingkai Ganda Surat Kabar (Dioptimasi: Single Edge di Mobile, Frame Penuh di Tablet/Desktop) */}
      <div className="flex-1 flex flex-col border-y-0 sm:border-2 md:border-[3px] border-bramasta-ink sm:p-1 md:p-1.5 bg-paper max-w-[1200px] mx-auto w-full shadow-none sm:shadow-xl">
        <div className="flex-1 flex flex-col border-0 sm:border border-bramasta-ink bg-paper">
          <BramastaNavbar />
          <main className="flex-1 px-3 sm:px-6 md:px-8 py-3 sm:py-5 md:py-6">
            {children}
          </main>
          <BramastaFooter organizerInfo={event?.organizer_info} />
        </div>
      </div>
    </div>
  );
}
