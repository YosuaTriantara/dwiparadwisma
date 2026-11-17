/**
 * Manajemen Penyimpanan State untuk Panduan & Pop-up LKBB Bramasta
 * - Welcome Banner di dwiparadwisma.com menggunakan sessionStorage agar tampil setiap kunjungan (announcement)
 * - Status alur panduan step-by-step di /lkbb-bramasta-4 tetap disimpan di localStorage (zero redundancy)
 */

const STORAGE_KEYS = {
  WELCOME_SESSION_DISMISSED: "dwipara_welcome_bramasta_session_v1",
  TOUR_STATUS: "bramasta_tour_status_v1",
  TOUR_CURRENT_STEP: "bramasta_tour_current_step_v1",
} as const;

export type TourStatus = "not_started" | "active" | "completed" | "dismissed";

/**
 * Memeriksa apakah modal announcement selamat datang sudah ditutup pada sesi kunjungan saat ini.
 * Menggunakan sessionStorage sehingga otomatis tampil kembali pada setiap sesi kunjungan baru.
 */
export function isWelcomeDismissed(): boolean {
  if (typeof window === "undefined") return true;
  try {
    // Bersihkan kunci permanen lama di localStorage jika ada agar announcement tidak terblokir
    if (localStorage.getItem("dwipara_welcome_bramasta_dismissed_v1")) {
      localStorage.removeItem("dwipara_welcome_bramasta_dismissed_v1");
    }
    return sessionStorage.getItem(STORAGE_KEYS.WELCOME_SESSION_DISMISSED) === "true";
  } catch {
    return false;
  }
}

/**
 * Menutup modal selamat datang untuk sesi kunjungan saat ini.
 * Tidak mengubah status panduan perlombaan (tour status) agar alur panduan tetap independen.
 */
export function dismissWelcomeModal(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEYS.WELCOME_SESSION_DISMISSED, "true");
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Memulai tur panduan Bramasta: menutup announcement sesi ini dan mengaktifkan status tur di localStorage.
 */
export function startBramastaTour(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.TOUR_STATUS, "active");
    localStorage.setItem(STORAGE_KEYS.TOUR_CURRENT_STEP, "0");
  } catch {
    // Ignore storage quota errors
  }
}

export function getTourStatus(): TourStatus {
  if (typeof window === "undefined") return "not_started";
  try {
    const val = localStorage.getItem(STORAGE_KEYS.TOUR_STATUS) as TourStatus | null;
    if (val === "active" || val === "completed" || val === "dismissed") {
      return val;
    }
    return "not_started";
  } catch {
    return "not_started";
  }
}

export function setTourStatus(status: TourStatus): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.TOUR_STATUS, status);
  } catch {
    // Ignore storage quota errors
  }
}

export function getCurrentTourStep(): number {
  if (typeof window === "undefined") return 0;
  try {
    const val = localStorage.getItem(STORAGE_KEYS.TOUR_CURRENT_STEP);
    const parsed = val ? parseInt(val, 10) : 0;
    return isNaN(parsed) ? 0 : parsed;
  } catch {
    return 0;
  }
}

export function setCurrentTourStep(step: number): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.TOUR_CURRENT_STEP, step.toString());
  } catch {
    // Ignore storage quota errors
  }
}

export function completeTour(): void {
  setTourStatus("completed");
}

export function dismissTour(): void {
  setTourStatus("dismissed");
}

export function resetTour(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEYS.WELCOME_SESSION_DISMISSED);
    localStorage.removeItem(STORAGE_KEYS.TOUR_STATUS);
    localStorage.removeItem(STORAGE_KEYS.TOUR_CURRENT_STEP);
  } catch {
    // Ignore storage quota errors
  }
}
