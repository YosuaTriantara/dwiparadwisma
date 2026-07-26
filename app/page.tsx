import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import ImmersiveTransition1 from "@/components/sections/ImmersiveTransition1";
import AboutSection from "@/components/sections/AboutSection";
import PrestasiGallery from "@/components/sections/PrestasiGallery";
import ImmersiveTransition2 from "@/components/sections/ImmersiveTransition2";
import JejakTimeline from "@/components/sections/JejakTimeline";
import CtaSection from "@/components/sections/CtaSection";

export default function Home() {
  return (
    <>
      <Navbar />
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
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
