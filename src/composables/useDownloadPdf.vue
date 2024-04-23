<script>
export default function useDownloadPdf(pdfFileName) {
  function downloadPdf() {
    const link = document.createElement('a');
    const pdfUrl = `${process.env.BASE_URL}${pdfFileName}`;
    link.href = pdfUrl;
    link.target = '_blank';
    link.download = 'Marcelo Olivera - Curriculum Vitae.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return {
    downloadPdf,
  };
}
</script>