import React, { useState, useEffect } from 'react';
import { X, Printer, QrCode as QrIcon, CheckCircle2 } from 'lucide-react';
import { ArsipBerkas, KantorProfile } from '../types';
import { generateDeedQrCodeDataUrl } from '../utils/qrCode';
import { LogoINI, LogoIPPAT } from './OfficialLogos';

interface QrLabelModalProps {
  berkas: ArsipBerkas | null;
  kantorProfile?: KantorProfile;
  onClose: () => void;
}

export const QrLabelModal: React.FC<QrLabelModalProps> = ({ berkas, kantorProfile, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const namaLengkapNotaris = kantorProfile 
    ? `${kantorProfile.namaNotaris}, ${kantorProfile.gelar}`
    : 'TEGUH HENDRAWAN, S.H., M.Kn.';

  useEffect(() => {
    if (!berkas) {
      setQrDataUrl('');
      return;
    }

    let isCancelled = false;
    generateDeedQrCodeDataUrl(berkas, kantorProfile).then((url) => {
      if (!isCancelled) {
        setQrDataUrl(url);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [berkas, kantorProfile]);

  if (!berkas) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLocation = () => {
    const locText = `Lemari: ${berkas.lokasiFisik.lemari}, Rak: ${berkas.lokasiFisik.rak}, Bantex: ${berkas.lokasiFisik.nomorBantex} (${berkas.nomorAkta})`;
    navigator.clipboard.writeText(locText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* On-screen Interactive Modal */}
      <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-slate-900 border border-slate-750 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden text-slate-100 my-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <QrIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Cetak Label QR Map Arsip Fisik
                </h3>
                <p className="text-xs text-slate-400">
                  Label stiker sampul map berkas / Bantex / boks arsip
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

          {/* Label Preview Card (What will be printed) */}
          <div className="p-6 bg-slate-950 flex justify-center">
            <div className="w-full max-w-md bg-white text-slate-900 border-2 border-slate-900 rounded-lg p-4 shadow-lg text-left select-none">
              {/* Kop Label */}
              <div className="border-b-2 border-slate-900 pb-2 mb-3 flex items-center justify-between gap-2">
                <div className="shrink-0">
                  {berkas.jenisLayanan === 'NOTARIS' ? (
                    <LogoINI size={36} theme="light" />
                  ) : (
                    <LogoIPPAT size={36} theme="light" />
                  )}
                </div>
                <div className="text-center flex-1">
                  <p className="text-[9px] font-bold tracking-widest text-slate-700 uppercase">
                    ARSIP RESMI KANTOR NOTARIS & PPAT
                  </p>
                  <h4 className="text-xs sm:text-sm font-extrabold tracking-tight text-slate-950 uppercase font-serif">
                    {namaLengkapNotaris}
                  </h4>
                  <p className="text-[8px] text-slate-600 font-semibold">
                    {berkas.jenisLayanan === 'NOTARIS' ? 'BUKU DAFTAR AKTA NOTARIS' : 'BUKU DAFTAR AKTA PPAT'}
                  </p>
                </div>
                <div className="w-9 shrink-0" />
              </div>

              {/* Main Body with QR and details */}
              <div className="flex items-start gap-3">
                {/* QR Code */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-28 h-28 border border-slate-300 p-1 bg-white rounded flex items-center justify-center">
                    {qrDataUrl ? (
                      <img src={qrDataUrl} alt="QR Code Berkas" className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                        Memuat QR...
                      </div>
                    )}
                  </div>
                  <span className="text-[8px] font-mono text-slate-600 mt-1 font-bold">
                    {berkas.nomorBerkas}
                  </span>
                </div>

                {/* Metadata */}
                <div className="flex-1 min-w-0 text-xs space-y-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Nomor Akta</span>
                    <span className="font-extrabold text-sm font-mono text-slate-950 leading-tight">
                      {berkas.nomorAkta}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Tanggal Akta</span>
                    <span className="font-semibold text-slate-800">
                      {new Date(berkas.tanggalAkta).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Sifat / Perihal</span>
                    <span className="font-semibold text-slate-900 block truncate" title={berkas.judulAkta}>
                      {berkas.judulAkta}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Para Pihak</span>
                    <p className="text-[11px] text-slate-700 leading-snug line-clamp-2">
                      {berkas.paraPihak.map(p => p.nama).join(', ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Physical Shelf Indicator Strip */}
              <div className="mt-3 pt-2 border-t-2 border-dashed border-slate-400 grid grid-cols-3 gap-1 text-center bg-slate-50 rounded p-1.5 border">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">Lemari</span>
                  <span className="font-bold text-xs text-slate-900">{berkas.lokasiFisik.lemari}</span>
                </div>
                <div className="border-x border-slate-300">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">Rak</span>
                  <span className="font-bold text-xs text-slate-900">{berkas.lokasiFisik.rak}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">Bantex / Boks</span>
                  <span className="font-bold text-xs text-slate-900 font-mono truncate block" title={berkas.lokasiFisik.nomorBantex}>
                    {berkas.lokasiFisik.nomorBantex}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Action Controls */}
          <div className="px-5 py-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs">
            <button
              onClick={handleCopyLocation}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Lokasi Disalin!</span>
                </>
              ) : (
                <span>Salin Info Lokasi</span>
              )}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Label Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Area - Only Visible during Window Print */}
      <div className="hidden print-only">
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '10px', border: '2px solid black', fontFamily: 'sans-serif' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid black', paddingBottom: '6px', marginBottom: '8px' }}>
            <div style={{ width: '40px' }}>
              {berkas.jenisLayanan === 'NOTARIS' ? (
                <LogoINI size={36} theme="light" />
              ) : (
                <LogoIPPAT size={36} theme="light" />
              )}
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '1px' }}>
                ARSIP RESMI KANTOR NOTARIS & PPAT
              </div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                {namaLengkapNotaris}
              </div>
              <div style={{ fontSize: '8px', color: '#444', fontWeight: 'bold' }}>
                {berkas.jenisLayanan === 'NOTARIS' ? 'BUKU DAFTAR AKTA NOTARIS' : 'BUKU DAFTAR AKTA PPAT'}
              </div>
            </div>
            <div style={{ width: '40px' }}></div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ textAlign: 'center', width: '110px' }}>
              {qrDataUrl && <img src={qrDataUrl} alt="QR" style={{ width: '110px', height: '110px' }} />}
              <div style={{ fontSize: '8px', fontFamily: 'monospace', fontWeight: 'bold', marginTop: '2px' }}>
                {berkas.nomorBerkas}
              </div>
            </div>

            <div style={{ flex: 1, fontSize: '11px', lineHeight: '1.4' }}>
              <div>
                <strong style={{ fontSize: '9px', color: '#666', textTransform: 'uppercase' }}>Nomor Akta:</strong>
                <div style={{ fontSize: '13px', fontWeight: 'bold', fontFamily: 'monospace' }}>{berkas.nomorAkta}</div>
              </div>
              <div style={{ marginTop: '4px' }}>
                <strong style={{ fontSize: '9px', color: '#666', textTransform: 'uppercase' }}>Tanggal:</strong>
                <div>{berkas.tanggalAkta}</div>
              </div>
              <div style={{ marginTop: '4px' }}>
                <strong style={{ fontSize: '9px', color: '#666', textTransform: 'uppercase' }}>Sifat Akta:</strong>
                <div style={{ fontWeight: '600' }}>{berkas.judulAkta}</div>
              </div>
              <div style={{ marginTop: '4px' }}>
                <strong style={{ fontSize: '9px', color: '#666', textTransform: 'uppercase' }}>Para Pihak:</strong>
                <div style={{ fontSize: '10px' }}>{berkas.paraPihak.map(p => p.nama).join(', ')}</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '10px', paddingTop: '6px', borderTop: '2px dashed #666', display: 'flex', justifyContent: 'space-between', textAlign: 'center', background: '#f5f5f5', padding: '6px', borderRadius: '4px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '8px', color: '#666' }}>LEMARI</div>
              <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{berkas.lokasiFisik.lemari}</div>
            </div>
            <div style={{ flex: 1, borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc' }}>
              <div style={{ fontSize: '8px', color: '#666' }}>RAK</div>
              <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{berkas.lokasiFisik.rak}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '8px', color: '#666' }}>BANTEX</div>
              <div style={{ fontWeight: 'bold', fontSize: '11px', fontFamily: 'monospace' }}>{berkas.lokasiFisik.nomorBantex}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
