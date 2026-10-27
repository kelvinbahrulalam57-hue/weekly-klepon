# KLEPON X V3.1 — Platform Turnamen Esports & Verifikasi Anti-Kecurangan Realtime

Platform web esports kompetitif untuk komunitas turnamen dan scrim (Fast Tournament / FT) KLEPON X dengan leaderboard mingguan real-time, dashboard manajemen admin, pusat edukasi anti-bukti palsu yang tegas, serta integrasi kontak resmi WhatsApp Admin & Link Grup FT.

> [!IMPORTANT]
> Sistem dilengkapi dengan arsitektur **Dual Interface**:
> 1. **Portal Publik Pemain**: Pendaftaran tim/solo, jadwal turnamen aktif, Leaderboard Top 10 mingguan, formulir upload bukti kemenangan (Booyah / Victory), pusat edukasi inspeksi bukti palsu, dan tombol kontak WhatsApp Admin & Grup FT.
> 2. **Panel Admin Esports**: Otentikasi admin, verifikasi laporan win (Approve menambah +1 Poin otomatis & Win counter, Reject dengan catatan sanksi), manajemen Season mingguan, serta daftar sanksi/blacklist penipu.
> 3. **Integrasi Data Realtime**: Dukungan Supabase Client terkonfigurasi dengan fallback penyimpanan lokal reaktif (sehingga aplikasi dapat langsung diuji dan beroperasi tanpa jeda di lingkungan preview).

---

### 1. Overview & Core Concept

- **Tujuan Utama**: Memberikan ruang kompetisi yang adil, transparan, dan berkelas bagi pemain esports, menghentikan manipulasi bukti kemenangan (screenshot palsu/editan), serta mempermudah panitia mengelola season dan perolehan poin.
- **Target Pengguna**: Pemain/Kapten Tim Fast Tournament (Free Fire, Mobile Legends, dan turnamen komunitas) serta Panitia/Admin KLEPON X.
- **Nilai Utama**: Verifikasi cepat, transparansi sanksi kecurangan, dan akses satu klik ke komunitas resmi tanpa perantara penipu.

---

### 2. User Experience & Visual Design

- **Aesthetic Direction**: *Tactical Dark Esports* — Latar belakang charcoal gelap yang pekat (`#090D16`, `#0F172A`), aksen neon emerald (`#10B981`) dan crimson alert (`#EF4444`), tipografi tajam yang tegas, tanpa elemen ornamen semu (zero-pill metadata, hairline dividers, tabular nums).
- **Struktur Antarmuka**:
  - **Header Navigasi (Top Bar Contract)**: Brand wordmark `KLEPON X`, tautan cepat (*Turnamen*, *Leaderboard*, *Anti-Cheat Edukasi*, *Kontak FT*), dan tombol aksi switcher *Login Admin / Portal Pemain*.
  - **Hero Section**: Status Season aktif (KLEPON X - Week 1), jadwal FT hari ini, countdown pertandingan, dan tombol cepat *Gabung Grup FT WhatsApp* & *Hubungi Admin*.
  - **Live Leaderboard & Scrim Standings**: Tabel peringkat Top 10 dengan `tabular-nums`, status poin, win streaks, dan lencana tier tim.
  - **Formulir Lapor Kemenangan (Win Report)**: Form submit bukti match dengan panduan komprehensif, upload screenshot (preview langsung), input Room ID, UID/Nama Kapten, dan checkbox persetujuan integritas data.
  - **Pusat Edukasi Anti-Palsu (Anti-Fraud Zone)**:
    - *Simulator Inspeksi Screenshot*: Perbandingan interaktif antara Bukti Asli vs Bukti Editan (watermark palsu, perbedaan font pixel, timestamp baterai/jam yang tidak sinkron).
    - *Aturan Wajib Bukti*: Standar screenshot penuh layar tanpa crop, wajib terlihat Room ID dan UID.
    - *Daftar Sanksi & Blacklist*: Papan peringatan transparansi bagi tim yang terbukti mengirimkan data manipulasi.
  - **Floating Action Bar**: Akses instan cepat ke WhatsApp Admin Utama dan WhatsApp Grup FT.
  - **Modal / Tampilan Admin Dashboard**:
    - Login Admin terproteksi.
    - Filter antrean: `PENDING`, `DONE` (Approved), `REJECTED`.
    - Modal inspeksi bukti resolusi penuh dengan tombol *Approve (+1 Poin)* atau *Reject (Sanksi)*.
    - Pengaturan Season dan tombol reset mingguan.

