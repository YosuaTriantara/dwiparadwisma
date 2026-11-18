import { evoraRequest, EVORA_EVENT_SLUG } from "./client";
import type { EvoraEvent, EvoraCategory } from "@/types/evora";

/**
 * Mengambil detail event langsung dari EVORA Backend API.
 * Jika slug pertama mengembalikan 404, mencoba slug varian (lkbb-bramasta-40 / lkbb-bramasta-4).
 * Jika event belum terdaftar di EVORA, return null.
 */
export async function getEventDetail(
  idOrSlug: string = EVORA_EVENT_SLUG
): Promise<EvoraEvent | null> {
  const candidates = [idOrSlug, "lkbb-bramasta-40", "lkbb-bramasta-4"].filter(
    (s, idx, arr) => Boolean(s) && arr.indexOf(s) === idx
  );

  for (const slug of candidates) {
    try {
      const event = await evoraRequest<EvoraEvent>(`/events/${slug}`);
      if (event && (event.id || event.name)) {
        return event;
      }
    } catch {
      // Coba kandidat berikutnya
    }
  }
  return null;
}

/**
 * Mengambil daftar kategori & sisa kuota lomba langsung dari EVORA Backend API.
 * Jika kategori belum dibuka atau event belum ada, return [] (array kosong).
 */
export async function getEventCategories(
  idOrSlug: string = EVORA_EVENT_SLUG
): Promise<EvoraCategory[]> {
  const candidates = [idOrSlug, "lkbb-bramasta-40", "lkbb-bramasta-4"].filter(
    (s, idx, arr) => Boolean(s) && arr.indexOf(s) === idx
  );

  for (const slug of candidates) {
    try {
      const categories = await evoraRequest<EvoraCategory[]>(`/events/${slug}/categories`);
      if (Array.isArray(categories) && categories.length > 0) {
        return categories;
      }
    } catch {
      // Coba kandidat berikutnya
    }
  }
  return [];
}
