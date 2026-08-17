/* Descarga del CV. Era un .vue que solo contenia un <script>: funcionaba
   porque la extension lo mandaba al vue-loader, no porque estuviera bien.
   Es un composable, va en .js.

   El nombre del archivo tiene espacios; la codificacion se hace ACA y no en
   quien llama, asi el llamador pasa el nombre real y no un %20 a mano. */

const ARCHIVO = 'Marcelo Olivera - Curriculum Vitae.pdf';

export default function useDownloadPdf(nombre = ARCHIVO) {
  function downloadPdf() {
    const enlace = document.createElement('a');
    enlace.href = `${process.env.BASE_URL}${encodeURIComponent(nombre)}`;
    enlace.download = nombre;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
  }
  return { downloadPdf };
}
