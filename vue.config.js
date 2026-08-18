const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,

  /* El titulo por defecto salia de `name` en package.json: "portafolio", en
     minuscula, y aparecia en el <title>, en el manifest y en el <noscript>.
     El router lo sobreescribe al montar, pero el HTML servido —lo que ve un
     rastreador que no ejecuta JavaScript— decia "portafolio". */
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Marcelo Olivera — Frontend Developer',
    },
  },

  pwa: {
    name: 'MarceCode',
    themeColor: '#0B0D10',
    msTileColor: '#0B0D10',
    manifestOptions: {
      name: 'Marcelo Olivera — Frontend Developer',
      short_name: 'MarceCode',
      description: 'Portfolio de Marcelo Olivera, Frontend Developer.',
      background_color: '#0B0D10',
      lang: 'es',
    },
    /* El plugin inyecta referencias a DIEZ archivos bajo /img/icons/ que
       nunca existieron en este proyecto: el manifest apuntaba a iconos
       ausentes y el navegador pedia 404 en cada carga. Eran dos de los
       errores de consola que arrastraba desde la historia 1.1. Ahora existen,
       generados desde el mismo glifo del sprite. */
    iconPaths: {
      faviconSVG: 'img/icons/favicon.svg',
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/msapplication-icon-144x144.png',
    },

    /* `skipWaiting: false` es lo que deja la version nueva en estado
       `waiting` para que el aviso de UpdateToast pueda ofrecerla. Con
       `skipWaiting: true` el worker nuevo tomaria control solo, sin avisar,
       y el visitante veria la pagina cambiar bajo los pies. */
    workboxOptions: {
      skipWaiting: false,
      clientsClaim: true,
      exclude: [/\.map$/, /^manifest.*\.js$/],
    },
  },

  /* `public/ui-generated/` es el prototipo de Open Design: la fuente
     normativa que las 41 historias citan como referencia de markup y CSS.
     Vive en el repo a proposito, pero NO tiene que publicarse.

     Sin esta exclusion se copia a dist/ y queda servido en
     marcecode.com/ui-generated/: cuatro paginas accesibles publicamente que
     ademas cargan sus fuentes desde Google, lo que rompe D14 —cero origenes
     de terceros en runtime— en el sitio real, no en el prototipo. Son ademas
     ~1.2 MB de PNG que nadie pide. */
  chainWebpack: (config) => {
    config.plugin('copy').tap((args) => {
      args[0].patterns[0].globOptions.ignore.push('**/ui-generated/**')
      return args
    })
  },
})
