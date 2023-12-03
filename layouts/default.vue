<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();
useHead({
    titleTemplate: (title) => {
        return title ? `${title} - GPT-APP` : 'GPT-APP';
    },
    meta: [
        { property: 'og:url', content: `${config.public.baseUrl}${route.path}` },
    ],
})
</script>

<template>
    <div class="l-admin">
        <FrontHeader />
            <main class="l-main">
                <slot />
            </main>
        <FrontFooter />
    </div>
</template>

<style lang="scss" scoped>
.l-admin {
    width: 100%;
    background: #f8f8f8;
}

.l-main {
    display: block;
    width: 100%;
    min-height:100vh;
}
</style>