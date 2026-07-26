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
  /** Full description shown in the detail popup */
  description?: string;
}

export interface PrestasiSlide {
  /** The large 7-col featured card */
  featured: Achievement;
  /** Up to 2 small supporting cards (5-col stack) */
  supporting: Achievement[];
}

export const prestasiSlides: PrestasiSlide[] = [
  {
    featured: {
      id: "p1",
      title: "JUARA UTAMA I LKBB PPI BALI",
      subtitle: "Lomba Ketangkasan Baris Berbaris Pelajar se-Bali",
      year: "2026",
      image: "/images/ppibali.jpg",
      imageAlt: "Juara Utama I LKBB PPI Bali 2026",
      description:
        "Dwipara Dwisma berhasil meraih predikat Juara Umum dalam ajang Lomba Ketangkasan Baris-Berbaris Pelajar Indonesia (PPI) tingkat Bali — pencapaian prestisius yang mencerminkan kualitas latihan intensif dan dedikasi tanpa batas seluruh anggota selama berbulan-bulan.",
    },
    supporting: [
      {
        id: "p2",
        title: "JUARA ....",
        subtitle: "Badung Paskibra Competition 2026",
        year: "2026",
        image: "/images/bpc2026.jpg",
        imageAlt: "Juara Utama I",
        description:
          "Penghargaan Best Variasi diraih berkat kreativitas dan kekompakan tim dalam menampilkan formasi variasi yang inovatif, memukau dewan juri dan seluruh penonton yang hadir.",
      },
      {
        id: "p3",
        title: "Juara ....",
        subtitle: "RUMFEST V",
        year: "2025",
        image: "/images/rumfest2025.jpg",
        imageAlt: "Peringkat 1 Danton Terbaik",
        description:
          "Komandan Peleton (Danton) terbaik tingkat Kabupaten Badung. Penghargaan ini mengakui kepemimpinan luar biasa yang ditunjukkan dalam memimpin pasukan dengan presisi, wibawa, dan ketegasan di hadapan dewan juri.",
      },
    ],
  },
  {
    featured: {
      id: "p4",
      title: "JUARA 2 LKBB TINGKAT PROVINSI",
      subtitle: "Festival Paskibraka Bali 2023",
      year: "2023",
      image: "/images/chapter-2-unity.png",
      imageAlt: "Juara 2 LKBB Tingkat Provinsi Bali",
      description:
        "Medali perak Festival Paskibraka Bali menjadi bukti konsistensi Dwipara dalam berkompetisi di tingkat provinsi, bersaing ketat dengan puluhan sekolah unggulan dari seluruh Bali.",
    },
    supporting: [
      {
        id: "p5",
        title: "BEST FORMASI",
        subtitle: "Festival Paskibraka Bali",
        year: "2023",
        image: null,
        imageAlt: "Best Formasi Festival Paskibraka",
        description:
          "Kategori Best Formasi merupakan pengakuan atas keindahan, ketepatan, dan kreativitas susunan formasi yang ditampilkan Dwipara selama Festival Paskibraka Bali 2023 berlangsung.",
      },
      {
        id: "p6",
        title: "BEST DISPLAY PASUKAN",
        subtitle: "Kompetisi Paskibraka Tingkat SMA",
        year: "2023",
        image: null,
        imageAlt: "Best Display Pasukan",
        description:
          "Display pasukan Dwipara dinilai sebagai yang terbaik, mencerminkan harmoni sempurna antara gerakan, seragam, dan presentasi tim secara keseluruhan di hadapan juri kompetisi.",
      },
    ],
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
    year: "2024",
    title: "ORIENTASI DWIPARA",
    desc: "Gerbang resmi bagi setiap calon anggota baru Dwipara Dwisma — sebuah proses pengenalan dan rekrutmen yang membentuk fondasi karakter sejak hari pertama bergabung.",
    fullDesc:
      "Orientasi Dwipara adalah program penerimaan dan pengenalan anggota baru yang menjadi pintu masuk resmi ke dalam keluarga besar Dwipara Dwisma. Melalui serangkaian kegiatan terstruktur, calon anggota diperkenalkan dengan nilai-nilai dasar Paskibraka, sejarah dan tradisi Dwipara, serta standar kedisiplinan yang menjadi identitas unit. Proses ini sekaligus menjadi ajang penilaian awal untuk menentukan kesiapan setiap calon dalam menjalani pembinaan lebih lanjut bersama seluruh anggota aktif.",
    image: "/images/timeline-1.png",
    imageAlt: "Orientasi Anggota Baru Dwipara Dwisma",
    accentColor: "green",
    tags: ["REKRUTMEN", "TAHUNAN"],
  },
  {
    num: "02",
    year: "2026",
    title: "LKBB BRAMASTA 3.0",
    desc: "Ajang Lomba Ketangkasan Baris-Berbaris bergengsi yang diselenggarakan langsung oleh Dwipara Dwisma sebagai wadah kompetisi sekaligus bukti kapasitas penyelenggaraan event berkualitas.",
    fullDesc:
      "LKBB Bramasta 3.0 adalah perlombaan Ketangkasan Baris-Berbaris yang diinisiasi dan diselenggarakan langsung oleh Dwipara Dwisma. Sebagai tuan rumah, Dwipara tidak hanya mengorganisir seluruh rangkaian acara — dari teknis pertandingan hingga akomodasi peserta — tetapi juga turut berkompetisi di antara puluhan tim terbaik dari berbagai sekolah yang hadir. Keberhasilan penyelenggaraan Bramasta 3.0 menjadi bukti nyata bahwa Dwipara Dwisma mampu tampil bukan sekadar sebagai peserta, tetapi juga sebagai penyelenggara event Paskibraka yang profesional dan terpercaya.",
    image: "/images/chapter-2-unity.png",
    imageAlt: "LKBB Bramasta 3.0 diselenggarakan oleh Dwipara Dwisma",
    accentColor: "orange",
    tags: ["LOMBA", "PENYELENGGARA"],
  },
  {
    num: "03",
    year: "2026",
    title: "Serah Terima Jabatan (Sertijab)",
    desc: "Momentum  regenerasi kepengurusan Dwipara Dwisma — tongkat estafet kepemimpinan diserahkan dari pengurus lama kepada generasi penerus yang siap melanjutkan warisan.",
    fullDesc:
      "Serah Terima Jabatan (Sertijab) adalah tradisi tahunan yang menandai berakhirnya satu periode kepengurusan dan lahirnya era kepemimpinan baru di Dwipara Dwisma. Dalam prosesi yang penuh khidmat ini, ketua dan seluruh jajaran pengurus menyerahkan tanggung jawab organisasi kepada generasi berikutnya yang telah melalui proses seleksi dan penilaian internal. Sertijab bukan sekadar pergantian nama di struktur organisasi — ia adalah janji keberlangsungan, komitmen bahwa nilai-nilai disiplin, dedikasi, dan kebanggaan yang telah dibangun akan terus dijaga dan dikembangkan oleh setiap generasi Dwipara.",
    image: "/images/chapter-3-process.png",
    imageAlt: "Serah Terima Jabatan Dwipara Dwisma",
    accentColor: "red",
    tags: ["INTERNAL", "REGENERASI"],
  },
];
