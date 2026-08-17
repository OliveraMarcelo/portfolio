/* Contiene el foco dentro de un contenedor mientras esta abierto, y lo
   devuelve al disparador al cerrar.

   El prototipo cierra con Escape y devuelve el foco, pero NO contiene el
   foco: quien navega con Tab sale del panel hacia el contenido que esta
   detras del velo, visualmente tapado y no clickeable. Es un fallo directo
   de NFR-08, y es la unica parte de la historia 2.4 que no se porta sino
   que se escribe.

   Lo consumen el menu mobile (2.4) y el lightbox del certificado (5.3): dos
   implementaciones distintas del mismo comportamiento accesible es como
   aparecen inconsistencias que solo salen en auditoria. */

const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useFocusTrap() {
  let disparador = null;

  /* El disparador se pasa EXPLICITO en lugar de leer document.activeElement.
     Dos razones: un `.click()` programatico no mueve el foco, y Safari no
     enfoca los <button> al hacer clic. Leyendo activeElement, el foco
     volveria al <body> en lugar del control que abrio la capa. */
  function abrir(contenedor, elDisparador = null) {
    disparador = elDisparador || document.activeElement;
    const focos = contenedor?.querySelectorAll(ENFOCABLES);
    if (focos?.length) focos[0].focus();
  }

  function cerrar() {
    if (disparador && typeof disparador.focus === 'function') disparador.focus();
    disparador = null;
  }

  /* Devuelve true si consumio el evento. */
  function alPresionarTab(e, contenedor) {
    if (e.key !== 'Tab' || !contenedor) return false;
    const focos = [...contenedor.querySelectorAll(ENFOCABLES)];
    if (!focos.length) return false;
    const primero = focos[0];
    const ultimo = focos[focos.length - 1];

    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault();
      ultimo.focus();
      return true;
    }
    if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primero.focus();
      return true;
    }
    return false;
  }

  return { abrir, cerrar, alPresionarTab };
}
