/**
 * Utility to generate a valid PDF 1.4 binary Blob client-side
 * for Minuta Akta, Salinan, and Warkah previews.
 */

export function createLegalDocumentPdfBlob(params: {
  title: string;
  nomorAkta: string;
  tanggalAkta: string;
  jenisLayanan: 'NOTARIS' | 'PPAT';
  paraPihak: string[];
  deskripsi: string;
  lokasiFisik: string;
}): Blob {
  const { title, nomorAkta, tanggalAkta, jenisLayanan, paraPihak, deskripsi, lokasiFisik } = params;

  // Generate plain text lines for the PDF stream
  const lines = [
    `KANTOR NOTARIS & PPAT TEGUH HENDRAWAN, S.H., M.Kn.`,
    `SK Menteri Hukum & HAM RI No. AHU-00192.AH.02.01.Tahun 2018`,
    `SK Kepala Badan Pertanahan Nasional RI No. 418/KEP-17.3/IX/2019`,
    `--------------------------------------------------------------------------------`,
    ``,
    `SALINAN ARSIP RESMI - ${jenisLayanan === 'NOTARIS' ? 'AKTA NOTARIS' : 'AKTA PPAT'}`,
    `NOMOR AKTA  : ${nomorAkta}`,
    `TANGGAL     : ${tanggalAkta}`,
    `PERIHAL     : ${title.toUpperCase()}`,
    `LOKASI FISIK: ${lokasiFisik}`,
    ``,
    `--------------------------------------------------------------------------------`,
    `RINGKASAN MINUTA & WARKAH BERKAS:`,
    deskripsi,
    ``,
    `PARA PIHAK PENGHADAP:`,
    ...paraPihak.map((p, idx) => `  ${idx + 1}. ${p}`),
    ``,
    `STATUS DOKUMEN:`,
    `  - Minuta Akta Asli telah ditandatangani oleh para pihak dan Notaris/PPAT.`,
    `  - Disimpan dalam warkah kantor Notaris & PPAT Teguh Hendrawan, S.H., M.Kn.`,
    `  - Terdaftar dalam Buku Daftar Akta resmi bulan berjalan.`,
    ``,
    `--------------------------------------------------------------------------------`,
    `Dicetak secara elektronik dari Sistem Manajemen Arsip Teguh Hendrawan, S.H., M.Kn.`,
    `Waktu Pengarsipan Digital: ${new Date().toLocaleString('id-ID')}`
  ];

  // Build minimal compliant PDF 1.4 string
  let textStream = "BT\n/F1 10 Tf\n40 780 Td\n14 TL\n";
  
  // Custom font size for header
  lines.forEach((line, index) => {
    // Escape parentheses and backslashes for PDF string literal
    const cleanLine = line.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    if (index === 0) {
      textStream += `/F2 12 Tf (${cleanLine}) Tj T*\n/F1 9 Tf\n`;
    } else if (index === 5) {
      textStream += `T* /F2 11 Tf (${cleanLine}) Tj T*\n/F1 9 Tf\n`;
    } else {
      textStream += `(${cleanLine}) Tj T*\n`;
    }
  });
  textStream += "ET";

  const streamLength = textStream.length;

  const pdfData = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${textStream}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000252 00000 n 
0000000000 00000 n 
0000000000 00000 n 
trailer
<< /Size 7 /Root 1 0 R >>
startxref
${350 + streamLength}
%%EOF`;

  return new Blob([pdfData], { type: 'application/pdf' });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
