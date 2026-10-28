"use client";

import React, { useState, useEffect } from "react";
import { FileText, Download, Eye, X, ExternalLink } from "lucide-react";
import { NewsRule } from "../ui/NewsRule";
import type { EvoraEvent, EvoraDocument } from "@/types/evora";

interface AdministrationGuideProps {
  event: EvoraEvent | null;
}

// Berkas dokumen default resmi jika API belum mengunggah berkas khusus di database
const DEFAULT_DOCUMENTS: EvoraDocument[] = [
  {
    id: "doc-juklak-juknis",
    title: "Petunjuk Teknis (Juknis) & Tata Tertib LKBB Bramasta 4.0",
    url: "/documents/juklak-juknis-bramasta-4.pdf",
    type: "pdf",
    size: "889 KB",
    description:
      "Memuat panduan lengkap ketentuan perlombaan, teknis penilaian PBB & variasi formasi, serta tata tertib kontingen peserta.",
  },
  {
    id: "doc-surat-rekomendasi",
    title: "Format Surat Rekomendasi & Izin Kepala Sekolah",
    url: "/documents/format-surat-rekomendasi.pdf",
    type: "pdf",
    size: "662 KB",
    description:
      "Formulir dispensasi dan rekomendasi resmi kepala sekolah untuk verifikasi keabsahan satuan kontingen peleton.",
  },
];

function normalizeDocuments(rawDocs: any): EvoraDocument[] {
  if (!rawDocs) return [];
  if (Array.isArray(rawDocs)) {
    return rawDocs
      .map((doc, idx) => {
        if (!doc) return null;
        if (typeof doc === "string") {
          const isPdf = doc.toLowerCase().includes(".pdf");
          return {
            id: `doc-${idx}`,
            title: `Dokumen Resmi ${idx + 1}`,
            url: doc,
            type: isPdf ? "pdf" : "doc",
          };
        }
        const url = doc.url || doc.file_url || doc.link || "";
        const isPdf =
          doc.type === "pdf" ||
          doc.type === "application/pdf" ||
          url.toLowerCase().includes(".pdf");
        return {
          id: doc.id || `doc-${idx}`,
          title: doc.title || doc.name || `Dokumen Administrasi ${idx + 1}`,
          url,
          type: isPdf ? "pdf" : doc.type || "doc",
          size: doc.size || "",
          description: doc.description || doc.desc || "",
          download_url: doc.download_url || url,
        };
      })
      .filter(Boolean) as EvoraDocument[];
  }

  if (typeof rawDocs === "object") {
    return Object.entries(rawDocs)
      .map(([key, val], idx) => {
        if (!val) return null;
        if (typeof val === "string") {
          const isPdf = val.toLowerCase().includes(".pdf");
          return {
            id: `doc-${idx}`,
            title: key.replace(/_/g, " ").toUpperCase(),
            url: val,
            type: isPdf ? "pdf" : "doc",
          };
        }
        if (typeof val === "object") {
          const v = val as any;
          const url = v.url || v.file_url || "";
          const isPdf =
            v.type === "pdf" ||
            v.type === "application/pdf" ||
            url.toLowerCase().includes(".pdf");
          return {
            id: v.id || `doc-${idx}`,
            title: v.title || v.name || key.replace(/_/g, " ").toUpperCase(),
            url,
            type: isPdf ? "pdf" : v.type || "doc",
            size: v.size || "",
            description: v.description || "",
            download_url: v.download_url || url,
          };
        }
        return null;
      })
      .filter(Boolean) as EvoraDocument[];
  }

  return [];
}

