// ─── Prestasi (Achievement) ──────────────────────────────────────────────────

export interface Achievement {
  id: string;
  /** Card title, all-caps */
  title: string;
  /** Supporting subtitle / event name */
  subtitle: string;
  year: string;
  image: string | null;
  imageAlt: string;
  /** Highlight count badge (e.g. "11 Penghargaan") */
  awardCount: string;
  /** Complete list of trophies/awards won in this event */
  trophies: string[];
  /** Full description shown in the detail popup */
  description?: string;
}

export const prestasiList: Achievement[] = [
  {
    id: "lkbb-rumfest-vi",
    title: "JUARA UMUM",
    subtitle: "LKBB RUMFEST VI",
    year: "2026",
    image: "/images/prestasi/lkbb-rumfest-vi/cover.jpeg",
    imageAlt: "Dokumentasi Juara Umum LKBB RUMFEST VI",
    awardCount: "11 Penghargaan",
    trophies: [
      "JUARA UMUM",
      "BEST OF THE BEST LPBB UDAYANA",
      "BEST OF THE BEST PBB",
      "BEST OF THE BEST FORMASI",
      "JUARA UTAMA 1",
      "BEST PBB 1 - BEST VARIASI 1",
      "BEST FORMASI 1",
      "BEST COACH 1",
      "BEST DANTON 1",
      "JUARA HARAPAN 2",
      "BEST ADMINISTRASI 5",
    ],
    description:
      "Pencapaian luar biasa Dwipara Dwisma dalam ajang bergengsi LKBB RUMFEST VI. Memboyong gelar tertinggi Juara Umum beserta 11 kategori penghargaan terbaik yang menjadi bukti disiplin tinggi dan keunggulan teknik seluruh anggota tim.",
  },
  {
    id: "lkbb-visvagatra",
    title: "JUARA UMUM",
    subtitle: "LKBB VISVAGATRA (POLTRADA)",
    year: "2025",
    image: "/images/prestasi/lkbb-visvagatra/cover.jpeg",
    imageAlt: "Dokumentasi Juara Umum LKBB Visvagatra POLTRADA",
    awardCount: "7 Penghargaan",
    trophies: [
      "JUARA UMUM",
      "JUARA UTAMA 1",
      "PBB TERBAIK 1",
      "KOMANDAN PASUKAN TERBAIK 1",
      "KOSTUM DAN MAKEUP TERBAIK 1",
      "VARIASI FORMASI TERBAIK 2",
      "JUARA HARAPAN 2",
    ],
    description:
      "Keberhasilan gemilang Dwipara Dwisma dalam kompetisi LKBB Visvagatra POLTRADA Bali. Tampil solid di seluruh kategori dan sukses mengamankan predikat Juara Umum dengan 7 piala kemenangan.",
  },
  {
    id: "lkbb-pasma",
    title: "JUARA UMUM",
    subtitle: "LKBB PASMA",
    year: "2026",
    image: "/images/prestasi/lkbb-pasma/cover.jpeg",
    imageAlt: "Dokumentasi Juara Umum LKBB PASMA",
    awardCount: "5 Penghargaan",
    trophies: [
      "Juara Umum",
      "Juara Utama I",
      "Variasi Formasi Terbaik I",
      "Pelatih Terbaik I",
      "Danton Terbaik I",
    ],
    description:
      "Performa konsisten dan memukau mengantarkan Dwipara Dwisma merebut gelar Juara Umum di LKBB PASMA. Dominasi penuh ditunjukkan lewat kemenangan Juara Utama I dan penghargaan pelatih serta danton terbaik.",
  },
  {
    id: "lkbb-sapta-2",
    title: "JUARA UTAMA I",
    subtitle: "LKBB SAPTA 2",
    year: "2025",
    image: "/images/prestasi/lkbb-sapta-2/cover.jpeg",
    imageAlt: "Dokumentasi Juara Utama I LKBB SAPTA 2",
    awardCount: "5 Penghargaan",
    trophies: [
      "JUARA UTAMA I",
      "BEST PBB I",
      "BEST VARIASI I",
      "BEST FORMASI I",
      "BEST DANTON I",
    ],
    description:
      "Kemenangan telak di ajang LKBB SAPTA 2 dengan menyapu bersih seluruh kategori utama: Juara Utama I, Best PBB, Best Variasi, Best Formasi, dan Best Danton I.",
  },
];

