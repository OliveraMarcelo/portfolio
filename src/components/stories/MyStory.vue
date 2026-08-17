<template>
    <section id="about">

      <SectionTitle text="Mi formación" span-text="." />
      <SubTitle text="🎓 Actualmente soy estudiante de Desarrollo de Software en el Instituto de Formación Técnica Superior N.º 11, cursando el primer año. Durante este proceso formativo he adquirido conocimientos en algoritmos, estructuras de datos y bases de programación orientada a objetos." />
      <SubTitle text="📚 Además, me considero una persona autodidacta: me capacito constantemente por mi cuenta a través de cursos, documentación oficial y proyectos prácticos que me permiten aplicar y afianzar lo aprendido. Esta actitud me ayuda a mantenerme actualizado en un entorno tecnológico en constante cambio." />
      <SubTitle text="🎓 También soy egresado de Digital House, donde completé el curso de Full Stack Developer, aprendiendo tecnologías como HTML, CSS, JavaScript, Node.js, Express, React y bases de datos relacionales y no relacionales." />
      <div class="certificate-container">
      <img src="@/assets/icons/image.png" alt="Certificado Full Stack Developer - Digital House" class="certificate-img" />
    </div>
      <SectionTitle text="Experiencia laboral" span-text="." />
      <SubTitle text="💼 Actualmente trabajo como Frontend Developer en EXO S.A., donde formo parte del equipo de desarrollo de software. Me especializo en el desarrollo de interfaces modernas utilizando Flutter, Riverpod y Dart para  web, mobile y aplicaciones de escritorio (Windows)  . Participo activamente en el diseño de componentes, consumo de APIS y mantenimiento de código." />
      <SubTitle text="🌐 También he trabajado con Vue.js, desarrollando dashboards para visualización de datos y herramientas internas, contribuyendo al desarrollo de experiencias de usuario fluidas y accesibles." />

      <SectionTitle text="Proyectos personales" span-text="." />
      <SubTitle text="🛠️ En mis tiempos libres desarrollo proyectos que me permiten explorar nuevas tecnologías y resolver problemas reales. Algunos de ellos incluyen:" />
      <SubTitle text="• Un chat en tiempo real con WebSockets, centrado en rendimiento y experiencia de usuario." />
      <SubTitle text="• Dashboards interactivos con filtros avanzados, manejo de estados y visualización dinámica de datos." />
<!--       <SubTitle text="• Actualmente, estoy desarrollando una plataforma de tienda mayorista utilizando React, donde implemento diseño modular, rutas protegidas, manejo de estado global y consumo de APIs." />
 -->  
      <SectionTitle text="Hobbies" span-text="." />
      <SubTitle text="🎸 Más allá del código, soy guitarrista y me gusta cantar. La música me ayuda a mantener el equilibrio, estimular la creatividad y conectar con otras personas desde un lugar artístico. Considero que este aspecto complementa mi perfil como desarrollador, ya que me enseña sobre disciplina, práctica constante y expresión personal." />
    </section>
  </template>
  
  <script setup>
  import SectionTitle from '../texts/SectionTitle.vue';
  import SubTitle from '../texts/SubTitle.vue';
  </script>
  
  <style lang="scss" scoped>
  /* Podés agregar estilos aquí si querés resaltar títulos o íconos */
  </style>
  