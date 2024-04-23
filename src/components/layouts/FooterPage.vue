<template>
    <footer>


        <div class="subtitle">
            Me puede contactar a estas redes sociales
        </div>
        <div class="social-links">
            <a href="https://www.linkedin.com/in/marcelodanielolivera/" target="_blank" rel="noopener noreferrer">
                <img src="../../assets/icons/linkedin.png" alt="LinkedIn">
            </a>
            <a :href="'mailto:' + email">
                <img src="../../assets/icons/gmail.png" alt="Email">
            </a>
            <a :href="'https://wa.me/541134323271' " target="_blank"
                rel="noopener noreferrer">
                <img src="../../assets/icons/whatsapp.png" alt="WhatsApp">
            </a>
        </div>

        <div>
            Powered by Vue
        </div>
    </footer>
</template>

<script setup>
const email = 'olivera.m.et13@gmail.com';
</script>

<style scoped>
footer {
    padding: 20px;
    text-align: center;
    width: 100%;
    height: 10rem;
    margin-top: 40px;
}


.social-links {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin: 20px  0 20px 0;
}

.social-links img {
    width: 30px;
    height: 30px;
}
</style>