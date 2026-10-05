import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  QrCode, 
  Edit3, 
  Trash2, 
  Plus, 
  FileCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FolderOpen,
  MapPin,
  Download
} from 'lucide-react';
import { ArsipBerkas, LayananType, StatusBerkas } from '../types';
import { downloadPdfFile } from '../services/db';

interface RegisterTableProps {
  layanan: LayananType;
  berkasList: ArsipBerkas[];
  onOpenPdf: (berkas: ArsipBerkas, docId?: string) => void;
  onOpenQrLabel: (berkas: ArsipBerkas) => void;
  onEditBerkas: (berkas: ArsipBerkas) => void;
  onDeleteBerkas: (id: string) => void;
  onAddNew: () => void;
}

export const RegisterTable: React.FC<RegisterTableProps> = ({
  layanan,
  berkasList,
  onOpenPdf,
  onOpenQrLabel,
  onEditBerkas,
  onDeleteBerkas,
  onAddNew
}) => {
  const currentYear = new Date().getFullYear();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<StatusBerkas | 'ALL'>('ALL');

  // Filtered dataset
  const filteredData = useMemo(() => {
    return berkasList
      .filter((item) => item.jenisLayanan === layanan)
      .filter((item) => {
        if (selectedYear !== 0 && item.tahunRegister !== selectedYear) return false;
        if (selectedMonth !== 'ALL' && item.bulanRegister !== selectedMonth) return false;
        if (selectedStatus !== 'ALL' && item.statusBerkas !== selectedStatus) return false;

        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchNoAkta = item.nomorAkta.toLowerCase().includes(q);
          const matchJudul = item.judulAkta.toLowerCase().includes(q);
          const matchBerkas = item.nomorBerkas.toLowerCase().includes(q);
          const matchObjek = item.objekHukum?.toLowerCase().includes(q);
          const matchSertipikat = item.nomorSertipikat?.toLowerCase().includes(q);
          const matchPihak = item.paraPihak.some(p => 
            p.nama.toLowerCase().includes(q) || (p.nik && p.nik.includes(q))
          );
          return matchNoAkta || matchJudul || matchBerkas || matchObjek || matchSertipikat || matchPihak;
        }

        return true;
      })
      .sort((a, b) => b.nomorRegisterBulanan - a.nomorRegisterBulanan);
  }, [berkasList, layanan, selectedYear, selectedMonth, selectedStatus, searchTerm]);

  const getStatusBadge = (status: StatusBerkas) => {
    switch (status) {
      case 'DRAFTING':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Drafting</span>
          </span>
        );
      case 'REVIEW_PENGHADAP':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Review Para Pihak</span>
          </span>
        );
      case 'TANDA_TANGAN':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-300">
            <AlertCircle className="w-3 h-3 text-purple-400" />
            <span>Siap Tanda Tangan</span>
          </span>
        );
      case 'VALIDASI_PAJAK':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Validasi Pajak</span>
          </span>
        );
      case 'PROSES_BPN':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-400">
            <Clock className="w-3 h-3 text-sky-400" />
            <span>Proses Kantah BPN</span>
          </span>
        );
      case 'SELESAI_DIARSIPKAN':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Arsip Lengkap</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Title & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white">
              {layanan === 'NOTARIS' ? 'Buku Daftar Akta Notaris' : 'Buku Daftar Akta PPAT'}
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {filteredData.length} Berkas
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Register resmi kenotariatan & ke-PPAT-an Kantor Teguh Hendrawan, S.H., M.Kn.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddNew}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-950 transition-colors shadow ${
              layanan === 'NOTARIS' ? 'bg-amber-400 hover:bg-amber-300' : 'bg-sky-400 hover:bg-sky-300'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Catat Akta Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nomor akta, judul, nama pihak penghadap, sertipikat..."
            className="w-full bg-slate-950 border border-slate-750 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          {/* Month selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="bg-slate-950 border border-slate-750 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">Semua Bulan</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Bulan {i + 1} ({new Date(2026, i, 1).toLocaleString('id-ID', { month: 'short' })})
              </option>
            ))}
          </select>

          {/* Year selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-slate-950 border border-slate-750 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-400"
          >
            <option value={currentYear}>{currentYear}</option>
            <option value={currentYear - 1}>{currentYear - 1}</option>
            <option value={currentYear - 2}>{currentYear - 2}</option>
          </select>

          {/* Status selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as StatusBerkas | 'ALL')}
            className="bg-slate-950 border border-slate-750 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">Semua Status</option>
            <option value="DRAFTING">Drafting</option>
            <option value="REVIEW_PENGHADAP">Review Para Pihak</option>
            <option value="TANDA_TANGAN">Siap Tanda Tangan</option>
            <option value="VALIDASI_PAJAK">Validasi Pajak</option>
            <option value="PROSES_BPN">Proses BPN</option>
            <option value="SELESAI_DIARSIPKAN">Selesai Diarsipkan</option>
          </select>
        </div>
      </div>

      {/* Main Register Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3 w-12 text-center">No</th>
                <th className="py-3 px-4">Nomor Akta & Tanggal</th>
                <th className="py-3 px-4">Sifat / Judul Akta</th>
                <th className="py-3 px-4">Para Pihak Penghadap</th>
                <th className="py-3 px-3">Lokasi Fisik Arsip</th>
                <th className="py-3 px-3">Dokumen PDF</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-200">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => {
                  const pdfCount = item.dokumenPdfList?.length || 0;
                  return (
                    <tr 
                      key={item.id} 
                      className="hover:bg-slate-850/50 transition-colors group"
                    >
                      {/* Register Number */}
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-400 tabular-nums">
                        {item.nomorRegisterBulanan}
                      </td>

                      {/* Nomor Akta & Tanggal */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-amber-300 text-xs">
                          {item.nomorAkta}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{item.tanggalAkta}</span>
                          <span className="text-slate-600">·</span>
                          <span className="font-mono text-[10px] text-slate-500">{item.nomorBerkas}</span>
                        </div>
                      </td>

                      {/* Judul & Sifat Akta */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-medium text-white line-clamp-1" title={item.judulAkta}>
                          {item.judulAkta}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {item.objekHukum || item.sifatAkta}
                        </div>
                        {item.nopPBB && (
                          <div className="flex items-center gap-1 text-[10px] font-mono text-amber-300 mt-1">
                            <span className="text-slate-500">NOP:</span>
                            <span>{item.nopPBB}</span>
                          </div>
                        )}
                        {item.kategoriAkta === 'SKMHT' && (
                          <div className="mt-1 flex items-center gap-1 text-[10px]">
                            <span className={`px-1.5 py-0.2 rounded font-medium ${
                              item.reminderSKMHT?.statusAPHT === 'SUDAH_APHT' 
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}>
                              ⏰ SKMHT {item.reminderSKMHT?.statusAPHT === 'SUDAH_APHT' ? '✓ Sudah APHT' : `Jatuh Tempo: ${item.reminderSKMHT?.tanggalJatuhTempoAPHT || '30 Hari'}`}
                            </span>
                          </div>
                        )}
                        {item.kategoriAkta === 'AJB' && (
                          <div className="mt-1 flex items-center gap-1 text-[10px]">
                            <span className={`px-1.5 py-0.2 rounded font-medium ${
                              item.progresAJB?.status === 'SELESAI' 
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                                : 'bg-sky-950 text-sky-300 border border-sky-800'
                            }`}>
                              📈 AJB {item.progresAJB?.status === 'SELESAI' ? '✓ Selesai' : `Tahap: ${item.progresAJB?.tahapAktif || 'Validasi Pajak'}`}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Para Pihak */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="space-y-0.5">
                          {item.paraPihak.slice(0, 2).map((pihak, idx) => (
                            <div key={idx} className="text-xs truncate text-slate-200">
                              <span className="font-medium text-white">{pihak.nama}</span>
                              <span className="text-[11px] text-slate-400 ml-1">({pihak.peran})</span>
                            </div>
                          ))}
                          {item.paraPihak.length > 2 && (
                            <span className="text-[10px] text-amber-400/90 font-medium">
                              +{item.paraPihak.length - 2} pihak lainnya
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Lokasi Fisik */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="font-medium">{item.lokasiFisik.lemari}</span>
                          <span className="text-slate-500">/</span>
                          <span>{item.lokasiFisik.rak}</span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5 truncate max-w-[120px]" title={item.lokasiFisik.nomorBantex}>
                          {item.lokasiFisik.nomorBantex}
                        </div>
                      </td>

                      {/* Dokumen PDF (Penyimpanan PDF di aplikasi) */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {pdfCount > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => onOpenPdf(item)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors text-xs font-medium"
                              title="Buka Dokumen PDF Tersimpan"
                            >
                              <FileText className="w-3.5 h-3.5 text-amber-400" />
                              <span>{pdfCount} PDF</span>
                            </button>
                            {item.dokumenPdfList && item.dokumenPdfList[0] && (
                              <button
                                onClick={() => downloadPdfFile(item.dokumenPdfList[0].fileBlobKey, item.dokumenPdfList[0].namaFile)}
                                className="p-1 text-slate-400 hover:text-amber-400 rounded hover:bg-slate-800 transition-colors"
                                title={`Unduh ${item.dokumenPdfList[0].namaFile}`}
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => onOpenPdf(item)}
                            className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-amber-400 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            <span>+ Upload PDF</span>
                          </button>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {getStatusBadge(item.statusBerkas)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* Open PDF Viewer */}
                          <button
                            onClick={() => onOpenPdf(item)}
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
                            title="Pratinjau PDF Akta & Warkah"
                          >
                            <FileCheck className="w-4 h-4" />
                          </button>

                          {/* Print QR Label */}
                          <button
                            onClick={() => onOpenQrLabel(item)}
                            className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded transition-colors"
                            title="Cetak Label QR Map Fisik"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => onEditBerkas(item)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                            title="Ubah Data Akta"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus akta ${item.nomorAkta} dari register?`)) {
                                onDeleteBerkas(item.id);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                            title="Hapus Akta"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <FolderOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="font-medium text-slate-300 text-sm">Tidak ada berkas akta yang sesuai</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Coba ubah kata kunci pencarian atau filter bulan/status register.
                    </p>
                    <button
                      onClick={onAddNew}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Catat Berkas Pertama</span>
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
