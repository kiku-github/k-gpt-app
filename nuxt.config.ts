// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    runtimeConfig: {
        public: {
            baseUrl: process.env.NUXT_BASE_URL,
            topUrl: "/",
            homeUrl: "/admin",
            loginUrl: "/admin/login",
        },
    },
    css: [
        { src: '~/assets/css/style.scss' },
    ],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@import "@/assets/css/setting.scss";',
                },
            },
        },
    },
    app: {
        head: {
            htmlAttrs: {
                lang: 'ja',
                prefix: 'og: http://ogp.me/ns#'
            },
            meta: [
                { name: 'robots', content: 'noindex, nofollow' },
                { name: 'twitter:card', content: 'summary' },
                { name: 'format-detection', content: 'telephone=no' },
                { property: 'og:site_name', content: 'GPT-APP' },
                { property: 'og:locale', content: 'ja_JP' }
            ],
            link: [
                {
                    rel: "preconnect",
                    href: "https://fonts.googleapis.com",
                },
                {
                    rel: "preconnect",
                    href: "https://fonts.gstatic.com",
                    crossorigin: "",
                },
                {
                    rel: "stylesheet",
                    href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;700&family=Roboto:wght@400;500;700&display=swap",
                },
            ],
        },
    },
})
