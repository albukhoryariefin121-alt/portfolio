# Portofolio — Muhammad Arifin Albukhori

Website portofolio pribadi satu halaman (*single page*) yang dibuat dengan **HTML, CSS, dan JavaScript murni** — tanpa framework dan tanpa library tambahan. Isinya memperkenalkan latar belakang pendidikan dan pengalaman kerja penulis di bidang pendidikan dan logistik.

- **Demo (GitHub Pages):** https://albukhoryariefin121-alt.github.io/portfolio/
- **Kode sumber:** https://github.com/albukhoryariefin121-alt/portfolio

## Cara menjalankan

Tidak perlu instalasi apa pun.

1. Unduh atau *clone* repositori ini.
2. Buka file `index.html` dengan browser (Chrome, Edge, Firefox, atau Safari).

Koneksi internet hanya dipakai untuk memuat font dari Google Fonts. Tanpa internet, halaman tetap berjalan dengan font bawaan sistem.

## Struktur proyek

```
portfolio/
├── index.html        Struktur & isi halaman
├── css/
│   └── style.css     Warna, layout, animasi, responsif
├── js/
│   └── script.js     Interaksi & animasi
├── img/
│   └── foto.jpg      Foto profil
└── README.md         Dokumentasi ini
```

Pembagian tugasnya mengikuti prinsip *separation of concerns*:

| Bahasa | File | Tugas |
|---|---|---|
| HTML | `index.html` | Menentukan **apa** yang ada di halaman (teks, gambar, tautan) |
| CSS | `css/style.css` | Menentukan **bagaimana tampilannya** (warna, ukuran, posisi, animasi) |
| JavaScript | `js/script.js` | Menentukan **bagaimana halaman bereaksi** (scroll, klik, gerakan mouse) |

## Fitur

- Desain gelap modern dengan gradasi biru–merah
- Responsif: tampil rapi di HP, tablet, dan laptop
- Layar pembuka (intro) dengan persentase loading
- Animasi muncul saat di-scroll
- Bagian "Cerita hidup" berupa scroll bercerita di layar besar, dan kartu biasa di layar kecil
- Timeline pengalaman dengan garis yang memanjang mengikuti scroll
- Latar jaringan titik animasi (`<canvas>`)
- Efek mouse: cahaya mengikuti kursor, kartu bercahaya, tombol magnetik, foto miring 3D
- Menu hamburger di HP
- Mendukung pengguna yang mematikan animasi (`prefers-reduced-motion`)

## Penjelasan `index.html`

Halaman dibagi menjadi section yang masing-masing punya `id` agar bisa dituju dari menu:

| `id` | Isi |
|---|---|
| `home` | Hero: nama, peran, kalimat pembuka, foto |
| `about` | Tentang saya dan data diri |
| `story` | Cerita hidup (4 bab) |
| `journey` | Timeline pengalaman |
| `skills` | Kekuatan |
| `philosophy` | Kutipan dan filosofi |
| `contact` | Kontak (Instagram, WhatsApp, GitHub) |

Beberapa kelas yang dipakai berulang:

- `.reveal` — elemen yang animasinya muncul saat masuk layar
- `.card` — kartu dengan efek cahaya
- `.section` — pembungkus tiap bagian
- `data-split` — atribut yang menandai judul agar dipecah per kata oleh JavaScript

## Penjelasan `css/style.css`

File dibagi menjadi 16 bagian bernomor (lihat daftar isi di baris paling atas file).

**Variabel warna.** Semua warna disimpan di blok `:root`. Untuk mengganti tema, cukup ubah nilai di sana:

```css
:root {
  --blue: #2f7bff;
  --red:  #ff3b5c;
  --violet: #8b5cf6;
  --gradient: linear-gradient(110deg, var(--blue), var(--violet) 50%, var(--red));
}
```

**Teknik utama yang dipakai:**

- **CSS Grid & Flexbox** untuk layout
- **CSS Variables** untuk tema dan nilai dinamis (misalnya `--mx`, `--my`, `--hp` yang diisi JavaScript)
- **`clamp()`** agar ukuran huruf dan jarak menyesuaikan lebar layar
- **`@keyframes`** untuk animasi (aurora, orbit, teks berjalan, peran berganti)
- **Media query** (`max-width: 860px` dan `480px`) untuk tampilan HP dan tablet
- **`position: sticky`** untuk bagian cerita hidup di layar besar
- **`backdrop-filter`** untuk efek kaca pada navbar dan label foto

## Penjelasan `js/script.js`

Kode dibagi menjadi fungsi kecil dengan satu tugas masing-masing, dibungkus dalam satu fungsi (*IIFE*) supaya variabelnya tidak bocor ke luar.

| Fungsi | Tugas |
|---|---|
| `splitText()` | Memecah judul dan kutipan menjadi per kata agar bisa dianimasikan satu per satu |
| `initIntro()` | Menampilkan intro, menghitung persentase 0–100%, lalu menutupnya. Intro hanya muncul sekali per sesi (`sessionStorage`) |
| `initReveal()` | Memakai `IntersectionObserver` untuk memberi kelas `in` saat elemen masuk layar, sekaligus menandai menu yang aktif |
| `initMenu()` | Membuka dan menutup menu hamburger di HP (termasuk tombol Esc dan atribut aksesibilitas) |
| `initContactLinks()` | Menambahkan pesan otomatis ke link WhatsApp, mengisi tahun footer, dan tombol kembali ke atas |
| `initPointerEffects()` | Efek mouse: cahaya kartu, tombol magnetik, cahaya kursor, foto 3D. Dilewati di layar sentuh |
| `initStory()` + `updateStory()` | Mengatur mode "terkunci" untuk cerita hidup di layar besar dan menentukan bab yang tampil sesuai posisi scroll |
| `updateOnScroll()` | Mengumpulkan semua perubahan yang bergantung pada scroll: navbar, garis progres, timeline, kutipan, paralaks |
| `requestScrollUpdate()` | Membatasi `updateOnScroll()` agar hanya berjalan sekali per frame (`requestAnimationFrame`) |
| `initNetworkCanvas()` | Menggambar jaringan titik biru–merah di `<canvas>` dan menghubungkan titik yang berdekatan |

**Konsep JavaScript yang dipakai:** manipulasi DOM (`querySelector`, `classList`, `style.setProperty`), *event listener*, `IntersectionObserver`, `requestAnimationFrame`, `matchMedia`, `sessionStorage`, Canvas 2D API, *arrow function*, dan *template literal*.

**Alur singkat saat halaman dibuka:**

1. HTML dan CSS dimuat, lalu `script.js` berjalan.
2. `splitText()` memecah judul menjadi kata-kata.
3. `initIntro()` menampilkan intro. Setelah selesai, kelas `ready` ditambahkan ke `<html>` dan animasi hero dimulai.
4. Saat pengguna scroll, `updateOnScroll()` memperbarui semua efek berbasis posisi, dan `IntersectionObserver` memunculkan elemen satu per satu.

## Teknologi

- HTML5
- CSS3
- JavaScript (ES6)
- Google Fonts: Inter dan Space Grotesk

## Penulis

**Muhammad Arifin Albukhori**
Mahasiswa Universitas Indraprasta PGRI · Citeureup, Bogor

- GitHub: [@albukhoryariefin121-alt](https://github.com/albukhoryariefin121-alt)
- Instagram: [@akemireyy_](https://www.instagram.com/akemireyy_/)
