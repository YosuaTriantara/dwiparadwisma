import type { EvoraEvent, EvoraTimelineItem } from "@/types/evora";

export type RegistrationStatusType = "coming_soon" | "open" | "closed";

export interface RegistrationStatusInfo {
  status: RegistrationStatusType;
  isOpen: boolean;
  label: string;
  badgeText: string;
  headline: string;
  description: string;
  registrationStage?: EvoraTimelineItem | null;
}

/**
 * Menentukan status pendaftaran resmi berdasarkan pengaturan event & linimasa kegiatan di EVORA.
 * 1. Menghormati master status dari penyelenggara (`event.registration_status` === "registration_open" / "ongoing").
 * 2. Menelusuri tahapan pendaftaran di `event.timeline`:
 *    - status === "ongoing" atau tanggal mulai (start_date) sudah tiba -> Pendaftaran Dibuka (isOpen: true)
 *    - status === "completed" / "closed" atau batas akhir terlewati -> Pendaftaran Ditutup (isOpen: false)
 * 3. Default jika belum dimulai -> Coming Soon (isOpen: false).
 */
export function getRegistrationStatus(event?: EvoraEvent | null): RegistrationStatusInfo {
  if (!event) {
    return {
      status: "coming_soon",
      isOpen: false,
      label: "Segera Dibuka",
      badgeText: "COMING SOON",
      headline: "Pendaftaran Akan Segera Dibuka",
      description: "Pendaftaran kontingen LKBB Bramasta 4.0 akan segera dibuka sesuai jadwal linimasa resmi.",
    };
  }

  // 1. Cari tahapan pendaftaran di dalam array timeline
  const regItem = event.timeline?.find((item) => {
    const stage = item.stage?.toLowerCase();
    const title = item.title?.toLowerCase() || "";
    return (
      stage === "registration" ||
      title.includes("daftar") ||
      title.includes("registrasi") ||
      title.includes("registration")
    );
  });

  const regStatus = event.registration_status?.toLowerCase();
  const isMasterOpen = regStatus === "registration_open" || regStatus === "ongoing";
  const isMasterClosed = regStatus === "registration_closed" || regStatus === "completed";

  // Periksa apakah tanggal mulai pendaftaran di timeline sudah tiba
  let isDateReached = false;
  let isDateEnded = false;
  if (regItem?.start_date) {
    try {
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const start = regItem.start_date.split("T")[0];
      if (today >= start) {
        isDateReached = true;
      }
      if (regItem.end_date) {
        const end = regItem.end_date.split("T")[0];
        if (today > end) {
          isDateEnded = true;
        }
      }
    } catch {
      // Abaikan error format tanggal
    }
  }

  const stageStatus = regItem?.status?.toLowerCase();
  const isTimelineOngoing = stageStatus === "ongoing";
  const isTimelineClosed = stageStatus === "completed" || stageStatus === "closed";

  // 1. Jika ditutup (baik secara master atau timeline expired)
  if (isMasterClosed || (isTimelineClosed && !isMasterOpen) || (isDateEnded && !isMasterOpen)) {
    return {
      status: "closed",
      isOpen: false,
      label: "Pendaftaran Ditutup",
      badgeText: "PENDAFTARAN DITUTUP",
      headline: "Pendaftaran Telah Ditutup",
      description:
        regItem?.description ||
        "Masa pendaftaran kontingen LKBB Bramasta 4.0 telah resmi berakhir.",
      registrationStage: regItem,
    };
  }

  // 2. Jika dibuka (Master Open, Timeline Ongoing, atau Tanggal Mulai Sudah Tiba)
  if (isMasterOpen || isTimelineOngoing || isDateReached) {
    return {
      status: "open",
      isOpen: true,
      label: "Daftar Tim Sekarang",
      badgeText: "PENDAFTARAN DIBUKA",
      headline: "Pendaftaran Resmi Telah Dibuka",
      description:
        regItem?.description ||
        "Pendaftaran kontingen LKBB Bramasta 4.0 tingkat SD, SMP & SMA se-Bali sedang dibuka.",
      registrationStage: regItem,
    };
  }

  // 3. Default: Coming soon
  return {
    status: "coming_soon",
    isOpen: false,
    label: "Segera Dibuka",
    badgeText: "COMING SOON",
    headline: "Pendaftaran Akan Segera Dibuka",
    description:
      regItem?.description ||
      "Pendaftaran kontingen LKBB Bramasta 4.0 akan dibuka sesuai jadwal linimasa resmi.",
    registrationStage: regItem,
  };
}
