/* Habilidades agrupadas por categoria (FR-21).

   Los NOMBRES de tecnologia no se traducen —"Vue" es "Vue" en los dos
   idiomas— asi que viven aca. Las ETIQUETAS de grupo si, y viven en
   src/locales/. Es la misma frontera que la historia 1.7 establecio.

   `icon` es el nombre previsto del simbolo del sprite, no una ruta. El sprite
   de la historia 1.4 tiene once simbolos y NINGUNO es de una tecnologia; los
   PNG de src/assets/icons/ no se usan porque no siguen el color del tema, que
   es el punto entero del sprite (D9), y son un origen de assets que D14 evita.
   La decision visual —sumar los simbolos al sprite o presentar los grupos sin
   iconos— se toma en la historia 5.4 con la grilla delante. El dato ya esta
   listo para las dos. */

export const skills = [
  {
    id: 'frontend',
    items: [
      { name: 'HTML', icon: 'html' },
      { name: 'CSS', icon: 'css' },
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'Vue', icon: 'vue' },
      { name: 'React', icon: 'react' },
      { name: 'Flutter', icon: 'flutter' },
    ],
  },
  {
    id: 'backend',
    items: [
      { name: 'Node.js', icon: 'node' },
      { name: 'Express', icon: 'express' },
      { name: 'SQL/NoSQL', icon: 'database' },
    ],
  },
  {
    id: 'tools',
    items: [
      { name: 'Git', icon: 'git' },
      { name: 'Docker', icon: 'docker' },
    ],
  },
];
