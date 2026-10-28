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
    <section id="kategori" className="scroll-mt-20">
      <div className="text-center mb-3 sm:mb-5">
        <span className="font-bodoni font-bold text-xs uppercase tracking-widest text-bramasta-ink-mute">
          KATEGORI PERLOMBAAN 
        </span>
        <h2 className="font-bodoni font-bold text-lg sm:text-xl lg:text-2xl uppercase tracking-tight text-bramasta-ink mt-1">
          Kategori Perlombaan & Kuota Tim
        </h2>
        <p className="font-bodoni text-sm sm:text-base text-bramasta-ink-soft max-w-lg mx-auto mt-1 leading-relaxed">
          Slot tim terbatas, pastikan Anda tidak kehabisan kuota dengan segera melakukan pendaftaran.
        </p>
      </div>

      {!hasCategories ? (
        /* Empty State: Kategori belum diisi di EVORA API */
        <div className="bg-paper-light border-2 border-bramasta-ink rounded-md p-5 sm:p-6 text-center shadow-[3px_3px_0px_#141210]">
          <span className="font-bodoni font-bold text-xs uppercase tracking-widest text-bramasta-ink-mute block mb-1">
            KATEGORI & ALOKASI KUOTA
          </span>
          <h3 className="font-bodoni font-bold text-lg sm:text-xl uppercase tracking-tight text-bramasta-ink mb-1.5">
            COMING SOON
          </h3>
          <p className="font-bodoni text-sm sm:text-base text-bramasta-ink-soft max-w-md mx-auto leading-relaxed">
            Pengumuman kategori lomba dan kuota slot tim akan dibuka bersamaan dengan pengumuman resmi panitia.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {categories.map((cat, idx) => {
            const remaining = Math.max(0, cat.slot_count - cat.slot_taken);
            const percentTaken = Math.min(
              100,
              Math.round((cat.slot_taken / cat.slot_count) * 100)
            );
            const isFull = remaining === 0;

            return (
              <div
                key={cat.id || idx}
                className="bg-paper-light border-2 border-bramasta-ink rounded-md p-4 sm:p-6 flex flex-col justify-between relative shadow-[3px_3px_0px_#141210]"
              >
                <div>
                  <div className="flex justify-between items-start gap-4 mb-2.5">
                    <span className="font-bodoni font-bold text-xs uppercase tracking-wider px-2.5 py-0.5 bg-bramasta-ink text-white rounded-sm">
                      Kategori 0{idx + 1}
                    </span>
                    <span
                      className={`font-bodoni font-bold text-xs uppercase px-2.5 py-0.5 border border-bramasta-ink rounded-sm ${
                        isFull
                          ? "bg-[#9B2C2C] text-white"
                          : "bg-paper text-bramasta-ink font-bold"
                      }`}
                    >
                      {isFull ? "KUOTA PENUH" : `${remaining} SLOT TERSISA`}
                    </span>
                  </div>

                  <h3 className="font-bodoni font-bold text-lg sm:text-xl uppercase text-bramasta-ink mb-2 leading-snug">
                    {cat.name}
                  </h3>

                  <NewsRule variant="thin" className="my-2.5" />

                  {/* Info Roster & Kuota */}
                  <div className="space-y-2 font-bodoni text-xs sm:text-sm text-bramasta-ink mb-5">
                    <div className="flex justify-between py-1.5 border-b border-bramasta-ink/20">
                      <span className="text-bramasta-ink-soft">Personil tim:</span>
                      <span className="font-bold text-bramasta-ink">
                        {cat.min_team_members} – {cat.max_team_members} Orang (Termasuk Danton)
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-bramasta-ink/20">
                      <span className="text-bramasta-ink-soft">Alokasi Total Kuota:</span>
                      <span className="font-bold text-bramasta-ink">
                        {cat.slot_count} Tim Sekolah
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-bramasta-ink/20">
                      <span className="text-bramasta-ink-soft">Slot Terisi Saat Ini:</span>
                      <span className="font-bold text-bramasta-ink">
                        {cat.slot_taken} Tim ({percentTaken}%)
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar Kuota */}
                  <div className="mb-5">
                    <div className="w-full h-2.5 bg-paper border border-bramasta-ink rounded-xs overflow-hidden">
                      <div
                        className="h-full bg-bramasta-accent transition-all duration-500"
                        style={{ width: `${percentTaken}%` }}
                      />
                    </div>
                    <span className="text-xs font-bodoni font-bold text-bramasta-ink mt-1.5 block text-right">
                      Terisi {cat.slot_taken} dari {cat.slot_count} kuota
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div>
                  {isFull ? (
                    <button
                      disabled
                      className="w-full min-h-[48px] py-3.5 bg-paper-dark text-bramasta-ink-mute font-bodoni font-bold text-xs sm:text-sm uppercase tracking-[0.1em] border-2 border-bramasta-ink/40 rounded-md cursor-not-allowed"
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
                      className="w-full min-h-[48px] block text-center py-3.5 px-6 bg-bramasta-accent text-bramasta-accent-on font-bodoni font-bold text-xs sm:text-sm uppercase tracking-[0.1em] hover:bg-bramasta-accent-hover transition-all rounded-md shadow-sm cursor-pointer active:translate-y-px"
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
