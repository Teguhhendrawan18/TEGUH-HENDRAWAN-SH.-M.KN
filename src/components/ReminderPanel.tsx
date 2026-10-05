import React, { useState } from 'react';
import { 
  BellRing, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Layers, 
  Building2, 
  AlertCircle,
  ExternalLink,
  Filter,
  CheckCircle
} from 'lucide-react';
import { ArsipBerkas, ReminderSKMHT, ProgresAJB, TahapAJB } from '../types';
import { LogoINI, LogoIPPAT, NotarisPpatEmblemCombo } from './OfficialLogos';

interface ReminderPanelProps {
  berkasList: ArsipBerkas[];
  onOpenBerkas: (berkas: ArsipBerkas) => void;
  onUpdateBerkas: (berkas: ArsipBerkas) => void;
}

export const ReminderPanel: React.FC<ReminderPanelProps> = ({
  berkasList,
  onOpenBerkas,
  onUpdateBerkas,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'SKMHT' | 'AJB' | 'URGENT'>('ALL');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Helper to compute days difference
  const getDaysDiff = (targetDateStr?: string) => {
    if (!targetDateStr) return null;
    const target = new Date(targetDateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filter SKMHT deeds
  const skmhtList = berkasList.filter(b => 
    b.kategoriAkta === 'SKMHT' || !!b.reminderSKMHT
  ).map(b => {
    // If not explicitly set, fallback to default date 30 days after deed date
    const deedDate = b.tanggalAkta;
    let jatuhTempo = b.reminderSKMHT?.tanggalJatuhTempoAPHT;
    if (!jatuhTempo && deedDate) {
      const d = new Date(deedDate);
      d.setDate(d.getDate() + 30);
      jatuhTempo = d.toISOString().split('T')[0];
    }
    const daysLeft = getDaysDiff(jatuhTempo);
    const status = b.reminderSKMHT?.statusAPHT || 'MENUNGGU_APHT';
    return {
      berkas: b,
      jatuhTempo: jatuhTempo || '',
      daysLeft,
      status,
      bank: b.reminderSKMHT?.namaKrediturBank || 'Bank Kreditur',
      catatan: b.reminderSKMHT?.catatan
    };
  });

  // Filter AJB deeds
  const ajbList = berkasList.filter(b => 
    b.kategoriAkta === 'AJB' || !!b.progresAJB
  ).map(b => {
    const tahap = b.progresAJB?.tahapAktif || 'VALIDASI_PAJAK';
    const status = b.progresAJB?.status || (b.statusBerkas === 'SELESAI_DIARSIPKAN' ? 'SELESAI' : 'DALAM_PROSES');
    const targetDate = b.progresAJB?.tanggalTarget || b.tanggalAkta;
    const daysLeft = getDaysDiff(targetDate);
    return {
      berkas: b,
      tahap,
      status,
      targetDate,
      daysLeft,
      keterangan: b.progresAJB?.keteranganProgres,
      catatanKendala: b.progresAJB?.catatanKendala
    };
  });

  // Summary counts
  const urgentSkmhtCount = skmhtList.filter(s => s.status === 'MENUNGGU_APHT' && s.daysLeft !== null && s.daysLeft <= 7).length;
  const urgentAjbCount = ajbList.filter(a => a.status !== 'SELESAI' && a.daysLeft !== null && a.daysLeft <= 3).length;
  const totalUrgent = urgentSkmhtCount + urgentAjbCount;

  // Quick mark SKMHT as completed (sudah dibuat APHT)
  const handleMarkSkmhtDone = (item: typeof skmhtList[0]) => {
    const updated: ArsipBerkas = {
      ...item.berkas,
      reminderSKMHT: {
        tanggalAktaSKMHT: item.berkas.tanggalAkta,
        tanggalJatuhTempoAPHT: item.jatuhTempo,
        statusAPHT: 'SUDAH_APHT',
        catatan: 'Telah diproses menjadi Akta APHT resmi.'
      },
      updatedAt: new Date().toISOString()
    };
    onUpdateBerkas(updated);
  };

  // Quick advance AJB stage
  const handleAdvanceAjbStage = (item: typeof ajbList[0]) => {
    const stages: TahapAJB[] = ['VALIDASI_PAJAK', 'PENGECEKAN_BPN', 'TANDA_TANGAN', 'PROSES_BALIK_NAMA', 'SELESAI'];
    const curIdx = stages.indexOf(item.tahap);
    const nextStage = curIdx < stages.length - 1 ? stages[curIdx + 1] : 'SELESAI';
    const isDone = nextStage === 'SELESAI';

    const updated: ArsipBerkas = {
      ...item.berkas,
      statusBerkas: isDone ? 'SELESAI_DIARSIPKAN' : item.berkas.statusBerkas,
      progresAJB: {
        tahapAktif: nextStage,
        tanggalTarget: item.targetDate,
        status: isDone ? 'SELESAI' : 'DALAM_PROSES',
        keteranganProgres: `Ditingkatkan ke tahap: ${getTahapLabel(nextStage)} pada ${new Date().toLocaleDateString('id-ID')}`
      },
      updatedAt: new Date().toISOString()
    };
    onUpdateBerkas(updated);
  };

  const getTahapLabel = (tahap: TahapAJB) => {
    switch (tahap) {
      case 'VALIDASI_PAJAK': return '1. Validasi Pajak (BPHTB & PPh)';
      case 'PENGECEKAN_BPN': return '2. Pengecekan Sertipikat BPN';
      case 'TANDA_TANGAN': return '3. Penandatanganan Minuta AJB';
      case 'PROSES_BALIK_NAMA': return '4. Proses Balik Nama di BPN';
      case 'SELESAI': return '5. Selesai (Sertipikat Diserahkan)';
    }
  };

  return (
    <div className="space-y-6 text-slate-100 pb-12">
      {/* Header Banner with PPAT & INI Logos */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-amber-500/30 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <NotarisPpatEmblemCombo size={44} showSubtitle={true} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-bold text-white tracking-wide">
                  PENGINGAT (REMINDER) SKMHT & PROGRES AJB
                </h1>
                {totalUrgent > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white animate-pulse">
                    {totalUrgent} Perlu Perhatian
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Pantau jatuh tempo 30 hari akta SKMHT menuju APHT dan perkembangan setiap tahapan yuridis akta AJB dengan tenggat waktu manual.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-slate-950/80 border border-slate-750 rounded-xl px-3 py-2 text-center">
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">Total SKMHT</span>
              <span className="text-base font-bold text-amber-400 font-mono">{skmhtList.length}</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-750 rounded-xl px-3 py-2 text-center">
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">Total AJB</span>
              <span className="text-base font-bold text-sky-400 font-mono">{ajbList.length}</span>
            </div>
            <div className="bg-slate-950/80 border border-rose-900/60 rounded-xl px-3 py-2 text-center">
              <span className="block text-[10px] text-rose-300 font-semibold uppercase">Mendesak</span>
              <span className="text-base font-bold text-rose-400 font-mono">{totalUrgent}</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-800 text-xs overflow-x-auto">
          <span className="text-slate-400 flex items-center gap-1 shrink-0 font-medium">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>Tampilkan:</span>
          </span>
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1 rounded-lg transition-colors font-medium ${
              filterType === 'ALL' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            Semua Pengingat ({skmhtList.length + ajbList.length})
          </button>
          <button
            onClick={() => setFilterType('SKMHT')}
            className={`px-3 py-1 rounded-lg transition-colors font-medium ${
              filterType === 'SKMHT' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            Masa Berlaku SKMHT ({skmhtList.length})
          </button>
          <button
            onClick={() => setFilterType('AJB')}
            className={`px-3 py-1 rounded-lg transition-colors font-medium ${
              filterType === 'AJB' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            Progres Tahapan AJB ({ajbList.length})
          </button>
          <button
            onClick={() => setFilterType('URGENT')}
            className={`px-3 py-1 rounded-lg transition-colors font-medium ${
              filterType === 'URGENT' ? 'bg-rose-500 text-white font-bold' : 'bg-slate-800 text-rose-300 hover:bg-slate-750'
            }`}
          >
            Mendekati Jatuh Tempo ({totalUrgent})
          </button>
        </div>
      </div>

      {/* Grid of Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: SKMHT Reminders */}
        {(filterType === 'ALL' || filterType === 'SKMHT' || filterType === 'URGENT') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-sm font-bold text-amber-400 flex items-center gap-2 uppercase tracking-wide">
                <Clock className="w-4 h-4" />
                <span>Pengingat Jatuh Tempo SKMHT Menuju APHT</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                {skmhtList.length} Akta Terdaftar
              </span>
            </div>

            {skmhtList.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-slate-400 text-xs">
                Belum ada data akta SKMHT yang tercatat dalam register.
              </div>
            ) : (
              <div className="space-y-3">
                {skmhtList
                  .filter(item => filterType !== 'URGENT' || (item.status === 'MENUNGGU_APHT' && item.daysLeft !== null && item.daysLeft <= 7))
                  .map((item) => {
                    const isDone = item.status === 'SUDAH_APHT';
                    const isExpired = !isDone && item.daysLeft !== null && item.daysLeft < 0;
                    const isUrgent = !isDone && item.daysLeft !== null && item.daysLeft >= 0 && item.daysLeft <= 7;

                    return (
                      <div
                        key={item.berkas.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isDone 
                            ? 'bg-slate-900/60 border-slate-800 opacity-80' 
                            : isExpired
                            ? 'bg-rose-950/20 border-rose-600/70 shadow-md'
                            : isUrgent
                            ? 'bg-amber-950/20 border-amber-500/70 shadow-md'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-white font-mono">
                                {item.berkas.nomorAkta}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-medium">
                                SKMHT
                              </span>
                              <span className="text-[10px] text-slate-400">
                                Akta: {item.berkas.tanggalAkta}
                              </span>
                            </div>
                            <h3 className="text-xs font-semibold text-slate-200 mt-1">
                              {item.berkas.judulAkta}
                            </h3>
                          </div>

                          {/* Status Badge */}
                          {isDone ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Sudah Buat APHT</span>
                            </span>
                          ) : isExpired ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-700 shrink-0 animate-pulse">
                              <AlertTriangle className="w-3 h-3 text-rose-400" />
                              <span>LEWAT JATUH TEMPO ({Math.abs(item.daysLeft || 0)} Hari)</span>
                            </span>
                          ) : isUrgent ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700 shrink-0">
                              <AlertCircle className="w-3 h-3 text-amber-400" />
                              <span>SISA {item.daysLeft} HARI</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                              Sisa {item.daysLeft} hari
                            </span>
                          )}
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 mb-3">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Tenggat Waktu APHT:</span>
                            <span className="font-semibold text-amber-300 font-mono">
                              {item.jatuhTempo || '-'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Pihak Penghadap:</span>
                            <span className="text-slate-200 truncate block">
                              {item.berkas.paraPihak.map(p => p.nama).filter(Boolean).join(' & ') || '-'}
                            </span>
                          </div>
                          {item.berkas.nomorSertipikat && (
                            <div className="col-span-2 pt-1 border-t border-slate-800/60">
                              <span className="text-slate-400 text-[10px]">Sertipikat Jaminan: </span>
                              <span className="font-mono text-slate-300">{item.berkas.nomorSertipikat}</span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => onOpenBerkas(item.berkas)}
                            className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white font-medium hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Buka Detail Berkas</span>
                          </button>

                          {!isDone && (
                            <button
                              type="button"
                              onClick={() => handleMarkSkmhtDone(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-colors"
                              title="Tandai bahwa APHT sudah resmi dibuat"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Tandai APHT Dibuat</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* Column 2: AJB Progress Tracking */}
        {(filterType === 'ALL' || filterType === 'AJB' || filterType === 'URGENT') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-sm font-bold text-sky-400 flex items-center gap-2 uppercase tracking-wide">
                <Layers className="w-4 h-4" />
                <span>Pelacakan Progres Tahapan AJB</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                {ajbList.length} Akta AJB
              </span>
            </div>

            {ajbList.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-slate-400 text-xs">
                Belum ada data akta AJB yang tercatat dalam register.
              </div>
            ) : (
              <div className="space-y-3">
                {ajbList
                  .filter(item => filterType !== 'URGENT' || (item.status !== 'SELESAI' && item.daysLeft !== null && item.daysLeft <= 3))
                  .map((item) => {
                    const isDone = item.status === 'SELESAI';
                    const isOverdue = !isDone && item.daysLeft !== null && item.daysLeft < 0;

                    return (
                      <div
                        key={item.berkas.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isDone 
                            ? 'bg-slate-900/60 border-slate-800 opacity-80' 
                            : isOverdue
                            ? 'bg-rose-950/20 border-rose-600/70 shadow-md'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-white font-mono">
                                {item.berkas.nomorAkta}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-medium">
                                AJB
                              </span>
                              <span className="text-[10px] text-slate-400">
                                Akta: {item.berkas.tanggalAkta}
                              </span>
                            </div>
                            <h3 className="text-xs font-semibold text-slate-200 mt-1">
                              {item.berkas.judulAkta}
                            </h3>
                          </div>

                          {/* Progress Status Badge */}
                          {isDone ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Selesai Diserahkan</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800 shrink-0">
                              <span>Dalam Proses</span>
                            </span>
                          )}
                        </div>

                        {/* Current Stage Indicator */}
                        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 mb-3 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-medium">Tahapan Berjalan:</span>
                            <span className="font-bold text-amber-300">
                              {getTahapLabel(item.tahap)}
                            </span>
                          </div>

                          {/* Visual Stage Progress Bar */}
                          <div className="grid grid-cols-5 gap-1 pt-1">
                            {(['VALIDASI_PAJAK', 'PENGECEKAN_BPN', 'TANDA_TANGAN', 'PROSES_BALIK_NAMA', 'SELESAI'] as TahapAJB[]).map((stg, i) => {
                              const stages: TahapAJB[] = ['VALIDASI_PAJAK', 'PENGECEKAN_BPN', 'TANDA_TANGAN', 'PROSES_BALIK_NAMA', 'SELESAI'];
                              const curIndex = stages.indexOf(item.tahap);
                              const isPassed = i <= curIndex;
                              const isCurrent = i === curIndex;

                              return (
                                <div key={stg} className="flex flex-col items-center">
                                  <div className={`h-1.5 w-full rounded-full ${
                                    isCurrent ? 'bg-amber-400 animate-pulse' : isPassed ? 'bg-emerald-500' : 'bg-slate-800'
                                  }`} />
                                  <span className={`text-[8px] font-mono mt-1 ${isCurrent ? 'text-amber-300 font-bold' : 'text-slate-500'}`}>
                                    T{i+1}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-850">
                            <span className="text-slate-400">Target Tanggal:</span>
                            <span className="font-mono text-slate-200">{item.targetDate || '-'}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => onOpenBerkas(item.berkas)}
                            className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white font-medium hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Buka Formulir / Dokumen</span>
                          </button>

                          {!isDone && (
                            <button
                              type="button"
                              onClick={() => handleAdvanceAjbStage(item)}
                              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg shadow-sm transition-colors"
                              title="Tingkatkan ke tahapan berikutnya"
                            >
                              <span>Lanjut Tahap Berikutnya</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
