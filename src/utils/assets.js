/* Resolucion de `project.image` (un nombre base) al asset empaquetado.

   El modulo de contenido no sabe de rutas de build ni de extensiones, asi que
   la traduccion nombre -> asset ocurre aca. Es un mapa explicito y no un
   require() con ruta construida en runtime: webpack resuelve el require
   dinamico generando un contexto con TODO el directorio, lo que mete en el
   bundle imagenes que nadie usa y falla en tiempo de ejecucion —no de
   compilacion— cuando el archivo no existe.

   Con un mapa, el que falta se ve leyendo el archivo. */

import jedamiPreview from '@/assets/img/jedami-preview.webp';
import pokemonPreview from '@/assets/img/pokemon-preview.webp';

const IMAGENES = {
  'jedami-preview': jedamiPreview,
  'pokemon-preview': pokemonPreview,
  /* 'chat-preview' NO existe todavia. Brecha de contenido registrada en la
     arquitectura y en la historia 7.1: hace falta que Marcelo saque la
     captura. Hasta entonces esta funcion devuelve null y quien la consume
     tiene que renderizar el caso sin imagen, no un enlace roto. */
};

export function imagenDeProyecto(nombre) {
  return IMAGENES[nombre] ?? null;
}