// Backward compatibility helper if needed
export interface PrestasiSlide {
  featured: Achievement;
  supporting: Achievement[];
}

export const prestasiSlides: PrestasiSlide[] = [
  {
    featured: prestasiList[0],
    supporting: [],
  },
  {
    featured: prestasiList[1],
    supporting: [],
  },
  {
    featured: prestasiList[2],
    supporting: [],
  },
  {
    featured: prestasiList[3],
    supporting: [],
  },
];

// ─── Jejak (Timeline Chapters) ───────────────────────────────────────────────

export type AccentColor = "orange" | "red" | "green";

export interface Chapter {
  num: string;
  year: string;
  title: string;
  /** Short description shown on the landing page preview */
  desc: string;
  /** Full description shown on the dedicated /jejak page */
  fullDesc: string;
  image: string | null;
  imageAlt: string;
  accentColor: AccentColor;
  tags: string[];
}

export const chapters: Chapter[] = [
  {
    num: "01",
    year: "2023",
    title: "LKBB BRAMASTA 1.0",
    desc: "Titik awal mempertemukan pelajar melalui semangat baris-berbaris. Membangun ruang kompetisi positif yang berorientasi pada pembentukan karakter dan identitas.",
    fullDesc:
      "BRAMASTA pertama menjadi titik awal lahirnya sebuah ajang yang mempertemukan para pelajar melalui semangat baris-berbaris. Berangkat dari keinginan untuk menciptakan ruang kompetisi yang positif bagi generasi muda, Paskibra SMAN 2 Mengwi mulai membangun sebuah kegiatan yang tidak hanya berorientasi pada kemenangan, tetapi juga pada pembentukan karakter. Tantangan terbesar bukan sekadar menghadirkan perlombaan, melainkan bagaimana membangun identitas BRAMASTA itu sendiri, mulai dari menyusun konsep, mempersiapkan teknis perlombaan, hingga memastikan seluruh rangkaian kegiatan dapat berjalan dengan baik.",
    image: "/images/bramasta-article-2.jpg",
    imageAlt: "Dokumentasi Penyelenggaraan LKBB Bramasta 1.0",
    accentColor: "green",
    tags: ["TITIK AWAL", "KARAKTER"],
  },
  {
    num: "02",
    year: "2024",
    title: "LKBB BRAMASTA 2.0",
    desc: "Hadir berbekal evaluasi dan pengalaman pertama dengan semangat pembenahan serta pengembangan untuk menghadirkan penyelenggaraan yang lebih matang.",
    fullDesc:
      "Berbekal pengalaman dari penyelenggaraan pertama, BRAMASTA 2.0 hadir dengan semangat untuk melakukan pembenahan dan pengembangan. Evaluasi dari pelaksanaan sebelumnya menjadi modal penting untuk menghadirkan penyelenggaraan yang lebih matang, mempertemukan para pelajar dan insan paskibra dalam suasana kompetitif yang sehat, memperluas persaudaraan antarpelajar, serta memperkuat budaya disiplin dan sportivitas.",
    image: "/images/bramasta-article-3.jpg",
    imageAlt: "Dokumentasi Arena Perlombaan LKBB Bramasta 2.0",
    accentColor: "orange",
    tags: ["PEMBENAHAN", "PENGEMBANGAN"],
  },
  {
    num: "03",
    year: "2025",
    title: "LKBB BRAMASTA 3.0",
    desc: "Melewati tiga penyelenggaraan yang membuktikan bahwa prestasi lahir dari proses panjang. Menjadi panggung bertemunya disiplin, kekompakan, dan perjuangan.",
    fullDesc:
      "Kini, ketika perjalanan BRAMASTA telah melewati tiga penyelenggaraan, ajang ini membuktikan bahwa BRAMASTA bukan sekadar perlombaan baris-berbaris biasa. Ia adalah panggung tempat disiplin bertemu semangat, kekompakan bertemu perjuangan, dan generasi muda membuktikan bahwa prestasi lahir dari proses yang tidak pernah mudah. Pertanyaan yang muncul bukan hanya tentang bagaimana BRAMASTA dimulai, tetapi juga sejauh mana perjalanan dan daya juang tersebut akan terus dilanjutkan.",
    image: "/images/bramasta-hero.jpg",
    imageAlt: "Podium Juara LKBB Bramasta 3.0 bersama Panitia Dwipara Dwisma",
    accentColor: "red",
    tags: ["TIGA EDISI", "DAYA JUANG"],
  },
];
