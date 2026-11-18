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
 * Menentukan status pendaftaran resmi berdasarkan linimasa (timeline) kegiatan event di EVORA.
 * 1. Menelusuri tahapan "registration" pada event.timeline:
 *    - status === "ongoing" -> Pendaftaran Sedang Dibuka (isOpen: true)
 *    - status === "completed" / "closed" -> Pendaftaran Telah Ditutup (isOpen: false)
 *    - status === "upcoming" / lainnya -> Pendaftaran Belum Dibuka / Coming Soon (isOpen: false)
 * 2. Fallback: memeriksa event.registration_status ("registration_open" / "ongoing").
 * 3. Default jika data belum ada atau event null -> Coming Soon (isOpen: false).
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

  if (regItem) {
    const stageStatus = regItem.status?.toLowerCase();
    if (stageStatus === "ongoing") {
      return {
        status: "open",
        isOpen: true,
        label: "Daftar Tim Sekarang",
        badgeText: "PENDAFTARAN DIBUKA",
        headline: "Pendaftaran Resmi Telah Dibuka",
        description:
          regItem.description ||
          "Pendaftaran kontingen LKBB Bramasta 4.0 tingkat SMP & SMA se-Bali sedang dibuka.",
        registrationStage: regItem,
      };
    }

    if (stageStatus === "completed" || stageStatus === "closed") {
      return {
        status: "closed",
        isOpen: false,
        label: "Pendaftaran Ditutup",
        badgeText: "PENDAFTARAN DITUTUP",
        headline: "Pendaftaran Telah Ditutup",
        description:
          regItem.description ||
          "Masa pendaftaran kontingen LKBB Bramasta 4.0 telah resmi berakhir.",
        registrationStage: regItem,
      };
    }

    // Default status tahapan adalah upcoming / coming_soon
    return {
      status: "coming_soon",
      isOpen: false,
      label: "Segera Dibuka",
      badgeText: "COMING SOON",
      headline: "Pendaftaran Akan Segera Dibuka",
      description:
        regItem.description ||
        "Pendaftaran kontingen LKBB Bramasta 4.0 akan dibuka sesuai jadwal linimasa resmi.",
      registrationStage: regItem,
    };
  }

  // 2. Fallback: Periksa event.registration_status jika timeline belum didefinisikan secara granular
  const regStatus = event.registration_status?.toLowerCase();
  if (regStatus === "registration_open" || regStatus === "ongoing") {
    return {
      status: "open",
      isOpen: true,
      label: "Daftar Tim Sekarang",
      badgeText: "PENDAFTARAN DIBUKA",
      headline: "Pendaftaran Resmi Telah Dibuka",
      description: "Pendaftaran kontingen LKBB Bramasta 4.0 tingkat SMP & SMA se-Bali sedang dibuka.",
    };
  }

  if (regStatus === "registration_closed" || regStatus === "completed") {
    return {
      status: "closed",
      isOpen: false,
      label: "Pendaftaran Ditutup",
      badgeText: "PENDAFTARAN DITUTUP",
      headline: "Pendaftaran Telah Ditutup",
      description: "Masa pendaftaran kontingen LKBB Bramasta 4.0 telah resmi berakhir.",
    };
  }

  // 3. Default: Coming soon
  return {
    status: "coming_soon",
    isOpen: false,
    label: "Segera Dibuka",
    badgeText: "COMING SOON",
    headline: "Pendaftaran Akan Segera Dibuka",
    description: "Pendaftaran kontingen LKBB Bramasta 4.0 akan segera dibuka sesuai jadwal linimasa resmi.",
  };
}
