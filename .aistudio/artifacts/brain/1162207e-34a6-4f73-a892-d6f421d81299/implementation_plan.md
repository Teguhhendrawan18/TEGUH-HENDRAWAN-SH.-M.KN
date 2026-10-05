# Rencana Implementasi: Pemindahan SKMHT ke Layanan Notaris & Penerapan Logo Resmi INI/IPPAT pada Kop Surat, Laporan, dan Tanda Terima

Menyesuaikan penempatan yuridis **Akta SKMHT (Surat Kuasa Membebankan Hak Tanggungan)** ke dalam **Jenis Layanan Notaris**, serta mengintegrasikan **Logo Resmi INI (Ikatan Notaris Indonesia)** dan **Logo Resmi IPPAT (Ikatan Pejabat Pembuat Akta Tanah)** pada seluruh dokumen cetak, kop surat resmi laporan, tanda terima berkas, dan dashboard.

---

### User Review & Confirmation

> [!IMPORTANT]
> 1. **Kategori SKMHT Dipindahkan ke Layanan Notaris**:
>    - Sesuai UU No. 4/1996 Pasal 15 ayat (1) dan praktik kantor kenotariatan, Akta SKMHT didaftarkan di dalam **Buku Daftar Akta Notaris** (dengan format nomor register `/NTR/`), bukan PPAT.
>    - Opsi SKMHT dipindahkan ke dropdown Notaris di `BerkasFormModal.tsx` dan terintegrasi dengan reminder tenggat waktu 30 hari menuju pembuatan Akta APHT di PPAT.
> 2. **Logo Resmi INI & IPPAT pada Kop Surat & Dokumen Cetak**:
>    - **Kop Surat Laporan Bulanan Notaris (`RekapLaporanView.tsx`)**: Menggunakan **Logo Resmi INI** di sisi kiri kop surat resmi untuk laporan ke Majelis Pengawas Daerah (MPD) Notaris & Kemenkumham RI.
>    - **Kop Surat Laporan Bulanan PPAT (`RekapLaporanView.tsx`)**: Menggunakan **Logo Resmi IPPAT** di sisi kiri kop surat resmi untuk laporan ke Kantor Pertanahan (Kantah BPN) dan Bapenda.
>    - **Tanda Terima Titipan Berkas Klien (`TandaTerimaView.tsx`)**: Menggunakan **Logo Ganda INI & IPPAT** pada kop tanda terima resmi saat dicetak / disimpan.
>    - **Dashboard & Header**: Tetap menampilkan logo resmi INI & IPPAT sebagai identitas kantor Notaris & PPAT.
>    - **Label QR Map / Bantex Fisik (`QrLabelModal.tsx`)**: Menampilkan Logo INI untuk berkas Notaris dan Logo IPPAT untuk berkas PPAT.

---

### 1. Proposed Changes

#### A. Pemindahan Kategori SKMHT ke Layanan Notaris (`src/components/BerkasFormModal.tsx` & `src/utils/documentRequirements.ts`)
- Memindahkan opsi `<option value="SKMHT">SKMHT (Kuasa Membebankan Hak Tanggungan)</option>` dari grup PPAT ke grup **Notaris**.
- Memastikan ketika jenis layanan Notaris dipilih, akta SKMHT mendapatkan format penomoran `/NTR/` dan masuk ke Buku Register Notaris.
- Menjaga modul *Reminder Jatuh Tempo APHT* tetap aktif otomatis ketika kategori `SKMHT` dipilih.

#### B. Penyempurnaan Lambang Resmi INI & IPPAT (`src/components/OfficialLogos.tsx`)
- Memastikan visual lambang resmi INI dan IPPAT memiliki tingkat ketajaman tinggi (*vector SVG*) yang presisi dan kompatibel untuk tampilan layar maupun cetakan resolusi tinggi (*print-ready* 300 DPI) pada kertas A4 / F4.
- Menyediakan komponen kop surat resmi khusus:
  - `<KopSuratNotaris kantorProfile={...} />` (Logo INI di kiri, identitas Notaris di tengah).
  - `<KopSuratPPAT kantorProfile={...} />` (Logo IPPAT di kiri, identitas PPAT di tengah).
  - `<KopSuratBersama kantorProfile={...} />` (Logo INI di kiri & Logo IPPAT di kanan, identitas kantor Notaris-PPAT di tengah).

#### C. Integrasi Kop Surat pada Laporan Bulanan Notaris & PPAT (`src/components/RekapLaporanView.tsx`)
- Pada saat mencetak atau mengekspor **Laporan Bulanan Akta Notaris**:
  - Menampilkan Kop Surat Resmi bertaraf kenotariatan dengan **Logo INI** di sisi kiri atas, teks pengantar resmi untuk Majelis Pengawas Notaris (MPD/MPW).
- Pada saat mencetak atau mengekspor **Laporan Bulanan Akta PPAT**:
  - Menampilkan Kop Surat Resmi ke-PPAT-an dengan **Logo IPPAT** di sisi kiri atas, teks pengantar resmi untuk Kepala Kantor Pertanahan (BPN) dan Kepala Badan Pendapatan Daerah (Bapenda).

#### D. Integrasi Kop Surat pada Tanda Terima Berkas (`src/components/TandaTerimaView.tsx`)
- Memperbarui tampilan modal dan formulir cetak Tanda Terima Berkas Klien dengan menyematkan **Logo Resmi INI & IPPAT** pada kop tanda terima di bagian atas.
- Memastikan saat dicetak (*print layout*) logo tampil jernih dengan border pemisah garis ganda khas dokumen hukum Indonesia.

#### E. Integrasi pada Label QR Map Arsip (`src/components/QrLabelModal.tsx`)
- Menyematkan Logo INI pada cetak stiker label map akta Notaris.
- Menyematkan Logo IPPAT pada cetak stiker label map akta PPAT.

---

### 2. Verification & Testing Plan

1. **Uji Penempatan SKMHT**:
   - Buka form "+ Akta Notaris", periksa apakah kategori "SKMHT (Kuasa Membebankan Hak Tanggungan)" tersedia di dropdown.
   - Buat akta SKMHT: pastikan nomor akta berformat `/NTR/`, tercatat di tabel Register Notaris, dan reminder jatuh tempo APHT aktif di dashboard & panel reminder.
2. **Uji Kop Surat Laporan Bulanan**:
   - Buka tab "Rekap & Laporan", pilih sub-tab Notaris: periksa keberadaan Logo INI pada kop laporan resmi.
   - Beralih ke sub-tab PPAT: periksa keberadaan Logo IPPAT pada kop laporan resmi ke BPN.
3. **Uji Tanda Terima Berkas Klien**:
   - Buka tab "Tanda Terima", klik "Cetak / Pratinjau Tanda Terima": pastikan logo resmi INI dan IPPAT tampil pada kop tanda terima tanda tangan.
4. **Verifikasi Build & Linting**:
   - Jalankan `compile_applet` dan `lint_applet` untuk memastikan seluruh perubahan bebas error.
