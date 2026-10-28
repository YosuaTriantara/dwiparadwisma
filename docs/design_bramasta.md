# DESIGN.md — LKBB Bramasta 4.0 Dedicated Page

> Panduan style, SEO, ukuran, dan aturan untuk halaman **LKBB Bramasta 4.0** (Dwipara Dwisma, Paskibra SMAN 2 Mengwi).
> Pendekatan: **Mobile First**. Semua nilai default ditulis untuk layar ~360px, lalu diperbesar dengan `min-width`.

---

## 0. Konteks & Posisi Halaman

| Item | Keputusan |
|---|---|
| Alur | Landing Dwipara (`/`) → **CTA entry point di landing** (lihat Bagian 0A) → **Halaman LKBB Bramasta 4.0** (`/lkbb-bramasta-4`) → **CTA akhir halaman ini** → Halaman informasi (`/lkbb-bramasta-4/informasi`) |
| Dua CTA berbeda | **CTA #1** ada di landing Dwipara dan mengarah ke halaman teaser ini. **CTA #2** ada di section terakhir halaman teaser dan mengarah ke halaman informasi |
| Tujuan halaman | Teaser "Coming Soon", membangun antusiasme, mengarahkan ke halaman informasi/pendaftaran |
| Konsep visual | **Koran jadul / surat kabar** (newsprint): kertas krem, tinta hitam, foto monokrom sepia, garis kolom, huruf Old English + Bodoni |
| Selaras dengan landing | Pertahankan navbar, footer, dan tone copy Dwipara ("Membangun Karakter, Mengukir Prestasi") agar terasa satu keluarga |
| Stack (asumsi) | Next.js (landing di Vercel). Contoh kode di bawah memakai Next.js + CSS variables / Tailwind |

**Sumber inspirasi**
1. *Poster Coming Soon* → palet krem, tipografi, grid koran, perlakuan foto.
2. *AI Style Guide* → struktur sistem komponen (elevasi, prioritas, radius, ikon 2px, kontrol, feedback) dan **aksen teal**.

---

## 0A. CTA Entry Point di Landing Dwipara (CTA #1)

CTA yang membawa pengunjung ke halaman LKBB Bramasta 4.0 **berada di landing Dwipara**, bukan di halaman teaser. Landing saat ini berurutan: Hero → Statistik → Tentang → Prestasi → Jejak → "Mulai Ceritamu!" → Footer.

### 0A.1 Penempatan (berurutan dari yang paling penting)

| # | Lokasi di landing | Bentuk | Wajib? |
|---|---|---|---|
| 1 | **Section baru "Teaser Bramasta 4.0"** di antara **Jejak** dan **"Mulai Ceritamu!"** | Kartu kliping koran besar + tombol primer | **Ya** (CTA utama) |
| 2 | **Navbar** (item menu terakhir sebelum tombol Daftar) | Item `BRAMASTA 4.0` + badge kecil `SOON` | Ya |
| 3 | **Node "LKBB Bramasta 3.0"** di section Jejak | Tautan teks "Lihat edisi 4.0 →" | Disarankan |
| 4 | **Announcement bar** tipis di atas navbar (dapat ditutup) | 1 baris teks + tautan | Opsional |
| 5 | **Footer** (kolom Navigasi) | Tautan teks `LKBB Bramasta 4.0` | Ya (untuk SEO) |

> Alasan penempatan #1: pengunjung baru saja membaca cerita Jejak (termasuk Bramasta 3.0), jadi tawaran edisi 4.0 terasa sebagai kelanjutan cerita. Letaknya sebelum CTA "Mulai Ceritamu!" agar tidak bersaing dengan ajakan bergabung sebagai anggota.

### 0A.2 Section teaser di landing (spesifikasi)

**Konsep:** potongan kliping koran yang "ditempel" di landing, sehingga menjadi satu-satunya elemen bernuansa newsprint di landing dan langsung menarik perhatian. Nuansa penuh (parchment, frame, rules) baru muncul setelah pengunjung masuk ke halaman Bramasta.

| Elemen | Spesifikasi |
|---|---|
| Wadah | Kartu `--paper` dengan border 2px `--ink`, frame dalam 1px, `--r-0`, bayangan `raised`, rotasi dekoratif **0°** di mobile (≤ 1° dari tablet, opsional) |
| Kicker | `COMING SOON` (tag hitam, teks krem) + `EDISI KE-4 · 2027` |
| Judul (H2) | `LKBB BRAMASTA 4.0` Bodoni Bold, 32px mobile → 56px desktop, uppercase |
| Subjudul | *Barisan Semangat Paskibra Dewata* (Bodoni Book, kicker uppercase) |
| Tagline | *"Mencari sang pejuang dan sang pemenang — untuk 2027"* (Bodoni Book Italic, 20px → 28px) |
| Foto | Foto podium Bramasta 3.0, sepia, rasio 4:3 (mobile) / 16:9 (desktop), caption kecil |
| Tombol primer | **"LIHAT BRAMASTA 4.0"** + ikon panah 20px → `/lkbb-bramasta-4` |
| Tombol sekunder (opsional) | "Lihat Edisi Sebelumnya" → anchor `#jejak` |

