/**
 * Utility pemformatan kontak panitia EVORA API
 * Mengubah nomor lokal (contoh: 081236345679) menjadi format tautan WhatsApp internasional (6281236345679)
 * dan format tampilan teks yang rapi (+62 812-3634-5679).
 */

export function formatWaNumber(phone?: string | null, fallback = "6281236345679"): string {
  if (!phone) return fallback;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return fallback;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("8")) return `62${digits}`;
  return digits;
}

export function formatDisplayPhone(phone?: string | null, fallback = "+62 812-3634-5679"): string {
  const wa = formatWaNumber(phone, fallback.replace(/\D/g, ""));
  if (wa.startsWith("62") && wa.length >= 11) {
    const prefix = wa.slice(2, 5);
    const mid = wa.slice(5, 9);
    const end = wa.slice(9);
    return `+62 ${prefix}-${mid}-${end}`;
  }
  return `+${wa}`;
}

