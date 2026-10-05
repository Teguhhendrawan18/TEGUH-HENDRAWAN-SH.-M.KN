import { ArsipBerkas, TandaTerimaBerkas, KantorProfile } from '../types';
import { createLegalDocumentPdfBlob } from '../utils/samplePdf';

const DB_NAME = 'ArsipNotarisDB';
const DB_VERSION = 2;

export const DEFAULT_KANTOR_PROFILE: KantorProfile = {
  namaNotaris: 'Teguh Hendrawan',
  gelar: 'S.H., M.Kn.',
  skNotaris: 'SK Menteri Hukum & HAM RI No. AHU-00192.AH.02.01.Tahun 2018',
  skPpat: 'SK Kepala Badan Pertanahan Nasional RI No. 418/KEP-17.3/IX/2019',
  wilayahKerja: 'Kota Administrasi Jakarta Selatan',
  alamatKantor: 'Jl. Fatmawati Raya No. 45, Kebayoran Baru, Jakarta Selatan 12150',
  telepon: '(021) 7201928',
  whatsapp: '0812-8899-7766',
  email: 'teguhhendrawan.notaris@gmail.com'
};

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('berkas')) {
        const berkasStore = db.createObjectStore('berkas', { keyPath: 'id' });
        berkasStore.createIndex('jenisLayanan', 'jenisLayanan', { unique: false });
        berkasStore.createIndex('nomorAkta', 'nomorAkta', { unique: false });
        berkasStore.createIndex('statusBerkas', 'statusBerkas', { unique: false });
        berkasStore.createIndex('tahunRegister', 'tahunRegister', { unique: false });
      }

      if (!db.objectStoreNames.contains('tanda_terima')) {
        db.createObjectStore('tanda_terima', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('pdf_blobs')) {
        db.createObjectStore('pdf_blobs');
      }

      if (!db.objectStoreNames.contains('profil_kantor')) {
        db.createObjectStore('profil_kantor');
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });

  return dbPromise;
}

