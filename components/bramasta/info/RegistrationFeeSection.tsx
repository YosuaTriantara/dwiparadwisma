"use client";

import React, { useState } from "react";
import { Banknote, Check, Copy, CreditCard } from "lucide-react";
import { NewsRule } from "../ui/NewsRule";
import type { EvoraEvent } from "@/types/evora";

interface RegistrationFeeSectionProps {
  event: EvoraEvent | null;
}

export function RegistrationFeeSection({ event }: RegistrationFeeSectionProps) {
  const [copied, setCopied] = useState(false);

  const feeNumber = Number(event?.registration_fee);
  const hasFeeData = Boolean(event?.is_paid && feeNumber > 0);

  if (!hasFeeData) {
    return null;
  }

  const feeFormatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(feeNumber);

  const accountNumber = event?.payment_info?.account_number || "";

  const handleCopyAccount = () => {
    if (!accountNumber || typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="biaya" aria-labelledby="biaya-title" className="scroll-mt-20">
      <div className="bg-paper-light border-2 border-bramasta-ink rounded-md p-4 sm:p-6 shadow-[3px_3px_0px_#141210]">
        {/* Header Section */}
        <div className="text-left sm:text-center mb-3 sm:mb-5">
          <span className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-[0.18em] text-bramasta-accent block">
            BIAYA PENDAFTARAN
          </span>
          <h2
            id="biaya-title"
            className="font-bodoni font-bold text-[26px] sm:text-[32px] lg:text-[38px] uppercase tracking-tight text-bramasta-ink leading-[1.12] mt-1"
          >
            Biaya Pendaftaran Tim
          </h2>
          <p className="font-bodoni text-base sm:text-[17px] text-bramasta-ink-soft max-w-xl sm:mx-auto mt-2 leading-[1.65] text-justify sm:text-center hyphens-auto">
            Rincian biaya registrasi per tim dan metode pembayaran
          </p>
        </div>

        <NewsRule variant="std" className="my-3.5" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Kartu Kiri: Nominal Biaya */}
          <div className="border-2 border-bramasta-ink bg-paper rounded-md p-4 sm:p-5 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1.5 bg-paper-dark border border-bramasta-ink rounded-sm text-bramasta-ink">
                  <Banknote className="w-4 h-4" />
                </span>
                <h3 className="font-bodoni font-bold text-sm sm:text-base uppercase tracking-[0.06em] text-bramasta-accent">
                  Nominal Biaya per Tim
                </h3>
              </div>

              <p className="font-bodoni font-bold text-3xl sm:text-4xl text-bramasta-ink lining-nums my-2">
                {feeFormatted}
              </p>
            </div>

            <p className="font-bodoni text-base text-bramasta-ink-soft leading-[1.6] text-justify hyphens-auto pt-3 border-t border-bramasta-ink/20 mt-2">
              Berlaku untuk satu tim peserta sesuai kategori perlombaan 
            </p>
          </div>

          {/* Kartu Kanan: Metode & Rekening Pembayaran */}
          <div className="border-2 border-bramasta-ink bg-paper rounded-md p-4 sm:p-5 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1.5 bg-paper-dark border border-bramasta-ink rounded-sm text-bramasta-ink">
                  <CreditCard className="w-4 h-4" />
                </span>
                <h3 className="font-bodoni font-bold text-sm sm:text-base uppercase tracking-[0.06em] text-bramasta-accent">
                  Metode Pembayaran 
                </h3>
              </div>

              <p className="font-bodoni font-bold text-lg sm:text-xl text-bramasta-ink mt-1">
                {event?.payment_method === "manual_transfer"
                  ? "Transfer Bank Manual"
                  : event?.payment_method || "Transfer Resmi Panitia"}
              </p>

              {event?.payment_info?.bank_name && (
                <div className="mt-3 p-3 bg-paper-light border border-bramasta-ink/40 rounded-sm lining-nums">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-bodoni font-bold text-xs uppercase tracking-wider text-bramasta-ink-soft block">
                        {event.payment_info.bank_name}
                      </span>
                      <span className="font-bodoni font-bold text-lg sm:text-xl text-bramasta-ink tracking-wide block">
                        {accountNumber}
                      </span>
                      {event.payment_info.account_holder && (
                        <span className="font-bodoni text-sm text-bramasta-ink-soft block mt-0.5">
                          a.n. {event.payment_info.account_holder}
                        </span>
                      )}
                    </div>

                    {accountNumber && (
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        className="group min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 border border-bramasta-ink bg-paper hover:bg-bramasta-ink hover:text-[#F4F1DC] text-bramasta-ink font-bodoni font-bold text-xs uppercase tracking-wider rounded-md transition-colors cursor-pointer shrink-0 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
                        title="Salin nomor rekening"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 text-[#2F6B3F] group-hover:text-[#F4F1DC]" />
                            <span>Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <p className="font-bodoni text-base text-bramasta-ink-soft leading-[1.6] text-justify hyphens-auto pt-3 border-t border-bramasta-ink/20 mt-3">
              Pastikan simpan bukti pembayaran anda untuk diunggah saat pendaftaran tim 
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
