export interface TourStep {
  id: string;
  targetId: string;
  stepNumber: number;
  totalSteps: number;
  badge: string;
  title: string;
  description: string;
  actionLabel?: string;
  targetAnchor: string;
}

export const BRAMASTA_TOUR_STEPS: TourStep[] = [
  {
    id: "deskripsi",
    targetId: "deskripsi",
    stepNumber: 1,
    totalSteps: 5,
    badge: "Langkah 1 dari 5 · Pengenalan",
    title: "Tentang LKBB Bramasta 4.0",
    description:
      "Kenali tema kompetisi, format lomba ketangkasan baris-berbaris, dan rekam jejak prestasi gelaran Bramasta se-Bali.",
    targetAnchor: "#deskripsi",
  },
  {
    id: "agenda",
    targetId: "agenda",
    stepNumber: 2,
    totalSteps: 5,
    badge: "Langkah 2 dari 5 · Linimasa",
    title: "Agenda & Jadwal Penting",
    description:
      "Perhatikan linimasa pendaftaran, jadwal technical meeting (TM), batas administrasi, hingga puncak hari perlombaan.",
    targetAnchor: "#agenda",
  },
  {
    id: "kategori",
    targetId: "kategori",
    stepNumber: 3,
    totalSteps: 5,
    badge: "Langkah 3 dari 5 · Kuota Tim",
    title: "Kategori & Kuota Slot",
    description:
      "Cek kategori tingkat (SMP/MTs atau SMA/SMK/MA) beserta sisa kuota tim yang masih tersedia sebelum kuota terpenuhi.",
    targetAnchor: "#kategori",
  },
  {
    id: "administrasi",
    targetId: "administrasi",
    stepNumber: 4,
    totalSteps: 5,
    badge: "Langkah 4 dari 5 · Juklak & Juknis",
    title: "Pedoman Administrasi & Berkas",
    description:
      "Lihat atau unduh dokumen petunjuk teknis (Juknis) resmi, berkas formulir, dan syarat administrasi kontingen.",
    targetAnchor: "#administrasi",
  },
  {
    id: "pendaftaran",
    targetId: "pendaftaran",
    stepNumber: 5,
    totalSteps: 5,
    badge: "Langkah 5 dari 5 · Pendaftaran",
    title: "Siap Mendaftarkan Pasukan Anda?",
    description:
      "Klik tombol 'Daftar Tim Sekarang' untuk mengisi data kontingen atau login ke dashboard tim Anda. Anda juga dapat menghubungi panitia jika butuh bantuan.",
    actionLabel: "Daftar Tim Sekarang",
    targetAnchor: "#pendaftaran",
  },
];
