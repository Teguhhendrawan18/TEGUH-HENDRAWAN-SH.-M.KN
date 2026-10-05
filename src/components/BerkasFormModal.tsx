import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  Upload, 
  FileText, 
  Layers,
  Download,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Receipt,
  Eye,
  ExternalLink,
  Sparkles,
  FolderOpen,
  BellRing,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { 
  ArsipBerkas, 
  LayananType, 
  PihakPenghadap, 
  StatusBerkas, 
  TipeDokumenPdf, 
  ArsipDokumenPdf,
  TahapAJB,
  ReminderSKMHT,
  ProgresAJB
} from '../types';
import { saveBerkas, savePdfBlob, downloadPdfFile, getPdfBlob } from '../services/db';
import { formatFileSize, createLegalDocumentPdfBlob } from '../utils/samplePdf';
import { getRequiredDocumentSlots } from '../utils/documentRequirements';

interface BerkasFormModalProps {
  initialBerkas?: ArsipBerkas | null;
  defaultLayanan?: LayananType;
  existingCount: number;
  onClose: () => void;
  onSaved: (berkas: ArsipBerkas) => void;
}

export const BerkasFormModal: React.FC<BerkasFormModalProps> = ({
  initialBerkas,
  defaultLayanan = 'NOTARIS',
  existingCount,
  onClose,
  onSaved
}) => {
  const isEdit = !!initialBerkas;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Form State
  const [jenisLayanan, setJenisLayanan] = useState<LayananType>(
    initialBerkas?.jenisLayanan || defaultLayanan
  );

  const [nomorRegisterBulanan, setNomorRegisterBulanan] = useState<number>(
    initialBerkas?.nomorRegisterBulanan || existingCount + 1
  );

  const [bulanRegister, setBulanRegister] = useState<number>(
    initialBerkas?.bulanRegister || currentMonth
  );

  const [tahunRegister, setTahunRegister] = useState<number>(
    initialBerkas?.tahunRegister || currentYear
  );

  const [nomorAkta, setNomorAkta] = useState<string>(
    initialBerkas?.nomorAkta ||
      `${String(existingCount + 1).padStart(2, '0')}/${
        (initialBerkas?.jenisLayanan || defaultLayanan) === 'NOTARIS' ? 'NTR' : 'PPAT'
      }/${currentMonth}/${currentYear}`
  );

  const [tanggalAkta, setTanggalAkta] = useState<string>(
    initialBerkas?.tanggalAkta || new Date().toISOString().split('T')[0]
  );

  const [judulAkta, setJudulAkta] = useState<string>(
    initialBerkas?.judulAkta || ''
  );

  const [kategoriAkta, setKategoriAkta] = useState<string>(
    initialBerkas?.kategoriAkta || (defaultLayanan === 'NOTARIS' ? 'PENDIRIAN_PT' : 'AJB')
  );

  const [sifatAkta, setSifatAkta] = useState<string>(
    initialBerkas?.sifatAkta || ''
  );

  const [nilaiTransaksi, setNilaiTransaksi] = useState<number | undefined>(
    initialBerkas?.nilaiTransaksi
  );

  const [objekHukum, setObjekHukum] = useState<string>(
    initialBerkas?.objekHukum || ''
  );

  const [nomorSertipikat, setNomorSertipikat] = useState<string>(
    initialBerkas?.nomorSertipikat || ''
  );

  const [nopPBB, setNopPBB] = useState<string>(
    initialBerkas?.nopPBB || ''
  );

  const [catatanWarkah, setCatatanWarkah] = useState<string>(
    initialBerkas?.catatanWarkah || ''
  );

  const [statusBerkas, setStatusBerkas] = useState<StatusBerkas>(
    initialBerkas?.statusBerkas || 'DRAFTING'
  );

  // Physical Location
  const [lemari, setLemari] = useState<string>(
    initialBerkas?.lokasiFisik?.lemari || 'Lemari A'
  );
  const [rak, setRak] = useState<string>(
    initialBerkas?.lokasiFisik?.rak || 'Rak 01'
  );
  const [nomorBantex, setNomorBantex] = useState<string>(
    initialBerkas?.lokasiFisik?.nomorBantex || `BTX-${defaultLayanan}-${currentYear}-01`
  );
  const [kodeBoks, setKodeBoks] = useState<string>(
    initialBerkas?.lokasiFisik?.kodeBoks || 'BOKS-01'
  );
  const [catatanLokasi, setCatatanLokasi] = useState<string>(
    initialBerkas?.lokasiFisik?.catatanLokasi || ''
  );

  // Parties
  const [paraPihak, setParaPihak] = useState<PihakPenghadap[]>(
    initialBerkas?.paraPihak && initialBerkas.paraPihak.length > 0
      ? initialBerkas.paraPihak
      : [
          { id: '1', nama: '', peran: 'Pihak Pertama', alamat: '', nik: '' },
          { id: '2', nama: '', peran: 'Pihak Kedua', alamat: '', nik: '' }
        ]
  );

  // Saksi
  const [namaSaksiText, setNamaSaksiText] = useState<string>(
    initialBerkas?.namaSaksi?.join(', ') || 'Rina Anggraini, S.H., Fajar Nugraha'
  );

  // Manual Reminder States (SKMHT & AJB Progress)
  const defaultDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  };

  const [tanggalJatuhTempoAPHT, setTanggalJatuhTempoAPHT] = useState<string>(
    initialBerkas?.reminderSKMHT?.tanggalJatuhTempoAPHT || defaultDueDate()
  );
  const [statusAPHT, setStatusAPHT] = useState<'MENUNGGU_APHT' | 'SUDAH_APHT' | 'KADALUARSA'>(
    initialBerkas?.reminderSKMHT?.statusAPHT || 'MENUNGGU_APHT'
  );
  const [namaKrediturBank, setNamaKrediturBank] = useState<string>(
    initialBerkas?.reminderSKMHT?.namaKrediturBank || 'Bank BCA / Mandiri / BRI / BNI'
  );
  const [nomorAktaAPHT, setNomorAktaAPHT] = useState<string>(
    initialBerkas?.reminderSKMHT?.nomorAktaAPHT || ''
  );
  const [catatanSKMHT, setCatatanSKMHT] = useState<string>(
    initialBerkas?.reminderSKMHT?.catatan || ''
  );

  // AJB Progress States
  const [tahapAJB, setTahapAJB] = useState<TahapAJB>(
    initialBerkas?.progresAJB?.tahapAktif || 'VALIDASI_PAJAK'
  );
  const [tanggalTargetAJB, setTanggalTargetAJB] = useState<string>(
    initialBerkas?.progresAJB?.tanggalTarget || defaultDueDate()
  );
  const [statusProgresAJB, setStatusProgresAJB] = useState<'MENUNGGU' | 'DALAM_PROSES' | 'SELESAI' | 'KENDALA'>(
    initialBerkas?.progresAJB?.status || 'DALAM_PROSES'
  );
  const [keteranganProgresAJB, setKeteranganProgresAJB] = useState<string>(
    initialBerkas?.progresAJB?.keteranganProgres || ''
  );

  // General Manual Deadline Date
  const [tenggatWaktuManual, setTenggatWaktuManual] = useState<string>(
    initialBerkas?.tenggatWaktuManual || ''
  );

  // PDF uploads staged
  const [existingPdfList, setExistingPdfList] = useState<ArsipDokumenPdf[]>(
    initialBerkas?.dokumenPdfList || []
  );
  const [stagedFiles, setStagedFiles] = useState<{ file: File; tipe: TipeDokumenPdf; labelHint?: string }[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // In-Form PDF Preview State
  interface InFormPreview {
    title: string;
    fileName: string;
    fileSize: number;
    blobUrl: string;
    blobKey?: string;
    isStaged?: boolean;
    docId?: string;
    tipe: TipeDokumenPdf;
  }
  const [activePreview, setActivePreview] = useState<InFormPreview | null>(null);

  // Clean up object URLs when preview changes or component unmounts
  useEffect(() => {
    return () => {
      if (activePreview?.blobUrl) {
        URL.revokeObjectURL(activePreview.blobUrl);
      }
    };
  }, [activePreview]);

  // Compute required document slots based on the active deed category
  const requiredSlots = useMemo(() => {
    return getRequiredDocumentSlots(kategoriAkta);
  }, [kategoriAkta]);

  const handleClosePreview = () => {
    if (activePreview?.blobUrl) {
      URL.revokeObjectURL(activePreview.blobUrl);
    }
    setActivePreview(null);
  };

  const handleDownloadActivePreview = () => {
    if (!activePreview) return;
    if (activePreview.blobKey) {
      downloadPdfFile(activePreview.blobKey, activePreview.fileName);
    } else if (activePreview.blobUrl) {
      const a = document.createElement('a');
      a.href = activePreview.blobUrl;
      a.download = activePreview.fileName.endsWith('.pdf') ? activePreview.fileName : `${activePreview.fileName}.pdf`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
      }, 100);
    }
  };

  const handleOpenPreviewExisting = async (doc: ArsipDokumenPdf, labelTitle: string) => {
    try {
      const blob = await getPdfBlob(doc.fileBlobKey);
      if (!blob) {
        alert('File PDF tidak ditemukan di penyimpanan lokal.');
        return;
      }
      if (activePreview?.blobUrl) {
        URL.revokeObjectURL(activePreview.blobUrl);
      }
      const url = URL.createObjectURL(blob);
      setActivePreview({
        title: labelTitle,
        fileName: doc.namaFile,
        fileSize: doc.fileSize,
        blobUrl: url,
        blobKey: doc.fileBlobKey,
        isStaged: false,
        docId: doc.id,
        tipe: doc.tipeDokumen,
      });
    } catch (err) {
      console.error('Error opening preview:', err);
      alert('Gagal membuka pratinjau dokumen.');
    }
  };

  const handleOpenPreviewStaged = (staged: { file: File; tipe: TipeDokumenPdf; labelHint?: string }, labelTitle: string) => {
    if (activePreview?.blobUrl) {
      URL.revokeObjectURL(activePreview.blobUrl);
    }
    const url = URL.createObjectURL(staged.file);
    setActivePreview({
      title: labelTitle || staged.labelHint || staged.tipe,
      fileName: staged.file.name,
      fileSize: staged.file.size,
      blobUrl: url,
      isStaged: true,
      tipe: staged.tipe,
    });
  };

  // Auto-adjust default number when switching between Notaris and PPAT
  const handleLayananChange = (type: LayananType) => {
    setJenisLayanan(type);
    if (!isEdit) {
      const prefix = type === 'NOTARIS' ? 'NTR' : 'PPAT';
      setNomorAkta(`${String(nomorRegisterBulanan).padStart(2, '0')}/${prefix}/${bulanRegister}/${tahunRegister}`);
      setNomorBantex(`BTX-${type}-${tahunRegister}-01`);
      setKategoriAkta(type === 'NOTARIS' ? 'PENDIRIAN_PT' : 'AJB');
    }
  };

  const handleAddPihak = () => {
    setParaPihak([
      ...paraPihak,
      {
        id: String(Date.now()),
        nama: '',
        peran: `Penghadap ${paraPihak.length + 1}`,
        alamat: '',
        nik: ''
      }
    ]);
  };

  const handleUpdatePihak = (index: number, field: keyof PihakPenghadap, value: string) => {
    const updated = [...paraPihak];
    updated[index] = { ...updated[index], [field]: value };
    setParaPihak(updated);
  };

  const handleRemovePihak = (index: number) => {
    if (paraPihak.length <= 1) return;
    setParaPihak(paraPihak.filter((_, i) => i !== index));
  };

  const handleStageFile = (
    event: React.ChangeEvent<HTMLInputElement>,
    tipe: TipeDokumenPdf,
    labelTitle?: string
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Pilih file berformat PDF');
      return;
    }
    // Filter out previous staged of same type (except general warkah)
    const filtered = tipe !== 'WARKAH_PENDUKUNG' && tipe !== 'LAINNYA'
      ? stagedFiles.filter(s => s.tipe !== tipe)
      : stagedFiles;

    const newStagedItem = { file, tipe, labelHint: labelTitle };
    setStagedFiles([...filtered, newStagedItem]);
    event.target.value = '';

    // Immediately display preview with download button
    if (activePreview?.blobUrl) {
      URL.revokeObjectURL(activePreview.blobUrl);
    }
    const url = URL.createObjectURL(file);
    setActivePreview({
      title: labelTitle || tipe,
      fileName: file.name,
      fileSize: file.size,
      blobUrl: url,
      isStaged: true,
      tipe: tipe,
    });
  };

  const handleRemoveStagedFile = (index: number) => {
    const target = stagedFiles[index];
    if (target && activePreview && activePreview.fileName === target.file.name) {
      handleClosePreview();
    }
    setStagedFiles(stagedFiles.filter((_, i) => i !== index));
  };

  const handleRemoveExistingPdf = (docId: string) => {
    if (activePreview && activePreview.docId === docId) {
      handleClosePreview();
    }
    setExistingPdfList(existingPdfList.filter(d => d.id !== docId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulAkta.trim()) {
      alert('Judul akta / perihal berkas wajib diisi.');
      return;
    }
    if (!nomorAkta.trim()) {
      alert('Nomor akta wajib diisi.');
      return;
    }

    setIsSaving(true);
    try {
      const berkasId = initialBerkas?.id || `berkas-${Date.now()}`;
      const prefix = jenisLayanan === 'NOTARIS' ? 'NTR' : 'PPT';
      const nomorBerkas = initialBerkas?.nomorBerkas || `BRK-${tahunRegister}-${prefix}-${String(nomorRegisterBulanan).padStart(3, '0')}`;

      // Upload and save staged PDFs into IndexedDB
      const newlySavedDocs: ArsipDokumenPdf[] = [];
      for (const staged of stagedFiles) {
        const blobKey = `pdf_${berkasId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        await savePdfBlob(blobKey, staged.file);

        newlySavedDocs.push({
          id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          namaFile: staged.file.name,
          tipeDokumen: staged.tipe,
          fileBlobKey: blobKey,
          fileSize: staged.file.size,
          fileMimeType: staged.file.type || 'application/pdf',
          uploadedAt: new Date().toISOString(),
          deskripsi: `Diunggah pada ${new Date().toLocaleDateString('id-ID')}`
        });
      }

      // Combine existing docs and new docs
      let finalPdfList = [...existingPdfList, ...newlySavedDocs];

      // If user did not upload any PDF and this is a brand new deed, generate a legal draft PDF automatically so the user immediately has an archived PDF!
      if (finalPdfList.length === 0 && !isEdit) {
        const autoBlob = createLegalDocumentPdfBlob({
          title: judulAkta,
          nomorAkta: nomorAkta,
          tanggalAkta: tanggalAkta,
          jenisLayanan: jenisLayanan,
          paraPihak: paraPihak.map(p => `${p.nama || 'Para Pihak'} (${p.peran})`),
          deskripsi: sifatAkta || catatanWarkah || 'Arsip Minuta Akta Resmi Kantor Notaris & PPAT Teguh Hendrawan',
          lokasiFisik: `${lemari} / ${rak} / ${nomorBantex}`
        });

        const autoBlobKey = `pdf_${berkasId}_minuta_auto`;
        await savePdfBlob(autoBlobKey, autoBlob);

        finalPdfList = [
          {
            id: `doc-${Date.now()}-auto`,
            namaFile: `Minuta_${nomorAkta.replace(/[/\\?%*:|"<>]/g, '_')}.pdf`,
            tipeDokumen: 'MINUTA_AKTA',
            fileBlobKey: autoBlobKey,
            fileSize: autoBlob.size,
            fileMimeType: 'application/pdf',
            uploadedAt: new Date().toISOString(),
            deskripsi: 'Arsip PDF Minuta Akta dibuat otomatis'
          }
        ];
      }

      const saksiList = namaSaksiText
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const berkasData: ArsipBerkas = {
        id: berkasId,
        nomorBerkas,
        jenisLayanan,
        nomorRegisterBulanan: Number(nomorRegisterBulanan),
        bulanRegister: Number(bulanRegister),
        tahunRegister: Number(tahunRegister),
        nomorAkta: nomorAkta.trim(),
        tanggalAkta,
        judulAkta: judulAkta.trim(),
        kategoriAkta,
        sifatAkta: sifatAkta.trim() || judulAkta.trim(),
        paraPihak: paraPihak.filter(p => p.nama.trim().length > 0),
        namaSaksi: saksiList,
        nilaiTransaksi: nilaiTransaksi ? Number(nilaiTransaksi) : undefined,
        objekHukum: objekHukum.trim() || undefined,
        nomorSertipikat: nomorSertipikat.trim() || undefined,
        nopPBB: nopPBB.trim() || undefined,
        lokasiFisik: {
          lemari,
          rak,
          nomorBantex,
          kodeBoks,
          catatanLokasi: catatanLokasi.trim() || undefined
        },
        statusBerkas,
        dokumenPdfList: finalPdfList,
        catatanWarkah: catatanWarkah.trim() || undefined,
        reminderSKMHT: (kategoriAkta === 'SKMHT' || !!initialBerkas?.reminderSKMHT) ? {
          tanggalAktaSKMHT: tanggalAkta,
          tanggalJatuhTempoAPHT,
          statusAPHT,
          nomorAktaAPHT: nomorAktaAPHT.trim() || undefined,
          namaKrediturBank: namaKrediturBank.trim() || undefined,
          catatan: catatanSKMHT.trim() || undefined
        } : undefined,
        progresAJB: (kategoriAkta === 'AJB' || !!initialBerkas?.progresAJB) ? {
          tahapAktif: tahapAJB,
          tanggalTarget: tanggalTargetAJB,
          status: statusProgresAJB,
          keteranganProgres: keteranganProgresAJB.trim() || undefined
        } : undefined,
        tenggatWaktuManual: tenggatWaktuManual || undefined,
        createdAt: initialBerkas?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await saveBerkas(berkasData);
      onSaved(berkasData);
      onClose();
    } catch (err) {
      console.error('Error saving deed:', err);
      alert('Gagal menyimpan data berkas akta. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-750 rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-100 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${jenisLayanan === 'NOTARIS' ? 'bg-amber-500/10 text-amber-400' : 'bg-sky-500/10 text-sky-400'}`}>
              {jenisLayanan === 'NOTARIS' ? <FileText className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                {isEdit ? 'Ubah Berkas Akta' : 'Catat Berkas Akta & Warkah Baru'}
              </h2>
              <p className="text-xs text-slate-400">
                Register resmi Kantor Notaris & PPAT Teguh Hendrawan, S.H., M.Kn.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Layanan & Nomor Register */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Jenis Layanan Akta
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleLayananChange('NOTARIS')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-colors ${
                    jenisLayanan === 'NOTARIS'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Akta Notaris</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLayananChange('PPAT')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-colors ${
                    jenisLayanan === 'PPAT'
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-sm'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4 text-sky-400" />
                  <span>Akta PPAT</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                No. Urut Register Bulan
              </label>
              <input
                type="number"
                min="1"
                value={nomorRegisterBulanan}
                onChange={(e) => setNomorRegisterBulanan(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono font-semibold text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Bulan & Tahun Register
              </label>
              <div className="flex gap-1.5">
                <select
                  value={bulanRegister}
                  onChange={(e) => setBulanRegister(Number(e.target.value))}
                  className="w-1/2 bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Bulan {i + 1}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={tahunRegister}
                  onChange={(e) => setTahunRegister(Number(e.target.value))}
                  className="w-1/2 bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Data Akta */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Identitas & Sifat Akta
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nomor Akta Resmi *
                </label>
                <input
                  type="text"
                  value={nomorAkta}
                  onChange={(e) => setNomorAkta(e.target.value)}
                  placeholder="Contoh: 08/NTR/X/2026"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tanggal Pembuatan Akta *
                </label>
                <input
                  type="date"
                  value={tanggalAkta}
                  onChange={(e) => setTanggalAkta(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Kategori Akta
                </label>
                <select
                  value={kategoriAkta}
                  onChange={(e) => setKategoriAkta(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {jenisLayanan === 'NOTARIS' ? (
                    <>
                      <option value="SKMHT">SKMHT (Kuasa Membebankan Hak Tanggungan)</option>
                      <option value="PENDIRIAN_PT">Pendirian PT (Perseroan Terbatas)</option>
                      <option value="PENDIRIAN_CV">Pendirian CV / Firma</option>
                      <option value="PENDIRIAN_YAYASAN">Pendirian Yayasan / Perkumpulan</option>
                      <option value="PERUBAHAN_ANGGARAN_DASAR">Perubahan Anggaran Dasar</option>
                      <option value="PERJANJIAN_KREDIT">Perjanjian Kredit / Pengakuan Hutang</option>
                      <option value="PERJANJIAN_SEWA">Perjanjian Sewa Menyewa</option>
                      <option value="SURAT_KUASA">Surat Kuasa Notarial</option>
                      <option value="WASIAT">Akta Wasiat</option>
                      <option value="LAINNYA_NOTARIS">Akta Notaris Lainnya</option>
                    </>
                  ) : (
                    <>
                      <option value="AJB">AJB (Akta Jual Beli)</option>
                      <option value="APHT">APHT (Akta Pemberian Hak Tanggungan)</option>
                      <option value="HIBAH">Akta Hibah</option>
                      <option value="PEMBAGIAN_HAK_BERSAMA">Akta Pembagian Hak Bersama (APHB)</option>
                      <option value="TUKAR_MENUKAR">Akta Tukar Menukar</option>
                      <option value="ROYA">Akta Roya / Penghapusan HT</option>
                      <option value="WARIS">Keterangan / Akta Waris</option>
                      <option value="LAINNYA_PPAT">Akta PPAT Lainnya</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Judul Berkas / Perihal Akta *
                </label>
                <input
                  type="text"
                  value={judulAkta}
                  onChange={(e) => setJudulAkta(e.target.value)}
                  placeholder="Contoh: Akta Pendirian PT Citra Karya Gemilang"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Sifat Akta (Deskripsi Singkat)
                </label>
                <input
                  type="text"
                  value={sifatAkta}
                  onChange={(e) => setSifatAkta(e.target.value)}
                  placeholder="Contoh: Pendirian PT dengan modal ditempatkan 1 Milyar"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Objek & Transaksi */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {jenisLayanan === 'PPAT' ? 'Nomor Sertipikat Tanah' : 'Objek Hukum / Badan Usaha'}
                </label>
                <input
                  type="text"
                  value={nomorSertipikat}
                  onChange={(e) => setNomorSertipikat(e.target.value)}
                  placeholder={jenisLayanan === 'PPAT' ? 'SHM No. 0412 / Kebayoran' : 'PT / CV / Objek Perjanjian'}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-amber-300">
                    Nomor Objek Pajak (NOP)
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">18 Digit NOP PBB</span>
                </div>
                <input
                  type="text"
                  value={nopPBB}
                  onChange={(e) => setNopPBB(e.target.value)}
                  placeholder="31.74.xxx.xxx.xxx-xxxx.0"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-amber-200 focus:outline-none focus:border-amber-400 placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nilai Transaksi / Nilai Objek (Rp)
                </label>
                <input
                  type="number"
                  value={nilaiTransaksi || ''}
                  onChange={(e) => setNilaiTransaksi(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Contoh: 1500000000"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Para Pihak Penghadap */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Para Pihak Penghadap
              </h3>
              <button
                type="button"
                onClick={handleAddPihak}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Pihak</span>
              </button>
            </div>

            <div className="space-y-2">
              {paraPihak.map((pihak, index) => (
                <div key={pihak.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800 items-center">
                  <div className="md:col-span-4">
                    <input
                      type="text"
                      value={pihak.nama}
                      onChange={(e) => handleUpdatePihak(index, 'nama', e.target.value)}
                      placeholder="Nama Lengkap & Gelar *"
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
                      required
                    />
                  </div>
                  <div className="md:col-span-3">
                    <input
                      type="text"
                      value={pihak.peran}
                      onChange={(e) => handleUpdatePihak(index, 'peran', e.target.value)}
                      placeholder="Peran (Penjual / Pembeli / Direktur)"
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <input
                      type="text"
                      value={pihak.nik || ''}
                      onChange={(e) => handleUpdatePihak(index, 'nik', e.target.value)}
                      placeholder="NIK (16 Digit) / NPWP"
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="md:col-span-1 flex justify-end">
                    {paraPihak.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePihak(index)}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded"
                        title="Hapus baris pihak"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Saksi-saksi Akta (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={namaSaksiText}
                onChange={(e) => setNamaSaksiText(e.target.value)}
                placeholder="Rina Anggraini, S.H., Fajar Nugraha"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Section 4: Lokasi Penyimpanan Fisik */}
          <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Lokasi Fisik Arsip (Lemari / Rak / Map)
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Lemari</label>
                <select
                  value={lemari}
                  onChange={(e) => setLemari(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Lemari A">Lemari A (Notaris Utama)</option>
                  <option value="Lemari B">Lemari B (PPAT AJB)</option>
                  <option value="Lemari C">Lemari C (PPAT APHT/SKMHT)</option>
                  <option value="Lemari D">Lemari D (Warkah Fisik)</option>
                  <option value="Lemari E">Lemari E (Arsip Khusus)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Rak Tingkat</label>
                <select
                  value={rak}
                  onChange={(e) => setRak(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {[...Array(6)].map((_, i) => (
                    <option key={i + 1} value={`Rak 0${i + 1}`}>
                      Rak 0{i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Nomor Bantex / Map</label>
                <input
                  type="text"
                  value={nomorBantex}
                  onChange={(e) => setNomorBantex(e.target.value)}
                  placeholder="BTX-NTR-2026-01"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Kode Boks Arsip</label>
                <input
                  type="text"
                  value={kodeBoks}
                  onChange={(e) => setKodeBoks(e.target.value)}
                  placeholder="BOKS-01"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Status Tahapan Berkas</label>
                <select
                  value={statusBerkas}
                  onChange={(e) => setStatusBerkas(e.target.value as StatusBerkas)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="DRAFTING">1. Drafting Minuta</option>
                  <option value="REVIEW_PENGHADAP">2. Review & Verifikasi Penghadap</option>
                  <option value="TANDA_TANGAN">3. Siap Tanda Tangan / Penandatanganan</option>
                  <option value="VALIDASI_PAJAK">4. Validasi Pajak (BPHTB / PPh)</option>
                  <option value="PROSES_BPN">5. Pendaftaran di Kantor Pertanahan BPN</option>
                  <option value="SELESAI_DIARSIPKAN">6. Selesai & Tersimpan di Arsip</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Catatan Warkah / Keterangan</label>
                <input
                  type="text"
                  value={catatanWarkah}
                  onChange={(e) => setCatatanWarkah(e.target.value)}
                  placeholder="Catatan proses, nomor pendaftaran BPN, dll."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Section: Pengaturan Pengingat (Reminder) & Tenggat Waktu Manual */}
          <div className="bg-slate-950/70 border border-amber-500/40 rounded-xl p-4 space-y-3 shadow-inner">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <BellRing className="w-4 h-4 text-amber-400" />
                <span>Pengaturan Pengingat (Reminder) & Tenggat Waktu Manual</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                Kategori: {kategoriAkta}
              </span>
            </div>

            {/* Case 1: SKMHT Reminder */}
            {kategoriAkta === 'SKMHT' ? (
              <div className="space-y-3">
                <div className="bg-amber-950/30 border border-amber-800/60 p-2.5 rounded-lg text-xs text-amber-300 flex items-start gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Ketentuan Masa Berlaku SKMHT:</span>
                    <p className="text-[11px] text-amber-200/90 mt-0.5">
                      Berdasarkan UU Hak Tanggungan No. 4/1996, SKMHT wajib diikuti pembuatan APHT selambat-lambatnya 1 bulan (30 hari) untuk tanah terdaftar. Atur tanggal jatuh tempo secara manual di bawah ini.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-amber-300 mb-1">
                      Tanggal Jatuh Tempo Pembuatan APHT *
                    </label>
                    <input
                      type="date"
                      value={tanggalJatuhTempoAPHT}
                      onChange={(e) => setTanggalJatuhTempoAPHT(e.target.value)}
                      className="w-full bg-slate-900 border border-amber-500/50 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">
                      Status Pemenuhan APHT
                    </label>
                    <select
                      value={statusAPHT}
                      onChange={(e) => setStatusAPHT(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
                    >
                      <option value="MENUNGGU_APHT">1. Menunggu Pembuatan APHT (Aktif)</option>
                      <option value="SUDAH_APHT">2. Sudah Dibuatkan APHT (Selesai)</option>
                      <option value="KADALUARSA">3. Kadaluarsa / Batal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">
                      Nama Bank / Lembaga Kreditur
                    </label>
                    <input
                      type="text"
                      value={namaKrediturBank}
                      onChange={(e) => setNamaKrediturBank(e.target.value)}
                      placeholder="Contoh: PT Bank Central Asia Tbk"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Nomor Akta APHT Terkait (Bila Sudah Dibuat)
                    </label>
                    <input
                      type="text"
                      value={nomorAktaAPHT}
                      onChange={(e) => setNomorAktaAPHT(e.target.value)}
                      placeholder="Contoh: 15/PPAT/10/2026"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Catatan Pengingat SKMHT
                    </label>
                    <input
                      type="text"
                      value={catatanSKMHT}
                      onChange={(e) => setCatatanSKMHT(e.target.value)}
                      placeholder="Contoh: Menunggu pelunasan sisa kredit sebelum APHT"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            ) : kategoriAkta === 'AJB' ? (
              /* Case 2: AJB Progress Tracking */
              <div className="space-y-3">
                <p className="text-[11px] text-slate-400">
                  Pantau tahapan yuridis Akta Jual Beli (Validasi Pajak, Pengecekan BPN, TTD Minuta, Balik Nama) dengan target tanggal manual.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-sky-300 mb-1">
                      Tahapan Berjalan AJB
                    </label>
                    <select
                      value={tahapAJB}
                      onChange={(e) => setTahapAJB(e.target.value as TahapAJB)}
                      className="w-full bg-slate-900 border border-sky-500/50 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-400 font-medium"
                    >
                      <option value="VALIDASI_PAJAK">1. Validasi Pajak (BPHTB / PPh)</option>
                      <option value="PENGECEKAN_BPN">2. Pengecekan Sertipikat BPN / SKPT</option>
                      <option value="TANDA_TANGAN">3. Penandatanganan Minuta AJB</option>
                      <option value="PROSES_BALIK_NAMA">4. Proses Balik Nama di Kantor BPN</option>
                      <option value="SELESAI">5. Selesai (Sertipikat Diserahkan ke Pembeli)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-amber-300 mb-1">
                      Target Tanggal Selesai (Manual) *
                    </label>
                    <input
                      type="date"
                      value={tanggalTargetAJB}
                      onChange={(e) => setTanggalTargetAJB(e.target.value)}
                      className="w-full bg-slate-900 border border-amber-500/50 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">
                      Status Progres
                    </label>
                    <select
                      value={statusProgresAJB}
                      onChange={(e) => setStatusProgresAJB(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="DALAM_PROSES">Sedang Dalam Proses</option>
                      <option value="MENUNGGU">Menunggu Dokumen Pihak</option>
                      <option value="KENDALA">Ada Kendala / Pending</option>
                      <option value="SELESAI">Tahapan Selesai</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Keterangan / Catatan Progres AJB
                  </label>
                  <input
                    type="text"
                    value={keteranganProgresAJB}
                    onChange={(e) => setKeteranganProgresAJB(e.target.value)}
                    placeholder="Contoh: Berkas telah masuk loket BPN nomor permohonan 8812/2026"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            ) : (
              /* Case 3: Other Deeds General Deadline */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">
                    Tanggal Tenggat Waktu Pengingat (Manual)
                  </label>
                  <input
                    type="date"
                    value={tenggatWaktuManual}
                    onChange={(e) => setTenggatWaktuManual(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="flex items-center text-[11px] text-slate-400 pt-5">
                  <span>Atur batas waktu untuk follow up penyelesaian berkas atau penyerahan akta ke klien.</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Unggahan Berkas Dinamis Sesuai Jenis Akta & Pratinjau PDF */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>Daftar Unggahan Berkas Akta & Warkah Digital</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Kebutuhan dokumen disesuaikan secara otomatis untuk kategori:{' '}
                  <span className="font-semibold text-amber-300">
                    {kategoriAkta === 'AJB' ? 'AJB (Akta Jual Beli)' :
                     kategoriAkta === 'APHT' ? 'APHT (Akta Pemberian Hak Tanggungan)' :
                     kategoriAkta === 'HIBAH' ? 'Akta Hibah' :
                     kategoriAkta === 'PENDIRIAN_PT' ? 'Pendirian PT / Badan Usaha' :
                     kategoriAkta === 'PERJANJIAN_SEWA' ? 'Perjanjian Sewa Menyewa' :
                     kategoriAkta}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {existingPdfList.length + stagedFiles.length} File Terpasang
                </span>
              </div>
            </div>

            {/* In-Form PDF Preview Panel with Download Button */}
            {activePreview && (
              <div className="bg-slate-950 border-2 border-amber-500/80 rounded-xl overflow-hidden shadow-2xl p-3 sm:p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-300 uppercase tracking-wide truncate">
                          Pratinjau: {activePreview.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
                          {activePreview.isStaged ? 'Siap Disimpan' : 'Tersimpan'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-mono truncate">
                        {activePreview.fileName} · <span className="text-slate-400 font-sans">({formatFileSize(activePreview.fileSize)})</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Tombol Unduh Dokumen Ini (PDF) */}
                    <button
                      type="button"
                      onClick={handleDownloadActivePreview}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-colors"
                      title="Unduh file PDF ini ke perangkat / komputer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh Dokumen (PDF)</span>
                    </button>

                    <a
                      href={activePreview.blobUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                      title="Buka di Tab Baru"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      type="button"
                      onClick={handleClosePreview}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Tutup Pratinjau"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Embedded PDF iframe */}
                <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
                  <iframe
                    src={activePreview.blobUrl}
                    className="w-full h-80 sm:h-96 rounded-lg"
                    title={`Pratinjau ${activePreview.fileName}`}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>File PDF berhasil dimuat. Anda dapat langsung mengunduhnya menggunakan tombol kuning di atas.</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleClosePreview}
                    className="text-slate-400 hover:text-white text-xs underline"
                  >
                    Tutup Pratinjau
                  </button>
                </div>
              </div>
            )}

            {/* Dynamic Document Requirements Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Daftar Slot Berkas yang Disesuaikan untuk {kategoriAkta}:</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  *Klik tombol Pratinjau & Unduh untuk melihat dan mengunduh berkas
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {requiredSlots.map((slot) => {
                  const existing = existingPdfList.find(d => d.tipeDokumen === slot.tipe);
                  const staged = stagedFiles.find(s => s.tipe === slot.tipe);
                  const isUploaded = !!(existing || staged);

                  return (
                    <div
                      key={slot.id}
                      className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                        isUploaded
                          ? 'bg-slate-900/90 border-emerald-500/50 shadow-sm'
                          : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 truncate">
                            <span className={`w-2 h-2 rounded-full ${isUploaded ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                            <span className="truncate">{slot.label}</span>
                          </span>
                          {isUploaded ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Terunggah</span>
                            </span>
                          ) : slot.wajib ? (
                            <span className="text-[10px] text-amber-400/90 font-medium px-1.5 py-0.2 rounded bg-amber-950/40 border border-amber-800/40 shrink-0">
                              Diperlukan
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-medium shrink-0">
                              Opsional
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mb-2.5 line-clamp-2">
                          {slot.subLabel}
                        </p>
                      </div>

                      {existing ? (
                        <div className="bg-slate-850 p-2 rounded-lg border border-slate-700/80 space-y-1.5">
                          <div className="flex items-center gap-1.5 truncate text-[11px]">
                            <FileCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="font-mono text-white truncate" title={existing.namaFile}>
                              {existing.namaFile}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-750">
                            <span>{formatFileSize(existing.fileSize)}</span>
                            <div className="flex items-center gap-1">
                              {/* Tombol Pratinjau & Unduh */}
                              <button
                                type="button"
                                onClick={() => handleOpenPreviewExisting(existing, slot.label)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-amber-300 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-800/60 transition-colors"
                                title="Buka Pratinjau & Unduh Dokumen Ini"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Pratinjau & Unduh</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => downloadPdfFile(existing.fileBlobKey, existing.namaFile)}
                                className="p-1 text-slate-400 hover:text-amber-300 rounded hover:bg-slate-750 transition-colors"
                                title="Unduh langsung"
                              >
                                <Download className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveExistingPdf(existing.id)}
                                className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-750 transition-colors"
                                title="Hapus file"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : staged ? (
                        <div className="bg-emerald-950/30 p-2 rounded-lg border border-emerald-800/60 space-y-1.5">
                          <div className="flex items-center gap-1.5 truncate text-[11px]">
                            <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="font-mono text-emerald-200 truncate">{staged.file.name}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-emerald-400 pt-1 border-t border-emerald-900/60">
                            <span>{formatFileSize(staged.file.size)}</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenPreviewStaged(staged, slot.label)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-emerald-200 bg-emerald-900/70 hover:bg-emerald-800 border border-emerald-700/60 text-[10px]"
                                title="Buka Pratinjau & Unduh Dokumen Ini"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Pratinjau & Unduh</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const idx = stagedFiles.findIndex(s => s === staged);
                                  if (idx !== -1) handleRemoveStagedFile(idx);
                                }}
                                className="text-emerald-400 hover:text-rose-400 text-[10px] underline"
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex items-center justify-center gap-1.5 border border-dashed border-slate-700 hover:border-amber-400/60 bg-slate-900/40 hover:bg-amber-400/5 py-2.5 px-3 rounded-lg text-center transition-colors">
                          <Upload className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs font-semibold text-slate-300 hover:text-white truncate">
                            + Unggah {slot.label}
                          </span>
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            className="hidden"
                            onChange={(e) => handleStageFile(e, slot.tipe, slot.label)}
                          />
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Upload for Other Additional Documents */}
            <div className="pt-2">
              <label className="cursor-pointer flex items-center justify-center gap-2 border border-dashed border-slate-750 hover:border-slate-500 bg-slate-900/30 hover:bg-slate-800/40 py-2.5 px-4 rounded-xl text-center transition-colors">
                <Upload className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-300 hover:text-white">
                  + Unggah Dokumen Tambahan Khusus Lainnya (PDF)
                </span>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={(e) => handleStageFile(e, 'WARKAH_PENDUKUNG', 'Dokumen Pendukung')}
                />
              </label>
            </div>

            {/* List of All Staged New PDFs */}
            {stagedFiles.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>File PDF Baru Siap Disimpan ({stagedFiles.length}):</span>
                </span>
                {stagedFiles.map((staged, i) => (
                  <div key={i} className="flex items-center justify-between bg-emerald-950/40 border border-emerald-800/60 px-3 py-1.5 rounded-lg text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="font-mono text-emerald-200 truncate">{staged.file.name}</span>
                      <span className="text-emerald-400/80 text-[11px]">({formatFileSize(staged.file.size)})</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/80 text-emerald-200">
                        {staged.labelHint || staged.tipe}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenPreviewStaged(staged, staged.labelHint || staged.tipe)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-emerald-200 bg-emerald-900/60 hover:bg-emerald-800 text-[10px]"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Pratinjau & Unduh</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveStagedFile(i)}
                        className="text-emerald-400 hover:text-rose-400 p-1"
                        title="Batal unggah file ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List of All Currently Stored PDFs with Direct Download */}
            {existingPdfList.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-300">
                    Seluruh Dokumen PDF Tersimpan di Berkas Ini ({existingPdfList.length}):
                  </span>
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {existingPdfList.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs hover:border-slate-600 transition-colors">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="font-mono text-white truncate max-w-sm">{doc.namaFile}</span>
                        <span className="text-slate-400 text-[11px]">({formatFileSize(doc.fileSize)})</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                          {doc.tipeDokumen}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenPreviewExisting(doc, doc.tipeDokumen)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/40 transition-colors"
                          title="Buka Pratinjau & Unduh Dokumen Ini"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Pratinjau & Unduh</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadPdfFile(doc.fileBlobKey, doc.namaFile)}
                          className="p-1 text-slate-400 hover:text-amber-300 rounded hover:bg-slate-700 transition-colors"
                          title="Unduh langsung file PDF ini"
                        >
                          <Download className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingPdf(doc.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-700 transition-colors"
                          title="Hapus berkas PDF"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              * Kolom wajib diisi untuk pencatatan register resmi
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Catat Berkas & Buat Arsip'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
