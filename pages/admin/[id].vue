<script setup lang="ts">
import { getAuth } from 'firebase/auth';
import { Blog, Category } from '@/types/blog';
definePageMeta({
    layout: false,
    middleware: 'auth',
});
useHead({
    title: 'ブログ編集',
});
const { data: blogs, refresh } = useFetch<Blog[]>('/api/blog');
const { data: categories } = useFetch<Category[]>('/api/category');
const { loading, uploadImageToFirebase } = useImage();
const route = useRoute();
const blogId = route.params.id as string;
const auth = getAuth();
const user = auth.currentUser;
const selectedBlog = ref<Blog | null>(null);
const img = ref('');
const userEmail = ref('');

onMounted(async () => {
    await refresh();
    if (blogs.value) {
        selectedBlog.value = (blogs.value as unknown as Blog[]).find(blog => blog.id === parseInt(blogId)) || null;
    }
    if (user !== null) {
        userEmail.value = user.email || '';
    }
});

const handleChange = async (e: Event) => {
    const inputElement = e.target as HTMLInputElement;
    const files = inputElement.files;

    try {
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type.match(/^image\/(png|jpeg|webp)$/)) {
                loading.img.value = true;
                const imageUrl = await uploadImageToFirebase(file);
                img.value = imageUrl;
                if (selectedBlog.value) {
                    selectedBlog.value.img = img.value;
                }
                loading.img.value = false;
            }
        }
    } catch (error) {
        loading.img.value = false;
    }
};

const fileInput = ref<HTMLInputElement | null>(null);
const clearImage = () => {
    if (selectedBlog.value) {
        selectedBlog.value.img = '';
    }
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

const editBlog = async () => {
    if (loading.up.value) {
        alert('画像のアップロードが完了するまでお待ちください。');
        return;
    }
    try {
        if (selectedBlog.value) {
            const { data } = await useFetch('/api/blog', {
                method: 'put',
                body: {
                    id: selectedBlog.value.id,
                    title: selectedBlog.value.title,
                    generateText: selectedBlog.value.generateText,
                    img: selectedBlog.value.img,
                    userEmail: userEmail.value,
                    published: selectedBlog.value.published,
                    categoryId: selectedBlog.value.categoryId,
                },
            });
            return navigateTo('/admin', { replace: true });
        } else {
        }
    } catch (error) {
    }
};

const deleteBlog = async () => {
    try {
        if (selectedBlog.value) {
            const { data } = await useFetch(`/api/blog`, {
                method: 'delete',
                body: {
                    id: selectedBlog.value.id,
                },
            });
            return navigateTo('/admin', { replace: true });
        }
    } catch (error) {
    }
};

const router = useRouter();
const goBack = () => {
    router.back();
};
</script>

<template>
    <NuxtLayout name="admin">
        <section class="p-blogEdit">
            <div class="c-adminTtl">
                <h1 class="c-adminTtl__txt">ブログ編集</h1>
            </div>
            <div class="l-inner --w100" v-if="selectedBlog">
                <div class="p-blogEditTop">
                    <div class="c-adminInput">
                        <label for="title" class="c-adminInput__label">タイトル</label>
                        <input type="text" id="title" class="c-adminInput__txt" v-model="selectedBlog.title">
                    </div>
                    <div class="c-adminInput --select">
                        <label for="status" class="c-adminInput__label">状態</label>
                        <select id="status" class="c-adminInput__txt --select" v-model="selectedBlog.published">
                            <option :value="true">公開</option>
                            <option :value="false">非公開</option>
                        </select>
                    </div>
                    <div class="c-adminInput --select">
                        <label for="status" class="c-adminInput__label">カテゴリー</label>
                        <select id="category" class="c-adminInput__txt --select" v-model="selectedBlog.categoryId">
                            <option value="" disabled>選択してください</option>
                            <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name
                            }}</option>
                        </select>
                    </div>
                </div>
                <div class="p-blogEditImg c-adminInput">
                    <label for="img" class="c-adminInput__label">画像</label>
                    <div v-if="selectedBlog && selectedBlog.img" class="p-blogEditImg__preview">
                        <img :src="selectedBlog.img" alt="選択された画像" />
                        <button class="c-adminBtnCancel" @click="clearImage">取り消し</button>
                    </div>
                    <input type="file" id="img" class="c-adminInput__file" v-on:change="handleChange" ref="fileInput">
                    <span v-if="loading.img.value" class="p-blogEditImgBtn__load"></span>
                </div>
                <div class="p-blogEditContent c-adminInput">
                    <label for="title" class="c-adminInput__label">内容</label>
                    <textarea type="text" id="title" class="c-adminInput__txt p-blogEditContent__input"
                        v-model="selectedBlog.generateText"></textarea>
                </div>
                <div class="p-blogEditBtn">
                    <button @click="goBack" class="p-blogEditBtnBack">戻る</button>
                    <button type="button" class="c-adminBtnDelete p-blogEditBtn__item" @click="deleteBlog">削除</button>
                    <button type="button" class="c-adminBtnAdd p-blogEditBtn__item" @click="editBlog">保存</button>
                </div>
                <div class="p-blogEditDate">
                    <p class="p-blogEditDate__txt">作成日：{{ formatDate(selectedBlog.createdAt.toString()) }}</p>
                    <p class="p-blogEditDate__txt">更新日：{{ formatDate(selectedBlog.updatedAt.toString()) }}</p>
                </div>
            </div>
        </section>
    </NuxtLayout>
</template>

<style scoped lang="scss">
.p-blogEdit {
    &Top {
        display: flex;
        gap: 2rem;
        margin-bottom: 3rem;

        @media (max-width: ($sp)) {
            flex-direction: column;
            margin-bottom: 2rem;
        }
    }

    &Img {
        margin-bottom: 3rem;

        @media (max-width: ($sp)) {
            margin-bottom: 2rem;
        }

        &__preview {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
            padding: 1rem 0;
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

    &Content {
        max-width: 620px;
        margin-bottom: 3rem;

        &__input {
            height: 150px;
        }
    }

    &Btn {
        display: flex;
        gap: 2rem;
        margin-bottom: 5rem;

        @media (max-width: ($sp)) {
            flex-direction: column;
            gap: 3rem;
            max-width: 270px;
            margin: 0 auto 5rem;
        }

        &__item {
            @media (max-width: ($sp)) {
                padding: 1.3rem 0;
            }
        }

        &Back {
            position: relative;
            padding: 0 30px;
            text-align: center;
            font-size: 1.4rem;
            color: #000;
            cursor: pointer;
            transition: .3s;

            @media (max-width: ($sp)) {
                margin: 0 auto 2rem;
            }

            &:hover {
                opacity: .7;

                @media (max-width: ($ipro)) {
                    opacity: 1;
                }
            }

            &::before {
                position: absolute;
                content: "";
                top: 50%;
                left: 10px;
                width: 6px;
                height: 6px;
                border-bottom: 2px solid #000;
                border-right: 2px solid #000;
                transform: translateY(-60%) rotate(135deg);
            }
        }
    }

    &Date {
        display: flex;
        gap: 3rem;
        font-size: 1.2rem;

        @media (max-width: ($sp)) {
            flex-direction: column;
            gap: 1rem;
        }
    }
}

@keyframes spin {
    100% {
        transform: rotate(360deg);
    }
}
</style>