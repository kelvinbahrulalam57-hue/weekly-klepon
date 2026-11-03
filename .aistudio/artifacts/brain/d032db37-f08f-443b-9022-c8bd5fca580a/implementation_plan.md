# Rencana Implementasi & Hasil: Modal Riwayat Pertandingan & Eliminasi Ciri AI

## 1. Modal Profil & Riwayat Pertandingan Tim (`PlayerDetailModal.tsx`)
- **Fitur Interaktif:**
  - Setiap baris atau nama tim pada `LeaderboardSection` kini dapat diklik (`cursor-pointer`) dengan efek sorot interaktif dan teks panduan: *"💡 Klik nama tim atau baris mana pun di bawah untuk membuka profil tim, statistik total menang, dan arsip bukti stiker DONE"*.
  - Mengklik nama/baris tim akan membuka sub-view modal profil mendalam (`PlayerDetailModal`):
    - **Header Tim:** Foto profil tim, nama squad, tag turnamen, nama kapten, nomor WhatsApp, dan badge posisi peringkat (#1, #2, dst).
    - **Status Kualifikasi Turnamen:** Penanda apakah tim saat ini berada di zona aman lolos ke Bagan 10 Besar Mingguan atau membutuhkan poin tambahan.
    - **Grid Statistik Pertandingan:** Total Poin Klasemen, Total Kemenangan (Wins FT), Win Rate (%), Total Pertandingan (Matches), dan Current Win Streak (dengan highlight api jika sedang on-fire).
    - **Arsip Riwayat Pertandingan (Match History):** Daftar seluruh storan kemenangan FT tim yang telah disahkan panitia lengkap dengan tanggal/jam, nama pot, status verifikasi (+1 Poin), catatan panitia, serta thumbnail foto screenshot bukti stiker DONE di GB yang dapat diklik untuk inspeksi resolusi penuh.
    - **Aksi Cepat:** Tautan langsung untuk chat WhatsApp dengan kapten tim.

## 2. Eliminasi Ciri Khas Template Buatan AI (Human-Crafted Look)
- **Pembersihan "AI Slop" & Generic Badge Pills:**
  - Menghapus badge pil mengambang dengan efek pulsing berlebihan seperti `[LIVE COUNTDOWN]`, `[POSTER AKTIF]`, dan `Live Realtime Sync`.
  - Mengganti teks mekanis / robotik menjadi tipografi editorial turnamen esport komunitas Free Fire Indonesia yang natural dan otentik.
  - Sub-header hero kini tampil bersih dan profesional: `Turnamen Mingguan Free Fire Clash Squad · 100% Gratis · Sistem Bagan 10 Besar`.
  - Timer hitung mundur kini memiliki judul dan label waktu yang rapi tanpa lencana pulsing buatan AI.
  - Galeri poster menyajikan judul editorial bersih (`Poster Utama Turnamen`).

## 3. Pengujian & Verifikasi
- TypeScript check (`tsc --noEmit`): Bersih tanpa error.
- Vite build (`compile_applet`): Sukses.
- HTTP Dev Server: 200 OK.