---

### 3. Key Product Decisions & Trade-Offs

- **Sistem Penyimpanan Terpadu (Supabase + Reactive Local Bridge)**:
  - *Keputusan*: Konfigurasi modular yang langsung menghubungkan Supabase (`supabase-js`) bila kredensial tersedia di `config.js` / `.env`, dengan fallback reaktif in-memory & `localStorage` yang tersinkronisasi.
  - *Alasan*: Admin dan pemain dapat langsung mendemokan seluruh alur pendaftaran, upload bukti, dan approval poin di dev server tanpa hambatan koneksi awal.
- **Deteksi Integritas Bukti di Sisi Klien**:
  - *Keputusan*: Pemeriksaan metadata dasar (dimensi gambar, format, timestamp input) disertai *Pusat Edukasi Visual Interaktif* yang mengajarkan pemain bagaimana admin memeriksa kecurangan.
  - *Alasan*: Mencegah upaya pengiriman bukti asal-asalan sebelum masuk ke antrean panitia.
- **WhatsApp Integration dengan Template Pesan Otomatis**:
  - *Keputusan*: Tautan langsung ke `https://wa.me/` dengan pre-filled text dinamis untuk pendaftaran turnamen, konfirmasi slot, dan komplain banding.
  - *Alasan*: Komunitas turnamen Indonesia sangat bergantung pada komunikasi WhatsApp yang cepat dan mudah diakses dari ponsel maupun desktop.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        KLEPON X V3.1 ARCHITECTURE                      │
└────────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┴───────────────────────────┐
        ▼                                                       ▼
┌───────────────────────────────┐               ┌───────────────────────────────┐
│     PORTAL PUBLIK PEMAIN      │               │     DASHBOARD ADMIN PANEL     │
│  - Jadwal FT & Status Slot    │               │  - Otentikasi Admin           │
│  - Live Leaderboard Top 10    │               │  - Antrean Laporan PENDING    │
│  - Form Lapor Kemenangan      │               │  - Verifikasi: Approve/Reject │
│  - Simulator Edukasi Anti-Cheat│              │  - Poin +1 & Win Auto-calc    │
│  - Link Grup FT & WA Admin    │               │  - Manajemen Season & Blacklist│
└───────────────┬───────────────┘               └───────────────┬───────────────┘
                │                                               │
                └───────────────────────┬───────────────────────┘
                                        ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                            STATE & DATA CONTROLLER                            │
│  - Data Store: Players, Teams, Win Reports (PENDING/DONE/REJECTED), Seasons  │
│  - Realtime Event Dispatcher (Simulasi Event / Supabase Realtime Listener)   │
│  - Storage Bukti Screenshot & Signed URL Preview                              │
└───────────────────────────────────────────────────────────────────────────────┘
```

#### Struktur Data Utama:
- **Player / Team**: `id`, `name`, `game`, `captain_name`, `whatsapp`, `points`, `wins`, `status` (`active`, `banned`).
- **Win Report**: `id`, `team_name`, `room_id`, `match_date`, `screenshot_url`, `status` (`pending`, `done`, `rejected`), `admin_notes`, `created_at`.
- **Season**: `id`, `name` (e.g. "KLEPON X - WEEK 1"), `is_active`, `start_date`, `end_date`.
- **Blacklist Record**: `id`, `team_name`, `reason`, `date`, `evidence_summary`.

---

### 5. Langkah Pelaksanaan

1. **Konfigurasi Dependensi & Style**: Memastikan Tailwind CSS, Lucide icons, dan komponen visual modern beresolusi tinggi siap digunakan.
2. **Implementasi Store & Realtime Service**: Mengembangkan engine data store untuk player, laporan win, leaderboard, dan audit trail admin.
3. **Pembangunan Portal Pemain**: Menyusun landing hero, live leaderboard, modul turnamen/scrim, form lapor kemenangan, dan floating hub WhatsApp.
4. **Pusat Edukasi Anti-Palsu & Inspection Tool**: Membangun modul edukatif interaktif dengan pembanding bukti asli vs editan dan tata tertib turnamen.
5. **Dashboard Admin Terpadu**: Membangun autentikasi login, panel antrean verifikasi win, aksi 1-klik approval poin, dan manajemen sanksi.
6. **Verifikasi & Build Test**: Pengujian menyeluruh menggunakan `compile_applet` untuk menjamin aplikasi berjalan tanpa error.
