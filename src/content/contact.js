/* Canales de contacto (FR-24, FR-25). Cuarto y ultimo modulo de
   src/content/, con la misma decision que los tres anteriores (D4).

   Las ETIQUETAS se traducen; el numero, el email y la URL no. Van en la clave
   `i18n` del canal y no en src/locales/ porque viajan con el dato: un canal
   nuevo trae su etiqueta en los dos idiomas, o se ve que falta.

   El email esta publicado a proposito. Es un portfolio: la direccion esta
   para que la usen. Un mailto: en texto plano es cosechable por bots y ese
   costo se acepta — el PRD elige enlaces directos sin formulario (FR-24) y
   excluye el backend del alcance. NO se ofusca con JavaScript: rompe el
   enlace sin JS, complica el markup, y los cosechadores actuales ejecutan JS
   igual. No compra nada real. */

export const contact = [
  {
    id: 'whatsapp',
    /* wa.me acepta SOLO digitos con codigo de pais y sin `+`. El formato
       legible se guarda aparte en `value`: son dos representaciones del mismo
       dato, y derivar una de la otra con un replace es logica en el lugar
       equivocado — se rompe con el primer numero de otro formato. */
    href: 'https://wa.me/541134323271',
    value: '+54 11 3432-3271',
    icon: 'whatsapp',
    external: true,
    i18n: {
      es: { label: 'WhatsApp', aria: 'Escribime por WhatsApp' },
      en: { label: 'WhatsApp', aria: 'Message me on WhatsApp' },
    },
  },
  {
    id: 'email',
    href: 'mailto:olivera.m.et13@gmail.com',
    value: 'olivera.m.et13@gmail.com',
    icon: 'mail',
    /* `false` a proposito: mailto: NO abre un sitio, entrega el enlace al
       cliente de correo. Con target="_blank" algunos navegadores dejan una
       pestaña en blanco huerfana, que se ve como un error del sitio. */
    external: false,
    i18n: {
      es: { label: 'Email', aria: 'Escribime un email' },
      en: { label: 'Email', aria: 'Send me an email' },
    },
  },
  {
    id: 'linkedin',
    href: 'https://www.linkedin.com/in/marcelodanielolivera/',
    value: 'in/marcelodanielolivera',
    icon: 'linkedin',
    external: true,
    i18n: {
      es: { label: 'LinkedIn', aria: 'Ver mi perfil de LinkedIn' },
      en: { label: 'LinkedIn', aria: 'See my LinkedIn profile' },
    },
  },
];

/* La regla de `target` y `rel` vive ACA y no en cada presentacion. El pie y
   la seccion de contacto son dos layouts distintos del mismo dato, y si cada
   uno derivara los atributos por su cuenta el mailto: terminaria abriendo una
   pestaña en blanco en uno de los dos. */
export function atributosDeEnlace(canal) {
  return canal.external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};
}
