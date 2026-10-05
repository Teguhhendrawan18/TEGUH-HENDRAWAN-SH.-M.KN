import React from 'react';
import { KantorProfile } from '../types';

/**
 * Logo Resmi Ikatan Notaris Indonesia (INI)
 * Lambang resmi berstandar kenotariatan dengan timbangan keadilan, buku hukum, dan tulisan Ikatan Notaris Indonesia 1908.
 * Mendukung tampilan gelap (dashboard) maupun terang (cetak kop surat putih).
 */
export const LogoINI: React.FC<{ 
  size?: number; 
  className?: string; 
  withLabel?: boolean;
  theme?: 'dark' | 'light';
}> = ({ 
  size = 40, 
  className = '',
  withLabel = false,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 select-none"
      >
        <defs>
          <radialGradient id="iniGoldGrad" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFE082" />
            <stop offset="60%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#996515" />
          </radialGradient>
          <radialGradient id="iniGreenGrad" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#1B4D3E" />
            <stop offset="70%" stopColor="#0F3025" />
            <stop offset="100%" stopColor="#081A14" />
          </radialGradient>
        </defs>

        {/* Outer Ring Gold */}
        <circle cx="50" cy="50" r="48" fill="url(#iniGoldGrad)" stroke="#5A3A05" strokeWidth="1" />
        <circle cx="50" cy="50" r="44" fill={isLight ? '#133E30' : 'url(#iniGreenGrad)'} stroke="#FFE082" strokeWidth="1.2" />

        {/* Inner Ring with Dots */}
        <circle cx="50" cy="50" r="33" fill={isLight ? '#0B2920' : '#0C261E'} stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="1.5 2" />

        {/* Scales of Justice (Timbangan Keadilan) */}
        {/* Center Beam */}
        <path d="M50 20 L50 64" stroke="#FFE082" strokeWidth="3" strokeLinecap="round" />
        {/* Top Finial */}
        <circle cx="50" cy="18" r="3.5" fill="url(#iniGoldGrad)" stroke="#5A3A05" strokeWidth="0.8" />
        {/* Crossbar */}
        <path d="M30 28 Q50 25 70 28" stroke="#FFE082" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Left Pan Strings */}
        <path d="M30 28 L23 44 M30 28 L37 44" stroke="#FFF2A1" strokeWidth="0.9" />
        {/* Left Pan */}
        <path d="M21 44 Q30 50 39 44 Z" fill="url(#iniGoldGrad)" stroke="#5A3A05" strokeWidth="0.6" />
        {/* Right Pan Strings */}
        <path d="M70 28 L63 44 M70 28 L77 44" stroke="#FFF2A1" strokeWidth="0.9" />
        {/* Right Pan */}
        <path d="M61 44 Q70 50 79 44 Z" fill="url(#iniGoldGrad)" stroke="#5A3A05" strokeWidth="0.6" />

        {/* Open Law Book (Buku Hukum) */}
        <path d="M34 66 Q50 63 50 67 Q50 63 66 66 L64 74 Q50 71 50 74 Q50 71 36 74 Z" fill="#FFFFFF" stroke="#64748B" strokeWidth="0.6" />
        <path d="M32 68 Q50 65 50 69 Q50 65 68 68 L66 76 Q50 73 50 76 Q50 73 34 76 Z" fill="url(#iniGoldGrad)" stroke="#5A3A05" strokeWidth="0.8" />

        {/* Text Around Rings */}
        <text x="50" y="12" fill="#FFF2A1" fontSize="5.2" fontWeight="bold" textAnchor="middle" letterSpacing="0.8">
          IKATAN NOTARIS INDONESIA
        </text>
        <text x="50" y="89" fill="#FFF2A1" fontSize="5.5" fontWeight="bold" textAnchor="middle" letterSpacing="1.2">
          INI · 1908
        </text>
      </svg>

      {withLabel && (
        <div className="flex flex-col text-left">
          <span className={`text-[11px] font-bold uppercase tracking-wider leading-none ${isLight ? 'text-emerald-900' : 'text-amber-300'}`}>
            I.N.I.
          </span>
          <span className={`text-[9px] font-medium leading-tight ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            Ikatan Notaris Indonesia
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Logo Resmi Ikatan Pejabat Pembuat Akta Tanah (IPPAT)
 * Lambang profesi PPAT dengan bola dunia pertanahan, padi & kapas, serta nuansa hijau emas.
 * Mendukung tampilan gelap (dashboard) maupun terang (cetak kop surat putih).
 */
export const LogoIPPAT: React.FC<{ 
  size?: number; 
  className?: string; 
  withLabel?: boolean;
  theme?: 'dark' | 'light';
}> = ({ 
  size = 40, 
  className = '',
  withLabel = false,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 select-none"
      >
        <defs>
          <radialGradient id="ippatGold" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFE082" />
            <stop offset="60%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8A5A0A" />
          </radialGradient>
          <radialGradient id="ippatGreen" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#2E6F40" />
            <stop offset="70%" stopColor="#184A25" />
            <stop offset="100%" stopColor="#0B2613" />
          </radialGradient>
        </defs>

        {/* Outer Ring Gold */}
        <circle cx="50" cy="50" r="48" fill="url(#ippatGold)" stroke="#5A3A05" strokeWidth="1" />
        <circle cx="50" cy="50" r="44" fill={isLight ? '#1B5E20' : 'url(#ippatGreen)'} stroke="#FFE082" strokeWidth="1.2" />

        {/* Inner Shield / Circle */}
        <circle cx="50" cy="50" r="32" fill={isLight ? '#0D3814' : '#0E3319'} stroke="#D4AF37" strokeWidth="1.4" />

        {/* Globe Grid lines (Simbol Yuridis Pertanahan Nasional) */}
        <circle cx="50" cy="50" r="23" stroke="#D4AF37" strokeWidth="1" fill={isLight ? '#144622' : '#144622'} />
        <ellipse cx="50" cy="50" rx="14" ry="23" stroke="#FFE082" strokeWidth="0.8" fill="none" opacity="0.85" />
        <line x1="27" y1="50" x2="73" y2="50" stroke="#FFE082" strokeWidth="1" />
        <line x1="50" y1="27" x2="50" y2="73" stroke="#FFE082" strokeWidth="1" />
        <path d="M31 38 Q50 44 69 38" stroke="#FFE082" strokeWidth="0.7" fill="none" opacity="0.8" />
        <path d="M31 62 Q50 56 69 62" stroke="#FFE082" strokeWidth="0.7" fill="none" opacity="0.8" />

        {/* Padi & Kapas Wreath */}
        <path d="M22 66 C18 52 20 38 27 28" stroke="#FFE082" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3" fill="none" />
        <path d="M78 66 C82 52 80 38 73 28" stroke="#FFE082" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3" fill="none" />

        {/* Ribbon at base */}
        <path d="M28 72 Q50 78 72 72 L70 79 Q50 84 30 79 Z" fill="url(#ippatGold)" stroke="#5A3A05" strokeWidth="0.8" />

        {/* Text */}
        <text x="50" y="12" fill="#FFF2A1" fontSize="4.8" fontWeight="bold" textAnchor="middle" letterSpacing="0.6">
          PEJABAT PEMBUAT AKTA TANAH
        </text>
        <text x="50" y="88" fill="#FFF2A1" fontSize="5.5" fontWeight="bold" textAnchor="middle" letterSpacing="1.2">
          IPPAT · 1987
        </text>
      </svg>

      {withLabel && (
        <div className="flex flex-col text-left">
          <span className={`text-[11px] font-bold uppercase tracking-wider leading-none ${isLight ? 'text-emerald-900' : 'text-emerald-400'}`}>
            I.P.P.A.T.
          </span>
          <span className={`text-[9px] font-medium leading-tight ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            Ikatan Pejabat Pembuat Akta Tanah
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Kombinasi Lambang Resmi PPAT & INI untuk Header dan Dashboard
 */
export const NotarisPpatEmblemCombo: React.FC<{ 
  size?: number; 
  className?: string;
  showSubtitle?: boolean;
}> = ({ 
  size = 38, 
  className = '',
  showSubtitle = true
}) => {
  return (
    <div className={`flex items-center gap-2.5 bg-slate-900/90 border border-amber-500/30 p-1.5 px-3 rounded-xl shadow-inner ${className}`}>
      {/* Logo INI */}
      <div className="flex items-center gap-1.5" title="Ikatan Notaris Indonesia (INI)">
        <LogoINI size={size} />
      </div>

      {/* Vertical Divider */}
      <div className="h-7 w-[1px] bg-gradient-to-b from-transparent via-amber-500/50 to-transparent" />

      {/* Logo IPPAT */}
      <div className="flex items-center gap-1.5" title="Ikatan Pejabat Pembuat Akta Tanah (IPPAT)">
        <LogoIPPAT size={size} />
      </div>

      {showSubtitle && (
        <div className="hidden sm:flex flex-col pl-1 border-l border-slate-800">
          <span className="text-[11px] font-bold text-amber-300 tracking-wide uppercase leading-tight">
            INI · IPPAT
          </span>
          <span className="text-[9px] text-slate-400 font-medium leading-none">
            Organisasi Profesi Resmi
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Kop Surat Resmi Notaris untuk Laporan Bulanan ke MPD & Kemenkumham
 * Dilengkapi Logo Resmi INI di sisi kiri atas.
 */
export const KopSuratNotaris: React.FC<{
  kantorProfile?: KantorProfile;
  subJudul?: string;
  nomorSurat?: string;
  className?: string;
}> = ({
  kantorProfile,
  subJudul = 'LAPORAN BULANAN BUKU DAFTAR AKTA NOTARIS',
  nomorSurat,
  className = ''
}) => {
  return (
    <div className={`w-full text-slate-900 bg-white p-4 pb-3 border-b-2 border-black print:p-0 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        {/* Sisi Kiri: Logo Resmi INI */}
        <div className="shrink-0 flex flex-col items-center">
          <LogoINI size={72} theme="light" />
          <span className="text-[8px] font-bold text-slate-700 tracking-wider mt-0.5">I.N.I.</span>
        </div>

        {/* Bagian Tengah: Teks Kop Surat Notaris */}
        <div className="flex-1 text-center space-y-0.5">
          <p className="text-xs font-bold tracking-widest text-slate-700 uppercase">
            NOTARIS
          </p>
          <h2 className="text-lg font-serif font-bold text-black uppercase tracking-wide">
            {kantorProfile?.namaNotaris || 'TEGUH HENDRAWAN'}, {kantorProfile?.gelar || 'S.H., M.Kn.'}
          </h2>
          <p className="text-[10px] text-slate-700 font-medium">
            {kantorProfile?.skNotaris || 'Surat Keputusan Menteri Hukum dan Hak Asasi Manusia RI'}
          </p>
          <p className="text-[10px] text-slate-700">
            {kantorProfile?.alamatKantor || 'Jl. RS. Fatmawati Raya No. 45, Cilandak Barat, Jakarta Selatan 12430'}
          </p>
          <p className="text-[9px] text-slate-600 font-mono">
            Telp: {kantorProfile?.telepon || '(021) 7590-1234'} · Email: {kantorProfile?.email || 'teguhhendrawan03@gmail.com'}
          </p>
        </div>

        {/* Sisi Kanan: Spacer seimbang */}
        <div className="shrink-0 w-16 invisible sm:visible flex flex-col items-center">
          <div className="w-16 h-16" />
        </div>
      </div>

      {/* Garis Ganda Pembatas Kop Surat Resmi Notaris */}
      <div className="mt-3 border-t-2 border-black pt-[2px] border-b border-black" />

      {/* Judul Laporan */}
      {subJudul && (
        <div className="text-center mt-3 mb-1">
          <h3 className="text-sm font-bold text-black underline tracking-wide uppercase font-serif">
            {subJudul}
          </h3>
          {nomorSurat && (
            <p className="text-[11px] text-slate-700 font-mono mt-0.5">
              Nomor: {nomorSurat}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Kop Surat Resmi PPAT untuk Laporan Bulanan ke Kantah BPN & Bapenda
 * Dilengkapi Logo Resmi IPPAT di sisi kiri atas.
 */
export const KopSuratPPAT: React.FC<{
  kantorProfile?: KantorProfile;
  subJudul?: string;
  nomorSurat?: string;
  className?: string;
}> = ({
  kantorProfile,
  subJudul = 'LAPORAN BULANAN AKTA PEJABAT PEMBUAT AKTA TANAH (PPAT)',
  nomorSurat,
  className = ''
}) => {
  return (
    <div className={`w-full text-slate-900 bg-white p-4 pb-3 border-b-2 border-black print:p-0 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        {/* Sisi Kiri: Logo Resmi IPPAT */}
        <div className="shrink-0 flex flex-col items-center">
          <LogoIPPAT size={72} theme="light" />
          <span className="text-[8px] font-bold text-slate-700 tracking-wider mt-0.5">I.P.P.A.T.</span>
        </div>

        {/* Bagian Tengah: Teks Kop Surat PPAT */}
        <div className="flex-1 text-center space-y-0.5">
          <p className="text-xs font-bold tracking-widest text-slate-700 uppercase">
            PEJABAT PEMBUAT AKTA TANAH (PPAT)
          </p>
          <h2 className="text-lg font-serif font-bold text-black uppercase tracking-wide">
            {kantorProfile?.namaNotaris || 'TEGUH HENDRAWAN'}, {kantorProfile?.gelar || 'S.H., M.Kn.'}
          </h2>
          <p className="text-[10px] text-slate-700 font-medium">
            Daerah Kerja: {kantorProfile?.wilayahKerja || 'Kota Administrasi Jakarta Selatan'}
          </p>
          <p className="text-[10px] text-slate-700">
            {kantorProfile?.skPpat || 'Surat Keputusan Kepala Badan Pertanahan Nasional RI'}
          </p>
          <p className="text-[10px] text-slate-700">
            {kantorProfile?.alamatKantor || 'Jl. RS. Fatmawati Raya No. 45, Cilandak Barat, Jakarta Selatan 12430'}
          </p>
          <p className="text-[9px] text-slate-600 font-mono">
            Telp: {kantorProfile?.telepon || '(021) 7590-1234'} · Email: {kantorProfile?.email || 'teguhhendrawan03@gmail.com'}
          </p>
        </div>

        {/* Sisi Kanan: Spacer seimbang */}
        <div className="shrink-0 w-16 invisible sm:visible flex flex-col items-center">
          <div className="w-16 h-16" />
        </div>
      </div>

      {/* Garis Ganda Pembatas Kop Surat Resmi PPAT */}
      <div className="mt-3 border-t-2 border-black pt-[2px] border-b border-black" />

      {/* Judul Laporan */}
      {subJudul && (
        <div className="text-center mt-3 mb-1">
          <h3 className="text-sm font-bold text-black underline tracking-wide uppercase font-serif">
            {subJudul}
          </h3>
          {nomorSurat && (
            <p className="text-[11px] text-slate-700 font-mono mt-0.5">
              Nomor: {nomorSurat}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Kop Surat Bersama Resmi Notaris & PPAT
 * Menggunakan Logo INI di sisi kiri dan Logo IPPAT di sisi kanan.
 * Digunakan untuk Tanda Terima Berkas Klien & Berita Acara Kantor.
 */
export const KopSuratBersama: React.FC<{
  kantorProfile?: KantorProfile;
  judulDokumen?: string;
  nomorDokumen?: string;
  className?: string;
}> = ({
  kantorProfile,
  judulDokumen = 'TANDA TERIMA PENERIMAAN BERKAS / WARKAH',
  nomorDokumen,
  className = ''
}) => {
  return (
    <div className={`w-full text-slate-900 bg-white p-4 pb-3 border-b-2 border-black print:p-0 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        {/* Sisi Kiri: Logo Resmi INI */}
        <div className="shrink-0 flex flex-col items-center">
          <LogoINI size={64} theme="light" />
          <span className="text-[8px] font-bold text-slate-700 tracking-wider mt-0.5">I.N.I.</span>
        </div>

        {/* Bagian Tengah: Identitas Kantor Notaris & PPAT */}
        <div className="flex-1 text-center space-y-0.5">
          <p className="text-[11px] font-bold tracking-widest text-slate-700 uppercase">
            KANTOR NOTARIS & PEJABAT PEMBUAT AKTA TANAH (PPAT)
          </p>
          <h2 className="text-base sm:text-lg font-serif font-bold text-black uppercase tracking-wide">
            {kantorProfile?.namaNotaris || 'TEGUH HENDRAWAN'}, {kantorProfile?.gelar || 'S.H., M.Kn.'}
          </h2>
          <p className="text-[10px] text-slate-700 font-medium">
            Wilayah Jabatan & Daerah Kerja: {kantorProfile?.wilayahKerja || 'Kota Administrasi Jakarta Selatan'}
          </p>
          <p className="text-[9px] text-slate-600">
            {kantorProfile?.alamatKantor || 'Jl. RS. Fatmawati Raya No. 45, Cilandak Barat, Jakarta Selatan'}
          </p>
          <p className="text-[9px] text-slate-600 font-mono">
            Telp: {kantorProfile?.telepon || '(021) 7590-1234'} · Email: {kantorProfile?.email || 'teguhhendrawan03@gmail.com'}
          </p>
        </div>

        {/* Sisi Kanan: Logo Resmi IPPAT */}
        <div className="shrink-0 flex flex-col items-center">
          <LogoIPPAT size={64} theme="light" />
          <span className="text-[8px] font-bold text-slate-700 tracking-wider mt-0.5">I.P.P.A.T.</span>
        </div>
      </div>

      {/* Garis Ganda Kop Surat Resmi */}
      <div className="mt-3 border-t-2 border-black pt-[2px] border-b border-black" />

      {/* Judul Dokumen */}
      {judulDokumen && (
        <div className="text-center mt-3 mb-1">
          <h3 className="text-sm font-bold text-black underline tracking-wide uppercase font-serif">
            {judulDokumen}
          </h3>
          {nomorDokumen && (
            <p className="text-[11px] text-slate-700 font-mono mt-0.5">
              Nomor: {nomorDokumen}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
