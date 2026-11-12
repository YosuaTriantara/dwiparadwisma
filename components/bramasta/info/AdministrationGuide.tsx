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

  // Esc key & body lock scroll safely
  useEffect(() => {
    if (!previewDoc) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewDoc(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewDoc]);

  // Normalisasi berkas dari API EVORA, fallback ke dokumen resmi default jika kosong
  const apiDocs = normalizeDocuments(event?.documents);
  const documents = apiDocs.length > 0 ? apiDocs : DEFAULT_DOCUMENTS;

  return (
    <section id="administrasi" aria-labelledby="administrasi-title" className="scroll-mt-20">
      <div className="bg-paper-light border-2 border-bramasta-ink rounded-md p-4 sm:p-6 shadow-[3px_3px_0px_#141210]">
        {/* Header Section */}
        <div className="text-left sm:text-center mb-3 sm:mb-5">
          <span className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-[0.18em] text-bramasta-accent block">
            PEDOMAN PESERTA 
          </span>
          <h2
            id="administrasi-title"
            className="font-bodoni font-bold text-[26px] sm:text-[32px] lg:text-[38px] uppercase tracking-tight text-bramasta-ink leading-[1.12] mt-1"
          >
            Administrasi & Berkas 
          </h2>
          <p className="font-bodoni text-base sm:text-[17px] text-bramasta-ink-soft max-w-xl sm:mx-auto mt-2 leading-[1.65] text-justify sm:text-center hyphens-auto">
            Lihat atau unduh dokumen petunjuk teknis LKBB Bramasta 4.0.
          </p>
        </div>

        <NewsRule variant="std" className="my-3.5" />

        {/* Daftar Berkas & Dokumen Resmi Perlombaan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc, idx) => {
            const isPdf =
              doc.type?.toLowerCase() === "pdf" ||
              doc.url.toLowerCase().includes(".pdf");

            return (
              <div
                key={doc.id || idx}
                className="bg-paper border-2 border-bramasta-ink rounded-md p-4 flex flex-col justify-between shadow-sm relative"
              >
                <div>
                  {/* Header Item Dokumen */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-paper-dark border border-bramasta-ink rounded-sm text-bramasta-ink">
                        <FileText className="w-4 h-4" />
                      </span>
                      <span className="px-2.5 py-0.5 bg-bramasta-ink text-[#F4F1DC] font-bodoni font-bold text-xs uppercase tracking-wider rounded-sm">
                        {isPdf ? "DOKUMEN PDF" : (doc.type?.toUpperCase() || "BERKAS")}
                      </span>
                    </div>
                    {doc.size && (
                      <span className="text-xs sm:text-sm font-bodoni text-bramasta-ink-soft font-bold lining-nums">
                        {doc.size}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bodoni font-bold text-lg sm:text-xl uppercase tracking-[0.02em] text-bramasta-ink leading-[1.25] mt-1.5 mb-2">
                    {doc.title}
                  </h3>

                  {doc.description && (
                    <p className="font-bodoni text-base text-bramasta-ink-soft leading-[1.6] text-justify hyphens-auto mb-3.5 oldstyle-nums">
                      {doc.description}
                    </p>
                  )}
                </div>

                {/* Tombol Aksi: Preview Pop-up (tanpa redirect) & Unduh File */}
                <div className="flex items-center gap-2.5 pt-3 border-t border-bramasta-ink/20 mt-2">
                  {isPdf && doc.url && (
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 px-3 py-2.5 bg-bramasta-ink text-[#F4F1DC] font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-bramasta-ink-soft rounded-md transition-colors shadow-xs cursor-pointer text-center"
                      title="Buka preview dokumen"
                    >
                      <Eye className="w-4 h-4 shrink-0" />
                      <span>Preview</span>
                    </button>
                  )}

                  {doc.url && (
                    <a
                      href={doc.download_url || doc.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`min-h-[44px] flex items-center justify-center gap-1.5 px-3 py-2.5 border-2 border-bramasta-ink text-bramasta-ink bg-paper-light font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-bramasta-ink hover:text-[#F4F1DC] rounded-md transition-colors cursor-pointer text-center ${
                        isPdf ? "flex-1" : "w-full"
                      }`}
                      title="Unduh berkas PDF"
                    >
                      <Download className="w-4 h-4 shrink-0" />
                      <span>Unduh</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── POP-UP MODAL PREVIEW DOKUMEN PDF (RINGKAS & MOBILE-FRIENDLY) ── */}
      {previewDoc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-bramasta-ink/75 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="bg-paper-light border-2 sm:border-[3px] border-bramasta-ink shadow-[4px_4px_0px_#141210] rounded-xl max-w-4xl w-full h-[88vh] sm:h-[90vh] flex flex-col relative animate-in zoom-in-95 duration-150 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal Preview Ringkas */}
            <div className="px-3 py-2 sm:px-4 sm:py-2.5 bg-paper border-b-2 border-bramasta-ink flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <span className="font-bodoni font-bold text-xs uppercase tracking-wider text-bramasta-accent block">
                  DOKUMEN RESMI (PDF)
                </span>
                <h3
                  id="preview-modal-title"
                  className="font-bodoni font-bold text-sm sm:text-base uppercase text-bramasta-ink truncate"
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
                  className="min-w-[44px] min-h-[44px] justify-center p-2 sm:px-3 sm:py-2 border border-bramasta-ink bg-paper hover:bg-bramasta-ink hover:text-[#F4F1DC] rounded-md transition-colors flex items-center gap-1.5 text-xs font-bodoni font-bold uppercase focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
                  title="Unduh file PDF"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Unduh</span>
                </a>

                <a
                  href={previewDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-[44px] min-h-[44px] justify-center p-2 sm:px-3 sm:py-2 border border-bramasta-ink bg-paper hover:bg-bramasta-ink hover:text-[#F4F1DC] rounded-md transition-colors flex items-center gap-1.5 text-xs font-bodoni font-bold uppercase focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
                  title="Buka di tab baru"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">Tab Baru</span>
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 border border-bramasta-ink bg-paper hover:bg-bramasta-ink hover:text-[#F4F1DC] rounded-md transition-colors cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
                  aria-label="Tutup preview"
                  title="Tutup preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Petunjuk khusus browser ponsel apabila PDF tidak dirender inline */}
            <div className="sm:hidden px-3 py-2 bg-paper-dark/60 border-b border-bramasta-ink/25 flex items-center justify-between gap-2 text-xs font-bodoni text-bramasta-ink">
              <span className="leading-snug">
                Pratinjau tidak muncul di ponsel?
              </span>
              <a
                href={previewDoc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-bramasta-accent underline shrink-0 py-1"
              >
                Buka PDF &rarr;
              </a>
            </div>

            {/* Konten PDF Iframe Viewer Maksimal */}
            <div className="flex-1 w-full bg-paper-dark relative overflow-hidden">
              <iframe
                src={`${previewDoc.url}#toolbar=1&navpanes=0`}
                className="w-full h-full border-0 bg-[#F4F1DC]"
                title={previewDoc.title}
              />
            </div>

            {/* Footer Modal Ringkas 1 Baris */}
            <div className="px-3 py-2 sm:px-4 bg-paper border-t-2 border-bramasta-ink flex items-center justify-between gap-2">
              <span className="font-bodoni text-xs sm:text-sm text-bramasta-ink-soft truncate lining-nums">
                {previewDoc.size ? `Ukuran: ${previewDoc.size}` : "Format: PDF Resmi"}
              </span>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="min-h-[44px] px-4 py-2 border border-bramasta-ink bg-bramasta-ink text-[#F4F1DC] font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-bramasta-ink-soft rounded-md transition-colors cursor-pointer shrink-0 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2"
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
