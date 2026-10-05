export type LayananType = 'NOTARIS' | 'PPAT';

export type StatusBerkas = 
  | 'DRAFTING'
  | 'REVIEW_PENGHADAP'
  | 'TANDA_TANGAN'
  | 'VALIDASI_PAJAK'
  | 'PROSES_BPN'
  | 'SELESAI_DIARSIPKAN';

export type TipeDokumenPdf = 
  | 'MINUTA_AKTA'
  | 'SALINAN_AKTA'
  | 'PAJAK_PBB'
  | 'BPHTB'
  | 'PPH'
  | 'BUKTI_KROSCEK'
  | 'SKMHT'
  | 'PERJANJIAN_KREDIT'
  | 'SK_KEMENKUMHAM'
  | 'NIB_OSS'
  | 'WARKAH_PENDUKUNG'
  | 'KTP_KK_NPWP'
  | 'SERTIPIKAT_TANAH'
  | 'SPPT_PBB'
  | 'BUKTI_BAYAR_PAJAK'
  | 'LAINNYA';

export interface SlotKebutuhanDokumen {
  id: string;
  tipe: TipeDokumenPdf;
  label: string;
  subLabel: string;
  wajib?: boolean;
  keterangan?: string;
}

export interface ArsipDokumenPdf {
  id: string;
  namaFile: string;
  tipeDokumen: TipeDokumenPdf;
  fileBlobKey: string;
  fileSize: number;
  fileMimeType: string;
  uploadedAt: string;
  deskripsi?: string;
}

export interface PihakPenghadap {
  id: string;
  nama: string;
  nik?: string;
  npwp?: string;
  alamat?: string;
  peran: string; // misal: "Penghadap I (Penjual)", "Penghadap II (Pembeli)", "Debitur", "Kreditur", "Direktur Utama"
}

export interface LokasiFisik {
  lemari: string; // misal: "Lemari A"
  rak: string; // misal: "Rak 03"
  nomorBantex: string; // misal: "BTX-PPAT-2026-08"
  kodeBoks?: string; // misal: "BOKS-02"
  catatanLokasi?: string;
}

export interface ArsipBerkas {
  id: string;
  nomorBerkas: string; // misal: "BRK-2026-NTR-042" atau "BRK-2026-PPT-019"
  jenisLayanan: LayananType;
  nomorRegisterBulanan: number;
  bulanRegister: number; // 1-12
  tahunRegister: number; // 2026
  nomorAkta: string; // misal: "08/NTR/X/2026" atau "14/PPAT/X/2026"
  tanggalAkta: string; // YYYY-MM-DD
  judulAkta: string;
  kategoriAkta: string;
  sifatAkta: string; // misal: "Pendirian PT", "Jual Beli", "Hak Tanggungan", "Kuasa Membebankan"
  paraPihak: PihakPenghadap[];
  namaSaksi: string[];
  nilaiTransaksi?: number;
  objekHukum?: string; // misal: "Tanah & Bangunan SHM No. 402/Pondok Indah" atau "PT Maju Bersama Sejahtera"
  nomorSertipikat?: string;
  nopPBB?: string;
  lokasiFisik: LokasiFisik;
  statusBerkas: StatusBerkas;
  dokumenPdfList: ArsipDokumenPdf[];
  catatanWarkah?: string;
  reminderSKMHT?: ReminderSKMHT;
  progresAJB?: ProgresAJB;
  tenggatWaktuManual?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  id: string;
  email: string;
  nama: string;
  role: 'NOTARIS_PPAT' | 'STAF_OPERASIONAL';
  jabatan: string;
  nomorSk?: string;
}

export interface ReminderSKMHT {
  tanggalAktaSKMHT: string;
  tanggalJatuhTempoAPHT: string; // manual date entered by user
  statusAPHT: 'MENUNGGU_APHT' | 'SUDAH_APHT' | 'KADALUARSA';
  nomorAktaAPHT?: string;
  namaKrediturBank?: string;
  catatan?: string;
}

export type TahapAJB = 
  | 'VALIDASI_PAJAK' 
  | 'PENGECEKAN_BPN' 
  | 'TANDA_TANGAN' 
  | 'PROSES_BALIK_NAMA' 
  | 'SELESAI';

export interface ProgresAJB {
  tahapAktif: TahapAJB;
  tanggalTarget: string; // manual target date
  status: 'MENUNGGU' | 'DALAM_PROSES' | 'SELESAI' | 'KENDALA';
  keteranganProgres?: string;
  catatanKendala?: string;
}

export interface ItemTandaTerima {
  id: string;
  namaDokumen: string;
  nomorDokumen?: string;
  asliAtauCopy: 'ASLI' | 'COPY';
  jumlah: number;
  keterangan?: string;
}

export interface TandaTerimaBerkas {
  id: string;
  nomorTandaTerima: string; // misal: "TT-TH/2026/10/004"
  namaKlien: string;
  nomorKontak: string;
  identitasKlien?: string; // NIK/Paspor
  tanggalPenerimaan: string;
  nomorBerkasTerkait?: string;
  daftarDokumen: ItemTandaTerima[];
  namaPenerima: string;
  jabatanPenerima: string;
  statusSerah: 'DITERIMA_KANTOR' | 'DIKEMBALIKAN_KE_KLIEN';
  tanggalPengembalian?: string;
  catatan?: string;
  createdAt: string;
}

export interface KantorProfile {
  namaNotaris: string;
  gelar: string;
  skNotaris: string;
  skPpat: string;
  wilayahKerja: string;
  alamatKantor: string;
  telepon: string;
  whatsapp?: string;
  email: string;
}
