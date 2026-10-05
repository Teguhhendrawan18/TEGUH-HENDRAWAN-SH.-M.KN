import React, { useState } from 'react';
import { 
  FileCheck, 
  Printer, 
  Download, 
  Upload, 
  Calendar, 
  CheckCircle2, 
  FileSpreadsheet,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { ArsipBerkas, LayananType, KantorProfile } from '../types';
import { saveBerkas, clearAllBerkasAndTandaTerima, populateDemoData } from '../services/db';
import { KopSuratNotaris, KopSuratPPAT } from './OfficialLogos';

interface RekapLaporanViewProps {
  berkasList: ArsipBerkas[];
  kantorProfile?: KantorProfile;
  onDataImported: () => void;
}

export const RekapLaporanView: React.FC<RekapLaporanViewProps> = ({
  berkasList,
  kantorProfile,
  onDataImported
}) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedLayanan, setSelectedLayanan] = useState<LayananType>('NOTARIS');
  const [selectedBulan, setSelectedBulan] = useState<number>(currentMonth);
  const [selectedTahun, setSelectedTahun] = useState<number>(currentYear);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const reportItems = berkasList.filter(
    b => b.jenisLayanan === selectedLayanan &&
         b.bulanRegister === selectedBulan &&
         b.tahunRegister === selectedTahun
  ).sort((a, b) => a.nomorRegisterBulanan - b.nomorRegisterBulanan);

  const handlePrint = () => {
    window.print();
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    setIsExporting(true);
    try {
      const dataStr = JSON.stringify(berkasList, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Backup_Arsip_Notaris_TeguhHendrawan_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error', err);
      alert('Gagal mengekspor data');
    } finally {
      setIsExporting(false);
    }
  };

  // Import JSON Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const imported = JSON.parse(text) as ArsipBerkas[];
        if (Array.isArray(imported)) {
          for (const item of imported) {
            await saveBerkas(item);
          }
          alert(`Berhasil memulihkan ${imported.length} berkas akta.`);
          onDataImported();
        } else {
          alert('Format file JSON tidak sesuai.');
        }
      } catch (err) {
        console.error('Import error', err);
        alert('File backup JSON tidak valid.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearAll = async () => {
    if (window.confirm('Kosongkan semua daftar berkas akta dan tanda terima? Profil resmi kantor tetap dipertahankan.')) {
      await clearAllBerkasAndTandaTerima();
      onDataImported();
      alert('Semua data berkas dan tanda terima telah berhasil dikosongkan.');
    }
  };

  const handleLoadDemo = async () => {
    if (window.confirm('Muat data contoh akta Notaris & PPAT untuk pengujian sistem?')) {
      await populateDemoData();
      onDataImported();
      alert('Data contoh demo berhasil dimuat.');
    }
  };

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  return (
    <div className="space-y-5">
      {/* Top Controller Bar */}
      <div className="no-print bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white">
              Rekapitulasi Laporan Bulanan Resmi
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Laporan MPD / ATR BPN
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Format laporan bulanan akta Notaris ke Majelis Pengawas Daerah (MPD) dan laporan akta PPAT ke Kantor Pertanahan ATR/BPN.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Layanan Selector */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-750">
            <button
              onClick={() => setSelectedLayanan('NOTARIS')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedLayanan === 'NOTARIS'
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Laporan Notaris
            </button>
            <button
              onClick={() => setSelectedLayanan('PPAT')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedLayanan === 'PPAT'
                  ? 'bg-sky-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Laporan PPAT
            </button>
          </div>

          {/* Month selector */}
          <select
            value={selectedBulan}
            onChange={(e) => setSelectedBulan(Number(e.target.value))}
            className="bg-slate-950 border border-slate-750 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400"
          >
            {monthNames.map((name, i) => (
              <option key={i + 1} value={i + 1}>
                {name}
              </option>
            ))}
          </select>

          {/* Year selector */}
          <select
            value={selectedTahun}
            onChange={(e) => setSelectedTahun(Number(e.target.value))}
            className="bg-slate-950 border border-slate-750 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400"
          >
            <option value={currentYear}>{currentYear}</option>
            <option value={currentYear - 1}>{currentYear - 1}</option>
          </select>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Backup & Restore Action Strip */}
      <div className="no-print bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <FileSpreadsheet className="w-4 h-4 text-amber-400" />
          <span>Cadangan & Pemulihan Arsip (JSON Data Portability):</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportBackup}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-750 border border-slate-700 transition-colors"
          >
            <Download className="w-3 h-3 text-amber-400" />
            <span>Ekspor Cadangan (JSON)</span>
          </button>

          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-750 border border-slate-700 transition-colors">
            <Upload className="w-3 h-3 text-sky-400" />
            <span>Impor Cadangan</span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportBackup}
            />
          </label>

          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-rose-300 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/60 transition-colors"
            title="Kosongkan seluruh berkas akta dan warkah"
          >
            <Trash2 className="w-3 h-3 text-rose-400" />
            <span>Kosongkan Seluruh Berkas</span>
          </button>

          <button
            onClick={handleLoadDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition-colors"
            title="Muat data contoh akta Notaris & PPAT"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            <span>Muat Contoh Demo</span>
          </button>
        </div>
      </div>

      {/* Printable Report Sheet Layout */}
      <div className="bg-white text-slate-950 p-8 rounded-xl shadow-lg border border-slate-300 font-serif text-xs select-none">
        {/* Kop Laporan Resmi dengan Logo Resmi INI (Notaris) atau IPPAT (PPAT) */}
        {selectedLayanan === 'NOTARIS' ? (
          <KopSuratNotaris
            kantorProfile={kantorProfile}
            subJudul={`LAPORAN BULANAN AKTA NOTARIS - PERIODE ${monthNames[selectedBulan - 1].toUpperCase()} ${selectedTahun}`}
            nomorSurat={`01/LAP-NTR/${selectedBulan}/${selectedTahun}`}
          />
        ) : (
          <KopSuratPPAT
            kantorProfile={kantorProfile}
            subJudul={`LAPORAN BULANAN AKTA PEJABAT PEMBUAT AKTA TANAH (PPAT) - PERIODE ${monthNames[selectedBulan - 1].toUpperCase()} ${selectedTahun}`}
            nomorSurat={`01/LAP-PPAT/${selectedBulan}/${selectedTahun}`}
          />
        )}

        {/* Tujuan Surat Pengantar Resmi */}
        <div className="my-3 text-left font-sans text-[11px] leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
          <p className="font-semibold text-slate-800">
            {selectedLayanan === 'NOTARIS' ? (
              <>
                Kepada Yth.
                <br />
                <strong>Ketua Majelis Pengawas Daerah (MPD) Notaris</strong>
                <br />
                {kantorProfile?.wilayahKerja || 'Kota Administrasi Jakarta Selatan'}
              </>
            ) : (
              <>
                Kepada Yth.
                <br />
                <strong>1. Kepala Kantor Pertanahan {kantorProfile?.wilayahKerja || 'Kota Administrasi Jakarta Selatan'} (ATR/BPN)</strong>
                <br />
                <strong>2. Kepala Badan Pendapatan Daerah (Bapenda) / KPP Pratama Terkait</strong>
              </>
            )}
          </p>
          <p className="text-[10px] text-slate-600 mt-1 italic">
            Bersama ini kami sampaikan buku daftar akta yang telah dibuat dan disahkan selama periode bulan {monthNames[selectedBulan - 1]} tahun {selectedTahun}.
          </p>
        </div>

        {/* Report Summary */}
        <div className="mb-4 font-sans text-[11px] flex justify-between bg-slate-50 p-2.5 rounded border border-slate-200">
          <span>Jumlah Akta Terdaftar: <strong>{reportItems.length} Akta</strong></span>
          <span>Status Cetak: <strong>Arsip Sistem Digital Kantor</strong></span>
          <span>Tanggal Rekap: <strong>{new Date().toLocaleDateString('id-ID')}</strong></span>
        </div>

        {/* Main Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-slate-900 text-[11px] font-sans">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold text-[10px] uppercase">
                <th className="border border-slate-900 p-2 text-center w-8">No</th>
                <th className="border border-slate-900 p-2 text-left w-32">Nomor & Tgl Akta</th>
                <th className="border border-slate-900 p-2 text-left">Bentuk / Sifat Akta</th>
                <th className="border border-slate-900 p-2 text-left">Nama Para Pihak</th>
                <th className="border border-slate-900 p-2 text-left w-32">Saksi-saksi</th>
                <th className="border border-slate-900 p-2 text-center w-24">Lokasi Arsip</th>
              </tr>
            </thead>
            <tbody>
              {reportItems.length > 0 ? (
                reportItems.map((item, idx) => (
                  <tr key={item.id} className="border-b border-slate-300">
                    <td className="border border-slate-900 p-2 text-center font-mono font-bold">
                      {item.nomorRegisterBulanan}
                    </td>
                    <td className="border border-slate-900 p-2 font-mono">
                      <div className="font-bold">{item.nomorAkta}</div>
                      <div className="text-[10px] text-slate-600">{item.tanggalAkta}</div>
                    </td>
                    <td className="border border-slate-900 p-2">
                      <div className="font-semibold">{item.judulAkta}</div>
                      <div className="text-[10px] text-slate-600">{item.sifatAkta}</div>
                    </td>
                    <td className="border border-slate-900 p-2">
                      {item.paraPihak.map((p, i) => (
                        <div key={i} className="text-[10px]">
                          {i + 1}. {p.nama} ({p.peran})
                        </div>
                      ))}
                    </td>
                    <td className="border border-slate-900 p-2 text-[10px]">
                      {item.namaSaksi.join(', ')}
                    </td>
                    <td className="border border-slate-900 p-2 text-center text-[10px] font-mono">
                      {item.lokasiFisik.lemari} / {item.lokasiFisik.rak}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="border border-slate-900 p-6 text-center text-slate-500 italic">
                    Nihil - Tidak ada akta pada periode {monthNames[selectedBulan - 1]} {selectedTahun}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Signatures */}
        <div className="grid grid-cols-2 gap-8 text-center text-xs pt-4 font-sans">
          <div></div>
          <div>
            <p className="text-slate-700">
              {kantorProfile?.wilayahKerja ? kantorProfile.wilayahKerja.replace(/^Kota\s+Administrasi\s+|^Kabupaten\s+/, '') : 'Jakarta'}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="font-bold text-slate-900 mt-1">
              {selectedLayanan === 'NOTARIS'
                ? `Notaris di ${kantorProfile?.wilayahKerja || 'Jakarta Selatan'}`
                : `PPAT ${kantorProfile?.wilayahKerja || 'Kota Jakarta Selatan'}`}
            </p>
            <div className="h-16"></div>
            <p className="font-bold underline text-slate-950 font-serif text-sm">
              {kantorProfile ? `${kantorProfile.namaNotaris}, ${kantorProfile.gelar}` : 'TEGUH HENDRAWAN, S.H., M.Kn.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
