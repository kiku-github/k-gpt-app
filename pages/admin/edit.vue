<script setup lang="ts">
import { getAuth } from 'firebase/auth';
import { Category } from '@/types/blog';
definePageMeta({
    layout: false,
    middleware: 'auth',
});
useHead({
    title: 'ブログ作成',
});
const { data: categories } = useFetch<Category[]>('/api/category');
const { loading, uploadImageToFirebase } = useImage();
const auth = getAuth();
const user = auth.currentUser;
const blogData = {
    title: ref(''),
    generateText: ref(''),
    img: ref(''),
    userEmail: ref(''),
    published: ref(false),
    categories: ref(''),
};
const keyword = ref('');
const imgPreview = ref('');

onMounted(() => {
    if (user !== null) {
        blogData.userEmail.value = user.email || '';
    }
});
const router = useRouter();
const goBack = () => {
    router.back();
};
const handleChange = async (e: Event) => {
    const inputElement = e.target as HTMLInputElement;
    const files = inputElement.files;

    try {
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type.match(/^image\/(png|jpeg|webp)$/)) {
                loading.img.value = true;
                const imageUrl = await uploadImageToFirebase(file);
                imgPreview.value = imageUrl;
                blogData.img.value = imageUrl;
                loading.img.value = false;
            }
        }
    } catch (error) {
        loading.img.value = false;
    }
};

const prompt = computed(() => `
    日本語で回答してください。${keyword.value}について230文字程度で完結するように記事を作成してください。
`);

const handleClick = async () => {
    try {
        loading.txt.value = true;
        const { data } = await useFetch('/api/generate', {
            method: 'POST',
            body: {
                prompt: prompt.value,
            },
        });
        blogData.generateText.value = data.value.choices[0].text;
    } catch (error) {
    } finally {
        loading.txt.value = false;
    }
};

const fileInput = ref<HTMLInputElement | null>(null);
const clearImage = () => {
    blogData.img.value = '';
    imgPreview.value = '';
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

const addBlog = async () => {
    if (loading.up.value) {
        alert('画像のアップロードが完了するまでお待ちください。');
        return;
    }
    try {
        const { data } = await useFetch('/api/blog', {
            method: 'post',
            body: {
                title: blogData.title.value,
                generateText: blogData.generateText.value,
                img: blogData.img.value,
                userEmail: blogData.userEmail.value,
                published: blogData.published.value,
                categoryId: blogData.categories.value,
            },
        });
        return navigateTo('/admin', { replace: true });
    } catch (error) {
    }
};
</script>

<template>
    <NuxtLayout name="admin">
        <section class="p-blogsAdd">
            <div class="c-adminTtl">
                <h1 class="c-adminTtl__txt">ブログ作成</h1>
            </div>
            <div class="l-inner">
                <div class="p-blogsAddContent">
                    <div class="p-blogsAddContentList c-adminInput">
                        <label for="title" class="c-adminInput__label">タイトル</label>
                        <input v-model="blogData.title.value" type="text" id="title" class="c-adminInput__txt">
                    </div>
                    <div class="p-blogsAddContentList c-adminInput --select">
                        <label for="published" class="c-adminInput__label">状態</label>
                        <select v-model="blogData.published.value" id="published" class="c-adminInput__txt --select">
                            <option :value="true">公開</option>
                            <option :value="false">非公開</option>
                        </select>
                    </div>
                    <div class="p-blogsAddContentList c-adminInput --select">
                        <label for="category" class="c-adminInput__label">カテゴリー</label>
                        <select v-model="blogData.categories.value" id="category" class="c-adminInput__txt --select">
                            <option value="" disabled>選択してください</option>
                            <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name
                            }}</option>
                        </select>
                    </div>
                    <div class="p-blogsAddContentList c-adminInput">
                        <label for="img" class="c-adminInput__label">画像</label>
                        <input type="file" id="img" class="c-adminInput__file" v-on:change="handleChange" ref="fileInput">
                        <span v-if="loading.img.value" class="p-blogsAddContentListBtn__load"></span>
                        <div v-if="blogData.img.value" class="p-blogsAddContentListCancel">
                            <button class="c-adminBtnCancel" @click="clearImage">取り消し</button>
                        </div>
                    </div>
                    <div class="p-blogsAddContentList c-adminInput">
                        <label for="keyword" class="c-adminInput__label">キーワード</label>
                        <input v-model="keyword" type="text" id="keyword" class="c-adminInput__txt" placeholder="犬">
                        <p class="p-blogsAddContentList__note">キーワードを入力すると記事が生成されます。</p>
                        <div class="p-blogsAddContentListBtn">
                            <button type="button" class="c-adminBtnGenerate" @click="handleClick">ブログ生成</button>
                            <span v-if="loading.txt.value" class="p-blogsAddContentListBtn__load"></span>
                        </div>
                    </div>
                    <div class="p-blogsAddContentList c-adminInput --textarea">
                        <label for="generateText" class="c-adminInput__label">内容</label>
                        <textarea v-model="blogData.generateText.value" type="text" id="generateText"
                            class="c-adminInput__txt --textarea"></textarea>
                    </div>
                    <div class="p-blogsAddContentBtn">
                        <button @click="goBack" class="c-adminBtnBack">戻る</button>
                        <button type="button" class="c-adminBtnAdd" @click="addBlog">保存</button>
                    </div>
                </div>
                <h2 class="p-blogsAdd__head">プレビュー</h2>
                <div class="p-blogsAddPreview">
                    <h3 class="p-blogsAddPreview__ttl">{{ blogData.title.value }}</h3>
                    <div class="p-blogsAddPreview__img">
                        <div v-if="blogData.img.value"><img v-bind:src="blogData.img.value"></div>
                    </div>
                    <p class="p-blogsAddPreview__txt" v-html="generateTextWithLineBreaks(blogData.generateText.value)"></p>
                </div>
            </div>
        </section>
    </NuxtLayout>
