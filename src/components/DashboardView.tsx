import React from 'react';
import { 
  FileText, 
  Layers, 
  FolderLock, 
  FileCheck, 
  Receipt, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  QrCode, 
  ArrowRight,
  ShieldCheck,
  BellRing,
  AlertCircle
} from 'lucide-react';
import { ArsipBerkas, LayananType, KantorProfile } from '../types';
import { NotarisPpatEmblemCombo } from './OfficialLogos';

interface DashboardViewProps {
  berkasList: ArsipBerkas[];
  kantorProfile?: KantorProfile;
  onOpenPdf: (berkas: ArsipBerkas) => void;
  onOpenQrLabel: (berkas: ArsipBerkas) => void;
  onOpenNewBerkas: (type?: LayananType) => void;
  onOpenNewTandaTerima: () => void;
  onOpenProfileModal?: () => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  berkasList,
  kantorProfile,
  onOpenPdf,
  onOpenQrLabel,
  onOpenNewBerkas,
  onOpenNewTandaTerima,
  onOpenProfileModal,
  onNavigateTab
}) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Metrics
  const notarisMonthCount = berkasList.filter(
    b => b.jenisLayanan === 'NOTARIS' && b.bulanRegister === currentMonth && b.tahunRegister === currentYear
  ).length;

  const ppatMonthCount = berkasList.filter(
    b => b.jenisLayanan === 'PPAT' && b.bulanRegister === currentMonth && b.tahunRegister === currentYear
  ).length;

  const totalPdfCount = berkasList.reduce(
    (acc, item) => acc + (item.dokumenPdfList?.length || 0), 0
  );

  const inProgressCount = berkasList.filter(
    b => b.statusBerkas !== 'SELESAI_DIARSIPKAN'
  ).length;

  const completedCount = berkasList.filter(
    b => b.statusBerkas === 'SELESAI_DIARSIPKAN'
  ).length;

  // Recent 5 deeds
  const recentDeeds = [...berkasList].slice(0, 5);

  // Reminder deeds
  const skmhtDeeds = berkasList.filter(b => b.kategoriAkta === 'SKMHT' || !!b.reminderSKMHT);
  const ajbDeeds = berkasList.filter(b => b.kategoriAkta === 'AJB' || !!b.progresAJB);
  const activeSkmhtCount = skmhtDeeds.filter(s => s.reminderSKMHT?.statusAPHT !== 'SUDAH_APHT').length;
  const activeAjbCount = ajbDeeds.filter(a => a.progresAJB?.status !== 'SELESAI').length;

  return (
    <div className="space-y-6">
      {/* Office Profile Hero Banner with PPAT & INI Official Logos */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <NotarisPpatEmblemCombo size={48} showSubtitle={false} className="shrink-0 hidden sm:flex" />

            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[11px] font-bold tracking-wider uppercase text-amber-400 font-mono">
                  Sistem Manajemen Arsip & Warkah Digital
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-[11px] text-slate-400">
                  Wilayah Jabatan {kantorProfile?.wilayahKerja || 'Kota Jakarta Selatan'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-serif uppercase">
                KANTOR NOTARIS & PPAT {kantorProfile?.namaNotaris || 'TEGUH HENDRAWAN'}, {kantorProfile?.gelar || 'S.H., M.Kn.'}
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Pengelolaan terintegrasi Buku Daftar Akta Notaris & PPAT, penyimpanan dan pratinjau dokumen PDF warkah/minuta, pencetakan label QR map fisik, dan administrasi tanda terima berkas klien.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onOpenNewBerkas('NOTARIS')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Akta Notaris</span>
            </button>
            <button
              onClick={() => onOpenNewBerkas('PPAT')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 shadow transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Akta PPAT</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Metric 1: Total Arsip */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Arsip Berkas</span>
            <FolderLock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-white tabular-nums">
            {berkasList.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1">
            Akta terdaftar resmi
          </span>
        </div>

        {/* Metric 2: Notaris Bulan Ini */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Akta Notaris Bulan Ini</span>
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-amber-300 tabular-nums">
            {notarisMonthCount}
          </div>
          <span className="text-[11px] text-slate-400 mt-1">
            Bulan {currentMonth}/{currentYear}
          </span>
        </div>

        {/* Metric 3: PPAT Bulan Ini */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Akta PPAT Bulan Ini</span>
            <Layers className="w-4 h-4 text-sky-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-sky-300 tabular-nums">
            {ppatMonthCount}
          </div>
          <span className="text-[11px] text-slate-400 mt-1">
            AJB, APHT, Hibah, dll.
          </span>
        </div>

        {/* Metric 4: Dokumen PDF Tersimpan */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Dokumen PDF Tersimpan</span>
            <FileCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-emerald-300 tabular-nums">
            {totalPdfCount}
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-1">
            Tersimpan di IndexedDB
          </span>
        </div>

        {/* Metric 5: Dalam Proses */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Dalam Proses Berjalan</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-purple-300 tabular-nums">
            {inProgressCount}
          </div>
          <span className="text-[11px] text-slate-400 mt-1">
            BPN / Validasi Pajak
          </span>
        </div>
      </div>

      {/* Reminder Widget Banner (SKMHT & AJB) */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-sky-950/40 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 border border-amber-500/30">
            <BellRing className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                Pengingat Akta: Jatuh Tempo SKMHT & Progres AJB
              </span>
              {(activeSkmhtCount > 0 || activeAjbCount > 0) && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  {activeSkmhtCount + activeAjbCount} Akta Terpantau
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              {activeSkmhtCount > 0 
                ? `${activeSkmhtCount} akta SKMHT aktif menunggu pembuatan APHT.` 
                : 'Semua akta SKMHT telah diproses menjadi APHT.'}{' '}
              {activeAjbCount > 0 
                ? `${activeAjbCount} berkas AJB dalam proses tahapan yuridis.` 
                : 'Seluruh berkas AJB terpantau lancar.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab('reminder')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow transition-colors shrink-0"
        >
          <span>Buka Panel Reminder</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => onNavigateTab('notaris')}
          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Buku Register Notaris</span>
              <span className="text-[11px] text-slate-400">Lihat nomor urut & salinan akta</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
        </button>

        <button
          onClick={() => onNavigateTab('ppat')}
          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-850 transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Buku Register PPAT</span>
              <span className="text-[11px] text-slate-400">AJB, APHT, data tanah & NOP</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
        </button>

        <button
          onClick={onOpenNewTandaTerima}
          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Buat Tanda Terima Klien</span>
              <span className="text-[11px] text-slate-400">Titipan sertipikat & berkas asli</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
        </button>
      </div>

      {/* Recent Deeds & Active Files */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">
              Arsip Akta & Warkah Terbaru
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Berkas minuta akta yang baru saja dicatat dan diarsipkan
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('notaris')}
              className="text-xs font-medium text-amber-400 hover:text-amber-300"
            >
              Lihat Semua Akta →
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-800/80">
          {recentDeeds.length > 0 ? (
            recentDeeds.map((berkas) => {
              const pdfCount = berkas.dokumenPdfList?.length || 0;
              return (
                <div
                  key={berkas.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-850/50 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      berkas.jenisLayanan === 'NOTARIS' ? 'bg-amber-500/10 text-amber-400' : 'bg-sky-500/10 text-sky-400'
                    }`}>
                      {berkas.jenisLayanan === 'NOTARIS' ? <FileText className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-xs">
                          {berkas.nomorAkta}
                        </span>
                        <span className="text-slate-500 text-xs">·</span>
                        <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded ${
                          berkas.jenisLayanan === 'NOTARIS' ? 'bg-amber-950 text-amber-300' : 'bg-sky-950 text-sky-300'
                        }`}>
                          {berkas.jenisLayanan}
                        </span>
                        <span className="text-slate-500 text-xs">·</span>
                        <span className="text-xs text-slate-400">{berkas.tanggalAkta}</span>
                      </div>

                      <h3 className="font-semibold text-slate-100 text-xs truncate max-w-lg mt-0.5">
                        {berkas.judulAkta}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span>Pihak: {berkas.paraPihak.map(p => p.nama).join(', ')}</span>
                        <span className="text-slate-600">|</span>
                        <span className="flex items-center gap-1 text-slate-300">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          {berkas.lokasiFisik.lemari} / {berkas.lokasiFisik.rak} ({berkas.lokasiFisik.nomorBantex})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => onOpenPdf(berkas)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>{pdfCount} PDF</span>
                    </button>

                    <button
                      onClick={() => onOpenQrLabel(berkas)}
                      className="p-1.5 text-slate-400 hover:text-sky-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Cetak Label QR Map Fisik"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 px-4">
              <FolderLock className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-200">
                Belum Ada Arsip Berkas yang Dicatat
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
                Sistem siap digunakan untuk pencatatan riil kantor. Mulai dengan mencatat akta Notaris atau akta PPAT pertama Anda.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => onOpenNewBerkas('NOTARIS')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Catat Akta Notaris Pertama</span>
                </button>
                <button
                  onClick={() => onOpenNewBerkas('PPAT')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 transition-colors shadow"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Catat Akta PPAT Pertama</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
