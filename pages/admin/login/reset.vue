<script setup lang="ts">
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
definePageMeta({
    layout: false,
});
useHead({
    title: 'パスワードリセット | GPT-APP',
});

const auth = getAuth();
const { formData } = useAuth();

const resetPassword = async () => {
    try {
        await sendPasswordResetEmail(auth, formData.email.value);
        formData.successMessage.value = 'パスワードリセット用のリンクを送信しました。メールを確認してください。';
        formData.errorMessage.value = '';
    } catch (error) {
        formData.errorMessage.value = 'メールアドレスが見つかりません。';
        formData.successMessage.value = '';
    }
};
</script>

<template>
    <section class="p-login">
        <div class="p-login__inner">
            <div class="p-loginBlock">
                <form @submit.prevent="resetPassword">
                    <div class="p-loginBlockItem">
                        <label for="email" class="p-loginBlockItem__label">メールアドレス</label>
                        <input type="email" id="email" v-model="formData.email.value" required
                            class="p-loginBlockItem__input">
                        <p class="p-loginBlock__txt">登録済みのメールアドレスに再設定用のリンクを送信します。</p>
                        <p v-if="formData.successMessage.value" class="p-loginBlock__success">{{
                            formData.successMessage.value }}</p>
                        <p v-if="formData.errorMessage.value" class="p-loginBlock__error">{{ formData.errorMessage.value }}
                        </p>
                    </div>
                    <div class="p-loginBlockBtnWrap">
                        <NuxtLink to="/admin/login" class="c-adminBtnBack">戻る</NuxtLink>
                        <div class="p-loginBlockBtn">
                            <button type="submit" class="p-loginBlockBtn__txt">送信</button>
                        </div>
                    </div>
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

    &Block {
        width: 100%;
        max-width: 400px;
        padding: 4rem 3rem;
        background: #fff;
        border-radius: 5px;
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
            width: 100%;
            max-width: 180px;
            background: $colorBtn;
            border: 1px solid $colorBtn;
            border-radius: 5px;
            text-align: center;
            transition: .3s;
            cursor: pointer;

            &Wrap {
                display: flex;
                justify-content: center;
                gap: 4rem;

                @media (max-width: ($sp)) {
                    flex-direction: column-reverse;
                    gap: 1.5rem;
                    max-width: 180px;
                    margin: 0 auto;
                }
            }

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

        &__success {
            margin-top: 2rem;
            font-size: 1.2rem;
            font-weight: 700;
        }

        &__txt {
            font-size: 1.2rem;
        }
    }
}
</style>