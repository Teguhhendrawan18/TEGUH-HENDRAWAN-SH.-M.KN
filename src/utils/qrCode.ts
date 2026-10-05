import QRCode from 'qrcode';
import { ArsipBerkas, KantorProfile } from '../types';

export async function generateDeedQrCodeDataUrl(
  berkas: ArsipBerkas,
  kantorProfile?: KantorProfile
): Promise<string> {
  const officeName = kantorProfile 
    ? `Notaris & PPAT ${kantorProfile.namaNotaris}, ${kantorProfile.gelar}`
    : 'Notaris & PPAT Teguh Hendrawan, S.H., M.Kn.';

  const qrPayload = JSON.stringify({
    kantor: officeName,
    layanan: berkas.jenisLayanan,
    noBerkas: berkas.nomorBerkas,
    noAkta: berkas.nomorAkta,
    tglAkta: berkas.tanggalAkta,
    judul: berkas.judulAkta,
    lokasi: `${berkas.lokasiFisik.lemari} / ${berkas.lokasiFisik.rak} / ${berkas.lokasiFisik.nomorBantex}`,
    verifikasi: 'ARSIP-VALID'
  });

  try {
    const dataUrl = await QRCode.toDataURL(qrPayload, {
      width: 256,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate QR code', err);
    return '';
  }
}
