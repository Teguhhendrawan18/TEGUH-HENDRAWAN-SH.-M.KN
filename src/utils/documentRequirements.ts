import { SlotKebutuhanDokumen, TipeDokumenPdf } from '../types';

export const DOKUMEN_AJB: SlotKebutuhanDokumen[] = [
  {
    id: 'ajb_minuta',
    tipe: 'MINUTA_AKTA',
    label: 'Akta AJB',
    subLabel: 'Minuta Asli Akta Jual Beli bertandatangan',
    wajib: true,
  },
  {
    id: 'ajb_ktp',
    tipe: 'KTP_KK_NPWP',
    label: 'KTP Para Pihak',
    subLabel: 'KTP Penjual & Pembeli, Kartu Keluarga, Buku Nikah',
    wajib: true,
  },
  {
    id: 'ajb_sertifikat',
    tipe: 'SERTIPIKAT_TANAH',
    label: 'Sertifikat',
    subLabel: 'Sertipikat Asli (SHM / SHGB / Hak Pakai)',
    wajib: true,
  },
  {
    id: 'ajb_kroscek',
    tipe: 'BUKTI_KROSCEK',
    label: 'Bukti Kroscek',
    subLabel: 'Hasil Pengecekan Sertipikat BPN / SKPT',
    wajib: true,
  },
  {
    id: 'ajb_pbb',
    tipe: 'PAJAK_PBB',
    label: 'PBB',
    subLabel: 'SPPT PBB & Bukti Lunas STTS Tahun Berjalan',
    wajib: true,
  },
  {
    id: 'ajb_bphtb',
    tipe: 'BPHTB',
    label: 'BPHTB',
    subLabel: 'SSPD BPHTB & Lembar Validasi Bapenda',
    wajib: true,
  },
  {
    id: 'ajb_pph',
    tipe: 'PPH',
    label: 'PPH',
    subLabel: 'SSP PPh Final 2.5% & Validasi / NTPN KPP Pratama',
    wajib: true,
  },
  {
    id: 'ajb_lainnya',
    tipe: 'WARKAH_PENDUKUNG',
    label: 'Dokumen Lainnya',
    subLabel: 'Surat persetujuan keluarga, kuasa, pernyataan, dll.',
    wajib: false,
  },
];

export const DOKUMEN_APHT: SlotKebutuhanDokumen[] = [
  {
    id: 'apht_minuta',
    tipe: 'MINUTA_AKTA',
    label: 'Akta APHT',
    subLabel: 'Minuta Asli Akta Pemberian Hak Tanggungan',
    wajib: true,
  },
  {
    id: 'apht_pbb',
    tipe: 'PAJAK_PBB',
    label: 'PBB',
    subLabel: 'SPPT PBB & Bukti Bayar Tahun Berjalan',
    wajib: true,
  },
  {
    id: 'apht_skmht',
    tipe: 'SKMHT',
    label: 'SKMHT',
    subLabel: 'Surat Kuasa Membebankan Hak Tanggungan (jika ada)',
    wajib: false,
  },
  {
    id: 'apht_pk',
    tipe: 'PERJANJIAN_KREDIT',
    label: 'Perjanjian Kredit',
    subLabel: 'Perjanjian Kredit (PK) Bank & Surat Penegasan SP3K',
    wajib: true,
  },
  {
    id: 'apht_sertifikat',
    tipe: 'SERTIPIKAT_TANAH',
    label: 'Sertifikat',
    subLabel: 'Sertipikat Tanah Objek Jaminan Hak Tanggungan',
    wajib: true,
  },
  {
    id: 'apht_kroscek',
    tipe: 'BUKTI_KROSCEK',
    label: 'Bukti Kroscek',
    subLabel: 'Hasil Pengecekan Sertipikat BPN / HT-el',
    wajib: true,
  },
  {
    id: 'apht_ktp',
    tipe: 'KTP_KK_NPWP',
    label: 'KTP Para Pihak',
    subLabel: 'KTP Debitur, Penjamin, dan Pejabat Bank Kreditur',
    wajib: true,
  },
  {
    id: 'apht_lainnya',
    tipe: 'WARKAH_PENDUKUNG',
    label: 'Dokumen Lainnya',
    subLabel: 'Polis asuransi, surat persetujuan, dll.',
    wajib: false,
  },
];

