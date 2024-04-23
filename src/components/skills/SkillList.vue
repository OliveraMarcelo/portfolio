<template>
    <div>
        <SectionTitle text="Mis habilidades" span-text="." />
        <SubTitle text="Mis habilidades mas destacadas serian estas : " />
        <div class="skills-container">
            <div class="row">
                <div class="column">
                    <h2>Frontend Skills</h2>
                    <div class="icons">
                        <div v-for="icon in frontendIcons" :key="icon.name" class="icon">
                            <img v-bind:src="icon.path" :alt="icon.name" class="icon-image" />
                        </div>
                    </div>
                </div>
                <!--  <div class="column">
                    <h2>Backend Skills</h2>
                    <div class="icons">
                        <div v-for="icon in backendIcons" :key="icon.name" class="icon">
                            <img  :src="icon.path" :alt="icon.name" class="icon-image" />
                        </div>
                    </div>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import SectionTitle from '../texts/SectionTitle.vue';
import SubTitle from '../texts/SubTitle.vue';
import html5 from '../../assets/icons/html-5.png'
import css from '../../assets/icons/css-3.png'
import js from '../../assets/icons/js.png'
import vue from '../../assets/icons/vue.png'
import react from '../../assets/icons/react.png'
import flutter from '../../assets/icons/flutter.png'

const frontendIcons = ref([
    { name: 'HTML', path: html5 },
    { name: 'CSS', path: css },
    { name: 'JS', path: js },
    { name: 'Vue', path: vue },
    { name: 'React', path: react },
    { name: 'Flutter', path: flutter }
]);

/* const backendIcons = ref([
    { name: 'SQL', path: ''  },
    { name: 'Node.js', path: '' },
    { name: 'Sequelize', path: '' },
    { name: 'MySQL', path: ''  }
]); */
</script>




<style scoped>
.skills-container {
    margin: 20px auto;
    max-width: 800px;
}

.row {
    display: flex;
    justify-content: space-between;
}

.column {
    flex: 1;
}

.icons {
    display: flex;
    flex-wrap: wrap;
}

.icon {
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 5px 10px;
    background-color: #eee;
    border-radius: 5px;
}

.icon-image {
    width: 50px;
}
</style>