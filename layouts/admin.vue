<script setup lang="ts">
useHead({
    titleTemplate: (title) => {
        return title ? `${title} - GPT-APP` : 'GPT-APP';
    }
})
</script>

<template>
    <AdminHeader />
    <div class="wrapper">
        <AdminSide />
        <div class="l-admin">
            <main class="l-main">
                <slot />
            </main>
            <AdminFooter />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.wrapper {
    display: flex;
    width: 100%;
}

.l-admin {
    width: calc(100% - 200px);

    @media (max-width: ($ipro)) {
        width: 100%;
    }
}

.l-main {
    display: block;
    width: 100%;
    min-height: calc(100vh - 150px);
}</style>