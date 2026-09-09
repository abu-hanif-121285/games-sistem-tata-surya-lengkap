# Tata Surya Explorer 6

Aplikasi pembelajaran IPAS Fase C untuk kelas 6 SD. Antarmuka berbahasa Indonesia, planetarium 2.5D, materi, kuis, lima permainan, serta progres perangkat lokal.

## Menjalankan

Gunakan `npm install`, lalu `npm run dev`. Hasil produksi dibuat menggunakan skrip `npm run build` yang tersedia. Aplikasi tidak memerlukan server aplikasi, akun, API key, atau layanan berbayar. Routing menggunakan hash sehingga halaman dapat dibuka pada hosting statis.

## Struktur

- `src/App.tsx`: shell, sidebar, navigasi mobile, routing, panduan, dan transisi halaman.
- `src/data/planets.ts`: sumber data astronomi dan referensi ilmiah.
- `src/data/lessons.ts`: tujuh materi, inti pemahaman, dan refleksi.
- `src/data/questions.ts`: bank soal dan tipe interaksi.
- `src/data/gamification.ts`: level, badge, misi, dan katalog permainan.
- `src/components/ExplorationEngine.tsx`: kamera 2.5D, drag, pinch zoom, pemilihan, orbit, dan skala.
- `src/components/QuestionActivity.tsx`: pilihan ganda, benar/salah, memilih planet, mencocokkan, pengelompokan drag-and-drop, dan pengurutan.
- `src/components/OrderActivity.tsx`: drag-and-drop serta tombol alternatif untuk keyboard dan layar sentuh.
- `src/pages/Quiz.tsx`: sesi kuis, cakupan materi, kesulitan, challenge bertahap, penilaian, dan hasil.
- `src/pages/Games.tsx`: lima mesin permainan dengan skor dan pengulangan.
- `src/state/LearningContext.tsx`: aktivitas, XP, badge, misi, dan pemberitahuan.
- `src/state/gamification.ts`: mesin misi, badge, level, dan streak yang terpisah dari penyimpanan.
- `src/state/storage.ts`: model progres berversi, validasi data, dan adapter `ProgressRepository`.
- `src/state/audio.ts`: efek suara opsional melalui Web Audio.
- `src/pages/Teacher.tsx`: pemantauan profil lokal, riwayat kuis, refleksi, ekspor JSON, serta reset berkonfirmasi.

## Batas Visual dan Fakta

Mode pembelajaran tidak berskala. Mode realistis menggunakan perbandingan jarak rata-rata Matahari-planet, dengan simbol planet diperbesar agar dapat dipilih. Orbit dibuat sederhana, bukan efemeris atau posisi planet saat ini. Kecepatan animasi bukan kecepatan fisik. Diagram perbandingan menggunakan rasio diameter khatulistiwa tanpa cincin.

Fakta mengacu pada NASA Science dan NASA Planetary Fact Sheet. Acuan kurikulum dan tautan sumber tersedia pada menu Sumber & tentang. Gambar beranda dan astronaut merupakan ilustrasi artistik. Tekstur planet dari Solar System Scope, CC BY 4.0; tekstur Bumi dan Matahari memakai salinan beresolusi lebih rendah dari repositori homer-jay/solar-system-textures. Rendering CSS menambahkan pencahayaan dan memiliki fallback visual jika tekstur eksternal gagal dimuat. Font dan tekstur eksternal memerlukan koneksi internet saat pertama dimuat. Tidak ada klaim mode offline penuh.

Sumber tekstur: https://www.solarsystemscope.com/textures/ . Lisensi: https://creativecommons.org/licenses/by/4.0/ . Adaptasi: pemetaan pada bola 2.5D, ukuran tampilan, bayangan CSS, dan cincin ilustratif.

## Aturan Progres

- Planet memberi +10 XP pada pembelajaran pertama, tidak termasuk Matahari yang merupakan bintang.
- Materi memberi +20 XP sekali; siswa menulis refleksi sebelum menyelesaikan.
- Jawaban kuis benar memberi +10 XP per sesi. Nilai akhir tersimpan setelah seluruh kuis selesai.
- Mini game memberi +30 XP pada penyelesaian pertama. Skor permainan +10 untuk jawaban benar pada percobaan pertama.
- Misi memberi +50 XP sekali. Ambang level adalah 0, 100, 300, dan 600 XP.
- Kuis menyimpan 30 sesi terakhir dan nilai terbaik sepanjang progres lokal.
- Nama panggilan, refleksi, XP, badge, misi, dan progres disimpan dalam localStorage. Tidak ada data dikirim ke backend.

## Pengembangan Berikutnya

Ganti adapter `ProgressRepository` untuk penyimpanan tambahan. Untuk backend asinkron, tambahkan hidrasi, antrean penyimpanan, autentikasi, aturan akses, serta penyelesaian konflik di `LearningProvider`, tanpa mengubah mesin materi atau kuis. Google Sheets membutuhkan endpoint aman seperti Apps Script, bukan kredensial di browser. Firebase membutuhkan autentikasi dan security rules sebelum mendukung kelas multi-siswa.

Mesin eksplorasi dapat diganti dengan renderer WebGL/Three.js sambil mempertahankan data planet, pemilihan, dan sistem XP. Mode Guru hanya memantau satu profil pada satu browser, tanpa autentikasi admin.

## Aksesibilitas

Dialog native mendukung pengelolaan fokus dan Escape. Tombol ikon berlabel, progress bar memakai atribut ARIA, feedback tidak hanya bergantung pada warna, dan animasi mengikuti preferensi kurangi gerakan. Peta mendukung keyboard, tombol zoom, drag, dan pinch. Seluruh drag-and-drop memiliki alternatif tombol atau select.

## Pemeriksaan Sebelum Pemakaian Kelas

Build produksi diperiksa dengan skrip build proyek. Pengujian browser end-to-end dan pengujian perangkat fisik belum dijalankan di lingkungan implementasi ini. Daftar pemeriksaan manual:

1. Buka setiap halaman melalui sidebar, navigasi mobile, dan tombol kembali browser.
2. Geser peta, zoom, putar, tampilkan/sembunyikan orbit, pilih planet, dan buka profil. Periksa keterangan kedua mode skala.
3. Pelajari satu planet, muat ulang, dan kunjungi kembali. XP penemuan tidak boleh diberikan dua kali.
4. Selesaikan materi pertama dengan refleksi. Pastikan +20 XP materi dan +50 XP misi pertama, serta refleksi tetap ada setelah muat ulang.
5. Kerjakan seluruh tipe soal. Periksa feedback setelah mencoba, nilai akhir, riwayat guru, dan XP jawaban benar.
6. Mainkan kelima mini game. Coba jawaban salah, ulangi sampai benar, lalu ulangi sesi untuk memeriksa aturan XP sekali per permainan.
7. Uji alternatif tombol panah dan select untuk drag-and-drop, navigasi keyboard, suara opsional, serta preferensi kurangi gerakan.
8. Unduh laporan guru, batalkan reset, lalu konfirmasi reset. Periksa penyimpanan perangkat dan badge terkunci kembali.