export function AdministrationGuide({ event }: AdministrationGuideProps) {
  const [previewDoc, setPreviewDoc] = useState<EvoraDocument | null>(null);

  // Esc key & body lock scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewDoc(null);
    };

    if (previewDoc) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewDoc]);

  const feeNumber = Number(event?.registration_fee);
  const hasFeeData = Boolean(event?.is_paid && feeNumber > 0);

  const feeFormatted = hasFeeData
    ? new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(feeNumber)
    : "Bebas Biaya / Belum Diatur";

  // Normalisasi berkas dari API EVORA, fallback ke dokumen resmi default jika kosong
  const apiDocs = normalizeDocuments(event?.documents);
  const documents = apiDocs.length > 0 ? apiDocs : DEFAULT_DOCUMENTS;

  return (
    <section id="administrasi" className="scroll-mt-20">
      <div className="bg-paper-light border-2 border-bramasta-ink rounded-md p-4 sm:p-6 shadow-[3px_3px_0px_#141210]">
        {/* Header Section */}
        <div className="text-center mb-3 sm:mb-5">
          <span className="font-bodoni font-bold text-xs uppercase tracking-widest text-bramasta-ink-mute">
            PEDOMAN PESERTA & SYARAT BERKAS RESMI
          </span>
          <h2 className="font-bodoni font-bold text-lg sm:text-xl lg:text-2xl uppercase tracking-tight text-bramasta-ink mt-1">
            Administrasi, Biaya & Berkas Regulasi
          </h2>
          <p className="font-bodoni text-sm sm:text-base text-bramasta-ink-soft max-w-lg mx-auto mt-1 leading-relaxed">
            Rincian biaya pendaftaran peleton serta dokumen petunjuk teknis perlombaan resmi LKBB Bramasta 4.0.
          </p>
        </div>

        <NewsRule variant="thin" className="my-2.5" />

        {/* 1. Panel Biaya & Metode Pembayaran */}
        {hasFeeData && (
          <div className="border-2 border-bramasta-ink bg-paper rounded-md p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 sm:mb-5 shadow-xs">
            <div>
              <span className="font-bodoni font-semibold text-xs sm:text-sm uppercase tracking-wider text-bramasta-ink-soft block">
                Biaya Pendaftaran per Tim
              </span>
              <span className="font-bodoni font-bold text-2xl sm:text-3xl text-bramasta-ink">
                {feeFormatted}
              </span>
            </div>

            <div className="text-left md:text-right border-t md:border-t-0 md:border-l border-bramasta-ink/30 pt-3 md:pt-0 md:pl-5 w-full md:w-auto">
              <span className="font-bodoni font-semibold text-xs sm:text-sm uppercase tracking-wider text-bramasta-ink-soft block">
                Metode Pembayaran
              </span>
              <span className="font-bodoni font-bold text-sm sm:text-base text-bramasta-ink block">
                {event?.payment_method === "manual_transfer"
                  ? "Transfer Bank Manual"
                  : event?.payment_method || "Transfer Resmi Panitia"}
              </span>
              {event?.payment_info?.bank_name && (
                <span className="font-bodoni font-medium text-xs sm:text-sm text-bramasta-ink block mt-1">
                  {event.payment_info.bank_name}: {event.payment_info.account_number} (a.n. {event.payment_info.account_holder})
                </span>
              )}
            </div>
          </div>
        )}

        {/* 2. Panel Berkas & Dokumen Resmi Perlombaan (Daftar Dokumen dari API) */}
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-2.5">
            <FileText className="w-4 h-4 text-bramasta-ink" />
            <h3 className="font-bodoni font-bold text-sm sm:text-base uppercase tracking-wider text-bramasta-ink">
              Berkas Regulasi & Formulir Pendaftaran Resmi
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {documents.map((doc, idx) => {
              const isPdf =
                doc.type?.toLowerCase() === "pdf" ||
                doc.url.toLowerCase().includes(".pdf");

              return (
                <div
                  key={doc.id || idx}
                  className="bg-paper border-2 border-bramasta-ink p-3.5 sm:p-4 flex flex-col justify-between shadow-sm relative"
                >
                  <div>
                    {/* Header Item Dokumen */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-paper-dark border border-bramasta-ink text-bramasta-ink">
                          <FileText className="w-4 h-4" />
                        </span>
                        <span className="px-2 py-0.5 bg-bramasta-ink text-white font-bodoni font-bold text-xs uppercase tracking-wider">
                          {isPdf ? "DOKUMEN PDF" : (doc.type?.toUpperCase() || "BERKAS")}
                        </span>
                      </div>
                      {doc.size && (
                        <span className="text-xs font-bodoni text-bramasta-ink-mute font-medium">
                          {doc.size}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bodoni font-bold text-sm sm:text-base uppercase text-bramasta-ink leading-snug mt-1 mb-1">
                      {doc.title}
                    </h4>

                    {doc.description && (
                      <p className="font-bodoni text-xs sm:text-sm text-bramasta-ink-soft leading-relaxed mb-3">
                        {doc.description}
                      </p>
                    )}
                  </div>

                  {/* Tombol Aksi: Preview Pop-up (tanpa redirect) & Unduh File */}
                  <div className="flex items-center gap-2 pt-2.5 border-t border-bramasta-ink/20 mt-2">
                    {isPdf && doc.url && (
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-bramasta-ink text-white font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-bramasta-ink/90 transition-colors shadow-xs cursor-pointer text-center"
                        title="Buka preview dokumen"
                      >
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                        <span>Preview</span>
                      </button>
                    )}

                    {doc.url && (
                      <a
                        href={doc.download_url || doc.url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-1.5 px-3 py-2 border-2 border-bramasta-ink text-bramasta-ink bg-paper-light font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-bramasta-ink hover:text-white transition-colors cursor-pointer text-center ${
                          isPdf ? "flex-1" : "w-full"
                        }`}
                        title="Unduh berkas PDF"
                      >
                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                        <span>Unduh</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── POP-UP MODAL PREVIEW DOKUMEN PDF (RINGKAS & MOBILE-FRIENDLY) ── */}
      {previewDoc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="bg-paper-light border-2 sm:border-3 border-bramasta-ink shadow-[4px_4px_0px_#141210] rounded-xl max-w-4xl w-full h-[88vh] sm:h-[90vh] flex flex-col relative animate-in zoom-in-95 duration-150 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal Preview Ringkas */}
            <div className="px-3 py-2 sm:px-4 sm:py-2.5 bg-paper border-b-2 border-bramasta-ink flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <span className="font-bodoni font-bold text-[11px] sm:text-xs uppercase tracking-wider text-bramasta-ink-mute block">
                  DOKUMEN RESMI (PDF)
                </span>
                <h3
                  id="preview-modal-title"
                  className="font-bodoni font-bold text-xs sm:text-base uppercase text-bramasta-ink truncate"
                  title={previewDoc.title}
                >
                  {previewDoc.title}
                </h3>
              </div>

              {/* Action buttons di header */}
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={previewDoc.download_url || previewDoc.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 sm:px-2.5 sm:py-1.5 border border-bramasta-ink bg-paper hover:bg-bramasta-ink hover:text-white transition-colors flex items-center gap-1 text-xs font-bodoni font-bold uppercase"
                  title="Unduh file PDF"
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Unduh</span>
                </a>

                <a
                  href={previewDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 sm:px-2.5 sm:py-1.5 border border-bramasta-ink bg-paper hover:bg-bramasta-ink hover:text-white transition-colors flex items-center gap-1 text-xs font-bodoni font-bold uppercase"
                  title="Buka di tab baru"
                >
                  <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Tab Baru</span>
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 sm:p-2 border border-bramasta-ink bg-paper hover:bg-bramasta-ink hover:text-white transition-colors cursor-pointer"
                  aria-label="Tutup preview"
                  title="Tutup preview"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Konten PDF Iframe Viewer Maksimal */}
            <div className="flex-1 w-full bg-paper-dark relative overflow-hidden">
              <iframe
                src={`${previewDoc.url}#toolbar=1&navpanes=0`}
                className="w-full h-full border-0 bg-white"
                title={previewDoc.title}
              />
            </div>

            {/* Footer Modal Ringkas 1 Baris */}
            <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-paper border-t-2 border-bramasta-ink flex items-center justify-between gap-2">
              <span className="font-bodoni text-xs text-bramasta-ink-mute truncate">
                {previewDoc.size ? `Ukuran: ${previewDoc.size}` : "Format: PDF Resmi"}
              </span>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-1 border border-bramasta-ink bg-bramasta-ink text-white font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-bramasta-ink/90 transition-colors cursor-pointer shrink-0"
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
