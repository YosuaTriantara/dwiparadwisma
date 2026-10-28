import { evoraRequest, EVORA_EVENT_SLUG } from "./client";
import type { EvoraEvent, EvoraCategory } from "@/types/evora";

/**
 * Mengambil detail event langsung dari EVORA Backend API.
 * Jika event belum terdaftar/belum diatur di EVORA (404), return null (tanpa data dummy).
 */
export async function getEventDetail(
  idOrSlug: string = EVORA_EVENT_SLUG
): Promise<EvoraEvent | null> {
  try {
    const event = await evoraRequest<EvoraEvent>(`/events/${idOrSlug}`);
    return event;
  } catch (err) {
    // Data belum dibuat di EVORA API, kembalikan null agar UI menampilkan status menunggu rilis
    return null;
  }
}

/**
 * Mengambil daftar kategori & sisa kuota lomba langsung dari EVORA Backend API.
 * Jika kategori belum dibuka atau event belum ada, return [] (array kosong).
 */
export async function getEventCategories(
  idOrSlug: string = EVORA_EVENT_SLUG
): Promise<EvoraCategory[]> {
  try {
    const categories = await evoraRequest<EvoraCategory[]>(`/events/${idOrSlug}/categories`);
    return Array.isArray(categories) ? categories : [];
  } catch (err) {
    // Belum ada kategori di EVORA API, kembalikan array kosong
    return [];
  }
}
