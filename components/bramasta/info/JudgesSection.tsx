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

  // Close modal on Escape key & lock scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedJudge(null);
    };

    if (selectedJudge) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedJudge]);

  return (
    <section id="juri" className="scroll-mt-20">
      <div className="border-2 border-bramasta-ink bg-paper-light rounded-md p-4 sm:p-6 shadow-[3px_3px_0px_#141210]">
        <div className="text-center mb-3 sm:mb-5">
          <span className="font-bodoni font-bold text-xs uppercase tracking-widest text-bramasta-ink-mute">
            DEWAN JURI
          </span>
          <h2 className="font-bodoni font-bold text-lg sm:text-xl lg:text-2xl uppercase tracking-tight text-bramasta-ink mt-1">
            Dewan Juri Resmi Perlombaan
          </h2>
          <p className="font-bodoni text-sm sm:text-base text-bramasta-ink-soft max-w-lg mx-auto mt-1 leading-relaxed">
            Penilaian teknis dan kedisiplinan baris-berbaris dipimpin langsung oleh dewan juri kehormatan.
          </p>
        </div>

        <NewsRule variant="thin" className="my-2.5" />

        {judges.length === 0 ? (
          <div className="bg-paper border border-bramasta-ink/30 rounded-md p-5 text-center">
            <p className="font-bodoni text-xs sm:text-sm text-bramasta-ink-soft max-w-md mx-auto leading-relaxed">
              Daftar dewan juri sedang dalam proses konfirmasi panitia di sistem EVORA.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {judges.map((judge) => {
              const photoSrc = judge.avatar_url || judge.photo_url;
              return (
                <div
                  key={judge.id}
                  onClick={() => setSelectedJudge(judge)}
                  className="bg-paper border-2 border-bramasta-ink rounded-md p-4 flex flex-col justify-between cursor-pointer hover:shadow-[3px_3px_0px_#141210] transition-all group"
                  title="Klik untuk melihat foto & informasi lengkap"
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Foto / Avatar Juri */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 border-2 border-bramasta-ink bg-paper-dark rounded-sm overflow-hidden mb-3 shadow-xs group-hover:scale-105 transition-transform">
                      {photoSrc ? (
                        <Image
                          src={photoSrc}
                          alt={judge.name}
                          fill
                          sizes="120px"
                          className="object-cover filter grayscale contrast-105"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-bramasta-ink/40">
                          <UserCheck className="w-10 h-10" />
                          <span className="text-[9px] font-bodoni uppercase tracking-wider mt-1 text-bramasta-ink-mute">
                            Dewan Juri
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Nama & Role */}
                    <h3 className="font-bodoni font-bold text-sm sm:text-base uppercase text-bramasta-ink group-hover:underline leading-snug">
                      {judge.name}
                    </h3>
                    {judge.role && (
                      <span className="text-xs sm:text-sm font-bodoni font-bold uppercase tracking-wider text-bramasta-ink-soft mt-0.5 block">
                        {judge.role}
                      </span>
                    )}
                    {judge.institution && (
                      <span className="text-xs font-bodoni text-bramasta-ink block mt-0.5">
                        {judge.institution}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-bramasta-ink/20 text-center">
                    <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-bodoni font-bold uppercase tracking-wider text-bramasta-ink group-hover:text-bramasta-ink-soft">
                      Lihat Profil Lengkap &rarr;
                    </span>
                  </div>
                </div>
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
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedJudge(null)}
        >
          <div
            className="bg-paper-light border-2 sm:border-3 border-bramasta-ink p-3.5 sm:p-5 shadow-2xl max-w-sm sm:max-w-md w-full max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex justify-between items-start gap-3 pb-2 border-b-2 border-bramasta-ink">
              <div>
                <span className="font-bodoni font-bold text-[11px] sm:text-xs uppercase tracking-wider text-bramasta-ink-mute block">
                  PROFIL DEWAN JURI
                </span>
                <h3 id="judge-modal-title" className="font-bodoni font-bold text-base sm:text-lg uppercase text-bramasta-ink mt-0.5">
                  {selectedJudge.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJudge(null)}
                className="p-1.5 border border-bramasta-ink hover:bg-bramasta-ink hover:text-white transition-colors cursor-pointer shrink-0"
                aria-label="Tutup pop-up"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Konten Modal: Foto & Deskripsi Lengkap Ringkas */}
            <div className="mt-3 flex flex-col items-center text-center">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 border-2 border-bramasta-ink bg-paper-dark overflow-hidden mb-2.5 shadow-sm">
                {selectedJudge.avatar_url || selectedJudge.photo_url ? (
                  <Image
                    src={selectedJudge.avatar_url || selectedJudge.photo_url!}
                    alt={selectedJudge.name}
                    fill
                    priority
                    sizes="150px"
                    className="object-cover filter grayscale contrast-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-bramasta-ink/40">
                    <UserCheck className="w-12 h-12" />
                    <span className="text-[10px] font-bodoni uppercase tracking-wider mt-1 text-bramasta-ink-mute">
                      Dewan Juri
                    </span>
                  </div>
                )}
              </div>

              <h4 className="font-bodoni font-bold text-base uppercase text-bramasta-ink">
                {selectedJudge.name}
              </h4>
              {selectedJudge.role && (
                <span className="inline-block px-2.5 py-0.5 bg-bramasta-ink text-white text-xs font-bodoni font-bold uppercase tracking-wider mt-1">
                  Penilaian: {selectedJudge.role}
                </span>
              )}
              {selectedJudge.institution && (
                <span className="font-bodoni text-xs text-bramasta-ink-soft block mt-0.5">
                  {selectedJudge.institution}
                </span>
              )}

              <NewsRule variant="thin" className="my-2.5 w-full" />

              <div className="text-left w-full font-bodoni text-xs sm:text-sm text-bramasta-ink leading-relaxed">
                <span className="font-bold uppercase tracking-wider block text-xs text-bramasta-ink mb-1">
                  Catatan Penilai:
                </span>
                <p className="text-bramasta-ink-soft">
                  {selectedJudge.bio && selectedJudge.bio.trim().length > 0
                    ? selectedJudge.bio
                    : "Bertugas memberikan penilaian teknis, ketepatan instruksi danton, serta keserasian baris-berbaris secara objektif dan independen pada ajang LKBB Bramasta 4.0."}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t-2 border-bramasta-ink text-center">
              <button
                type="button"
                onClick={() => setSelectedJudge(null)}
                className="w-full py-2.5 border-2 border-bramasta-ink bg-bramasta-ink text-white font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-bramasta-ink/90 transition-colors shadow-sm cursor-pointer"
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
