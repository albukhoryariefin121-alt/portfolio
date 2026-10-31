/* =========================================================
   PORTOFOLIO — Muhammad Arifin Albukhori
   File : js/script.js

   Semua fitur dibagi menjadi fungsi kecil, masing-masing
   punya satu tugas. Urutan pemanggilan ada di bagian paling
   bawah file (bagian "JALANKAN SEMUA FITUR").

   DAFTAR FUNGSI
    1. splitText()          memecah judul jadi per kata (untuk animasi)
    2. initIntro()          layar pembuka + persentase loading
    3. initReveal()         elemen muncul saat di-scroll + menu aktif
    4. initMenu()           menu hamburger di HP
    5. initContactLinks()   pesan WhatsApp, tahun footer, tombol "atas"
    6. initPointerEffects() efek mouse (cahaya, kartu, tombol, foto 3D)
    7. initStory()          bagian "Cerita hidup"
    8. updateOnScroll()     semua hal yang berubah saat halaman di-scroll
    9. initNetworkCanvas()  latar jaringan titik animasi
   ========================================================= */

(() => {
  'use strict';   // mode ketat: membantu menghindari kesalahan penulisan kode


  /* =======================================================
     0. HELPER & DATA BERSAMA
     ======================================================= */

  // Singkatan untuk mengambil elemen: $('#id') = satu elemen, $$('.kelas') = semua elemen
  const $  = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  // Membatasi angka agar tetap di antara min dan max
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const root = document.documentElement;   // elemen <html>

  // Deteksi perangkat & preferensi pengguna
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches; // pengguna minta animasi dikurangi
  const hasMouse = matchMedia('(hover: hover) and (pointer: fine)').matches;           // laptop/PC (bukan layar sentuh)

  // Nomor WhatsApp & pesan otomatis
  const WA_NUMBER  = '6282318281072';
  const WA_MESSAGE = 'Halo Arifin, saya melihat portofolio Anda dan ingin terhubung.';

  // Menandai bahwa JavaScript aktif. CSS memakai kelas ".js"
  // untuk menyembunyikan elemen sebelum dianimasikan.
  root.classList.add('js');

  // Elemen yang dipakai di beberapa fungsi, diambil sekali di sini
  const quoteText = $('#quoteText');
  let quoteWords  = [];   // diisi oleh splitText()


  /* =======================================================
     1. PECAH TEKS PER KATA
     "Halo dunia" menjadi <span>Halo</span> <span>dunia</span>
     supaya tiap kata bisa muncul bergantian (animasi CSS).
     ======================================================= */
  function splitText() {
    // a) Judul dengan atribut data-split: kata muncul satu per satu
    $$('[data-split]').forEach((element) => {
      const text = element.textContent.trim();
      element.setAttribute('aria-label', text);   // pembaca layar tetap membaca teks utuh

      element.innerHTML = text
        .split(/\s+/)
        .map((word, index) => `<span class="w" aria-hidden="true" style="--i:${index}">${word}</span>`)
        .join(' ');
    });

    // b) Kutipan di bagian Filosofi: kata menyala sesuai posisi scroll
    const quote = quoteText.textContent.trim();
    quoteText.setAttribute('aria-label', quote);
    quoteText.innerHTML = quote
      .split(/\s+/)
      .map((word) => `<span class="w" aria-hidden="true">${word}</span>`)
      .join(' ');
    quoteWords = $$('.w', quoteText);
  }


  /* =======================================================
     2. INTRO
     Menampilkan persentase 0-100%, lalu intro naik ke atas.
     Intro hanya tampil sekali per sesi (disimpan di sessionStorage).
     ======================================================= */
  function initIntro() {
    const intro = $('#intro');
    const percent = $('#pct');
    const INTRO_DURATION = 1900;   // lama hitungan persen (milidetik)

    // Cek apakah intro sudah pernah dilihat
    let alreadySeen = false;
    try { alreadySeen = sessionStorage.getItem('introSeen') === '1'; } catch (error) { /* abaikan */ }

    // Menutup intro dan memulai animasi hero
    function finishIntro() {
      if (intro.classList.contains('done')) return;   // cegah dipanggil dua kali

      intro.classList.add('done');       // CSS menaikkan intro keluar layar
      root.classList.add('ready');       // CSS memunculkan elemen hero
      try { sessionStorage.setItem('introSeen', '1'); } catch (error) { /* abaikan */ }

      setTimeout(() => { intro.hidden = true; }, 1100);   // sembunyikan total setelah animasi selesai
    }

    // Lewati intro bila sudah pernah dilihat atau pengguna mengurangi animasi
    if (alreadySeen || prefersReducedMotion) {
      intro.hidden = true;
      root.classList.add('ready');
      return;
    }

    // Hitung persentase memakai requestAnimationFrame (halus, mengikuti refresh layar)
    const startTime = performance.now();
    function countPercent(now) {
      const progress = clamp((now - startTime) / INTRO_DURATION, 0, 1);   // 0 sampai 1
      percent.textContent = Math.round(progress * 100) + '%';
      if (progress < 1 && !intro.classList.contains('done')) requestAnimationFrame(countPercent);
    }
    requestAnimationFrame(countPercent);

    setTimeout(finishIntro, INTRO_DURATION + 200);      // otomatis selesai
    $('#skip').addEventListener('click', finishIntro);  // atau lewati manual
  }


  /* =======================================================
     3. MUNCUL SAAT DI-SCROLL + MENU AKTIF
     Memakai IntersectionObserver: browser memberi tahu
     ketika sebuah elemen masuk ke dalam layar.
     ======================================================= */
  function initReveal() {
    const revealItems = $$('.reveal, [data-split]');

    // Browser lama tanpa IntersectionObserver: langsung tampilkan semua
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('in'));
      return;
    }

    // a) Elemen masuk layar -> beri kelas "in" (CSS yang menganimasikannya)
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);   // cukup sekali, tidak perlu dipantau lagi
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealItems.forEach((item) => revealObserver.observe(item));

    // b) Section yang sedang terlihat -> tandai link menu yang sesuai
    const menuLinks = $$('.menu a');
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        menuLinks.forEach((link) => link.classList.toggle('active', link.hash === '#' + entry.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });   // garis pantau di tengah layar

    $$('main section[id]').forEach((section) => sectionObserver.observe(section));
  }


  /* =======================================================
     4. MENU HAMBURGER (HP)
     ======================================================= */
  function initMenu() {
    const burger = $('#burger');
    const menu = $('#menu');

    // Buka/tutup menu, sekaligus mengatur atribut aksesibilitas
    function setMenuOpen(isOpen) {
      menu.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      burger.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
      document.body.style.overflow = isOpen ? 'hidden' : '';   // kunci scroll saat menu terbuka
    }

    burger.addEventListener('click', () => setMenuOpen(!menu.classList.contains('open')));
    menu.addEventListener('click', (event) => { if (event.target.closest('a')) setMenuOpen(false); }); // tutup setelah pilih menu
    addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenuOpen(false); });       // tombol Esc

    // Jika layar diperlebar ke ukuran laptop, pastikan menu tertutup
    matchMedia('(min-width: 861px)').addEventListener?.('change', (event) => { if (event.matches) setMenuOpen(false); });
  }


  /* =======================================================
     5. LINK KONTAK, TAHUN, TOMBOL "KEMBALI KE ATAS"
     ======================================================= */
  function initContactLinks() {
    // Tambahkan pesan otomatis ke semua link WhatsApp
    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;
    $$('.wa').forEach((link) => { link.href = waUrl; });

    // Tahun di footer selalu mengikuti tahun saat ini
    $('#year').textContent = new Date().getFullYear();

    // Tombol kembali ke atas
    $('#toTop').addEventListener('click', () => {
      scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }


  /* =======================================================
     6. EFEK MOUSE (hanya laptop/PC)
     Di layar sentuh efek ini dilewati agar ringan.
     ======================================================= */
  function initPointerEffects() {
    if (!hasMouse || prefersReducedMotion) return;

    // a) Kartu: posisi kursor disimpan ke variabel CSS --mx dan --my,
    //    lalu CSS menggambar cahaya di titik tersebut.
    $$('.card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const box = card.getBoundingClientRect();
        card.style.setProperty('--mx', (event.clientX - box.left) + 'px');
        card.style.setProperty('--my', (event.clientY - box.top) + 'px');
      }, { passive: true });
    });

    // b) Tombol "magnetik": sedikit bergeser mengikuti kursor
    $$('.magnetic').forEach((button) => {
      button.addEventListener('pointermove', (event) => {
        const box = button.getBoundingClientRect();
        const offsetX = (event.clientX - box.left - box.width / 2) * 0.18;
        const offsetY = (event.clientY - box.top - box.height / 2) * 0.28;
        button.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });
      button.addEventListener('pointerleave', () => { button.style.transform = ''; });
    });

    // c) Cahaya besar yang mengikuti mouse dengan gerakan lembut (lerp)
    //    lerp = tiap frame, posisi bergerak 8% menuju target.
    const glow = $('#glow');
    let glowX = innerWidth / 2, glowY = innerHeight / 2;
    let targetX = glowX, targetY = glowY;

    addEventListener('pointermove', (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      glow.classList.add('on');
    }, { passive: true });

    (function animateGlow() {
      glowX += (targetX - glowX) * 0.08;
      glowY += (targetY - glowY) * 0.08;
      glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
      requestAnimationFrame(animateGlow);
    })();

    // d) Foto di hero miring 3D mengikuti posisi mouse
    const hero = $('#home');
    const frame = $('#frame');

    hero.addEventListener('pointermove', (event) => {
      const box = hero.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;    // -0.5 sampai 0.5
      const y = (event.clientY - box.top) / box.height - 0.5;
      frame.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
      frame.style.setProperty('--rx', (-y * 8).toFixed(2) + 'deg');
    }, { passive: true });

    hero.addEventListener('pointerleave', () => {
      frame.style.setProperty('--ry', '0deg');
      frame.style.setProperty('--rx', '0deg');
    });
  }


  /* =======================================================
     7. CERITA HIDUP
     - Layar besar : halaman "terkunci" (kelas .pinned), bab
                     berganti sesuai posisi scroll.
     - Layar kecil : bab tampil sebagai kartu biasa.
     ======================================================= */
  const story = $('#story');
  const chapters = $$('.chapter');
  const storyDots = $$('.story-dots i');
  const storyCount = $('#storyCount');
  const pinQuery = matchMedia('(min-width: 900px) and (min-height: 640px)');

  let isPinned = false;       // apakah mode terkunci sedang aktif
  let activeChapter = -1;     // nomor bab yang sedang tampil

  function initStory() {
    function applyLayout() {
      isPinned = pinQuery.matches && !prefersReducedMotion;
      story.classList.toggle('pinned', isPinned);

      if (!isPinned) chapters.forEach((chapter) => chapter.classList.remove('on', 'past'));
      activeChapter = -1;
      updateOnScroll();
    }

    pinQuery.addEventListener?.('change', applyLayout);   // jalankan ulang saat ukuran layar berubah
    applyLayout();
  }

  // Menentukan bab mana yang tampil berdasarkan seberapa jauh section di-scroll
  function updateStory() {
    if (!isPinned) return;

    const box = story.getBoundingClientRect();
    const progress = clamp(-box.top / (box.height - innerHeight), 0, 1);               // 0 sampai 1
    const index = Math.min(chapters.length - 1, Math.floor(progress * chapters.length)); // 0, 1, 2, 3

    if (index === activeChapter) return;   // tidak ada perubahan, tidak perlu kerja ulang
    activeChapter = index;

    chapters.forEach((chapter, i) => {
      chapter.classList.toggle('on', i === index);     // bab aktif
      chapter.classList.toggle('past', i < index);     // bab yang sudah lewat
    });
    storyDots.forEach((dot, i) => dot.classList.toggle('on', i <= index));
    storyCount.textContent = `0${index + 1} / 0${chapters.length}`;
  }


  /* =======================================================
     8. UPDATE SAAT SCROLL
     Semua perubahan yang bergantung pada posisi scroll
     dikumpulkan di sini. Dipanggil lewat requestAnimationFrame
     supaya hanya berjalan sekali per frame (tidak berat).
     ======================================================= */
  const nav = $('#nav');
  const progressBar = $('#progress');
  const hero = $('#home');
  const frame = $('#frame');
  const timeline = $('#timeline');
  const bgWords = $$('.bg-word');
  let scrollQueued = false;

  function updateOnScroll() {
    scrollQueued = false;

    const y = scrollY;                                          // posisi scroll saat ini
    const maxScroll = root.scrollHeight - innerHeight;          // total jarak yang bisa di-scroll

    // a) Navbar: tambah latar kaca setelah sedikit di-scroll
    nav.classList.toggle('solid', y > 30);

    // b) Garis progres di atas layar (0% - 100% lebar)
    progressBar.style.transform = `scaleX(${maxScroll > 0 ? y / maxScroll : 0})`;

    // c) Hero: teks memudar & foto bergeser pelan saat di-scroll
    hero.style.setProperty('--hp', clamp(y / (innerHeight * 0.9), 0, 1).toFixed(3));
    if (!prefersReducedMotion) frame.style.setProperty('--sy', (Math.min(y, innerHeight) * -0.05).toFixed(1) + 'px');

    // d) Timeline: garis berwarna memanjang mengikuti scroll
    const timelineBox = timeline.getBoundingClientRect();
    const timelineFill = clamp((innerHeight * 0.6 - timelineBox.top) / timelineBox.height, 0, 1);
    timeline.style.setProperty('--f', timelineFill.toFixed(3));

    // e) Kutipan: semakin jauh di-scroll, semakin banyak kata yang menyala
    const quoteBox = quoteText.getBoundingClientRect();
    const quoteProgress = clamp((innerHeight * 0.85 - quoteBox.top) / (quoteBox.height + innerHeight * 0.35), 0, 1);
    const litWords = Math.round(quoteProgress * 1.15 * quoteWords.length);
    quoteWords.forEach((word, i) => word.classList.toggle('on', prefersReducedMotion || i < litWords));

    // f) Cerita hidup (mode terkunci)
    updateStory();

    // g) Tulisan raksasa di belakang judul bergeser pelan (efek paralaks)
    if (!prefersReducedMotion && innerWidth > 700) {
      bgWords.forEach((word) => {
        const parentBox = word.parentNode.getBoundingClientRect();
        const shift = ((parentBox.top + parentBox.height / 2 - innerHeight / 2) / innerHeight) * -14;
        word.style.transform = `translate3d(${shift}vw, 0, 0)`;
      });
    }
  }

  // Dijalankan paling banyak sekali per frame, tidak setiap event scroll
  function requestScrollUpdate() {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(updateOnScroll);
  }


  /* =======================================================
     9. LATAR JARINGAN TITIK (CANVAS)
     Titik-titik biru & merah bergerak pelan; titik yang
     berdekatan dihubungkan garis tipis.
     ======================================================= */
  function initNetworkCanvas() {
    const canvas = $('#net');
    const ctx = canvas.getContext('2d');

    const LINK_DISTANCE = 130;    // jarak maksimum dua titik terhubung (px)
    const POINTER_RADIUS = 160;   // jarak titik terhubung ke kursor (px)

    let width, height;
    let points = [];
    let pointerX = -999, pointerY = -999;   // posisi kursor (di luar layar saat belum bergerak)
    let isRunning = true;

    // Mengatur ukuran canvas & membuat titik baru sesuai luas layar
    function resize() {
      const ratio = Math.min(devicePixelRatio || 1, 2);   // agar tajam di layar retina
      width = innerWidth;
      height = innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = clamp(Math.round((width * height) / 18000), 18, 64);   // layar kecil = titik lebih sedikit
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,   // kecepatan horizontal
        vy: (Math.random() - 0.5) * 0.3,   // kecepatan vertikal
        radius: Math.random() * 1.3 + 0.6,
        isRed: Math.random() < 0.3         // 30% titik berwarna merah, sisanya biru
      }));

      if (prefersReducedMotion) draw();    // tanpa animasi: gambar sekali saja
    }

    // Menggambar satu frame
    function draw() {
      ctx.clearRect(0, 0, width, height);

      // 1) Gerakkan semua titik, pantulkan jika menyentuh tepi layar
      if (!prefersReducedMotion) {
        for (const p of points) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width)  p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }
      }

      // 2) Gambar titik dan garis penghubungnya
      for (let i = 0; i < points.length; i++) {
        const a = points[i];

        ctx.fillStyle = a.isRed ? 'rgba(255, 90, 120, .75)' : 'rgba(124, 214, 255, .75)';
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
        ctx.fill();

        // Hubungkan dengan titik lain yang cukup dekat
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance >= LINK_DISTANCE) continue;

          const alpha = ((1 - distance / LINK_DISTANCE) * 0.26).toFixed(3);   // makin jauh makin pudar
          ctx.strokeStyle = (a.isRed || b.isRed) ? `rgba(255, 59, 92, ${alpha})` : `rgba(47, 123, 255, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }

        // Hubungkan dengan kursor mouse (laptop/PC saja)
        if (hasMouse) {
          const pointerDistance = Math.hypot(a.x - pointerX, a.y - pointerY);
          if (pointerDistance < POINTER_RADIUS) {
            const alpha = ((1 - pointerDistance / POINTER_RADIUS) * 0.45).toFixed(3);
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointerX, pointerY);
            ctx.stroke();
          }
        }
      }
    }

    resize();

    // Hitung ulang saat ukuran layar berubah (ditunda 150 ms agar tidak berat)
    let resizeTimer;
    addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    if (hasMouse) {
      addEventListener('pointermove', (event) => { pointerX = event.clientX; pointerY = event.clientY; }, { passive: true });
    }

    // Loop animasi, dihentikan saat tab browser tidak sedang dilihat (hemat baterai)
    if (!prefersReducedMotion) {
      (function loop() {
        if (isRunning) draw();
        requestAnimationFrame(loop);
      })();
      document.addEventListener('visibilitychange', () => { isRunning = !document.hidden; });
    }
  }


  /* =======================================================
     JALANKAN SEMUA FITUR
     Urutan ini penting: teks harus dipecah dulu sebelum
     dianimasikan, dan cerita harus disiapkan sebelum scroll.
     ======================================================= */
  splitText();
  initIntro();
  initReveal();
  initMenu();
  initContactLinks();
  initPointerEffects();
  initStory();
  initNetworkCanvas();

  addEventListener('scroll', requestScrollUpdate, { passive: true });
  addEventListener('resize', requestScrollUpdate);
  updateOnScroll();   // hitung kondisi awal tanpa menunggu scroll
})();
