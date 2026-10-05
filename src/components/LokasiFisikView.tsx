import React, { useState } from 'react';
import { 
  FolderLock, 
  MapPin, 
  Search, 
  FileText, 
  QrCode, 
  CheckCircle2, 
  ArrowRight,
  Archive
} from 'lucide-react';
import { ArsipBerkas } from '../types';

interface LokasiFisikViewProps {
  berkasList: ArsipBerkas[];
  onOpenPdf: (berkas: ArsipBerkas) => void;
  onOpenQrLabel: (berkas: ArsipBerkas) => void;
  onEditBerkas: (berkas: ArsipBerkas) => void;
}

export const LokasiFisikView: React.FC<LokasiFisikViewProps> = ({
  berkasList,
  onOpenPdf,
  onOpenQrLabel,
  onEditBerkas
}) => {
  const [selectedLemari, setSelectedLemari] = useState<string>('ALL');
  const [selectedRak, setSelectedRak] = useState<string>('ALL');
  const [searchBantex, setSearchBantex] = useState<string>('');

  const cabinets = [
    { id: 'Lemari A', nama: 'Lemari A - Minuta Notaris', desc: 'Akta Pendirian PT/CV, Perjanjian Sewa, Kuasa', color: 'border-amber-500/40 text-amber-400 bg-amber-500/5' },
    { id: 'Lemari B', nama: 'Lemari B - PPAT AJB & Hibah', desc: 'Akta Jual Beli Tanah, Akta Hibah, Tukar Menukar', color: 'border-sky-500/40 text-sky-400 bg-sky-500/5' },
    { id: 'Lemari C', nama: 'Lemari C - PPAT APHT & SKMHT', desc: 'Hak Tanggungan Perbankan, SKMHT, Roya', color: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/5' },
    { id: 'Lemari D', nama: 'Lemari D - Warkah Fisik Asli', desc: 'Dokumen Warkah Klien, Fotokopi Legalisir, PBB', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/5' },
    { id: 'Lemari E', nama: 'Lemari E - Arsip Khusus & Wasiat', desc: 'Akta Wasiat Tertutup, Perubahan AD Terbatas', color: 'border-purple-500/40 text-purple-400 bg-purple-500/5' }
  ];

  const filteredBerkas = berkasList.filter((b) => {
    if (selectedLemari !== 'ALL' && b.lokasiFisik.lemari !== selectedLemari) return false;
    if (selectedRak !== 'ALL' && b.lokasiFisik.rak !== selectedRak) return false;
    if (searchBantex.trim()) {
      const q = searchBantex.toLowerCase();
      const matchBantex = b.lokasiFisik.nomorBantex.toLowerCase().includes(q);
      const matchBoks = b.lokasiFisik.kodeBoks?.toLowerCase().includes(q);
      const matchNoAkta = b.nomorAkta.toLowerCase().includes(q);
      const matchJudul = b.judulAkta.toLowerCase().includes(q);
      return matchBantex || matchBoks || matchNoAkta || matchJudul;
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">
                Tata Letak & Inventaris Rak Arsip Fisik
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {berkasList.length} Berkas Fisik
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Pelacakan presisi lokasi map warkah, nomor Bantex, dan kode boks arsip di ruang penyimpanan kantor Notaris & PPAT Teguh Hendrawan.
            </p>
          </div>
        </div>
      </div>

      {/* Cabinets Visual Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {cabinets.map((cab) => {
          const count = berkasList.filter(b => b.lokasiFisik.lemari === cab.id).length;
          const isSelected = selectedLemari === cab.id;
          return (
            <button
              key={cab.id}
              onClick={() => setSelectedLemari(isSelected ? 'ALL' : cab.id)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-800 border-amber-400 shadow-md ring-1 ring-amber-400'
                  : 'bg-slate-900 hover:bg-slate-850 ' + cab.color
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Archive className="w-5 h-5 opacity-90" />
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-950/80 text-white">
                  {count} Berkas
                </span>
              </div>
              <h3 className="font-bold text-xs text-white leading-tight mb-1">{cab.id}</h3>
              <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                {cab.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchBantex}
            onChange={(e) => setSearchBantex(e.target.value)}
            placeholder="Cari nomor Bantex, kode boks, atau nomor akta..."
            className="w-full bg-slate-950 border border-slate-750 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedLemari}
            onChange={(e) => setSelectedLemari(e.target.value)}
            className="bg-slate-950 border border-slate-750 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">Semua Lemari</option>
            <option value="Lemari A">Lemari A (Notaris)</option>
            <option value="Lemari B">Lemari B (PPAT AJB)</option>
            <option value="Lemari C">Lemari C (PPAT APHT)</option>
            <option value="Lemari D">Lemari D (Warkah)</option>
            <option value="Lemari E">Lemari E (Khusus)</option>
          </select>

          <select
            value={selectedRak}
            onChange={(e) => setSelectedRak(e.target.value)}
            className="bg-slate-950 border border-slate-750 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">Semua Rak</option>
            {[...Array(6)].map((_, i) => (
              <option key={i + 1} value={`Rak 0${i + 1}`}>
                Rak 0{i + 1}
              </option>
            ))}
          </select>

          {(selectedLemari !== 'ALL' || selectedRak !== 'ALL' || searchBantex) && (
            <button
              onClick={() => {
                setSelectedLemari('ALL');
                setSelectedRak('ALL');
                setSearchBantex('');
              }}
              className="text-amber-400 hover:text-amber-300 font-medium text-xs px-2 py-1"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Grid of Shelved Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredBerkas.length > 0 ? (
          filteredBerkas.map((berkas) => (
            <div
              key={berkas.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-colors flex flex-col justify-between"
            >
              <div>
                {/* Location Tag */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{berkas.lokasiFisik.lemari}</span>
                    <span className="text-slate-600">/</span>
                    <span>{berkas.lokasiFisik.rak}</span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {berkas.lokasiFisik.nomorBantex}
                  </span>
                </div>

                {/* Deed info */}
                <div className="space-y-1 text-xs">
                  <div className="font-mono font-bold text-white text-sm">
                    {berkas.nomorAkta}
                  </div>
                  <p className="font-semibold text-slate-200 line-clamp-1">
                    {berkas.judulAkta}
                  </p>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    Pihak: {berkas.paraPihak.map(p => p.nama).join(', ')}
                  </p>
                  {berkas.lokasiFisik.catatanLokasi && (
                    <p className="text-[10px] text-slate-500 italic mt-1">
                      Catatan: {berkas.lokasiFisik.catatanLokasi}
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => onOpenPdf(berkas)}
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{berkas.dokumenPdfList?.length || 0} PDF Tersimpan</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenQrLabel(berkas)}
                    className="p-1.5 text-slate-400 hover:text-sky-400 rounded hover:bg-slate-800 transition-colors"
                    title="Cetak Label QR Map"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onEditBerkas(berkas)}
                    className="text-slate-400 hover:text-white text-[11px] font-medium px-2 py-1 rounded hover:bg-slate-800"
                  >
                    Pindahkan / Edit
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12 bg-slate-900 border border-slate-800 rounded-xl text-slate-400">
            <FolderLock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="font-medium text-slate-300 text-sm">Tidak ada berkas di lokasi ini</p>
            <p className="text-xs text-slate-500 mt-1">
              Gunakan filter atau tombol reset untuk menampilkan seluruh rak arsip.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
