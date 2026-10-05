import React, { useState } from 'react';
import { 
  Receipt, 
  Plus, 
  Printer, 
  Trash2, 
  Search, 
  X, 
  CheckCircle2, 
  Calendar, 
  FileText
} from 'lucide-react';
import { TandaTerimaBerkas, ItemTandaTerima, KantorProfile } from '../types';
import { saveTandaTerima, deleteTandaTerima } from '../services/db';
import { KopSuratBersama, NotarisPpatEmblemCombo } from './OfficialLogos';

interface TandaTerimaViewProps {
  tandaTerimaList: TandaTerimaBerkas[];
  kantorProfile?: KantorProfile;
  onTandaTerimaUpdated: () => void;
  openCreateModalDirectly?: boolean;
  onCloseCreateModalDirectly?: () => void;
}

export const TandaTerimaView: React.FC<TandaTerimaViewProps> = ({
  tandaTerimaList,
  kantorProfile,
  onTandaTerimaUpdated,
  openCreateModalDirectly,
  onCloseCreateModalDirectly
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(openCreateModalDirectly || false);
  const [selectedForPrint, setSelectedForPrint] = useState<TandaTerimaBerkas | null>(null);

  // New Tanda Terima Form State
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [namaKlien, setNamaKlien] = useState<string>('');
  const [nomorKontak, setNomorKontak] = useState<string>('');
  const [identitasKlien, setIdentitasKlien] = useState<string>('');
  const [tanggalPenerimaan, setTanggalPenerimaan] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [nomorBerkasTerkait, setNomorBerkasTerkait] = useState<string>('');
  const [namaPenerima, setNamaPenerima] = useState<string>('Rina Anggraini, S.H.');
  const [jabatanPenerima, setJabatanPenerima] = useState<string>('Staf Administrasi & Warkah');
  const [catatan, setCatatan] = useState<string>('');

  const [items, setItems] = useState<ItemTandaTerima[]>([
    {
      id: 'item-1',
      namaDokumen: 'Sertipikat Hak Milik (SHM) Asli',
      nomorDokumen: '',
      asliAtauCopy: 'ASLI',
      jumlah: 1,
      keterangan: 'Kondisi lengkap dan utuh'
    },
    {
      id: 'item-2',
      namaDokumen: 'SPPT PBB Tahun Berjalan',
      nomorDokumen: '',
      asliAtauCopy: 'ASLI',
      jumlah: 1,
      keterangan: 'Beserta STTS bukti lunas'
    }
  ]);

  // Handle when openCreateModalDirectly changes from parent
  React.useEffect(() => {
    if (openCreateModalDirectly) {
      setIsCreateOpen(true);
    }
  }, [openCreateModalDirectly]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        namaDokumen: '',
        nomorDokumen: '',
        asliAtauCopy: 'ASLI',
        jumlah: 1,
        keterangan: ''
      }
    ]);
  };

  const handleUpdateItem = (index: number, field: keyof ItemTandaTerima, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKlien.trim()) {
      alert('Nama klien wajib diisi');
      return;
    }

    const nomorTandaTerima = `TT-TH/${currentYear}/${String(currentMonth).padStart(2, '0')}/${String(tandaTerimaList.length + 1).padStart(3, '0')}`;

    const newTT: TandaTerimaBerkas = {
      id: `tt-${Date.now()}`,
      nomorTandaTerima,
      namaKlien: namaKlien.trim(),
      nomorKontak: nomorKontak.trim(),
      identitasKlien: identitasKlien.trim() || undefined,
      tanggalPenerimaan,
      nomorBerkasTerkait: nomorBerkasTerkait.trim() || undefined,
      daftarDokumen: items.filter(it => it.namaDokumen.trim().length > 0),
      namaPenerima: namaPenerima.trim(),
      jabatanPenerima: jabatanPenerima.trim(),
      statusSerah: 'DITERIMA_KANTOR',
      catatan: catatan.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    await saveTandaTerima(newTT);
    onTandaTerimaUpdated();
    setIsCreateOpen(false);
    if (onCloseCreateModalDirectly) onCloseCreateModalDirectly();

    // Reset form
    setNamaKlien('');
    setNomorKontak('');
    setIdentitasKlien('');
    setCatatan('');
    setSelectedForPrint(newTT);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus data tanda terima ini?')) {
      await deleteTandaTerima(id);
      onTandaTerimaUpdated();
    }
  };

  const filteredList = tandaTerimaList.filter((tt) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      tt.nomorTandaTerima.toLowerCase().includes(q) ||
      tt.namaKlien.toLowerCase().includes(q) ||
      tt.nomorKontak.includes(q) ||
      tt.daftarDokumen.some(d => d.namaDokumen.toLowerCase().includes(q) || (d.nomorDokumen && d.nomorDokumen.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white">
              Tanda Terima Titipan Berkas Klien
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {tandaTerimaList.length} Lembar
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Bukti penyerahan fisik warkah, sertipikat asli, dan dokumen identitas dari para pihak kepada Kantor Notaris & PPAT Teguh Hendrawan.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Buat Tanda Terima Baru</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nomor tanda terima, nama klien, atau nama dokumen titipan..."
            className="w-full bg-slate-950 border border-slate-750 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* List of Tanda Terima Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.length > 0 ? (
          filteredList.map((tt) => (
            <div
              key={tt.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-300">
                      {tt.nomorTandaTerima}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{tt.tanggalPenerimaan}</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Diterima di Kantor</span>
                  </span>
                </div>

                <div className="space-y-1 mb-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Klien / Penyerah</span>
                    <span className="font-semibold text-white text-sm">{tt.namaKlien}</span>
                    {tt.nomorKontak && (
                      <span className="text-slate-400 ml-2 font-mono text-[11px]">{tt.nomorKontak}</span>
                    )}
                  </div>

                  {tt.nomorBerkasTerkait && (
                    <div className="text-[11px] text-slate-400">
                      Terkait Berkas: <span className="font-mono text-amber-300/90">{tt.nomorBerkasTerkait}</span>
                    </div>
                  )}

                  <div className="pt-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                      Daftar Dokumen Diserahkan ({tt.daftarDokumen.length} Dokumen):
                    </span>
                    <ul className="space-y-1 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 text-[11px]">
                      {tt.daftarDokumen.map((doc, idx) => (
                        <li key={idx} className="flex items-start justify-between gap-2 text-slate-300">
                          <span className="truncate">
                            <span className="text-amber-400/90 font-medium mr-1.5">{idx + 1}.</span>
                            {doc.namaDokumen} {doc.nomorDokumen ? `(${doc.nomorDokumen})` : ''}
                          </span>
                          <span className={`shrink-0 font-mono text-[10px] font-bold px-1.5 rounded ${
                            doc.asliAtauCopy === 'ASLI' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {doc.asliAtauCopy} ({doc.jumlah})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  Penerima: <span className="text-slate-300 font-medium">{tt.namaPenerima}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedForPrint(tt)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 font-medium transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Lembar Tanda Terima</span>
                  </button>

                  <button
                    onClick={() => handleDelete(tt.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-12 bg-slate-900 border border-slate-800 rounded-xl text-slate-400">
            <Receipt className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="font-semibold text-slate-300 text-sm">Belum ada tanda terima dokumen</p>
            <p className="text-xs text-slate-500 mt-1">
              Buat lembar tanda terima resmi untuk penyerahan dokumen fisik asli atau fotokopi dari klien.
            </p>
          </div>
        )}
      </div>

      {/* Modal: Buat Tanda Terima Baru */}
      {isCreateOpen && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-750 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-slate-100 my-auto">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Buat Tanda Terima Berkas Baru</h3>
                  <p className="text-xs text-slate-400">Kop Kantor Notaris & PPAT Teguh Hendrawan, S.H., M.Kn.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsCreateOpen(false);
                  if (onCloseCreateModalDirectly) onCloseCreateModalDirectly();
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nama Klien / Pihak Yang Menyerahkan *
                  </label>
                  <input
                    type="text"
                    value={namaKlien}
                    onChange={(e) => setNamaKlien(e.target.value)}
                    placeholder="Contoh: Ir. Hendra Gunawan"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nomor Kontak / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={nomorKontak}
                    onChange={(e) => setNomorKontak(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    NIK / Nomor Identitas Klien
                  </label>
                  <input
                    type="text"
                    value={identitasKlien}
                    onChange={(e) => setIdentitasKlien(e.target.value)}
                    placeholder="16 Digit NIK"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tanggal Penyerahan Dokumen
                  </label>
                  <input
                    type="date"
                    value={tanggalPenerimaan}
                    onChange={(e) => setTanggalPenerimaan(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              {/* Rincian Dokumen */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Rincian Dokumen yang Diterima
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Dokumen</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800 items-center">
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={item.namaDokumen}
                          onChange={(e) => handleUpdateItem(index, 'namaDokumen', e.target.value)}
                          placeholder="Nama Dokumen (mis: Sertipikat SHM No. xx)"
                          className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-400"
                          required
                        />
                      </div>
                      <div className="col-span-3">
                        <select
                          value={item.asliAtauCopy}
                          onChange={(e) => handleUpdateItem(index, 'asliAtauCopy', e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-400"
                        >
                          <option value="ASLI">Dokumen ASLI</option>
                          <option value="COPY">Fotokopi / Salinan</option>
                        </select>
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={item.keterangan || ''}
                          onChange={(e) => handleUpdateItem(index, 'keterangan', e.target.value)}
                          placeholder="Keterangan / Kondisi"
                          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nama Staf Penerima Kantor
                  </label>
                  <input
                    type="text"
                    value={namaPenerima}
                    onChange={(e) => setNamaPenerima(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Jabatan Penerima
                  </label>
                  <input
                    type="text"
                    value={jabatanPenerima}
                    onChange={(e) => setJabatanPenerima(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Catatan Tambahan (Keperluan Akta)
                </label>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Contoh: Dokumen diserahkan untuk pengurusan AJB dan Balik Nama Sertipikat"
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow"
                >
                  Simpan & Siapkan Cetak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cetak Tanda Terima (Formal Kop Surat) */}
      {selectedForPrint && (
        <>
          <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-750 rounded-xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden text-slate-100 my-auto">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Printer className="w-5 h-5 text-amber-400" />
                  <span className="font-semibold text-sm">Pratinjau Lembar Tanda Terima Klien</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Dokumen Sekarang</span>
                  </button>
                  <button
                    onClick={() => setSelectedForPrint(null)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable sheet in white paper styling */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-950 flex justify-center">
                <div className="w-full max-w-2xl bg-white text-slate-900 p-8 shadow-xl text-left border border-slate-300 rounded text-xs select-none">
                  {/* Kop Surat Resmi Bersama dengan Logo Resmi INI & IPPAT */}
                  <KopSuratBersama
                    kantorProfile={kantorProfile}
                    judulDokumen="TANDA TERIMA PENYERAHAN DOKUMEN / WARKAH"
                    nomorDokumen={selectedForPrint.nomorTandaTerima}
                  />

                  {/* Client Info */}
                  <div className="mb-4 text-xs space-y-1 bg-slate-50 p-3 rounded border border-slate-200">
                    <div className="flex">
                      <span className="w-36 font-semibold text-slate-700">Telah diterima dari</span>
                      <span className="font-bold text-slate-900">: {selectedForPrint.namaKlien}</span>
                    </div>
                    {selectedForPrint.identitasKlien && (
                      <div className="flex">
                        <span className="w-36 font-semibold text-slate-700">Nomor Identitas (NIK)</span>
                        <span className="text-slate-800 font-mono">: {selectedForPrint.identitasKlien}</span>
                      </div>
                    )}
                    {selectedForPrint.nomorKontak && (
                      <div className="flex">
                        <span className="w-36 font-semibold text-slate-700">Nomor Telepon/WA</span>
                        <span className="text-slate-800 font-mono">: {selectedForPrint.nomorKontak}</span>
                      </div>
                    )}
                    <div className="flex">
                      <span className="w-36 font-semibold text-slate-700">Tanggal Penerimaan</span>
                      <span className="text-slate-800">
                        : {new Date(selectedForPrint.tanggalPenerimaan).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    {selectedForPrint.catatan && (
                      <div className="flex">
                        <span className="w-36 font-semibold text-slate-700">Keperluan Berkas</span>
                        <span className="text-slate-800">: {selectedForPrint.catatan}</span>
                      </div>
                    )}
                  </div>

                  {/* Table of Documents */}
                  <div className="mb-5">
                    <p className="text-xs font-bold text-slate-800 mb-1.5">
                      Daftar rincian dokumen yang dititipkan:
                    </p>
                    <table className="w-full border-collapse border border-slate-400 text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-800 text-[11px]">
                          <th className="border border-slate-400 p-2 w-10 text-center">No</th>
                          <th className="border border-slate-400 p-2 text-left">Nama Dokumen & Keterangan</th>
                          <th className="border border-slate-400 p-2 w-24 text-center">Bentuk</th>
                          <th className="border border-slate-400 p-2 w-16 text-center">Jumlah</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedForPrint.daftarDokumen.map((doc, i) => (
                          <tr key={i} className="border-b border-slate-300">
                            <td className="border border-slate-400 p-2 text-center font-mono">{i + 1}</td>
                            <td className="border border-slate-400 p-2">
                              <span className="font-semibold text-slate-900 block">{doc.namaDokumen}</span>
                              {doc.keterangan && (
                                <span className="text-[10px] text-slate-600 block mt-0.5">{doc.keterangan}</span>
                              )}
                            </td>
                            <td className="border border-slate-400 p-2 text-center font-bold text-[10px]">
                              {doc.asliAtauCopy}
                            </td>
                            <td className="border border-slate-400 p-2 text-center font-mono">{doc.jumlah} Berkas</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Legal Clause */}
                  <div className="text-[10px] text-slate-600 border border-slate-200 bg-slate-50 p-2.5 rounded mb-6 leading-relaxed">
                    <strong>Catatan & Ketentuan:</strong> Dokumen-dokumen tersebut di atas diterima oleh Kantor Notaris & PPAT Teguh Hendrawan dalam kondisi baik untuk proses penyelesaian akta dan warkah hukum terkait. Tanda terima ini merupakan bukti sah penyerahan dokumen fisik. Harap membawa lembar asli tanda terima ini pada saat pengambilan dokumen hasil proses.
                  </div>

                  {/* Dual Signatures */}
                  <div className="grid grid-cols-2 gap-8 text-center text-xs pt-4">
                    <div>
                      <p className="text-slate-600 mb-1">Yang Menyerahkan (Klien),</p>
                      <div className="h-16"></div>
                      <p className="font-bold underline text-slate-900">{selectedForPrint.namaKlien}</p>
                    </div>

                    <div>
                      <p className="text-slate-600 mb-1">
                        {kantorProfile?.wilayahKerja ? kantorProfile.wilayahKerja.replace(/^Kota\s+Administrasi\s+|^Kabupaten\s+/, '') : 'Jakarta'}, {new Date(selectedForPrint.tanggalPenerimaan).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-slate-600 text-[11px]">Yang Menerima,</p>
                      <div className="h-12"></div>
                      <p className="font-bold underline text-slate-900">{selectedForPrint.namaPenerima}</p>
                      <p className="text-[10px] text-slate-600">{selectedForPrint.jabatanPenerima}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Printable Element for Print Dialog */}
          <div className="hidden print-only">
            <div style={{ maxWidth: '650px', margin: '0 auto', fontFamily: 'serif', padding: '20px', color: '#000' }}>
              <KopSuratBersama
                kantorProfile={kantorProfile}
                judulDokumen="TANDA TERIMA PENYERAHAN DOKUMEN / WARKAH"
                nomorDokumen={selectedForPrint.nomorTandaTerima}
                className="mb-4"
              />

              <div style={{ fontSize: '12px', marginBottom: '14px', lineHeight: '1.6' }}>
                <div><strong>Telah diterima dari:</strong> {selectedForPrint.namaKlien}</div>
                {selectedForPrint.identitasKlien && <div><strong>NIK:</strong> {selectedForPrint.identitasKlien}</div>}
                {selectedForPrint.nomorKontak && <div><strong>Kontak:</strong> {selectedForPrint.nomorKontak}</div>}
                <div><strong>Tanggal:</strong> {selectedForPrint.tanggalPenerimaan}</div>
                {selectedForPrint.catatan && <div><strong>Keperluan:</strong> {selectedForPrint.catatan}</div>}
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginBottom: '16px' }}>
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    <th style={{ border: '1px solid #000', padding: '6px', width: '30px', textAlign: 'center' }}>No</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'left' }}>Nama Dokumen & Keterangan</th>
                    <th style={{ border: '1px solid #000', padding: '6px', width: '80px', textAlign: 'center' }}>Bentuk</th>
                    <th style={{ border: '1px solid #000', padding: '6px', width: '60px', textAlign: 'center' }}>Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedForPrint.daftarDokumen.map((doc, idx) => (
                    <tr key={idx}>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{idx + 1}</td>
                      <td style={{ border: '1px solid #000', padding: '6px' }}>
                        <strong>{doc.namaDokumen}</strong>
                        {doc.keterangan && <div style={{ fontSize: '9px', color: '#555' }}>{doc.keterangan}</div>}
                      </td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>
                        {doc.asliAtauCopy}
                      </td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>
                        {doc.jumlah}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ fontSize: '9px', border: '1px solid #ccc', padding: '8px', marginBottom: '24px', lineHeight: '1.4' }}>
                <strong>Ketentuan:</strong> Dokumen-dokumen di atas diterima untuk keperluan pengurusan berkas akta resmi. Tanda terima ini merupakan bukti sah penyerahan dokumen dan wajib dibawa saat pengambilan hasil.
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', fontSize: '11px', marginTop: '20px' }}>
                <div style={{ width: '200px' }}>
                  <div>Yang Menyerahkan (Klien),</div>
                  <div style={{ height: '60px' }}></div>
                  <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{selectedForPrint.namaKlien}</div>
                </div>

                <div style={{ width: '220px' }}>
                  <div>{kantorProfile?.wilayahKerja ? kantorProfile.wilayahKerja.replace(/^Kota\s+Administrasi\s+|^Kabupaten\s+/, '') : 'Jakarta'}, {selectedForPrint.tanggalPenerimaan}</div>
                  <div>Yang Menerima,</div>
                  <div style={{ height: '50px' }}></div>
                  <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{selectedForPrint.namaPenerima}</div>
                  <div style={{ fontSize: '9px' }}>{selectedForPrint.jabatanPenerima}</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