export const DOKUMEN_HIBAH: SlotKebutuhanDokumen[] = [
  {
    id: 'hibah_minuta',
    tipe: 'MINUTA_AKTA',
    label: 'Akta Hibah',
    subLabel: 'Minuta Asli Akta Hibah',
    wajib: true,
  },
  {
    id: 'hibah_ktp',
    tipe: 'KTP_KK_NPWP',
    label: 'KTP Para Pihak',
    subLabel: 'KTP & KK Pemberi Hibah, Penerima Hibah, Ahli Waris',
    wajib: true,
  },
  {
    id: 'hibah_sertifikat',
    tipe: 'SERTIPIKAT_TANAH',
    label: 'Sertifikat',
    subLabel: 'Sertipikat Tanah Objek Hibah',
    wajib: true,
  },
  {
    id: 'hibah_kroscek',
    tipe: 'BUKTI_KROSCEK',
    label: 'Bukti Kroscek',
    subLabel: 'Hasil Pengecekan Sertipikat BPN',
    wajib: true,
  },
  {
    id: 'hibah_pbb',
    tipe: 'PAJAK_PBB',
    label: 'PBB',
    subLabel: 'SPPT PBB & Bukti Bayar Tahun Berjalan',
    wajib: true,
  },
  {
    id: 'hibah_bphtb',
    tipe: 'BPHTB',
    label: 'BPHTB',
    subLabel: 'SSPD BPHTB Hibah & Validasi Bapenda',
    wajib: true,
  },
  {
    id: 'hibah_pph',
    tipe: 'PPH',
    label: 'PPH',
    subLabel: 'Surat Keterangan Bebas (SKB) PPh / Bukti Validasi',
    wajib: false,
  },
  {
    id: 'hibah_lainnya',
    tipe: 'WARKAH_PENDUKUNG',
    label: 'Dokumen Lainnya',
    subLabel: 'Persetujuan ahli waris, surat silsilah keluarga, dll.',
    wajib: false,
  },
];

export const DOKUMEN_PT: SlotKebutuhanDokumen[] = [
  {
    id: 'pt_minuta',
    tipe: 'MINUTA_AKTA',
    label: 'Minuta Akta Pendirian',
    subLabel: 'Minuta Asli Akta Pendirian PT',
    wajib: true,
  },
  {
    id: 'pt_ktp',
    tipe: 'KTP_KK_NPWP',
    label: 'KTP & NPWP Pendiri',
    subLabel: 'Identitas Pemegang Saham, Direksi & Komisaris',
    wajib: true,
  },
  {
    id: 'pt_kemenkumham',
    tipe: 'SK_KEMENKUMHAM',
    label: 'SK Kemenkumham',
    subLabel: 'SK Pengesahan Badan Hukum dari Ditjen AHU Kemenkumham',
    wajib: true,
  },
  {
    id: 'pt_nib',
    tipe: 'NIB_OSS',
    label: 'NIB & NPWP Perusahaan',
    subLabel: 'Nomor Induk Berusaha (OSS) & Kartu NPWP Badan',
    wajib: false,
  },
  {
    id: 'pt_modal',
    tipe: 'WARKAH_PENDUKUNG',
    label: 'Bukti Setor Modal',
    subLabel: 'Rekening koran / bukti setoran modal para pendiri',
    wajib: false,
  },
  {
    id: 'pt_salinan',
    tipe: 'SALINAN_AKTA',
    label: 'Salinan Akta',
    subLabel: 'Salinan Resmi untuk arsip kantor / para pihak',
    wajib: false,
  },
];

export const DOKUMEN_SEWA: SlotKebutuhanDokumen[] = [
  {
    id: 'sewa_minuta',
    tipe: 'MINUTA_AKTA',
    label: 'Akta Sewa Menyewa',
    subLabel: 'Minuta Asli Perjanjian Sewa Menyewa',
    wajib: true,
  },
  {
    id: 'sewa_ktp',
    tipe: 'KTP_KK_NPWP',
    label: 'KTP Para Pihak',
    subLabel: 'KTP & NPWP Pihak Yang Menyewakan dan Penyewa',
    wajib: true,
  },
  {
    id: 'sewa_objek',
    tipe: 'SERTIPIKAT_TANAH',
    label: 'Sertifikat / Bukti Hak',
    subLabel: 'Bukti kepemilikan objek sewa tanah/bangunan',
    wajib: false,
  },
  {
    id: 'sewa_pbb',
    tipe: 'PAJAK_PBB',
    label: 'PBB',
    subLabel: 'SPPT PBB Objek Sewa',
    wajib: false,
  },
  {
    id: 'sewa_lainnya',
    tipe: 'WARKAH_PENDUKUNG',
    label: 'Dokumen Lainnya',
    subLabel: 'Kwitansi bukti transfer bayar, inventaris barang, dll.',
    wajib: false,
  },
];