**Layout (Mobile First)**
- **Mobile (< 768px):** 1 kolom: kicker → judul → subjudul → foto → tagline → tombol (full-width, tinggi 48px).
- **≥ 768px:** 2 kolom (teks kiri 5/8, foto kanan 3/8) dengan garis pemisah vertikal 1px.
- **≥ 1024px:** boleh ditambah strip ornamen blackletter "Dwipara present" di atas kartu (maks. 1 elemen blackletter).

**Padding & spasi:** section 48px (mobile) / 64px (md) / 96px (lg) atas-bawah; padding kartu 16 / 24 / 32px.

### 0A.3 Item navbar landing

- Teks: `BRAMASTA 4.0` (uppercase, gaya sama dengan item menu lain) + badge pill `SOON` (bg `--ink`, teks `--paper`, 10px).
- Urutan menu: `HOME · TENTANG · PRESTASI · JEJAK · BRAMASTA 4.0` → tombol `DAFTAR` tetap yang terakhir.
- Pakai `<a href="/lkbb-bramasta-4">` (halaman terpisah), bukan anchor `#`.
- Mobile menu: item ini tampil biasa di daftar; jangan jadikan tombol besar tersendiri agar tidak menyaingi "DAFTAR".

### 0A.4 Hirarki CTA di landing (agar tidak bersaing)

| Prioritas | CTA | Tujuan |
|---|---|---|
| 1 | `GABUNG` / `DAFTAR SEKARANG` | Rekrutmen anggota Dwipara (hero & penutup, tetap teal solid) |
| 2 | **`LIHAT BRAMASTA 4.0`** | Event, tombol primer **hanya di dalam section teaser** |
| 3 | `BRAMASTA 4.0 · SOON` di navbar, tautan Jejak, footer | Navigasi pendukung (tampilan teks/tautan, bukan tombol solid) |

Aturan: dalam satu viewport tidak boleh ada dua tombol primer solid. Tombol "LIHAT BRAMASTA 4.0" tampil teal solid hanya saat section teaser terlihat.

### 0A.5 SEO & teknis untuk CTA #1

- Gunakan `next/link` / `<a href>` yang bisa di-crawl (bukan `onClick` + `router.push`).
- Teks tautan deskriptif: **"LKBB Bramasta 4.0"** / "Lihat LKBB Bramasta 4.0", bukan "Klik di sini".
- Tambahkan `title`/`aria-label` bila teks tombol saja kurang jelas: `aria-label="Lihat halaman LKBB Bramasta 4.0, coming soon"`.
- Tautan di navbar dan footer ikut menambah sinyal internal link ke `/lkbb-bramasta-4`.
- Foto di teaser: `loading="lazy"`, `alt` deskriptif, ≤ 80KB, WebP/AVIF, `width/height` terisi (hindari CLS).
- Prefetch halaman tujuan saat tombol terlihat/di-hover (default `next/link`).
- Tambahkan event analytics `cta_bramasta_click` dengan parameter `placement` (`section`, `navbar`, `jejak`, `footer`) untuk mengukur penempatan terbaik.

### 0A.6 Konsistensi antar halaman

- Tombol "LIHAT BRAMASTA 4.0" dan judul halaman tujuan harus sama kata kuncinya ("LKBB Bramasta 4.0") agar pengunjung merasa berada di tempat yang benar.
- Foto di teaser sebaiknya foto yang sama dengan foto utama di halaman Bramasta (cache dipakai ulang, transisi terasa mulus).
- Di halaman Bramasta, navbar menampilkan **"← Kembali ke Dwipara"** (lihat 6.2), jadi alur dua arah selalu jelas.

---

## 1. Prinsip Desain

1. **Editorial dulu, dekorasi belakangan.** Hierarki dibangun dari tipografi, garis (rules), dan whitespace, bukan efek.
2. **Satu aksen saja.** Hitam tinta + krem kertas adalah 90% tampilan. Teal hanya untuk elemen interaktif/penting.
3. **Monokrom untuk foto, warna untuk aksi.** Semua foto kegiatan diberi treatment sepia/grayscale; hanya tombol/link yang berwarna.
4. **Mobile First.** Satu kolom di mobile; kolom koran (2–3) baru muncul di tablet/desktop.
5. **Ringan & cepat.** Target LCP < 2,5 dtk di 4G. Peserta dan sekolah mengakses dari ponsel.
6. **Terbaca.** Teks isi minimal 16px, kontras minimal WCAG AA.

---

## 2. Color Palette

Dasar warna diambil dari poster (krem parchment + hitam tinta + foto abu-sepia). Teal diambil dari style guide referensi sebagai aksen UI.

### 2.1 Token warna

