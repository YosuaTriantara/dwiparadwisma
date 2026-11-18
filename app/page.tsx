import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import ImmersiveTransition1 from "@/components/sections/ImmersiveTransition1";
import AboutSection from "@/components/sections/AboutSection";
import PrestasiGallery from "@/components/sections/PrestasiGallery";
import ImmersiveTransition2 from "@/components/sections/ImmersiveTransition2";
import JejakTimeline from "@/components/sections/JejakTimeline";
import BramastaTeaserSection from "@/components/sections/BramastaTeaserSection";
import CtaSection from "@/components/sections/CtaSection";
import { BramastaWelcomeModal } from "@/components/home/BramastaWelcomeModal";
import { getEventDetail } from "@/lib/evora/events";
import { getRegistrationStatus } from "@/lib/evora/status";

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 60;

export default async function Home() {
  const event = await getEventDetail();
  const regStatus = getRegistrationStatus(event);

  return (
    <>
      <Navbar isOpen={regStatus.isOpen} />
      {/* Pop-up Pengumuman Resmi & Panduan Pendaftaran Bramasta untuk Pengunjung Pertama */}
      <BramastaWelcomeModal
        event={event}
        bannerUrl={event?.banner_url}
        eventName={event?.name}
      />
      {/*
        space-y-16 lg:space-y-20 adds consistent gap between every section
        so content never visually bleeds into the adjacent section when scrolling.
        Immersive / full-bleed sections also benefit from this breathing room.
      */}
      <main className="pt-[96px] flex flex-col gap-8 lg:gap-10">
        <Hero />
        <Stats />
        <ImmersiveTransition1 />
        <AboutSection />
        <PrestasiGallery />
        <ImmersiveTransition2 />
        <JejakTimeline />
        <BramastaTeaserSection isOpen={regStatus.isOpen} />
        <CtaSection isOpen={regStatus.isOpen} />
      </main>
      <Footer />
    </>
  );
}
