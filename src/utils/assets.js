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
  /* 'chat-preview' NO existe. Decidido en la historia 7.1: ese proyecto se
     presenta con un tratamiento tipografico en lugar de una captura, porque
     un mockup generico o una imagen prestada seria contenido falso en un
     portfolio. Si algun dia hay captura real, alcanza con agregarla aca: el
     `v-if` de ProjectCard y del detalle vuelve solo a la imagen. */
};

export function imagenDeProyecto(nombre) {
  return IMAGENES[nombre] ?? null;
}
