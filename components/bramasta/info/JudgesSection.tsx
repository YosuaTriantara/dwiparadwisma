"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { UserCheck, X } from "lucide-react";
import { NewsRule } from "../ui/NewsRule";
import type { EvoraJudge } from "@/types/evora";

interface JudgesSectionProps {
  judges?: EvoraJudge[];
}

export function JudgesSection({ judges = [] }: JudgesSectionProps) {
  const [selectedJudge, setSelectedJudge] = useState<EvoraJudge | null>(null);

  // Close modal on Escape key & lock scroll safely
  useEffect(() => {
    if (!selectedJudge) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedJudge(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedJudge]);

  return (
    <section id="juri" aria-labelledby="juri-title" className="scroll-mt-20">
      <div className="border-2 border-bramasta-ink bg-paper-light rounded-md p-4 sm:p-6 shadow-[3px_3px_0px_#141210]">
        <div className="text-left sm:text-center mb-3 sm:mb-5">
          <span className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-[0.18em] text-bramasta-accent block">
            SANG PENILAI
          </span>
          <h2
            id="juri-title"
            className="font-bodoni font-bold text-[26px] sm:text-[32px] lg:text-[38px] uppercase tracking-tight text-bramasta-ink leading-[1.12] mt-1"
          >
            Dewan Juri
          </h2>
          <p className="font-bodoni text-base sm:text-[17px] text-bramasta-ink-soft max-w-xl sm:mx-auto mt-2 leading-[1.65] text-justify sm:text-center hyphens-auto">
            Penilaian dipimpin oleh dewan juri profesional yang berkompeten di bidangnya
          </p>
        </div>

        <NewsRule variant="std" className="my-3" />

        {judges.length === 0 ? (
          <div className="bg-paper border border-bramasta-ink/30 rounded-md p-5 text-left sm:text-center">
            <p className="font-bodoni text-base text-bramasta-ink-soft max-w-md sm:mx-auto leading-[1.65] text-justify sm:text-center hyphens-auto">
              Coming Soon
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 mt-4">
            {judges.map((judge) => {
              const photoSrc = judge.avatar_url || judge.photo_url;
              return (
                <button
                  type="button"
                  key={judge.id}
                  onClick={() => setSelectedJudge(judge)}
                  className="bg-paper border-2 border-bramasta-ink rounded-md p-3.5 sm:p-4 flex flex-row sm:flex-col items-center sm:justify-between gap-3.5 sm:gap-0 cursor-pointer hover:shadow-[3px_3px_0px_#141210] transition-all group text-left sm:text-center focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
                  title="Klik untuk melihat foto & informasi lengkap"
                >
                  <div className="flex flex-row sm:flex-col items-center gap-3.5 sm:gap-0 text-left sm:text-center w-full min-w-0">
                    {/* Foto / Avatar Juri */}
                    <div className="relative w-20 h-20 sm:w-28 sm:h-28 border-2 border-bramasta-ink bg-paper-dark rounded-none overflow-hidden sm:mb-3 shadow-xs group-hover:scale-105 transition-transform shrink-0">
                      {photoSrc ? (
                        <Image
                          src={photoSrc}
                          alt={judge.name}
                          fill
                          sizes="(max-width: 640px) 80px, 120px"
                          className="object-cover filter grayscale contrast-105 sepia-[0.35]"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-bramasta-ink/40">
                          <UserCheck className="w-8 h-8 sm:w-10 sm:h-10" />
                          <span className="text-[10px] font-bodoni uppercase tracking-wider mt-1 text-bramasta-ink-soft hidden sm:block">
                            Dewan Juri
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Nama & Role */}
                    <div className="min-w-0 flex-1 sm:w-full">
                      <h3 className="font-bodoni font-bold text-lg uppercase tracking-[0.02em] text-bramasta-ink group-hover:underline leading-[1.2]">
                        {judge.name}
                      </h3>
                      {judge.role && (
                        <span className="text-xs sm:text-sm font-bodoni font-bold uppercase tracking-wider text-bramasta-accent mt-1 block">
                          {judge.role}
                        </span>
                      )}
                      {judge.institution && (
                        <span className="text-sm font-bodoni text-bramasta-ink-soft block mt-0.5">
                          {judge.institution}
                        </span>
                      )}
                      <span className="sm:hidden inline-flex items-center gap-1 text-xs font-bodoni font-bold uppercase tracking-wider text-bramasta-accent mt-2">
                        Lihat Profil &rarr;
                      </span>
                    </div>
                  </div>

                  <div className="hidden sm:block mt-3 pt-2 border-t border-bramasta-ink/20 text-center w-full">
                    <span className="inline-flex items-center justify-center min-h-[36px] gap-1 text-xs sm:text-sm font-bodoni font-bold uppercase tracking-wider text-bramasta-accent group-hover:underline">
                      Lihat Profil Lengkap &rarr;
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Pop-up Modal Detail Juri (Ringkas & Mobile-Friendly) */}
      {selectedJudge && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="judge-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-bramasta-ink/75 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedJudge(null)}
        >
          <div
            className="bg-paper-light border-2 sm:border-[3px] border-bramasta-ink rounded-xl p-4 sm:p-5 shadow-[4px_4px_0px_#141210] max-w-sm sm:max-w-md w-full max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex justify-between items-start gap-3 pb-2.5 border-b-2 border-bramasta-ink">
              <div>
                <span className="font-bodoni font-bold text-xs uppercase tracking-[0.16em] text-bramasta-accent block">
                  PROFIL DEWAN JURI
                </span>
                <h3 id="judge-modal-title" className="font-bodoni font-bold text-xl uppercase text-bramasta-ink leading-[1.2] mt-0.5">
                  {selectedJudge.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJudge(null)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 border border-bramasta-ink hover:bg-bramasta-ink hover:text-[#F4F1DC] rounded-md transition-colors cursor-pointer shrink-0 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
                aria-label="Tutup pop-up"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Konten Modal: Foto & Deskripsi Lengkap Ringkas */}
            <div className="mt-3.5 flex flex-col items-center text-center">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 border-2 border-bramasta-ink rounded-none bg-paper-dark overflow-hidden mb-3 shadow-sm">
                {selectedJudge.avatar_url || selectedJudge.photo_url ? (
                  <Image
                    src={selectedJudge.avatar_url || selectedJudge.photo_url!}
                    alt={selectedJudge.name}
                    fill
                    sizes="150px"
                    className="object-cover filter grayscale contrast-105 sepia-[0.35]"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-bramasta-ink/40">
                    <UserCheck className="w-12 h-12" />
                    <span className="text-[10px] font-bodoni uppercase tracking-wider mt-1 text-bramasta-ink-soft">
                      Dewan Juri
                    </span>
                  </div>
                )}
              </div>

              <h4 className="font-bodoni font-bold text-lg uppercase text-bramasta-ink">
                {selectedJudge.name}
              </h4>
              {selectedJudge.role && (
                <span className="inline-block px-2.5 py-0.5 bg-bramasta-ink text-[#F4F1DC] text-xs font-bodoni font-bold uppercase tracking-wider mt-1 rounded-sm">
                  Penilaian: {selectedJudge.role}
                </span>
              )}
              {selectedJudge.institution && (
                <span className="font-bodoni text-sm text-bramasta-ink-soft block mt-1">
                  {selectedJudge.institution}
                </span>
              )}

              <NewsRule variant="thin" className="my-3 w-full" />

              <div className="text-left w-full font-bodoni text-base text-bramasta-ink leading-[1.65]">
                <span className="font-bold uppercase tracking-wider block text-xs text-bramasta-accent mb-1">
                  Keterangan:
                </span>
                <p className="text-bramasta-ink-soft text-justify hyphens-auto">
                  {selectedJudge.bio && selectedJudge.bio.trim().length > 0
                    ? selectedJudge.bio
                    : "Bertugas memberikan penilaian teknis, ketepatan instruksi danton, serta keserasian baris-berbaris secara objektif dan independen pada ajang LKBB Bramasta 4.0."}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t-2 border-bramasta-ink text-center">
              <button
                type="button"
                onClick={() => setSelectedJudge(null)}
                className="w-full min-h-[48px] py-2.5 border-2 border-bramasta-ink bg-bramasta-ink text-[#F4F1DC] font-bodoni font-bold text-sm uppercase tracking-wider hover:bg-bramasta-ink-soft rounded-md transition-colors shadow-sm cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
