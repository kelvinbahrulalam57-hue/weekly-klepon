# Rencana Implementasi & Hasil: Hitung Mundur & Pembaruan Poster Turnamen

## 1. Komponen Hitung Mundur (Countdown Timer) di HeroSection
- **Tampilan Real-time Cyber Esports:**
  - Ditambahkan panel hitung mundur berdesain neon cyber modern tepat di bawah banner turnamen pada `HeroSection`.
  - Menghitung mundur sisa waktu secara live (setiap 1 detik) menuju batas akhir pendaftaran & kualifikasi mingguan (`Minggu, 23:59:59 WIB`).
  - Menampilkan 4 kotak digital interaktif dengan efek glow:
    - **HARI** (Days)
    - **JAM** (Hours)
    - **MENIT** (Minutes)
    - **DETIK** (Seconds) dengan highlight aksen amber
  - Dilengkapi badge status: `LIVE COUNTDOWN`, penanda `Minggu Ke-X`, teks informasi penentuan Top 10 Poin Terbesar, serta status pendaftaran aktif / selesai.

## 2. Pembaruan Poster Turnamen Resmi & Solusi Permanen Anti-Polos
- **Poster Turnamen Resmi Baru:**
  - Dibuatkan grafis poster turnamen resmi esport resolusi tinggi dengan teks *"KLEPON WEEKLY TOURNAMENT - FREE FIRE CLASH SQUAD"*, trofi emas bersayap menyala neon, panggung arena turnamen, dan badge tantangan mingguan.
  - File aset: `/src/assets/images/klepon_official_tournament_poster_1793580030422.jpg`.
- **Perbaikan "Tidak Bolak-Balik Menghapus":**
  - **Penyebab Sebelumnya:** Saat admin menghapus poster di Dashboard, listener real-time Firestore melakukan *union-merge* dengan memori lokal dan Firestore snapshot lama, sehingga poster yang sudah dihapus atau poster polos bawaan lama terus dimunculkan kembali.
  - **Solusi yang Diterapkan:**
    1. Ditambahkan pelacak ID poster terhapus permanen (`DELETED_BANNERS_KEY = 'klepon_deleted_banner_ids_v1'`).
    2. Pada listener `onSnapshot('banners')`, dokumen banner yang sudah pernah dihapus otomatis langsung di-purge dari Firestore dan disaring keluar sehingga tidak akan pernah kembali lagi.
    3. Poster latar stadion lama yang polos otomatis di-upgrade ke poster turnamen resmi bergrafis lengkap.
    4. Fungsi `getBanners()` menyaring semua entri kosong/polos dan memastikan hanya poster aktif dan berkualitas yang ditampilkan.

## 3. Verifikasi
- TypeScript & Lint check (`tsc --noEmit`): Lolos tanpa error.
- Vite compilation (`compile_applet`): Berhasil.
- Endpoint preview localhost 3000: Berstatus HTTP 200 OK.