| Token | Hex | Penggunaan |
|---|---|---|
| `--paper` | `#D9D3A1` | Background utama halaman (krem koran) |
| `--paper-light` | `#E6E1BC` | Surface terangkat (card, panel) |
| `--paper-dark` | `#C9C28A` | Surface cekung / area terpilih, divider tebal |
| `--paper-deep` | `#B5AD73` | Border halus, state hover pada surface |
| `--ink` | `#141210` | Teks utama, judul, garis tebal, tombol sekunder |
| `--ink-soft` | `#3A362B` | Teks isi panjang, caption |
| `--ink-mute` | `#6B6548` | Meta, placeholder, teks pendukung |
| `--sepia-1` | `#8A7B5C` | Overlay foto (tint) |
| `--sepia-2` | `#4A402E` | Footer / blok gelap |
| `--accent` | `#0F5257` | **Aksen utama**: tombol primer, link, fokus, indikator aktif |
| `--accent-hover` | `#0B3F43` | Hover/pressed tombol primer |
| `--accent-soft` | `#CFE0D2` | Background badge/info ringan |
| `--success` | `#2F6B3F` | Toast sukses, badge "Buka" |
| `--warning` | `#B7791F` | Banner peringatan, badge "Segera" |
| `--danger` | `#9B2C2C` | Error form |
| `--on-accent` | `#F4F1DC` | Teks di atas tombol teal / blok gelap |

> Hex ini perkiraan dari gambar. Ambil sampel warna asli dengan color picker dari file poster, lalu sesuaikan, tetapi pertahankan **rasio kontras** di bawah.

### 2.2 Pasangan kontras (wajib diverifikasi dengan checker)

| Teks | Latar | Target |
|---|---|---|
| `--ink` | `--paper` | ≥ 12:1 (AAA) |
| `--ink-soft` | `--paper` | ≥ 7:1 |
| `--ink-mute` | `--paper` | ≥ 4.5:1 (hanya untuk teks ≥ 14px) |
| `--on-accent` | `--accent` | ≥ 7:1 |
| `--accent` | `--paper` | ≥ 4.5:1 (aman untuk link) |

### 2.3 CSS Variables

```css
:root {
  --paper: #D9D3A1;
  --paper-light: #E6E1BC;
  --paper-dark: #C9C28A;
  --paper-deep: #B5AD73;

  --ink: #141210;
  --ink-soft: #3A362B;
  --ink-mute: #6B6548;

  --sepia-1: #8A7B5C;
  --sepia-2: #4A402E;

  --accent: #0F5257;
  --accent-hover: #0B3F43;
  --accent-soft: #CFE0D2;
  --on-accent: #F4F1DC;

  --success: #2F6B3F;
  --warning: #B7791F;
  --danger: #9B2C2C;
}
```

**Aturan warna**
- Jangan gunakan putih murni `#FFF` atau hitam murni `#000`.
- Jangan tambah aksen kedua (merah, biru, ungu).
- Mode gelap tidak disediakan; konsep koran adalah "kertas". Set `color-scheme: light`.

---

## 3. Tipografi

### 3.1 Peran font

| Peran | Font (sesuai opsi) | Dipakai untuk |
|---|---|---|
| **Masthead / Logo** | **Cloister Black** (Old English) | Wordmark "Dwipara", ornamen judul kecil. **Maksimal 1 elemen per layar** |
| **Display / Headline** | **Bodoni 72 Bold** | Judul hero "LKBB BRAMASTA 4.0", H2 section |
| **Subhead / Tagline** | **Bodoni 72 Book** | "Mencari sang pejuang dan sang pemenang", kutipan, subjudul |
| **Body / Isi artikel** | **Bodoni 72 Oldstyle** | Paragraf, caption, deskripsi, label kecil |
| **UI kecil (opsional)** | Bodoni 72 Book, huruf kapital + letter-spacing | Tombol, tab, tag |

### 3.2 Catatan lisensi & fallback web (PENTING)

`Bodoni 72` adalah font bawaan Apple (macOS/iOS) dan **tidak otomatis tersedia di Android/Windows**. `Cloister Black` adalah font komersial. Agar tampil konsisten di semua perangkat:

| Font target | Self-host jika punya lisensi web | Fallback gratis (Google Fonts) |
|---|---|---|
| Cloister Black | Ya (butuh lisensi webfont) | **UnifrakturCook** atau **UnifrakturMaguntia** |
| Bodoni 72 Bold | Ya (butuh lisensi) | **Bodoni Moda** (600–700) |
| Bodoni 72 Book | Ya | **Bodoni Moda** (400–500) |
| Bodoni 72 Oldstyle | Ya | **Bodoni Moda** (400) atau **Libre Bodoni** |

**Rekomendasi:** pakai fallback Google Fonts lewat `next/font` (self-hosted otomatis, tanpa request ke pihak ketiga), dan taruh nama font asli di depan `font-family` agar perangkat Apple memakai versi aslinya.

```ts
// app/fonts.ts
import { UnifrakturCook, Bodoni_Moda } from 'next/font/google';

export const blackletter = UnifrakturCook({
  weight: '700', subsets: ['latin'], display: 'swap', variable: '--font-blackletter',
});

export const bodoni = Bodoni_Moda({
  subsets: ['latin'], display: 'swap', variable: '--font-bodoni',
  weight: ['400', '500', '700'], style: ['normal', 'italic'],
});
```

```css
:root {
  --font-masthead: 'Cloister Black', var(--font-blackletter), 'UnifrakturCook', serif;
  --font-display:  'Bodoni 72', var(--font-bodoni), 'Bodoni Moda', 'Didot', Georgia, serif;
  --font-body:     'Bodoni 72 Oldstyle', 'Bodoni 72', var(--font-bodoni), 'Libre Bodoni', Georgia, serif;
}
```