// Kantor Profile Operations
export async function getKantorProfile(): Promise<KantorProfile> {
  try {
    const cached = localStorage.getItem('kantor_profile_cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.namaNotaris) return parsed;
    }
  } catch (e) {
    // Ignore storage errors
  }

  try {
    const db = await getDB();
    if (db.objectStoreNames.contains('profil_kantor')) {
      const result = await new Promise<KantorProfile | null>((resolve) => {
        const tx = db.transaction('profil_kantor', 'readonly');
        const store = tx.objectStore('profil_kantor');
        const req = store.get('profil_utama');
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
      if (result) return result;
    }
  } catch (err) {
    console.error('Error getting profile from IDB:', err);
  }

  return DEFAULT_KANTOR_PROFILE;
}

export async function saveKantorProfile(profile: KantorProfile): Promise<void> {
  try {
    localStorage.setItem('kantor_profile_cache', JSON.stringify(profile));
  } catch (e) {
    // Ignore storage errors
  }

  try {
    const db = await getDB();
    if (db.objectStoreNames.contains('profil_kantor')) {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction('profil_kantor', 'readwrite');
        const store = tx.objectStore('profil_kantor');
        const req = store.put(profile, 'profil_utama');
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    }
  } catch (err) {
    console.error('Error saving profile to IDB:', err);
  }
}


// PDF Blob Store Operations
export async function savePdfBlob(blobKey: string, blob: Blob): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pdf_blobs', 'readwrite');
    const store = tx.objectStore('pdf_blobs');
    const req = store.put(blob, blobKey);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getPdfBlob(blobKey: string): Promise<Blob | null> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pdf_blobs', 'readonly');
    const store = tx.objectStore('pdf_blobs');
    const req = store.get(blobKey);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function deletePdfBlob(blobKey: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pdf_blobs', 'readwrite');
    const store = tx.objectStore('pdf_blobs');
    const req = store.delete(blobKey);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Download PDF directly from IndexedDB
export async function downloadPdfFile(blobKey: string, fileName: string): Promise<boolean> {
  try {
    const blob = await getPdfBlob(blobKey);
    if (!blob) {
      alert('File PDF tidak ditemukan di penyimpanan lokal.');
      return false;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 200);
    return true;
  } catch (err) {
    console.error('Gagal mengunduh file:', err);
    alert('Terjadi kesalahan saat mengunduh file PDF.');
    return false;
  }
}

// Berkas Operations
export async function getAllBerkas(): Promise<ArsipBerkas[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('berkas', 'readonly');
    const store = tx.objectStore('berkas');
    const req = store.getAll();
    req.onsuccess = () => {
      const results: ArsipBerkas[] = req.result || [];
      // Sort by newest updated or register order
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      resolve(results);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function saveBerkas(item: ArsipBerkas): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('berkas', 'readwrite');
    const store = tx.objectStore('berkas');
    const req = store.put(item);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deleteBerkas(id: string): Promise<void> {
  const db = await getDB();
  // Also delete associated PDF blobs if any
  const berkas = await getBerkasById(id);
  if (berkas && berkas.dokumenPdfList) {
    for (const doc of berkas.dokumenPdfList) {
      try {
        await deletePdfBlob(doc.fileBlobKey);
      } catch (err) {
        console.error('Failed to delete blob', doc.fileBlobKey, err);
      }
    }
  }

  return new Promise((resolve, reject) => {
    const tx = db.transaction('berkas', 'readwrite');
    const store = tx.objectStore('berkas');
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getBerkasById(id: string): Promise<ArsipBerkas | null> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('berkas', 'readonly');
    const store = tx.objectStore('berkas');
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

// Tanda Terima Operations
export async function getAllTandaTerima(): Promise<TandaTerimaBerkas[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('tanda_terima', 'readonly');
    const store = tx.objectStore('tanda_terima');
    const req = store.getAll();
    req.onsuccess = () => {
      const results: TandaTerimaBerkas[] = req.result || [];
      results.sort((a, b) => new Date(b.tanggalPenerimaan).getTime() - new Date(a.tanggalPenerimaan).getTime());
      resolve(results);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function saveTandaTerima(item: TandaTerimaBerkas): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('tanda_terima', 'readwrite');
    const store = tx.objectStore('tanda_terima');
    const req = store.put(item);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deleteTandaTerima(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('tanda_terima', 'readwrite');
    const store = tx.objectStore('tanda_terima');
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Clean up sample seed data to ensure empty slate for real notary records
export async function cleanupSampleSeedData(): Promise<void> {
  try {
    const db = await getDB();
    
    // 1. Delete seed deeds from 'berkas'
    const allBerkas = await getAllBerkas();
    const seedBerkas = allBerkas.filter(b => b.id.startsWith('seed-'));
    for (const b of seedBerkas) {
      if (b.dokumenPdfList) {
        for (const doc of b.dokumenPdfList) {
          try {
            await deletePdfBlob(doc.fileBlobKey);
          } catch (e) {
            // Ignore blob errors
          }
        }
      }
      await new Promise<void>((resolve) => {
        const tx = db.transaction('berkas', 'readwrite');
        const store = tx.objectStore('berkas');
        const req = store.delete(b.id);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      });
    }

    // 2. Delete seed receipts from 'tanda_terima'
    const allTT = await getAllTandaTerima();
    const seedTT = allTT.filter(tt => tt.id.startsWith('tt-seed-'));
    for (const tt of seedTT) {
      await new Promise<void>((resolve) => {
        const tx = db.transaction('tanda_terima', 'readwrite');
        const store = tx.objectStore('tanda_terima');
        const req = store.delete(tt.id);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      });
    }
  } catch (err) {
    console.error('Error in cleanupSampleSeedData:', err);
  }
}

// Clear all deed records, PDFs, and receipts completely while preserving office profile
export async function clearAllBerkasAndTandaTerima(): Promise<void> {
  const db = await getDB();
  
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction('berkas', 'readwrite');
    const store = tx.objectStore('berkas');
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction('tanda_terima', 'readwrite');
    const store = tx.objectStore('tanda_terima');
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction('pdf_blobs', 'readwrite');
    const store = tx.objectStore('pdf_blobs');
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Initializer: Cleans seed items so database is clean (0 records) ready for real usage
export async function initializeDatabaseSeed(): Promise<void> {
  await cleanupSampleSeedData();
}

// Optional helper to populate demo data on user demand
export async function populateDemoData(): Promise<void> {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Initial deeds samples
  const seedItems: ArsipBerkas[] = [
    {
      id: 'seed-notaris-01',
      nomorBerkas: `BRK-${currentYear}-NTR-001`,
      jenisLayanan: 'NOTARIS',
      nomorRegisterBulanan: 1,
      bulanRegister: currentMonth,
      tahunRegister: currentYear,
      nomorAkta: `01/NTR/${currentMonth}/${currentYear}`,
      tanggalAkta: `${currentYear}-10-02`,
      judulAkta: 'Akta Pendirian PT Sinergi Abadi Sentosa',
      kategoriAkta: 'PENDIRIAN_PT',
      sifatAkta: 'Pendirian Perseroan Terbatas',
      paraPihak: [
        {
          id: 'p1',
          nama: 'Bambang Sudirman, S.E.',
          nik: '3171051204850003',
          npwp: '08.234.567.8-012.000',
          alamat: 'Jl. Wijaya Kusuma No. 14, Jakarta Selatan',
          peran: 'Direktur Utama / Pendiri I'
        },
        {
          id: 'p2',
          nama: 'Dewi Lestari, M.M.',
          nik: '3171055508880001',
          npwp: '09.345.678.9-013.000',
          alamat: 'Jl. Senopati No. 88, Jakarta Selatan',
          peran: 'Komisaris / Pendiri II'
        }
      ],
      namaSaksi: ['Rina Anggraini, S.H.', 'Fajar Nugraha'],
      nilaiTransaksi: 1000000000,
      objekHukum: 'Modal Dasar PT Sinergi Abadi Sentosa Rp 1.000.000.000,-',
      lokasiFisik: {
        lemari: 'Lemari A',
        rak: 'Rak 01',
        nomorBantex: `BTX-NTR-${currentYear}-01`,
        kodeBoks: 'BOKS-NTR-A1',
        catatanLokasi: 'Bantex Kuning Notaris Baris Pertama'
      },
      statusBerkas: 'SELESAI_DIARSIPKAN',
      dokumenPdfList: [],
      catatanWarkah: 'SK Kemenkumham No. AHU-0045231.AH.01.01.TAHUN 2026 telah terbit. Minuta asli tersimpan lengkap.',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: 'seed-ppat-01',
      nomorBerkas: `BRK-${currentYear}-PPT-001`,
      jenisLayanan: 'PPAT',
      nomorRegisterBulanan: 1,
      bulanRegister: currentMonth,
      tahunRegister: currentYear,
      nomorAkta: `14/PPAT/${currentMonth}/${currentYear}`,
      tanggalAkta: `${currentYear}-10-03`,
      judulAkta: 'Akta Jual Beli (AJB) Tanah & Bangunan Kebayoran',
      kategoriAkta: 'AJB',
      sifatAkta: 'Jual Beli Hak Milik',
      paraPihak: [
        {
          id: 'p3',
          nama: 'Ir. Hendra Gunawan',
          nik: '3275011406750002',
          npwp: '07.123.456.7-412.000',
          alamat: 'Jl. Gandaria Tengah II No. 5, Jakarta Selatan',
          peran: 'Penjual (Pihak Pertama)'
        },
        {
          id: 'p4',
          nama: 'dr. Farah Maulida, Sp.A.',
          nik: '3174026809890004',
          npwp: '12.456.789.0-015.000',
          alamat: 'Jl. Radio Dalam Raya No. 17, Jakarta Selatan',
          peran: 'Pembeli (Pihak Kedua)'
        }
      ],
      namaSaksi: ['Siti Rahmawati', 'Ahmad Zaki'],
      nilaiTransaksi: 3450000000,
      objekHukum: 'Tanah & Bangunan SHM No. 02419/Kebayoran Lama',
      nomorSertipikat: 'SHM No. 02419/Kebayoran Lama (Luas: 285 m2)',
      nopPBB: '31.74.010.005.012-0045.0',
      lokasiFisik: {
        lemari: 'Lemari B',
        rak: 'Rak 02',
        nomorBantex: `BTX-PPT-${currentYear}-01`,
        kodeBoks: 'BOKS-PPT-B2',
        catatanLokasi: 'Bantex Biru PPAT - AJB Berkas Tanah'
      },
      statusBerkas: 'PROSES_BPN',
      dokumenPdfList: [],
      catatanWarkah: 'BPHTB dan PPh Final 2.5% telah divalidasi Bapenda dan KPP. Berkas sedang dalam proses balik nama di Kantah BPN.',
      progresAJB: {
        tahapAktif: 'PROSES_BALIK_NAMA',
        tanggalTarget: `${currentYear}-10-25`,
        status: 'DALAM_PROSES',
        keteranganProgres: 'Validasi pajak dan cek BPN lunas. Berkas proses balik nama di loket BPN.'
      },
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      id: 'seed-notaris-skmht-01',
      nomorBerkas: `BRK-${currentYear}-NTR-003`,
      jenisLayanan: 'NOTARIS',
      nomorRegisterBulanan: 3,
      bulanRegister: currentMonth,
      tahunRegister: currentYear,
      nomorAkta: `03/NTR/${currentMonth}/${currentYear}`,
      tanggalAkta: `${currentYear}-10-04`,
      judulAkta: 'Surat Kuasa Membebankan Hak Tanggungan (SKMHT) Bank BCA',
      kategoriAkta: 'SKMHT',
      sifatAkta: 'Pemberian Kuasa Membebankan Hak Tanggungan',
      paraPihak: [
        {
          id: 'p7-skmht',
          nama: 'Agus Setiawan',
          nik: '3174011203800007',
          alamat: 'Jl. Fatmawati No. 89, Jakarta Selatan',
          peran: 'Pemberi Kuasa (Debitur)'
        },
        {
          id: 'p8-skmht',
          nama: 'PT Bank Central Asia Tbk',
          alamat: 'Menara BCA, Grand Indonesia, Jakarta',
          peran: 'Penerima Kuasa (Kreditur)'
        }
      ],
      namaSaksi: ['Rina Anggraini, S.H.', 'Fajar Nugraha'],
      nilaiTransaksi: 1850000000,
      objekHukum: 'Tanah SHM No. 01842/Pondok Labu Luas 180 m2',
      nomorSertipikat: 'SHM No. 01842/Pondok Labu',
      nopPBB: '31.74.020.008.015-0088.0',
      lokasiFisik: {
        lemari: 'Lemari A',
        rak: 'Rak 01',
        nomorBantex: `BTX-NTR-${currentYear}-01`,
        kodeBoks: 'BOKS-NTR-A1',
        catatanLokasi: 'Bantex Kuning Notaris - Akta SKMHT'
      },
      statusBerkas: 'VALIDASI_PAJAK',
      dokumenPdfList: [],
      reminderSKMHT: {
        tanggalAktaSKMHT: `${currentYear}-10-04`,
        tanggalJatuhTempoAPHT: `${currentYear}-11-03`,
        statusAPHT: 'MENUNGGU_APHT',
        namaKrediturBank: 'PT Bank Central Asia Tbk',
        catatan: 'Batas akhir pembuatan Akta APHT 30 hari kalender sejak penandatanganan SKMHT.'
      },
      catatanWarkah: 'SKMHT resmi telah ditandatangani. Siapkan Akta APHT sebelum jatuh tempo.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'seed-ppat-02',
      nomorBerkas: `BRK-${currentYear}-PPT-002`,
      jenisLayanan: 'PPAT',
      nomorRegisterBulanan: 2,
      bulanRegister: currentMonth,
      tahunRegister: currentYear,
      nomorAkta: `15/PPAT/${currentMonth}/${currentYear}`,
      tanggalAkta: `${currentYear}-10-04`,
      judulAkta: 'Akta Pemberian Hak Tanggungan (APHT) Bank Mandiri',
      kategoriAkta: 'APHT',
      sifatAkta: 'Pemberian Hak Tanggungan Peringkat I',
      paraPihak: [
        {
          id: 'p5',
          nama: 'PT Bank Mandiri (Persero) Tbk',
          alamat: 'Plaza Mandiri, Jl. Jend. Gatot Subroto Kav. 36-38, Jakarta',
          peran: 'Kreditur (Pemegang HT)'
        },
        {
          id: 'p6',
          nama: 'Budi Santoso',
          nik: '3172010803820005',
          alamat: 'Jl. Terogong Raya No. 42, Cilandak, Jakarta Selatan',
          peran: 'Debitur / Pemberi HT'
        }
      ],
      namaSaksi: ['Rina Anggraini, S.H.', 'Fajar Nugraha'],
      nilaiTransaksi: 2200000000,
      objekHukum: 'SHM No. 04118/Cilandak Barat (Luas: 210 m2)',
      nomorSertipikat: 'SHM No. 04118/Cilandak Barat',
      nopPBB: '31.74.020.008.016-0012.0',
      lokasiFisik: {
        lemari: 'Lemari B',
        rak: 'Rak 03',
        nomorBantex: `BTX-PPT-${currentYear}-02`,
        kodeBoks: 'BOKS-PPT-B3',
        catatanLokasi: 'Bantex Biru PPAT - APHT Perbankan'
      },
      statusBerkas: 'VALIDASI_PAJAK',
      dokumenPdfList: [],
      catatanWarkah: 'Pengikatan kredit modal kerja fasilitas KPR/Komersial. Sertipikat Hak Tanggungan elektronik (HT-el) sedang disiapkan.',
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 6).toISOString()
    },
    {
      id: 'seed-notaris-02',
      nomorBerkas: `BRK-${currentYear}-NTR-002`,
      jenisLayanan: 'NOTARIS',
      nomorRegisterBulanan: 2,
      bulanRegister: currentMonth,
      tahunRegister: currentYear,
      nomorAkta: `02/NTR/${currentMonth}/${currentYear}`,
      tanggalAkta: `${currentYear}-10-04`,
      judulAkta: 'Akta Perjanjian Sewa Menyewa Gedung Kantor',
      kategoriAkta: 'PERJANJIAN_SEWA',
      sifatAkta: 'Perjanjian Sewa Menyewa Bangunan Usaha',
      paraPihak: [
        {
          id: 'p7',
          nama: 'Wahyu Hidayat',
          nik: '3171021907780001',
          alamat: 'Jl. Panglima Polim V No. 9, Jakarta Selatan',
          peran: 'Pihak Pertama (Yang Menyewakan)'
        },
        {
          id: 'p8',
          nama: 'PT Solusi Finansial Global',
          alamat: 'Treasury Tower Lt. 18, SCBD, Jakarta Selatan',
          peran: 'Pihak Kedua (Penyewa)'
        }
      ],
      namaSaksi: ['Siti Rahmawati', 'Ahmad Zaki'],
      nilaiTransaksi: 480000000,
      objekHukum: 'Ruko 3 Lantai di Jl. Fatmawati No. 22 (Jangka waktu 3 tahun)',
      lokasiFisik: {
        lemari: 'Lemari A',
        rak: 'Rak 02',
        nomorBantex: `BTX-NTR-${currentYear}-01`,
        kodeBoks: 'BOKS-NTR-A2',
        catatanLokasi: 'Bantex Kuning Notaris - Perjanjian Perdata'
      },
      statusBerkas: 'SELESAI_DIARSIPKAN',
      dokumenPdfList: [],
      catatanWarkah: 'Uang sewa telah lunas dibayarkan via transfer bank bilyet giro. Salinan akta telah diserahkan kepada para pihak.',
      createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ];

  // Generate realistic PDF blobs for seed items so all deeds have immediate viewable PDF files!
  for (const item of seedItems) {
    const blob = createLegalDocumentPdfBlob({
      title: item.judulAkta,
      nomorAkta: item.nomorAkta,
      tanggalAkta: item.tanggalAkta,
      jenisLayanan: item.jenisLayanan,
      paraPihak: item.paraPihak.map(p => `${p.nama} (${p.peran})`),
      deskripsi: item.catatanWarkah || item.sifatAkta,
      lokasiFisik: `${item.lokasiFisik.lemari} / ${item.lokasiFisik.rak} / ${item.lokasiFisik.nomorBantex}`
    });

    const blobKey = `pdf_${item.id}_minuta`;
    await savePdfBlob(blobKey, blob);

    item.dokumenPdfList = [
      {
        id: `doc-${item.id}-1`,
        namaFile: `Minuta_${item.nomorAkta.replace(/\//g, '_')}.pdf`,
        tipeDokumen: 'MINUTA_AKTA',
        fileBlobKey: blobKey,
        fileSize: blob.size,
        fileMimeType: 'application/pdf',
        uploadedAt: item.createdAt,
        deskripsi: 'Minuta Akta Asli bertandatangan lengkap'
      }
    ];

    await saveBerkas(item);
  }

  // Seed Tanda Terima Berkas
  const sampleTandaTerima: TandaTerimaBerkas = {
    id: 'tt-seed-01',
    nomorTandaTerima: `TT-TH/${currentYear}/10/001`,
    namaKlien: 'Ir. Hendra Gunawan',
    nomorKontak: '0812-8899-7766',
    identitasKlien: '3275011406750002',
    tanggalPenerimaan: `${currentYear}-10-01`,
    nomorBerkasTerkait: `BRK-${currentYear}-PPT-001`,
    namaPenerima: 'Rina Anggraini, S.H.',
    jabatanPenerima: 'Staf Administrasi & Warkah',
    statusSerah: 'DITERIMA_KANTOR',
    catatan: 'Dokumen titipan untuk proses AJB dan Balik Nama SHM No. 02419/Kebayoran Lama.',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    daftarDokumen: [
      {
        id: 'item-1',
        namaDokumen: 'Sertipikat Hak Milik (SHM) Asli No. 02419/Kebayoran Lama',
        nomorDokumen: 'SHM 02419',
        asliAtauCopy: 'ASLI',
        jumlah: 1,
        keterangan: 'Buku tanah & surat ukur kondisi baik'
      },
      {
        id: 'item-2',
        namaDokumen: 'Surat Pemberitahuan Pajak Terhutang (SPPT PBB) Tahun Berjalan',
        nomorDokumen: '31.74.010.005.012-0045.0',
        asliAtauCopy: 'ASLI',
        jumlah: 1,
        keterangan: 'Lengkap bukti pembayaran STTS lunas'
      },
      {
        id: 'item-3',
        namaDokumen: 'KTP & Kartu Keluarga (KK) Suami Isteri Penjual',
        asliAtauCopy: 'COPY',
        jumlah: 2,
        keterangan: 'Fotokopi legalisir'
      },
      {
        id: 'item-4',
        namaDokumen: 'NPWP Penjual & Pembeli',
        asliAtauCopy: 'COPY',
        jumlah: 2,
        keterangan: 'Validasi NPWP 16 digit aktif'
      }
    ]
  };

  await saveTandaTerima(sampleTandaTerima);
}
