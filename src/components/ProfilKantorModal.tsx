import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  FileText,
  MapPin,
  Phone,
  Mail,
  Shield
} from 'lucide-react';
import { KantorProfile } from '../types';
import { DEFAULT_KANTOR_PROFILE, saveKantorProfile } from '../services/db';

interface ProfilKantorModalProps {
  currentProfile: KantorProfile;
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: (updated: KantorProfile) => void;
}

export const ProfilKantorModal: React.FC<ProfilKantorModalProps> = ({
  currentProfile,
  isOpen,
  onClose,
  onProfileUpdated
}) => {
  const [formData, setFormData] = useState<KantorProfile>(currentProfile);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof KantorProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    if (window.confirm('Kembalikan data profil ke identitas standar Teguh Hendrawan, S.H., M.Kn.?')) {
      setFormData(DEFAULT_KANTOR_PROFILE);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaNotaris.trim()) {
      alert('Nama Notaris wajib diisi');
      return;
    }

    await saveKantorProfile(formData);
    onProfileUpdated(formData);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-750 rounded-xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden text-slate-100 my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                Pengaturan Profil Kantor Notaris & PPAT
              </h2>
              <p className="text-xs text-slate-400">
                Data resmi kantor untuk kop surat, tanda terima, label QR map, dan laporan bulanan
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

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Live Kop Surat Preview Strip */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400 block mb-2 font-mono">
              Pratinjau Langsung Kop Surat & Dokumen Resmi:
            </span>
            <div className="bg-white text-slate-900 p-4 rounded-lg border border-slate-300 text-center select-none text-xs">
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800">
                KANTOR NOTARIS & PEJABAT PEMBUAT AKTA TANAH (PPAT)
              </h3>
              <h2 className="text-base font-extrabold uppercase tracking-tight text-slate-950 font-serif mt-0.5">
                {formData.namaNotaris || 'NAMA NOTARIS'}, {formData.gelar || ''}
              </h2>
              <p className="text-[9px] text-slate-600 mt-0.5">
                {formData.skNotaris || 'SK Menteri Hukum & HAM RI'} · {formData.skPpat || 'SK Kepala BPN RI'}
              </p>
              <p className="text-[9px] text-slate-600 mt-0.5">
                Wilayah Jabatan: <strong>{formData.wilayahKerja || 'Wilayah Kerja'}</strong>
              </p>
              <p className="text-[9px] text-slate-500 mt-0.5">
                {formData.alamatKantor || 'Alamat Kantor'} · Telp: {formData.telepon || '-'} {formData.whatsapp ? `· WA: ${formData.whatsapp}` : ''} · Email: {formData.email || '-'}
              </p>
            </div>
          </div>

          {/* Section 1: Identitas Pejabat */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Identitas Notaris & PPAT</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nama Lengkap Notaris & PPAT *
                </label>
                <input
                  type="text"
                  value={formData.namaNotaris}
                  onChange={(e) => handleChange('namaNotaris', e.target.value)}
                  placeholder="Contoh: Teguh Hendrawan"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Gelar Akademik *
                </label>
                <input
                  type="text"
                  value={formData.gelar}
                  onChange={(e) => handleChange('gelar', e.target.value)}
                  placeholder="S.H., M.Kn."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Wilayah Kerja / Tempat Kedudukan *
              </label>
              <input
                type="text"
                value={formData.wilayahKerja}
                onChange={(e) => handleChange('wilayahKerja', e.target.value)}
                placeholder="Contoh: Kota Administrasi Jakarta Selatan"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>
          </div>

          {/* Section 2: Surat Keputusan (SK) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Nomor Legalitas & SK Pengangkatan</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  SK Menteri Hukum & HAM RI (SK Notaris) *
                </label>
                <input
                  type="text"
                  value={formData.skNotaris}
                  onChange={(e) => handleChange('skNotaris', e.target.value)}
                  placeholder="Contoh: SK Menteri Hukum & HAM RI No. AHU-00192.AH.02.01.Tahun 2018"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  SK Kepala Badan Pertanahan Nasional RI (SK PPAT) *
                </label>
                <input
                  type="text"
                  value={formData.skPpat}
                  onChange={(e) => handleChange('skPpat', e.target.value)}
                  placeholder="Contoh: SK Kepala Badan Pertanahan Nasional RI No. 418/KEP-17.3/IX/2019"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Kontak & Lokasi Kantor */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Lokasi & Kontak Resmi Kantor</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Alamat Kantor Lengkap *
              </label>
              <textarea
                value={formData.alamatKantor}
                onChange={(e) => handleChange('alamatKantor', e.target.value)}
                placeholder="Jl. Fatmawati Raya No. 45, Kebayoran Baru, Jakarta Selatan 12150"
                rows={2}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Telepon Kantor
                </label>
                <input
                  type="text"
                  value={formData.telepon}
                  onChange={(e) => handleChange('telepon', e.target.value)}
                  placeholder="(021) 7201928"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.whatsapp || ''}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  placeholder="0812-8899-7766"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Kantor
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="teguhhendrawan.notaris@gmail.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset ke Standar</span>
            </button>

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
                disabled={isSaved}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg text-slate-950 bg-amber-400 hover:bg-amber-300 shadow transition-colors disabled:opacity-75"
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                    <span>Tersimpan!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan Profil</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
