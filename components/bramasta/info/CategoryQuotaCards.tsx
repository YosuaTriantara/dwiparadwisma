"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NewsRule } from "../ui/NewsRule";
import type { EvoraCategory, EvoraEvent } from "@/types/evora";
import { RegistrationWizardModal } from "../registration/RegistrationWizardModal";

interface CategoryQuotaCardsProps {
  categories: EvoraCategory[];
  event?: EvoraEvent | null;
}

export function CategoryQuotaCards({ categories, event }: CategoryQuotaCardsProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCatForModal, setSelectedCatForModal] = useState<string>("");

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ categoryId?: string }>;
      if (customEvent.detail?.categoryId) {
        setSelectedCatForModal(customEvent.detail.categoryId);
      } else if (categories.length > 0 && !selectedCatForModal) {
        setSelectedCatForModal(categories[0].id);
      }
      setIsModalOpen(true);
    };

    window.addEventListener("open-bramasta-registration", handleOpen);
    return () => {
      window.removeEventListener("open-bramasta-registration", handleOpen);
    };
  }, [categories, selectedCatForModal]);

  const hasCategories = categories && categories.length > 0;

  return (
    <section id="kategori" aria-labelledby="kategori-title" className="scroll-mt-20">
      <div className="bg-paper-light border-2 border-bramasta-ink rounded-md p-4 sm:p-6 shadow-[3px_3px_0px_#141210]">
        {/* Header Section */}
        <div className="text-left sm:text-center mb-3 sm:mb-5">
          <span className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-[0.18em] text-bramasta-accent block">
            KATEGORI PERLOMBAAN
          </span>
          <h2
            id="kategori-title"
            className="font-bodoni font-bold text-[26px] sm:text-[32px] lg:text-[38px] uppercase tracking-tight text-bramasta-ink leading-[1.12] mt-1"
          >
            Kategori & Kuota Tim
          </h2>
          <p className="font-bodoni text-base sm:text-[17px] text-bramasta-ink-soft max-w-xl sm:mx-auto mt-2 leading-[1.65] text-justify sm:text-center hyphens-auto">
            Slot terbatas, pastikan Anda tidak kehabisan kuota
          </p>
        </div>

        <NewsRule variant="std" className="my-3.5" />

        {!hasCategories ? (
          /* Empty State: Kategori belum diisi di EVORA API */
          <div className="bg-paper border border-bramasta-ink/30 rounded-md p-5 text-left sm:text-center">
            <h3 className="font-bodoni font-bold text-xl sm:text-2xl uppercase tracking-[0.02em] text-bramasta-ink leading-[1.2] mb-2">
              COMING SOON
            </h3>
            <p className="font-bodoni text-base text-bramasta-ink-soft max-w-md sm:mx-auto leading-[1.65] text-justify sm:text-center hyphens-auto">
              Pengumuman kategori lomba dan kuota slot tim akan dibuka bersamaan dengan pengumuman resmi panitia.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mt-4">
            {categories.map((cat, idx) => {
              const remaining = Math.max(0, cat.slot_count - cat.slot_taken);
              const percentTaken =
                cat.slot_count > 0
                  ? Math.min(100, Math.round((cat.slot_taken / cat.slot_count) * 100))
                  : 0;
              const isFull = remaining === 0;

              return (
                <div
                  key={cat.id || idx}
                  className="bg-paper border-2 border-bramasta-ink rounded-md p-4 sm:p-5 flex flex-col justify-between relative shadow-xs"
                >
                  <div>
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                      <span className="font-bodoni font-bold text-xs uppercase tracking-wider px-2.5 py-1 bg-bramasta-ink text-[#F4F1DC] rounded-sm lining-nums">
                        Kategori {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`font-bodoni font-bold text-xs uppercase px-2.5 py-1 border border-bramasta-ink rounded-sm lining-nums ${
                          isFull
                            ? "bg-[#9B2C2C] text-[#F4F1DC]"
                            : "bg-paper-light text-bramasta-ink"
                        }`}
                      >
                        {isFull ? "KUOTA PENUH" : `${remaining} SLOT TERSISA`}
                      </span>
                    </div>

                    <h3 className="font-bodoni font-bold text-xl sm:text-2xl uppercase tracking-[0.02em] text-bramasta-ink mb-2 leading-[1.2]">
                      {cat.name}
                    </h3>

                    <NewsRule variant="std" className="my-2.5" />

                    {/* Info Roster & Kuota (Ringkas tanpa duplikasi) */}
                    <div className="font-bodoni text-sm sm:text-base text-bramasta-ink mb-5 lining-nums">
                      <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-0.5 py-2 border-b border-bramasta-ink/20">
                        <span className="text-bramasta-ink-soft">Pasukan:</span>
                        <span className="font-bold text-bramasta-ink">
                          {cat.min_team_members} – {cat.max_team_members} Orang (Danton + Pasukan)
                        </span>
                      </div>

                      <div className="pt-2.5">
                        <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-0.5 mb-2">
                          <span className="text-bramasta-ink-soft">Kuota Terisi:</span>
                          <span className="font-bold text-bramasta-ink">
                            {cat.slot_taken} / {cat.slot_count} Tim ({percentTaken}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-paper-light border border-bramasta-ink rounded-sm overflow-hidden">
                          <div
                            className="h-full bg-bramasta-accent transition-all duration-500"
                            style={{ width: `${percentTaken}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    {isFull ? (
                      <button
                        disabled
                        className="w-full min-h-[48px] py-3.5 bg-paper-dark text-bramasta-ink-mute font-bodoni font-bold text-sm uppercase tracking-[0.1em] border-2 border-bramasta-ink/40 rounded-md cursor-not-allowed"
                      >
                        Pendaftaran Ditutup
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCatForModal(cat.id);
                          setIsModalOpen(true);
                        }}
                        className="w-full min-h-[48px] block text-center py-3.5 px-6 bg-bramasta-accent text-bramasta-accent-on font-bodoni font-bold text-sm uppercase tracking-[0.1em] hover:bg-bramasta-accent-hover transition-all rounded-md shadow-sm cursor-pointer active:translate-y-px focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
                      >
                        Daftar di Kategori Ini &rarr;
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pop-up Wizard Pendaftaran Langsung */}
      <RegistrationWizardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        event={event || null}
        initialCategoryId={selectedCatForModal}
        onSuccess={() => {
          setIsModalOpen(false);
          router.push("/lkbb-bramasta-4/daftar");
        }}
      />
    </section>
  );
}
