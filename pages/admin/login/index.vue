<script setup lang="ts">
definePageMeta({
    layout: false,
});
useHead({
    title: 'ログイン画面 | GPT-APP',
});

const { signIn, formData } = useAuth();
const signInUser = async () => {
    const config = useRuntimeConfig();
    try {
        await signIn(formData.email.value, formData.password.value)
        return navigateTo(config.public.homeUrl, { replace: true });
    } catch (error) {
        formData.errorMessage.value = 'メールアドレスまたはパスワードが違います'
        return
    }
}
</script>

<template>
    <section class="p-login">
        <div class="p-login__inner">
            <div class="p-loginBlock">
                <form @submit.prevent="signInUser">
                    <div class="p-loginBlockItem">
                        <label for="email" class="p-loginBlockItem__label">メールアドレス</label>
                        <input type="email" id="email" v-model="formData.email.value" required
                            class="p-loginBlockItem__input">
                    </div>
                    <div class="p-loginBlockItem">
                        <label for="password" class="p-loginBlockItem__label">パスワード</label>
                        <input type="password" id="password" v-model="formData.password.value" required
                            class="p-loginBlockItem__input">
                        <p v-if="formData.errorMessage.value" class="p-loginBlock__error">{{ formData.errorMessage.value }}
                        </p>
                    </div>
                    <div class="p-loginBlockBtn">
                        <button type="submit" class="p-loginBlockBtn__txt">ログイン</button>
                    </div>
                    <NuxtLink to="/admin/login/reset" class="p-login__link">パスワードをお忘れの方</NuxtLink>
                    <NuxtLink to="/" class="p-login__link">TOPに戻る</NuxtLink>
                </form>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.p-login {
    background: $colorBg;

    &__inner {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        padding: 0 2rem;
    }

    &__link {
        display: block;
        padding-top: 1.5rem;
        font-size: 1.2rem;
        text-align: center;
        text-decoration: underline;
        transition: .3s;

        &:hover {
            opacity: .7;

            @media (max-width: ($ipro)) {
                opacity: 1;
            }
        }
    }

    &Block {
        width: 100%;
        max-width: 400px;
        padding: 4rem 3rem;
        background: #fff;
        border-radius: 1rem;
        box-shadow: 0 0 10px #0003;
        box-sizing: border-box;

        &Item {
            display: flex;
            flex-direction: column;
            gap: .5rem;
            margin-bottom: 2rem;

            &__label {
                font-size: 1.6rem;
                font-weight: 600;
            }

            &__input {
                border: 1px solid #bcbcbc;
                border-radius: 5px;
                box-sizing: border-box;
                display: block;
                font-size: 1.4rem;
                padding: 0.5rem 1rem;
                width: 100%;
            }
        }

        &Btn {
            max-width: 250px;
            margin: 0 auto;
            background: $colorBtn;
            border: 1px solid $colorBtn;
            border-radius: 5px;
            text-align: center;
            transition: .3s;
            cursor: pointer;

            &:hover {
                background: #fff;

                @media (max-width: ($ipro)) {
                    background: $colorBtn;
                    color: #fff;
                }

                & .p-loginBlockBtn__txt {
                    color: $colorBtn;

                    @media (max-width: ($ipro)) {
                        color: #fff;
                    }
                }
            }

            &__txt {
                width: 100%;
                padding: .7rem 0;
                color: #fff;
                transition: .3s;
                cursor: pointer;
            }
        }

        &__error {
            color: red;
            font-size: 1.2rem;
            font-weight: 700;
            margin-top: 0.2rem;
        }
    }
}
</style>