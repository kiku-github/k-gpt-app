<script setup lang="ts">
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
definePageMeta({
    layout: false,
    middleware: 'auth',
});
useHead({
    title: 'アカウント作成',
});

const { formData } = useAuth();
const addAccount = async () => {
    const auth = getAuth();
    try {
        await createUserWithEmailAndPassword(auth, formData.email.value, formData.password.value);
        await navigateTo('/admin', { replace: true });
    } catch (error) {
        formData.errorMessage.value = 'メールアドレスまたはパスワードが違います';
    }
};
</script>

<template>
    <NuxtLayout name="admin">
        <section class="p-accountAdd">
            <div class="c-adminTtl">
                <h1 class="c-adminTtl__txt">アカウント新規登録</h1>
            </div>
            <div class="l-inner">
                <form @submit.prevent="addAccount">
                    <div class="p-accountAddInput">
                        <div class="c-adminInput">
                            <label for="email" class="c-adminInput__label">メールアドレス</label><span
                                class="c-adminInput__required">*</span>
                            <input v-model="formData.email.value" type="text" id="email" class="c-adminInput__txt">
                        </div>
                        <div class="c-adminInput">
                            <label for="password" class="c-adminInput__label">パスワード</label><span
                                class="c-adminInput__required">*</span>
                            <input v-model="formData.password.value" type="password" id="password" class="c-adminInput__txt">
                            <span class="c-adminInput__note">※パスワードは半角英数6文字以上(大文字・小文字・数字を含む)</span>
                            <span class="c-adminInput__note">※登録後アカウントが切り替わります</span>
                            <p v-if="formData.errorMessage.value" class="c-adminInput__error">{{ formData.errorMessage.value }}</p>
                        </div>
                    </div>
                    <div class="p-accountAddBtn">
                        <button type="submit" class="c-adminBtnAdd">登録</button>
                    </div>
                </form>
            </div>
        </section>
    </NuxtLayout>
</template>

<style scoped lang="scss">
.p-accountAdd {
    &Input {
        display: flex;
        flex-direction: column;
        gap: 3rem;
        margin-bottom: 4rem;
    }

    &Btn {
        display: flex;
        gap: 2rem;
    }
}
</style>
