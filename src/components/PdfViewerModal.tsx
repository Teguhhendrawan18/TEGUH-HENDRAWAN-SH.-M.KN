import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  Upload, 
  FileCheck, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { ArsipBerkas, ArsipDokumenPdf, TipeDokumenPdf } from '../types';
import { getPdfBlob, savePdfBlob, saveBerkas } from '../services/db';
import { formatFileSize } from '../utils/samplePdf';

interface PdfViewerModalProps {
  berkas: ArsipBerkas | null;
  initialDocId?: string;
  onClose: () => void;
  onBerkasUpdated: (updated: ArsipBerkas) => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  berkas,
  initialDocId,
  onClose,
  onBerkasUpdated
}) => {
  const [activeDocId, setActiveDocId] = useState<string>('');
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadType, setUploadType] = useState<TipeDokumenPdf>('WARKAH_PENDUKUNG');

  useEffect(() => {
    if (!berkas || !berkas.dokumenPdfList || berkas.dokumenPdfList.length === 0) {
      setActiveDocId('');
      setBlobUrl(null);
      setLoading(false);
      return;
    }

    const docToSelect = initialDocId && berkas.dokumenPdfList.some(d => d.id === initialDocId)
      ? initialDocId
      : berkas.dokumenPdfList[0].id;

    setActiveDocId(docToSelect);
  }, [berkas, initialDocId]);

  useEffect(() => {
    let currentUrl: string | null = null;
    let isCancelled = false;

    async function loadPdf() {
      if (!berkas || !activeDocId) {
        setBlobUrl(null);
        setLoading(false);
        return;
      }

      const activeDoc = berkas.dokumenPdfList.find(d => d.id === activeDocId);
      if (!activeDoc) {
        setBlobUrl(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const blob = await getPdfBlob(activeDoc.fileBlobKey);
        if (blob && !isCancelled) {
          currentUrl = URL.createObjectURL(blob);
          setBlobUrl(currentUrl);
        } else if (!isCancelled) {
          setBlobUrl(null);
        }
      } catch (err) {
        console.error('Error loading PDF blob:', err);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      isCancelled = true;
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [berkas, activeDocId]);

  if (!berkas) return null;

  const currentDoc = berkas.dokumenPdfList?.find(d => d.id === activeDocId);

  // Direct upload new PDF into this deed
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Mohon pilih file berformat PDF');
      return;
    }

    setIsUploading(true);
    try {
      const newBlobKey = `pdf_${berkas.id}_${Date.now()}`;
      await savePdfBlob(newBlobKey, file);

      const newDoc: ArsipDokumenPdf = {
        id: `doc-${Date.now()}`,
        namaFile: file.name,
        tipeDokumen: uploadType,
        fileBlobKey: newBlobKey,
        fileSize: file.size,
        fileMimeType: file.type || 'application/pdf',
        uploadedAt: new Date().toISOString(),
        deskripsi: `Diunggah pada ${new Date().toLocaleDateString('id-ID')}`
      };

      const updatedDocs = [...(berkas.dokumenPdfList || []), newDoc];
      const updatedBerkas: ArsipBerkas = {
        ...berkas,
        dokumenPdfList: updatedDocs,
        updatedAt: new Date().toISOString()
      };

      await saveBerkas(updatedBerkas);
      onBerkasUpdated(updatedBerkas);
      setActiveDocId(newDoc.id);
    } catch (err) {
      console.error('Gagal mengunggah PDF:', err);
      alert('Terjadi kesalahan saat menyimpan file PDF.');
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const handleDownload = () => {
    if (!blobUrl || !currentDoc) return;
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = currentDoc.namaFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getTipeLabel = (tipe: TipeDokumenPdf) => {
    switch (tipe) {
      case 'MINUTA_AKTA': return 'Minuta Akta';
      case 'SALINAN_AKTA': return 'Salinan Resmi';
      case 'PAJAK_PBB': return 'Pajak PBB';
      case 'BPHTB': return 'BPHTB';
      case 'PPH': return 'PPH';
      case 'BUKTI_KROSCEK': return 'Bukti Kroscek (BPN)';
      case 'SKMHT': return 'SKMHT';
      case 'PERJANJIAN_KREDIT': return 'Perjanjian Kredit';
      case 'SK_KEMENKUMHAM': return 'SK Kemenkumham';
      case 'NIB_OSS': return 'NIB & NPWP';
      case 'WARKAH_PENDUKUNG': return 'Warkah Pendukung';
      case 'SERTIPIKAT_TANAH': return 'Sertipikat Tanah';
      case 'KTP_KK_NPWP': return 'Identitas Para Pihak';
      case 'SPPT_PBB': return 'SPPT PBB';
      case 'BUKTI_BAYAR_PAJAK': return 'Bukti Bayar Pajak';
      default: return 'Dokumen PDF';
    }
  };

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-slate-900 border border-slate-750 rounded-xl shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden text-slate-100">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white truncate text-sm sm:text-base">
                  {berkas.nomorAkta}
                </span>
                <span className="text-xs text-slate-400 font-normal">·</span>
                <span className="text-xs text-amber-400 font-medium">
                  {berkas.jenisLayanan === 'NOTARIS' ? 'Akta Notaris' : 'Akta PPAT'}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-xl">
                {berkas.judulAkta} · {berkas.lokasiFisik.lemari} / {berkas.lokasiFisik.rak}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {blobUrl && (
              <>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow transition-colors"
                  title="Unduh Berkas PDF ke Komputer / HP"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Dokumen (PDF)</span>
                </button>
                <a
                  href={blobUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  title="Buka PDF di Tab Baru"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Tutup Penampil PDF"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-Header: Document Switcher & Quick Upload Bar */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* List of PDFs attached */}
          <div className="flex items-center gap-2 overflow-x-auto py-0.5 max-w-2xl">
            <span className="text-slate-400 font-medium shrink-0 mr-1">Dokumen PDF:</span>
            {berkas.dokumenPdfList && berkas.dokumenPdfList.length > 0 ? (
              berkas.dokumenPdfList.map((doc) => {
                const isActive = doc.id === activeDocId;
                return (
                  <div
                    key={doc.id}
                    className={`flex items-center rounded-md border text-xs font-medium transition-colors shrink-0 ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-750 border-slate-700'
                    }`}
                  >
                    <button
                      onClick={() => setActiveDocId(doc.id)}
                      className="px-2.5 py-1 flex items-center gap-1.5"
                    >
                      <FileCheck className="w-3 h-3 text-amber-400" />
                      <span>{getTipeLabel(doc.tipeDokumen)}</span>
                      <span className="text-slate-400 text-[11px] font-mono tabular-nums">
                        ({formatFileSize(doc.fileSize)})
                      </span>
                    </button>
                  </div>
                );
              })
            ) : (
              <span className="text-slate-500 italic">Belum ada file PDF tersimpan di berkas ini</span>
            )}
          </div>

          {/* Upload New PDF Form */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <div className="relative">
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value as TipeDokumenPdf)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-md pl-2 pr-6 py-1 appearance-none focus:outline-none focus:border-amber-400"
              >
                <option value="PAJAK_PBB">Pajak PBB</option>
                <option value="BPHTB">BPHTB</option>
                <option value="PPH">PPH</option>
                <option value="MINUTA_AKTA">Minuta Akta</option>
                <option value="SALINAN_AKTA">Salinan Akta</option>
                <option value="WARKAH_PENDUKUNG">Warkah Pendukung</option>
                <option value="SERTIPIKAT_TANAH">Sertipikat Tanah</option>
                <option value="KTP_KK_NPWP">KTP / NPWP Para Pihak</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
            </div>

            <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors">
              <Upload className="w-3 h-3" />
              <span>{isUploading ? 'Menyimpan...' : '+ Upload PDF'}</span>
              <input
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                disabled={isUploading}
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>

        {/* PDF Viewer Body */}
        <div className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <div className="w-7 h-7 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs">Memuat dokumen PDF dari arsip lokal...</p>
            </div>
          ) : blobUrl ? (
            <iframe
              src={`${blobUrl}#toolbar=1&navpanes=0`}
              title={currentDoc?.namaFile || 'Preview PDF'}
              className="w-full h-full border-none bg-slate-900"
            />
          ) : (
            <div className="text-center p-8 max-w-md">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 mx-auto mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">
                Belum Ada Dokumen PDF Terpilih
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Unggah dokumen PDF warkah, minuta akta, atau salinan berkas ini untuk langsung disimpan secara persisten di aplikasi.
              </p>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Pilih File PDF untuk Diunggah</span>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          )}
        </div>

        {/* Footer info strip */}
        {currentDoc && (
          <div className="px-5 py-2 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-slate-300">{currentDoc.namaFile}</span>
              <span>·</span>
              <span className="font-mono tabular-nums">{formatFileSize(currentDoc.fileSize)}</span>
              <span>·</span>
              <span>Diarsipkan: {new Date(currentDoc.uploadedAt).toLocaleString('id-ID')}</span>
            </div>
            <div className="text-amber-400/90 font-medium">
              Tersimpan di IndexedDB Lokal Kantor Notaris & PPAT
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