</template>

<style scoped lang="scss">
.p-blogsAdd {
    &Content {
        margin-bottom: 5rem;
        padding: 3rem;
        border-radius: 5px;
        box-shadow: 1px 1px 5px 1px rgba($color: #000000, $alpha: .2);

        &List {
            margin-bottom: 2rem;

            &:nth-of-type(4) {
                margin-bottom: 4rem;
            }

            &Cancel {
                padding-top: .5rem;
            }

            &__note {
                padding: .5rem 0 1rem .5rem;
                font-size: 1.2rem;
            }

            &Btn {
                display: flex;
                align-items: center;
                gap: 2rem;

                &__load {
                    display: block;
                    box-sizing: border-box;
                    width: 30px;
                    height: 30px;
                    border-radius: 100%;
                    border: 4px solid $colorMain;
                    border-top-color: $colorSub;
                    animation: spin 1s infinite linear;
                }
            }
        }

        &Btn {
            display: flex;
            gap: 2rem;
        }
    }

    &__head {
        display: inline-block;
        margin-bottom: 2rem;
        padding: .8rem 2rem;
        background: $colorBtn;
        border-radius: 10px;
        font-size: 1.6rem;
        color: #fff;
    }

    &Preview {
        padding: 3rem;
        border-radius: 5px;
        box-shadow: 1px 1px 5px 1px rgba($color: #000000, $alpha: .2);

        &__ttl {
            margin-bottom: 2rem;
            font-size: 2rem;
        }

        &__img {
            max-width: 500px;
            margin: 0 auto;

            & img {
                max-width: 500px;
                margin-bottom: 2rem;
                aspect-ratio: 3 / 2;
                object-fit: cover;
                object-position: center;
            }
        }

        &__txt {
            font-size: 1.6rem;
        }
    }
}

@keyframes spin {
    100% {
        transform: rotate(360deg);
    }
}
</style>