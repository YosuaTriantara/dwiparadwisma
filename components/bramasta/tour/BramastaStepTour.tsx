"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Compass,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  BRAMASTA_TOUR_STEPS,
  type TourStep,
} from "@/lib/tour/bramastaTourSteps";
import {
  getTourStatus,
  getCurrentTourStep,
  setCurrentTourStep,
  completeTour,
  dismissTour,
  startBramastaTour,
} from "@/lib/tour/tourStorage";

function BramastaStepTourContent() {
  const searchParams = useSearchParams();

  const [isActive, setIsActive] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const startTourFromBeginning = useCallback(() => {
    startBramastaTour();
    setShowPrompt(false);
    setIsActive(true);
    setCurrentStepIndex(0);
  }, []);

  // Inisialisasi: periksa apakah ada parameter ?tour=start, status localStorage, atau pengunjung pertama
  useEffect(() => {
    setIsMounted(true);
    const tourParam = searchParams ? searchParams.get("tour") : null;
    const status = getTourStatus();

    if (tourParam === "start") {
      startTourFromBeginning();
    } else if (status === "active") {
      setIsActive(true);
      const savedStep = getCurrentTourStep();
      const validStep = Math.min(
        Math.max(0, savedStep),
        BRAMASTA_TOUR_STEPS.length - 1
      );
      setCurrentStepIndex(validStep);
    } else if (status === "not_started") {
      setShowPrompt(true);
    }

    const handleTriggerTour = () => {
      startTourFromBeginning();
    };

    window.addEventListener("start-bramasta-tour", handleTriggerTour);
    return () => {
      window.removeEventListener("start-bramasta-tour", handleTriggerTour);
    };
  }, [searchParams, startTourFromBeginning]);

  // Efek scroll & penyorotan (highlight) target elemen saat step berubah
  useEffect(() => {
    if (!isActive) return;

    const currentStep = BRAMASTA_TOUR_STEPS[currentStepIndex];
    if (!currentStep) return;

    const el = document.getElementById(currentStep.targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });

      const originalOutline = el.style.outline;
      const originalOffset = el.style.outlineOffset;
      const originalShadow = el.style.boxShadow;

      el.style.outline = "3px solid #8b261e";
      el.style.outlineOffset = "6px";
      el.style.boxShadow = "0 0 0 6px rgba(139, 38, 30, 0.25)";
      el.style.transition = "outline 0.3s ease, box-shadow 0.3s ease";

      return () => {
        el.style.outline = originalOutline;
        el.style.outlineOffset = originalOffset;
        el.style.boxShadow = originalShadow;
      };
    }
  }, [isActive, currentStepIndex]);

  const handleNext = useCallback(() => {
    if (currentStepIndex < BRAMASTA_TOUR_STEPS.length - 1) {
      const next = currentStepIndex + 1;
      setCurrentStepIndex(next);
      setCurrentTourStep(next);
    } else {
      completeTour();
      setIsActive(false);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("open-bramasta-registration", { detail: {} })
        );
      }
    }
  }, [currentStepIndex]);

  const handlePrev = useCallback(() => {
    if (currentStepIndex > 0) {
      const prev = currentStepIndex - 1;
      setCurrentStepIndex(prev);
      setCurrentTourStep(prev);
    }
  }, [currentStepIndex]);

  const handleDismiss = useCallback(() => {
    dismissTour();
    setIsActive(false);
    setShowPrompt(false);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isActive && !showPrompt) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
      } else if (isActive && e.key === "ArrowRight") {
        handleNext();
      } else if (isActive && e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, showPrompt, handleNext, handlePrev, handleDismiss]);

  if (!isMounted) return null;

  const currentStep: TourStep = BRAMASTA_TOUR_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === BRAMASTA_TOUR_STEPS.length - 1;

  return (
    <>
      {/* ── 1. Dialog Pilihan Panduan (Mobile Optimized) ── */}
      {showPrompt && !isActive && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tour-prompt-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md max-h-[min(90dvh,540px)] flex flex-col bg-paper-light border-2 border-bramasta-ink rounded-lg shadow-[5px_5px_0px_#141210] p-4 sm:p-6 text-bramasta-ink animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-bramasta-ink/20 shrink-0">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-bramasta-accent shrink-0" />
                <span className="font-bodoni font-bold text-[11px] sm:text-xs uppercase tracking-[0.16em] text-bramasta-accent">
                  Panduan Interaktif
                </span>
              </div>
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Tutup penawaran panduan"
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-paper text-bramasta-ink-soft hover:text-bramasta-ink transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto overscroll-contain flex-1 pr-0.5">
              <h3
                id="tour-prompt-title"
                className="font-bodoni font-bold text-lg sm:text-xl text-bramasta-ink uppercase tracking-tight leading-snug"
              >
                Ingin Dipandu Melihat Informasi & Pendaftaran?
              </h3>

              <p className="font-bodoni text-xs sm:text-[13px] text-bramasta-ink-soft mt-2 leading-[1.6] text-justify hyphens-auto">
                Kami dapat memandu Anda langkah demi langkah melihat linimasa penting, kuota
                kategori lomba, dokumen petunjuk teknis (Juknis), hingga cara melakukan
                pendaftaran tim secara mudah.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-bramasta-ink/15 flex flex-col sm:flex-row gap-2 shrink-0">
              <button
                type="button"
                onClick={startTourFromBeginning}
                className="w-full sm:flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-bramasta-accent text-bramasta-accent-on font-bodoni font-bold text-xs uppercase tracking-wider hover:bg-bramasta-accent-hover transition-colors rounded-md shadow-xs cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-bramasta-ink"
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Ya, Mulai Panduan</span>
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="w-full sm:flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 border-2 border-bramasta-ink text-bramasta-ink font-bodoni font-bold text-xs uppercase tracking-wider hover:bg-bramasta-ink hover:text-paper-light transition-colors rounded-md cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-bramasta-accent"
              >
                <span>Jelajahi Sendiri</span>
              </button>
            </div>

            <p className="font-bodoni text-[10px] sm:text-[11px] text-bramasta-ink-soft text-center mt-2.5 shrink-0">
              Tombol <strong>&ldquo;Panduan&rdquo;</strong> selalu tersedia di navbar dan pojok kanan bawah.
            </p>
          </div>
        </div>
      )}

      {/* ── 2. Controller Spotlight Tur Aktif (Mobile Optimized Floating Bottom Card) ── */}
      {isActive && (
        <div
          role="region"
          aria-label="Panduan Interaktif LKBB Bramasta 4.0"
          className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-5 sm:max-w-md z-50 animate-in slide-in-from-bottom-4 duration-300 pb-[env(safe-area-inset-bottom,0px)]"
        >
          <div className="bg-paper-light border-2 border-bramasta-ink rounded-lg shadow-[4px_4px_0px_#141210] p-3.5 sm:p-5 text-bramasta-ink">
            {/* Header Tur */}
            <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-bramasta-ink/20">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-bramasta-accent animate-pulse shrink-0" />
                <span className="font-bodoni font-bold text-[11px] sm:text-xs uppercase tracking-[0.14em] text-bramasta-accent truncate">
                  {currentStep.badge}
                </span>
              </div>

              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Lewati panduan interaktif"
                className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full hover:bg-paper text-bramasta-ink-soft hover:text-bramasta-ink transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Konten Langkah Saat Ini */}
            <div>
              <h3 className="font-bodoni font-bold text-base sm:text-lg text-bramasta-ink uppercase tracking-tight leading-snug">
                {currentStep.title}
              </h3>
              <p className="font-bodoni text-xs sm:text-[13px] text-bramasta-ink-soft mt-1 leading-[1.55] line-clamp-3 sm:line-clamp-none">
                {currentStep.description}
              </p>
            </div>

            {/* Progress Dots */}
            <div className="flex items-center gap-1.5 my-2.5 sm:my-3">
              {BRAMASTA_TOUR_STEPS.map((step, idx) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    setCurrentTourStep(idx);
                  }}
                  aria-label={`Lompat ke langkah ${idx + 1}`}
                  className={`h-1.5 transition-all rounded-full cursor-pointer ${
                    idx === currentStepIndex
                      ? "w-5 sm:w-6 bg-bramasta-accent"
                      : idx < currentStepIndex
                      ? "w-2 sm:w-2.5 bg-bramasta-ink/60"
                      : "w-2 sm:w-2.5 bg-bramasta-ink/20"
                  }`}
                />
              ))}
            </div>

            {/* Kontrol Navigasi Langkah */}
            <div className="flex items-center justify-between gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={handleDismiss}
                className="text-[11px] sm:text-xs font-bodoni text-bramasta-ink-soft hover:text-bramasta-ink underline underline-offset-4 cursor-pointer min-h-[44px] px-1 flex items-center"
              >
                Lewati
              </button>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStepIndex === 0}
                  aria-label="Langkah sebelumnya"
                  className="min-h-[42px] px-2.5 sm:px-3 inline-flex items-center justify-center border border-bramasta-ink/40 text-bramasta-ink rounded text-[11px] sm:text-xs font-bodoni font-bold uppercase tracking-wider hover:bg-paper disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-0.5" />
                  <span className="hidden xs:inline">Sebelumnya</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="min-h-[42px] px-3.5 sm:px-4 inline-flex items-center justify-center gap-1 bg-bramasta-accent text-bramasta-accent-on rounded text-[11px] sm:text-xs font-bodoni font-bold uppercase tracking-wider hover:bg-bramasta-accent-hover cursor-pointer transition-colors shadow-xs"
                >
                  <span>{isLastStep ? "Daftar Tim" : "Lanjut"}</span>
                  {isLastStep ? (
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. Tombol Mengambang (Floating Action Button) - Mobile & Desktop ── */}
      {!isActive && !showPrompt && (
        <aside
          aria-label="Pusat Bantuan Panduan"
          className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-[env(safe-area-inset-bottom,0px)]"
        >
          <button
            type="button"
            onClick={startTourFromBeginning}
            className="group flex items-center gap-1.5 sm:gap-2 min-h-[44px] px-3 sm:px-4 py-2 sm:py-2.5 bg-paper-light text-bramasta-ink border-2 border-bramasta-ink rounded-full shadow-[3px_3px_0px_#141210] hover:bg-bramasta-ink hover:text-paper-light hover:shadow-[1px_1px_0px_#141210] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-bramasta-accent"
            title="Mulai Panduan Step-by-Step LKBB Bramasta 4.0"
            aria-label="Buka panduan interaktif pendaftaran"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-bramasta-accent text-bramasta-accent-on flex items-center justify-center shrink-0">
              <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <span className="font-bodoni font-bold text-[11px] sm:text-xs uppercase tracking-wider">
              <span className="inline sm:hidden">Panduan</span>
              <span className="hidden sm:inline">Panduan Pendaftaran</span>
            </span>
          </button>
        </aside>
      )}
    </>
  );
}

export function BramastaStepTour() {
  return (
    <Suspense fallback={null}>
      <BramastaStepTourContent />
    </Suspense>
  );
}
