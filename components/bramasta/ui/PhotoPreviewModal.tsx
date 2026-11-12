"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

const FOCUS_RING_CLASS =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2";

interface PhotoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  title: string;
  subtitle?: string;
}

export function PhotoPreviewModal({
  isOpen,
  onClose,
  imageUrl,
  title,
  subtitle,
}: PhotoPreviewModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="photo-preview-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-bramasta-ink/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="font-jakarta bg-paper-light border-2 border-bramasta-ink shadow-[0_2px_0_#B5AD73,0_16px_40px_rgba(20,18,16,0.28)] rounded-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="px-4 sm:px-5 pt-3.5 pb-3 bg-paper border-b border-paper-deep flex items-start justify-between gap-3 shrink-0">
          <div className="min-w-0">
            {subtitle && (
              <span className="font-jakarta font-bold text-xs uppercase tracking-[0.14em] text-bramasta-accent block truncate">
                {subtitle}
              </span>
            )}
            <h2
              id="photo-preview-title"
              className="font-bodoni font-bold text-lg sm:text-xl uppercase tracking-tight text-bramasta-ink mt-0.5 leading-tight break-words"
            >
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pratinjau foto"
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center border border-bramasta-ink/50 bg-paper-light text-bramasta-ink hover:bg-bramasta-ink hover:text-bramasta-accent-on rounded-md transition-colors cursor-pointer shrink-0 ${FOCUS_RING_CLASS}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gambar */}
        <div className="flex-1 overflow-auto p-3.5 sm:p-5 bg-paper-dark/35 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[64vh] w-auto max-w-full object-contain rounded-sm border border-paper-deep bg-paper shadow-sm"
          />
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-5 py-3 bg-paper border-t border-paper-deep flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className={`min-h-[44px] px-5 py-2 border border-bramasta-ink/60 bg-paper-light text-bramasta-ink font-semibold text-sm hover:bg-bramasta-ink hover:text-bramasta-accent-on rounded-md transition-colors cursor-pointer ${FOCUS_RING_CLASS}`}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
