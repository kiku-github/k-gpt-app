export default defineNuxtRouteMiddleware(async () => {
    if (!process.server) {
        const { checkAuthState, token } = useAuth()
        await checkAuthState()
        if (!token.value) {
            const config = useRuntimeConfig();
            return navigateTo(config.public.loginUrl, { replace: true })
        }
    }
})