export const DOKUMEN_SKMHT: SlotKebutuhanDokumen[] = [
  {
    id: 'skmht_minuta',
    tipe: 'MINUTA_AKTA',
    label: 'Akta SKMHT',
    subLabel: 'Minuta Asli Kuasa Membebankan Hak Tanggungan (Akta Notaris)',
    wajib: true,
  },
  {
    id: 'skmht_pk',
    tipe: 'PERJANJIAN_KREDIT',
    label: 'Perjanjian Kredit',
    subLabel: 'Perjanjian Kredit (PK) Pokok Bank & Surat Penegasan SP3K',
    wajib: true,
  },
  {
    id: 'skmht_sertifikat',
    tipe: 'SERTIPIKAT_TANAH',
    label: 'Sertifikat',
    subLabel: 'Sertipikat Tanah Jaminan (SHM / SHGB)',
    wajib: true,
  },
  {
    id: 'skmht_kroscek',
    tipe: 'BUKTI_KROSCEK',
    label: 'Bukti Kroscek',
    subLabel: 'Hasil Pengecekan Sertipikat BPN / SKPT',
    wajib: true,
  },
  {
    id: 'skmht_ktp',
    tipe: 'KTP_KK_NPWP',
    label: 'KTP Para Pihak',
    subLabel: 'KTP Pemberi Kuasa (Debitur), Pasangan & Penerima Kuasa (Bank)',
    wajib: true,
  },
  {
    id: 'skmht_pbb',
    tipe: 'PAJAK_PBB',
    label: 'PBB',
    subLabel: 'SPPT PBB & Bukti Lunas Tahun Berjalan',
    wajib: false,
  },
  {
    id: 'skmht_lainnya',
    tipe: 'WARKAH_PENDUKUNG',
    label: 'Dokumen Lainnya',
    subLabel: 'Surat persetujuan pasangan/keluarga, kuasa khusus, dll.',
    wajib: false,
  },
];

export const DOKUMEN_DEFAULT: SlotKebutuhanDokumen[] = [
  {
    id: 'def_minuta',
    tipe: 'MINUTA_AKTA',
    label: 'Minuta Akta',
    subLabel: 'Minuta Asli Akta Bertandatangan',
    wajib: true,
  },
  {
    id: 'def_ktp',
    tipe: 'KTP_KK_NPWP',
    label: 'KTP Para Pihak',
    subLabel: 'KTP / NPWP para pihak penghadap',
    wajib: true,
  },
  {
    id: 'def_sertifikat',
    tipe: 'SERTIPIKAT_TANAH',
    label: 'Sertifikat',
    subLabel: 'Sertipikat tanah atau legalitas objek',
    wajib: false,
  },
  {
    id: 'def_kroscek',
    tipe: 'BUKTI_KROSCEK',
    label: 'Bukti Kroscek',
    subLabel: 'Pengecekan sertipikat BPN / HT-el',
    wajib: false,
  },
  {
    id: 'def_pbb',
    tipe: 'PAJAK_PBB',
    label: 'PBB',
    subLabel: 'SPPT PBB & Bukti Bayar STTS',
    wajib: false,
  },
  {
    id: 'def_bphtb',
    tipe: 'BPHTB',
    label: 'BPHTB',
    subLabel: 'SSPD BPHTB & Validasi Bapenda',
    wajib: false,
  },
  {
    id: 'def_pph',
    tipe: 'PPH',
    label: 'PPH',
    subLabel: 'SSP PPh Final & Validasi Pajak',
    wajib: false,
  },
  {
    id: 'def_lainnya',
    tipe: 'WARKAH_PENDUKUNG',
    label: 'Dokumen Lainnya',
    subLabel: 'Dokumen warkah pendukung lainnya',
    wajib: false,
  },
];

export function getRequiredDocumentSlots(kategoriAkta: string): SlotKebutuhanDokumen[] {
  const norm = (kategoriAkta || '').toUpperCase();
  if (norm.includes('SKMHT')) {
    return DOKUMEN_SKMHT;
  }
  if (norm.includes('AJB') || norm.includes('JUAL_BELI') || norm.includes('JUAL BELI')) {
    return DOKUMEN_AJB;
  }
  if (norm.includes('APHT') || norm.includes('HAK_TANGGUNGAN')) {
    return DOKUMEN_APHT;
  }
  if (norm.includes('HIBAH')) {
    return DOKUMEN_HIBAH;
  }
  if (norm.includes('PT') || norm.includes('PENDIRIAN') || norm.includes('ANGGARAN_DASAR')) {
    return DOKUMEN_PT;
  }
  if (norm.includes('SEWA')) {
    return DOKUMEN_SEWA;
  }
  return DOKUMEN_DEFAULT;
}