**Performa font**
- Maksimal **3 file font** dimuat di halaman (blackletter 1, Bodoni 2: regular + bold). Italic hanya jika dipakai.
- `font-display: swap`, subset `latin` saja, format `woff2`.
- Preload hanya font untuk teks above-the-fold (judul hero).

### 3.3 Skala tipografi (Mobile First, fluid)

Nilai default = mobile (360px). Skala naik otomatis memakai `clamp()`.

| Token | Mobile (≈360px) | Desktop (≈1280px) | Font | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|---|---|
| `--fs-masthead` | 32px | 56px | Cloister Black | 400 | 1.1 | 0 |
| `--fs-hero` (H1) | 36px | 88px | Bodoni Bold | 700 | 1.0 | -0.01em |
| `--fs-h2` | 28px | 48px | Bodoni Bold | 700 | 1.1 | 0 |
| `--fs-h3` | 20px | 28px | Bodoni Bold | 700 | 1.2 | 0.02em (uppercase) |
| `--fs-tagline` | 20px | 36px | Bodoni Book | 400 | 1.25 | 0 |
| `--fs-kicker` | 12px | 14px | Bodoni Book | 400 | 1.2 | 0.18em (uppercase) |
| `--fs-body` | 16px | 17px | Bodoni Oldstyle | 400 | 1.65 | 0 |
| `--fs-small` | 14px | 14px | Bodoni Oldstyle | 400 | 1.5 | 0 |
| `--fs-caption` | 12px | 13px | Bodoni Oldstyle | 400 | 1.4 | 0.02em |
| `--fs-button` | 14px | 15px | Bodoni Bold | 700 | 1 | 0.1em (uppercase) |

```css
:root {
  --fs-masthead: clamp(2rem, 1.4rem + 2.6vw, 3.5rem);
  --fs-hero:     clamp(2.25rem, 1rem + 5.4vw, 5.5rem);
  --fs-h2:       clamp(1.75rem, 1.2rem + 2.2vw, 3rem);
  --fs-h3:       clamp(1.25rem, 1.1rem + 0.7vw, 1.75rem);
  --fs-tagline:  clamp(1.25rem, 1rem + 1.2vw, 2.25rem);
  --fs-kicker:   clamp(0.75rem, 0.7rem + 0.2vw, 0.875rem);
  --fs-body:     clamp(1rem, 0.97rem + 0.15vw, 1.0625rem);
}
```

**Aturan tipografi**
- Blackletter **tidak boleh** untuk paragraf, tombol, atau teks < 24px. Hanya masthead/ornamen.
- Judul hero selalu **UPPERCASE**; H3 section kecil uppercase dengan letter-spacing.
- Panjang baris isi: **45–70 karakter** (`max-width: 65ch`).
- Paragraf pembuka artikel boleh memakai **drop cap** Bodoni Bold (3 baris) dari tablet ke atas saja.
- Paragraf isi: `text-align: left` di mobile; `justify` + `hyphens: auto` hanya ≥ 1024px dan di kolom ≥ 280px (hindari rivers).
- Pakai `font-variant-numeric: oldstyle-nums` untuk angka di isi teks, `lining-nums` untuk "4.0", tahun, dan statistik.

---

## 4. Layout, Grid & Spacing

### 4.1 Breakpoint (min-width, Mobile First)

| Nama | Lebar | Kolom | Gutter | Margin sisi | Max container |
|---|---|---|---|---|---|
| `base` (mobile) | 0–479 | 4 | 16px | 16px | 100% |
| `sm` | ≥ 480 | 4 | 16px | 20px | 100% |
| `md` (tablet) | ≥ 768 | 8 | 24px | 32px | 720px |
| `lg` (laptop) | ≥ 1024 | 12 | 24px | 40px | 960px |
| `xl` (desktop) | ≥ 1280 | 12 | 32px | 48px | 1120px |

> Test minimal di **360×800**, **390×844**, **768×1024**, **1280×800**. Tidak boleh ada scroll horizontal.

