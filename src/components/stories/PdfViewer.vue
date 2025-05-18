<template>
    <div style="display: flex; justify-content: center;">
      <canvas ref="pdfCanvas" />
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import * as pdfjsLib from 'pdfjs-dist'
  
  // Configura el worker de PDF.js (usa CDN para evitar problemas de ruta)
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
  
  const pdfCanvas = ref(null)
  
  onMounted(async () => {
    const url = '/certificado.pdf' // Asegúrate que esté en la carpeta /public
  
    const loadingTask = pdfjsLib.getDocument(url)
    const pdf = await loadingTask.promise
  
    const page = await pdf.getPage(1)
  
    const viewport = page.getViewport({ scale: 1.5 })
    const canvas = pdfCanvas.value
    const context = canvas.getContext('2d')
  
    canvas.height = viewport.height
    canvas.width = viewport.width
  
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise
  })
  </script>
  pp