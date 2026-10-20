# Panduan Setup Sinkronisasi 2 Arah Google Spreadsheet & Dashboard LAN RI

Dokumen ini memandu langkah-langkah mudah untuk menghubungkan spreadsheet **"Rekap Publikasi LAN"** dengan Dashboard agar setiap perubahan di spreadsheet terbaca di dashboard, dan setiap pengisian melalui dashboard langsung tersimpan otomatis ke spreadsheet.

---

### Langkah 1: Buka Apps Script di Google Sheets
1. Buka spreadsheet: [Rekap Publikasi LAN](https://docs.google.com/spreadsheets/d/1dZbVC-lcYubhuDVSN-PjvZl0R6-huTFePcHDW6eJtqE/edit)
2. Di menu bagian atas spreadsheet, klik **Ekstensi (Extensions)** $\rightarrow$ pilih **Apps Script**.
3. Tab baru editor Google Apps Script akan terbuka.

---

### Langkah 2: Salin Kode Apps Script
1. Hapus semua tulisan bawaan yang ada di editor (`function myFunction() { ... }`).
2. Buka file [Code.gs](file:///d:/0-Maganghub-LAN%20RI/Dashboard-Analisis-Survei-Unit11/google_apps_script/Code.gs) yang telah kami buatkan.
3. Salin (Copy) seluruh isi kode dari file tersebut, lalu Tempel (Paste) ke editor Apps Script.
4. Klik ikon **Simpan (Save)** (ikon disket 💾 atau tekan `Ctrl + S`).
5. Beri nama proyek di kiri atas, misalnya: `API Dashboard Survei LAN`.

---

### Langkah 3: Deploy sebagai Web App
1. Di pojok kanan atas editor Apps Script, klik tombol biru **Deploy** $\rightarrow$ pilih **New deployment (Penerapan baru)**.
2. Di jendela pop-up:
   * Klik ikon gerigi (Select type) di samping kiri tulisan "Select type" $\rightarrow$ pilih **Web app**.
   * Isi kolom konfigurasi:
     * **Description:** `v1 API Survei LAN`
     * **Execute as (Jalankan sebagai):** `Me (email Anda)`
     * **Who has access (Siapa yang memiliki akses):** Pilih **`Anyone (Siapa saja)`** *(PENTING: Agar dashboard dan PIC unit dapat mengirim pembaruan tanpa hambatan login OAuth).*
3. Klik tombol **Deploy**.
4. Jika Google meminta izin (*Authorization Required*):
   * Klik **Authorize access**.
   * Pilih akun Google Anda.
   * Jika muncul peringatan *"Google hasn't verified this app"*, klik tautan kecil **Advanced (Lanjutan)** di kiri bawah $\rightarrow$ klik **Go to API Dashboard Survei LAN (unsafe)**.
   * Klik **Allow (Izinkan)**.

---

### Langkah 4: Salin URL Web App ke Dashboard
1. Setelah proses deploy selesai, Google akan menampilkan **Web app URL** yang berformat seperti ini:
   ```text
   https://script.google.com/macros/s/AKfycbx.../exec
   ```
2. Klik tombol **Copy** pada Web app URL tersebut.
3. Buka Dashboard Analisis Survei di peramban Anda.
4. Klik tombol gerigi ⚙️ **Pengaturan Koneksi** di pojok kanan atas dashboard.
5. Tempelkan URL tersebut ke kolom **"URL Google Apps Script"**, lalu klik **Simpan & Hubungkan**.
6. Selesai! Indikator di dashboard akan berubah menjadi hijau **"Terhubung ke Google Spreadsheet"**.

---

### Catatan Penting
* **Jika Anda mengubah kode di Apps Script**: Pastikan klik **Deploy** $\rightarrow$ **Manage deployments** $\rightarrow$ klik ikon pensil (Edit) $\rightarrow$ pilih Version: **New version** $\rightarrow$ klik **Deploy**.
* Jika URL Apps Script belum dipasang, Dashboard tetap berfungsi 100% menggunakan data awal (*offline fallback*) dan data pembaruan akan tersimpan di memori browser lokal (*Local Storage*) sehingga tidak ada data yang hilang.
