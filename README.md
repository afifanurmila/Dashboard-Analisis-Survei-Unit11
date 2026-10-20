# 📊 Dashboard Monitoring & Analisis Survei LAN RI 2026

Aplikasi dashboard modern berbasis web untuk rekapitulasi, monitoring progres, dan pengelolaan publikasi survei strategis di lingkungan **Lembaga Administrasi Negara Republik Indonesia (LAN RI)**. 

Dashboard ini dirancang khusus untuk mengatasi keterbatasan tampilan spreadsheet manual dengan menyediakan antarmuka visual yang intuitif serta fitur **sinkronisasi 2 arah** dengan Google Spreadsheet master.

---

## 🌟 Fitur Utama

1. **Selector "Fokus Unit Saya":**
   * PIC masing-masing unit kerja (SKPP, DAPKK, SKMP, SKTAN, DSPK2AN, STIA JKT/MKS/BDG, SKMK) dapat memilih unitnya secara instan.
   * Dashboard otomatis memfilter seluruh metrik, grafik, dan daftar survei milik unit bersangkutan tanpa terdistraksi agenda unit lain.

2. **3 Tampilan Utama (View Mode):**
   * **📊 Ringkasan & Analisis (Executive View):**
     * 4 Kartu KPI: Total Agenda Survei, Persentase Selesai Publikasi, Sedang Berjalan (Instrumen/Pengumpulan/Review PB), dan Belum Dimulai.
     * Diagram Donat Distribusi Klaster (*Prioritas Presiden, Tata Kelola ASN, Pelayanan Publik, Digitalisasi*).
     * Grafik Batang Horisontal Cakupan Media Diseminasi (*Web LAN, Web Unit, IG LAN, IG Unit, YT LAN, YT Unit, Media Online, Jurnal*).
     * Grafik Komparasi Progres Antar Unit Kerja.
   * **🗓️ Jadwal Rilis 2026 (Roadmap View):**
     * Pengelompokan agenda survei per bulan (Januari – Desember 2026) dan minggu publikasi (1–4).
     * Indikator warna status pengerjaan yang jelas.
   * **📋 Data Survei & Update Progress (Operational View):**
     * Pencarian cepat (*real-time search*) berdasarkan judul, unit, atau catatan keterangan.
     * Filter berdasarkan klaster tema, status progres, dan tahun.
     * Pilihan tampilan: **Mode Kartu (Card View)** atau **Mode Tabel (Table View)**.
     * Ikon interaktif saluran publikasi (langsung dapat diklik untuk membuka tautan).

3. **Drawer / Modal "Update Progres & Publikasi" (Anti-Ribet):**
   * Dropdown tahapan progres terstandarisasi (*Selesai Publikasi, Review Policy Brief, Penyusunan PB, Pengumpulan Data, Penyusunan Instrumen, Belum Dimulai*).
   * Kolom catatan keterangan yang luas.
   * Form terpisah untuk masing-masing tautan media publikasi (Web, IG, YT, Media Berita, Jurnal).
   * Tombol **Simpan & Sinkronkan ke Google Sheet**.

4. **Sinkronisasi 2 Arah Google Spreadsheet:**
   * Menggunakan **Google Apps Script Web App** gratis dan tanpa perlu konfigurasi Google Cloud yang rumit.
   * Perubahan yang dilakukan di Dashboard otomatis terupdate di Google Spreadsheet.
   * Jika belum terkoneksi, dashboard tetap berjalan lancar menggunakan data awal (*fallback*) dan penyimpanan memori lokal (*localStorage*).

---

## 🚀 Cara Menjalankan Dashboard

### Cara 1: Jalankan dengan Python (Rekomendasi)
Di terminal PowerShell / Command Prompt, jalankan perintah:
```powershell
py run_dashboard.py
```
Aplikasi akan otomatis meluncur dan membuka peramban web di `http://localhost:8000/index.html`.

### Cara 2: Buka Langsung File HTML
Anda juga dapat langsung membuka file `index.html` dengan mengklik ganda (double-click) di File Explorer ke peramban (Google Chrome / Microsoft Edge).

---

## 🔗 Panduan Menghubungkan ke Google Spreadsheet

Untuk mengaktifkan fitur simpan dan baca langsung ke Google Spreadsheet LAN:
1. Buka panduan lengkap di: [`google_apps_script/PANDUAN_SETUP_APPS_SCRIPT.md`](google_apps_script/PANDUAN_SETUP_APPS_SCRIPT.md).
2. Salin kode dari [`google_apps_script/Code.gs`](google_apps_script/Code.gs) ke menu **Ekstensi > Apps Script** di spreadsheet.
3. Terapkan (*Deploy*) sebagai Web App dengan akses *Anyone*.
4. Masukkan URL Web App ke menu **Pengaturan Koneksi (⚙️)** di dashboard.

---

## 📁 Struktur Direktori

```text
Dashboard-Analisis-Survei-Unit11/
│
├── index.html                           # Antarmuka Dashboard (Vue 3 + Tailwind CSS + Lucide Icons)
├── run_dashboard.py                     # Script peluncur lokal otomatis
├── parsed_data.json                     # Salinan data terstruktur (56 agenda survei)
├── README.md                            # Dokumentasi proyek
│
├── data/
│   └── initialData.js                   # Dataset awal 2025-2026 bawaan (offline fallback)
│
└── google_apps_script/
    ├── Code.gs                          # Backend API Apps Script untuk Google Sheets
    └── PANDUAN_SETUP_APPS_SCRIPT.md     # Panduan langkah demi langkah setup Apps Script
```

---
*Dibuat untuk kebutuhan pemantauan dan pengelolaan survei di Lembaga Administrasi Negara Republik Indonesia (LAN RI).*