### 4.2 Skala spasi (basis 4px)

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96`

| Konteks | Mobile | ≥ md | ≥ lg |
|---|---|---|---|
| Padding section vertikal | 48px | 64px | 96px |
| Jarak antar elemen dalam section | 16–24px | 24–32px | 32–48px |
| Padding card | 16px | 20px | 24px |
| Jarak ikon–teks | 8px | 8px | 12px |

### 4.3 Garis koran (Rules)

Elemen khas poster: garis ganda di bawah masthead dan garis pemisah kolom.

| Token | Spesifikasi | Penggunaan |
|---|---|---|
| `rule-thin` | 1px solid `--ink` | Pemisah kolom, tabel |
| `rule-std` | 2px solid `--ink` | Pemisah section |
| `rule-thick` | 4px solid `--ink` | Garis bawah masthead |
| `rule-double` | 4px + 2px + jarak 4px | Di bawah masthead & di atas footer |
| Frame halaman | 2px solid `--ink`, inset 8px (mobile) / 16px (desktop) | Bingkai luar seluruh halaman seperti poster |

```css
.rule-double {
  border-top: 4px solid var(--ink);
  position: relative;
}
.rule-double::after {
  content: ""; display: block; margin-top: 4px; border-top: 2px solid var(--ink);
}
```

### 4.4 Radius, Border & Elevasi

Mengadopsi struktur style guide referensi, tetapi **diperkecil** agar tetap terasa koran (bukan app modern).

| Token | Nilai | Dipakai |
|---|---|---|
| `--r-0` | 0px | Foto, frame, tabel (default koran) |
| `--r-sm` | 4px | Input, badge |
| `--r-md` | 8px | Card, tombol |
| `--r-lg` | 12px | Modal, toast |
| `--r-pill` | 999px | Tag status, switch |

| Border | Nilai |
|---|---|
| Halus | 1px `--paper-deep` |
| Standar | 2px `--ink` |
| Tebal | 4px `--ink` |

| Elevasi | Gaya |
|---|---|
| `base` | Tanpa bayangan, background `--paper` |
| `raised` | `--paper-light` + `0 2px 0 var(--paper-deep), 0 6px 14px rgba(20,18,16,.12)` |
| `inset` | `--paper-dark` + `inset 0 2px 4px rgba(20,18,16,.18)` |
| `dark` | `--sepia-2` + teks `--on-accent` (footer, banner CTA) |

---

## 5. Foto, Ikon & Tekstur

### 5.1 Treatment foto (khas poster)

```css
.photo {
  filter: grayscale(1) sepia(.35) contrast(1.05) brightness(.97);
  border: 2px solid var(--ink);
  border-radius: 0;
}
.photo--color-on-hover:hover { filter: none; } /* hanya desktop, opsional */
```

- Semua foto dokumentasi **monokrom-sepia**. Foto berwarna hanya untuk logo/pas foto resmi.
- Rasio: hero **16:10** (mobile 4:3), foto kolom **4:3**, strip galeri **3:2**.
- Beri caption kecil (Bodoni Oldstyle, 12px, `--ink-mute`) seperti keterangan foto koran: *"Dokumentasi LKBB Bramasta 3.0 — GOR …"*.

### 5.2 Tekstur kertas (opsional, ringan)

- Noise/grain SVG inline atau PNG ≤ 20KB, `opacity: .06–.10`, `mix-blend-mode: multiply`, di `body::before` (`pointer-events: none`).
- Dilarang memakai gambar tekstur > 50KB.

### 5.3 Ikon

| Aturan | Nilai |
|---|---|
| Gaya | Outline, stroke **2px**, sudut membulat |
| Ukuran | 16px (inline), 20px (tombol/nav), 24px (aksi utama) |
| Warna | `currentColor` (ikut `--ink` atau `--accent`) |
| Library | Lucide / Phosphor (SVG, tree-shaken). Jangan memakai icon font |
| Area sentuh | Minimal 44×44px meski ikon 20px |

---

## 6. Komponen

Semua target sentuh **≥ 44×44px**. Fokus keyboard: `outline: 3px solid var(--accent); outline-offset: 2px`.

### 6.1 Tombol

| Varian | Tampilan | Prioritas |
|---|---|---|
| **Primary** | bg `--accent`, teks `--on-accent`, uppercase, `--r-md`, tinggi 48px | 1 per layar (CTA utama) |
| **Secondary** | bg transparan, border 2px `--ink`, teks `--ink` | Aksi pendamping |
| **Ghost/Link** | teks `--accent`, underline 2px saat hover | Navigasi sekunder |
| **Disabled** | bg `--paper-dark`, teks `--ink-mute`, tanpa bayangan | Tidak tersedia |
| **Loading** | teks "Memuat…" + spinner 16px | Saat proses |

- Mobile: tombol CTA **full-width** (`width: 100%`); ≥ md: lebar otomatis, `min-width: 200px`.
- Hover: `--accent-hover`; Active: geser `translateY(1px)`.

### 6.2 Navbar (konsisten dengan landing)

- Mobile: bar atas sticky tinggi 56px: wordmark Dwipara (blackletter 24px) di kiri, tombol menu di kanan, menu fullscreen ber-background `--paper`.
- ≥ lg: menu horizontal (`HOME · TENTANG · PRESTASI · JEJAK`) + tombol "DAFTAR".
- Tambahkan tautan **"← Kembali ke Dwipara"** di atas atau di menu agar alur dua halaman jelas.
- Garis `rule-thick` di bawah navbar.

### 6.3 Masthead (blok judul koran)

```
┌────────────────────────────────┐
│        Dwipara   (blackletter) │
│          PRESENT               │
│  ────────────────────────────  │
│          COMING SOON           │
│     LKBB BRAMASTA 4.0          │
│ ══════════════════════════════ │
│ BARISAN SEMANGAT PASKIBRA DEWATA│
│ ══════════════════════════════ │
└────────────────────────────────┘
```

### 6.4 Card artikel (kolom koran)

- bg `--paper-light`, border 1px `--paper-deep`, padding 16px, `--r-md`.
- Judul uppercase Bodoni Bold 20px + garis `rule-std` di bawahnya.
- Mobile: tumpuk 1 kolom. ≥ lg: grid 2–3 kolom dengan **garis pemisah vertikal 1px** (bukan gap kosong), seperti koran.

### 6.5 Timeline "Perjalanan LKBB Bramasta"

- Mobile: vertikal, garis 2px `--ink` di kiri, titik 12px `--accent`.
- ≥ md: horizontal 4 titik (1.0 → 4.0), titik aktif (4.0) berisi angka dengan bg `--accent`.
- Setiap node: tahun (lining nums), judul, 1–2 kalimat.

### 6.6 Tag / Badge

| Tag | Warna |
|---|---|
| `COMING SOON` | bg `--ink`, teks `--paper` |
| `Pendaftaran Segera` | bg `--warning` |
| `Dibuka` | bg `--success`, teks `--on-accent` |
| `Info` | bg `--accent-soft`, teks `--accent` |

Pill, tinggi 28px, uppercase 12px, padding 0 12px.

### 6.7 Accordion FAQ (mendukung SEO)

- Pakai `<details><summary>` native, ikon chevron 20px, tinggi minimum 56px.
- Dipakai untuk pertanyaan umum; konten di-render di HTML (bukan lazy) agar terindeks.

### 6.8 Countdown (opsional, jika tanggal sudah pasti)

- 4 kotak (Hari · Jam · Menit · Detik), angka Bodoni Bold 32px mobile / 56px desktop, `rule-thin` di antara kotak.
- Wajib punya fallback teks statis untuk crawler/`noscript`.
- Respek `prefers-reduced-motion` (tanpa animasi flip).

### 6.9 Feedback & status

| Komponen | Aturan |
|---|---|
| Toast | Posisi bawah-tengah mobile, atas-kanan desktop; auto-dismiss 5 dtk; `role="status"` |
| Banner | Strip di bawah navbar, bg `--warning` 15%, ikon 20px |
| Skeleton | bg `--paper-dark`, shimmer halus 1,4 dtk, nonaktif saat reduced motion |
| Empty state | Ikon outline 48px + teks + tombol secondary |

### 6.10 Footer

- bg `--sepia-2`, teks `--on-accent`, `rule-double` di atasnya.
- Isi: wordmark blackletter, tagline, navigasi, kontak (Instagram `@paskibradwissma`, TikTok `@dwipara_`), hak cipta.
- Mobile: 1 kolom; ≥ md: 3 kolom.

---

## 7. Struktur Halaman (Urutan Section)

| # | Section | Isi | Catatan |
|---|---|---|---|
| 1 | **Navbar** | Wordmark, menu, tombol kembali | Sticky |
| 2 | **Masthead + Hero** | "Dwipara PRESENT", **COMING SOON**, H1 **LKBB BRAMASTA 4.0**, subjudul *Barisan Semangat Paskibra Dewata*, tagline *"Mencari sang pejuang dan sang pemenang — untuk 2027"* | Satu-satunya `<h1>` |
| 3 | **Foto utama** | Foto podium/pemenang LKBB sebelumnya (sepia) + caption | LCP element, `priority`, jangan lazy |
| 4 | **Bukan Sekadar Lomba Biasa** | Artikel 2 kolom (1 kolom di mobile) + foto kecil | Teks koran |
| 5 | **Perjalanan LKBB Bramasta** | Timeline 1.0 → 4.0 + strip foto | Wajib ada narasi per tahap |
| 6 | **Angka/Statistik** (opsional) | Edisi ke-4, jumlah peserta sebelumnya, dll. | Gunakan data nyata |
| 7 | **FAQ singkat** | 3–5 pertanyaan | Untuk SEO + FAQ schema |
| 8 | **CTA Akhir** | Judul *"Siap Jadi Sang Pemenang?"* + tombol **"Lihat Informasi Lengkap"** → `/lkbb-bramasta-4/informasi` | Satu CTA primer, tombol kedua "Hubungi Panitia" (WhatsApp) |
| 9 | **Footer** | Seperti 6.10 | |

**Aturan CTA akhir (CTA #2, di dalam halaman Bramasta; CTA #1 ada di landing, lihat Bagian 0A)**
- Latar `--sepia-2` (blok gelap) agar menonjol dari halaman krem.
- Tombol primer teal full-width di mobile.
- Tautan internal pakai `<a href>` / `next/link` (bukan `onClick`) agar crawlable.
- Tambahkan `aria-label` deskriptif bila teks tombol umum.

---

## 8. SEO Optimization

### 8.1 URL & Struktur

| Item | Aturan |
|---|---|
| Slug | `/lkbb-bramasta-4` (huruf kecil, tanda hubung, tanpa angka desimal) |
| Halaman info | `/lkbb-bramasta-4/informasi` |
| Canonical | Satu URL kanonis per halaman, tanpa trailing slash |
| Bahasa | `<html lang="id">`; locale `id_ID` |
| Heading | **1 × H1**; section = H2; sub-bagian = H3. Jangan lompat level |
| Tautan internal | Landing → halaman ini → halaman info; tambah tautan balik ke landing |

### 8.2 Meta tag (template)

```tsx
// app/lkbb-bramasta-4/page.tsx
export const metadata = {
  title: 'LKBB Bramasta 4.0 — Lomba Baris-Berbaris Paskibra Bali | Dwipara Dwisma',
  description:
    'LKBB Bramasta 4.0 oleh Dwipara Dwisma, Paskibra SMAN 2 Mengwi. Barisan Semangat Paskibra Dewata — mencari sang pejuang dan sang pemenang untuk 2027.',
  keywords: [
    'LKBB Bramasta 4.0', 'LKBB Bali 2027', 'lomba baris berbaris Bali',
    'Paskibra SMAN 2 Mengwi', 'Dwipara Dwisma', 'lomba ketangkasan baris berbaris',
  ],
  alternates: { canonical: 'https://dwiparadwisma.vercel.app/lkbb-bramasta-4' },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'Dwipara Dwisma',
    title: 'LKBB Bramasta 4.0 — Coming Soon',
    description: 'Mencari sang pejuang dan sang pemenang — untuk 2027.',
    url: 'https://dwiparadwisma.vercel.app/lkbb-bramasta-4',
    images: [{ url: '/og/bramasta-4.jpg', width: 1200, height: 630, alt: 'Poster LKBB Bramasta 4.0 Coming Soon' }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};
```

| Elemen | Batas |
|---|---|
| `<title>` | 50–60 karakter, kata kunci utama di depan |
| `meta description` | 140–160 karakter, ada ajakan/benefit |
| OG image | 1200×630, JPG ≤ 150KB, teks besar terbaca di thumbnail |
| Favicon | SVG + 180×180 apple-touch-icon |

### 8.3 Structured Data (JSON-LD)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "LKBB Bramasta 4.0",
  "alternateName": "Barisan Semangat Paskibra Dewata",
  "description": "Lomba Ketangkasan Baris-Berbaris tingkat pelajar yang diselenggarakan Dwipara Dwisma SMAN 2 Mengwi.",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "startDate": "2027-XX-XX",
  "location": {
    "@type": "Place",
    "name": "GOR ... (isi sesuai lokasi)",
    "address": { "@type": "PostalAddress", "addressRegion": "Bali", "addressCountry": "ID" }
  },
  "image": ["https://dwiparadwisma.vercel.app/og/bramasta-4.jpg"],
  "organizer": {
    "@type": "Organization",
    "name": "Dwipara Dwisma — Paskibra SMAN 2 Mengwi",
    "url": "https://dwiparadwisma.vercel.app"
  }
}
</script>
```

- Isi `startDate` dan `location` **hanya setelah pasti**. Jika belum, hapus kedua properti tersebut atau gunakan `eventStatus: EventScheduled` tanpa tanggal palsu. Jangan mengarang data.
- Tambah `BreadcrumbList` (Beranda › LKBB Bramasta 4.0) dan `FAQPage` bila section FAQ ada.
- Validasi dengan **Rich Results Test**.

### 8.4 Konten & Copywriting

- Kata kunci utama ("LKBB Bramasta 4.0") ada di: title, H1, paragraf pertama, alt foto utama, URL.
- Kata kunci sekunder alami: "lomba baris-berbaris", "Paskibra Bali", "SMAN 2 Mengwi", "pelajar".
- Minimal **300–500 kata** teks nyata di HTML (bukan gambar). **Jangan menaruh teks penting hanya di dalam gambar poster.**
- Pertahankan copy dari poster sebagai teks HTML (judul, "Bukan Sekadar Lomba Biasa", "Perjalanan LKBB Bramasta").
- Teks tautan deskriptif: "Lihat informasi lengkap LKBB Bramasta 4.0", bukan "klik di sini".

### 8.5 Gambar

| Aturan | Nilai |
|---|---|
| Format | AVIF/WebP (Next `<Image>` otomatis), fallback JPG |
| Ukuran maksimal | Hero ≤ 150KB, foto kolom ≤ 80KB, thumbnail ≤ 40KB |
| Dimensi tampil | Hero mobile 720px lebar, desktop 1440px; gunakan `sizes` |
| Atribut wajib | `width`, `height`, `alt` deskriptif (hindari "gambar1.jpg") |
| Lazy load | Semua di bawah fold `loading="lazy"`; hero `priority` |
| Nama file | `lkbb-bramasta-3-podium-juara.webp` (deskriptif, huruf kecil) |

Contoh alt: `"Para juara LKBB Bramasta 3.0 berdiri di podium bersama panitia Dwipara"`.

### 8.6 Teknis & Core Web Vitals

| Metrik | Target (mobile 4G) |
|---|---|
| LCP | < 2,5 dtk |
| INP | < 200 ms |
| CLS | < 0,1 |
| TTFB | < 0,8 dtk |
| Total berat halaman | < 1 MB (awal) |
| JavaScript awal | < 100KB gzip |
| Lighthouse | Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100 |

Tindakan:
- Gunakan Server Components / SSG; hindari render sisi klien untuk konten utama.
- Cadangkan ruang gambar (`aspect-ratio`) untuk mencegah CLS.
- Tunda JS countdown/animasi (`dynamic import`, `ssr: false` hanya untuk widget kecil).
- Tambah ke `sitemap.xml` dan pastikan `robots.txt` mengizinkan halaman ini.
- Viewport: `<meta name="viewport" content="width=device-width, initial-scale=1">` (jangan blok zoom).
- HTTPS, kompresi Brotli (otomatis di Vercel), cache aset statis `immutable`.

### 8.7 Semantic HTML

```html
<header> … <nav aria-label="Navigasi utama"> … </nav> </header>
<main id="konten">
  <section aria-labelledby="hero-title"> <h1 id="hero-title">LKBB Bramasta 4.0</h1> … </section>
  <article> … </article>
  <section aria-labelledby="perjalanan"> <h2 id="perjalanan">Perjalanan LKBB Bramasta</h2> … </section>
  <section aria-labelledby="cta"> … </section>
</main>
<footer> … </footer>
```
- Tambahkan "Lewati ke konten" (`skip link`) di awal halaman.
- Gunakan `<figure>`/`<figcaption>` untuk foto + keterangan, `<time datetime>` untuk tanggal.

### 8.8 Social & Off-page

- Bagikan halaman ini dari Instagram `@paskibradwissma` dan TikTok `@dwipara_` (link di bio).
- Pasang tautan ke halaman ini dari landing Dwipara di 4 titik: section teaser, navbar, node Jejak (Bramasta 3.0 → 4.0), dan footer (lihat Bagian 0A).
- Daftarkan situs di Google Search Console, kirim sitemap.

---

## 9. Aksesibilitas

- Target WCAG 2.2 AA.
- Area sentuh ≥ 44×44px, jarak antar target ≥ 8px.
- Seluruh fungsi bisa dioperasikan keyboard; urutan tab mengikuti urutan visual.
- Teks tidak boleh bergantung hanya pada warna (tambahkan ikon/label pada status).
- `prefers-reduced-motion: reduce` → matikan parallax, countdown flip, dan animasi masuk.
- Sematkan `alt=""` untuk gambar dekoratif (tekstur, ornamen).
- `aria-current="page"` pada menu aktif; `aria-expanded` pada tombol menu & accordion.

---

## 10. Motion

| Jenis | Spesifikasi |
|---|---|
| Durasi | 150–250ms (mikro), 400–600ms (reveal section) |
| Easing | `cubic-bezier(.2, .7, .2, 1)` |
| Reveal | Fade + `translateY(12px)`, sekali saja, via `IntersectionObserver` |
| Hero | Efek *"koran dicetak"*: fade-in judul berurutan (masthead → judul → tagline), total < 1 dtk |
| Dilarang | Parallax berat, auto-play video suara, animasi berulang tanpa henti |

---

## 11. Tailwind Tokens (opsional)

```js
// tailwind.config.js
module.exports = {
  theme: {
    screens: { sm: '480px', md: '768px', lg: '1024px', xl: '1280px' }, // mobile first
    extend: {
      colors: {
        paper: { DEFAULT: '#D9D3A1', light: '#E6E1BC', dark: '#C9C28A', deep: '#B5AD73' },
        ink: { DEFAULT: '#141210', soft: '#3A362B', mute: '#6B6548' },
        sepia: { 1: '#8A7B5C', 2: '#4A402E' },
        accent: { DEFAULT: '#0F5257', hover: '#0B3F43', soft: '#CFE0D2', on: '#F4F1DC' },
      },
      fontFamily: {
        masthead: ['var(--font-masthead)'],
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      borderRadius: { sm: '4px', md: '8px', lg: '12px' },
    },
  },
};
```

---

## 12. Do & Don't

| ✅ Do | ❌ Don't |
|---|---|
| Krem + hitam + satu aksen teal | Warna cerah, gradasi, neon |
| Foto sepia/grayscale dengan caption | Foto berwarna jenuh tanpa treatment |
| Blackletter hanya untuk masthead | Blackletter untuk paragraf/tombol |
| Garis tipis/tebal sebagai pemisah | Bayangan tebal ala aplikasi modern |
| Teks HTML nyata untuk semua copy | Poster utuh sebagai satu gambar tanpa teks |
| 1 CTA primer per layar | Banyak tombol primer bersaing |
| Uji di 360px lebih dulu | Mendesain desktop dulu lalu "mengecilkan" |
| Isi data event hanya jika pasti | Mengarang tanggal/lokasi di schema |

---

## 13. Checklist Sebelum Rilis

- [ ] Warna diambil dari poster asli dan lolos cek kontras
- [ ] Font fallback termuat; tidak ada FOIT; maksimal 3 file font
- [ ] Hanya satu `<h1>`; hierarki heading rapi
- [ ] Title, description, canonical, OG image terisi
- [ ] JSON-LD `Event` valid (tanpa data palsu), `BreadcrumbList`, `FAQPage`
- [ ] Semua gambar punya `alt`, `width`, `height`, format WebP/AVIF
- [ ] Lighthouse mobile: Perf ≥ 90, A11y ≥ 95, SEO 100
- [ ] LCP < 2,5 dtk, CLS < 0,1
- [ ] Tidak ada scroll horizontal di 360px
- [ ] Landing Dwipara punya section teaser, item navbar, tautan Jejak, dan tautan footer menuju `/lkbb-bramasta-4`
- [ ] Hanya ada satu tombol primer solid per viewport di landing (CTA rekrutmen tidak bersaing dengan CTA Bramasta)
- [ ] CTA akhir halaman Bramasta mengarah ke `/lkbb-bramasta-4/informasi` dan bisa di-crawl
- [ ] Sudah masuk `sitemap.xml` dan dikirim ke Search Console
- [ ] `prefers-reduced-motion` dihormati
