<script setup lang="ts">
import { Blog, Category } from '@/types/blog';
definePageMeta({
    layout: false,
    middleware: 'login',
});

const { data: blogs, refresh } = useFetch<Blog[]>('/api/blog');
const { data: categories } = useFetch<Category[]>('/api/category');
const route = useRoute();
const blogId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
const selectedBlog = ref<Blog | null>(null);

onMounted(async () => {
    await refresh();
    await blogs.value;

    if (Array.isArray(blogs.value)) {
        selectedBlog.value = blogs.value.find(blog => blog.id === parseInt(blogId)) as Blog;
        if (selectedBlog.value) {
            selectedBlog.value.published = selectedBlog.value.published === true;
        }
    }
});

const dynamicTitle = computed(() => {
    const blogTitle = selectedBlog.value ? String(selectedBlog.value.title) : '';
    return blogTitle ? blogTitle : '';
});
const ogpTitle = computed(() => {
    const blogTitle = selectedBlog.value ? String(selectedBlog.value.title) : '';
    return blogTitle ? `${blogTitle} - GPT-APP` : 'GPT-APP';
});
const dynamicDescription = computed(() => {
    if (selectedBlog.value) {
        const generateText = generateTextWithLineBreaks(selectedBlog.value.generateText);
        const plainText = generateText.replace(/<br>/g, ' ').replace(/<[^>]*>/g, '');
        return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;
    }
    return '';
});

useHead({
    title: dynamicTitle,
    meta: [
        { name: 'description', content: dynamicDescription },
        { property: 'og:title', content: ogpTitle },
        { property: 'og:description', content: dynamicDescription },
        { property: 'og:type', content: 'article' },
    ],
});

const getCategoryNameById = (categoryId: number): string => {
    const category = categories.value?.find((category) => category.id === categoryId);
    return category?.name || '';
};

const latestBlogs = computed(() => {
    if (Array.isArray(blogs.value) && blogs.value.length > 0) {
        const sortedBlogs = blogs.value.slice().sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        const visibleBlogs = sortedBlogs.filter(blog => blog.published);
        return visibleBlogs.slice(0, 4);
    }
    return [];
});
const relatedBlogs = computed(() => {
    if (Array.isArray(blogs.value)) {
        const categoryId = selectedBlog.value!.categoryId;

        const filteredBlogs = blogs.value.filter(blog => blog.categoryId === categoryId && blog.published && blog.categoryId !== null);

        const sortedBlogs = filteredBlogs.slice().sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        return sortedBlogs.slice(0, 4);
    }

    return [];
});

const articleUrl = ref(typeof window !== 'undefined' ? `${window.location.origin}${route.fullPath}` : '');
const encodedUrl = encodeURIComponent(articleUrl.value);
const encodedTitle = encodeURIComponent(dynamicTitle.value);

const twitterShareUrl = computed(() => {
    return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
});

const facebookShareUrl = computed(() => {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
});

const router = useRouter();
const prevBlog = computed(() => {
    if (Array.isArray(blogs.value)) {
        const visibleBlogs = blogs.value.filter(blog => blog.published);

        const currentIndex = visibleBlogs.findIndex(blog => blog.id === selectedBlog.value!.id);
        return currentIndex > 0 ? visibleBlogs[currentIndex - 1] : null;
    }
    return null;
});

const nextBlog = computed(() => {
    if (Array.isArray(blogs.value)) {
        const visibleBlogs = blogs.value.filter(blog => blog.published);

        const currentIndex = visibleBlogs.findIndex(blog => blog.id === selectedBlog.value!.id);
        return currentIndex < visibleBlogs.length - 1 ? visibleBlogs[currentIndex + 1] : null;
    }
    return null;
});

const navigateToBlog = (blogId: number) => {
    router.push(`/${blogId}`);
};
</script>

<template>
    <NuxtLayout name="default">
        <section class="p-blogDetail">
            <div v-if="selectedBlog" class="l-inner --center p-blogDetail__inner">
                <div class="p-blogDetail__wrap">
                    <p class="p-blogDetail__date">
                        {{ formatDateShort(selectedBlog.createdAt.toString()) }}
                    </p>
                    <p class="p-blogDetail__cat" v-if="selectedBlog.categoryId">
                        {{ getCategoryNameById(selectedBlog.categoryId) }}
                    </p>
                    <h2 class="p-blogDetail__head">
                        {{ selectedBlog.title }}
                    </h2>
                    <div class="p-blogDetailImg">
                        <div v-if="selectedBlog && selectedBlog.img">
                            <img :src="selectedBlog.img" alt="選択された画像" />
                        </div>
                        <div v-else class="p-blogDetailImg__placeholder">
                        </div>
                    </div>
                    <p class="p-blogDetail__txt" v-html="generateTextWithLineBreaks(selectedBlog.generateText)"></p>
                    <div class="p-blogDetailSns">
                        <a :href="twitterShareUrl" target="_blank"><img src="~/assets/image/common/x.png" alt="X"
                                class="p-blogDetailSns__x" /></a>
                        <a :href="facebookShareUrl" target="_blank"><img src="~/assets/image/common/facebook.png" alt="X"
                                class="p-blogDetailSns__facebook" /></a>
                    </div>
                    <div class="p-blogDetailBtn">
                        <NuxtLink to="/" class="p-blogDetailBtn__back c-adminBtnBack">一覧へ戻る</NuxtLink>
                    </div>
                    <button v-if="prevBlog" @click="navigateToBlog(prevBlog.id)" class="p-blogDetailBtnPrev">前の記事へ</button>
                    <button v-if="nextBlog" @click="navigateToBlog(nextBlog.id)" class="p-blogDetailBtnNext">次の記事へ</button>
                </div>
                <div class="p-blogDetailListWrap">
                    <div v-if="latestBlogs.length > 0" class="p-blogDetailList">
                        <h3 class="p-blogDetailList__title">新着記事</h3>
                        <div v-for="blog in latestBlogs" :key="blog.id" class="p-blogDetailListItem">
                            <NuxtLink :to="`/${blog.id}`" class="p-blogDetailListItem__link">
                                <div class="p-blogDetailListItemImg">
                                    <div v-if="blog.img">
                                        <img :src="blog.img" alt="記事画像" class="p-blogDetailListItemImg__file">
                                    </div>
                                    <div v-else class="p-blogDetailListItemImg__placeholder">
                                        no image
                                    </div>
                                </div>
                                <div>
                                    <p class="p-blogDetailListItem__date">{{
                                        formatDateShort(selectedBlog.createdAt.toString()) }}</p>
                                    <h4 class="p-blogDetailListItem__title">
                                        {{ blog.title }}
                                    </h4>
                                </div>
                            </NuxtLink>
                        </div>
                    </div>
                    <div v-if="relatedBlogs.length > 0" class="p-blogDetailList">
                        <h3 class="p-blogDetailList__title">関連記事</h3>
                        <div v-for="blog in relatedBlogs" :key="blog.id" class="p-blogDetailListItem">
                            <NuxtLink :to="`/${blog.id}`" class="p-blogDetailListItem__link">
                                <div class="p-blogDetailListItemImg">
                                    <div v-if="blog.img">
                                        <img :src="blog.img" alt="記事画像" class="p-blogDetailListItemImg__file">
                                    </div>
                                    <div v-else class="p-blogDetailListItemImg__placeholder">
                                        no image
                                    </div>
                                </div>
                                <div>
                                    <p class="p-blogDetailListItem__cat">{{ getCategoryNameById(selectedBlog.categoryId) }}
                                    </p>
                                    <h4 class="p-blogDetailListItem__title">
                                        {{ blog.title }}
                                    </h4>
                                </div>
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </NuxtLayout>
</template>

<style scoped lang="scss">
.p-blogDetail {
    padding-top: 3rem;

    &__inner {
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        gap: 4rem;

        @media (max-width: ($ipro)) {
            flex-direction: column;
            gap: 6rem;
        }
    }

    &__wrap {
        position: relative;
        width: 100%;
        box-sizing: border-box;
        padding: 4rem;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0px 3px 18px 3px rgba(0, 0, 0, .08);

        @media (max-width: ($sp)) {
            padding: 4rem 2rem 8rem;
        }
    }

    &__date {
        margin-bottom: 2rem;
        font-size: 1.4rem;
        font-weight: bold;
        color: $colorGray;

        @media (max-width: ($sp)) {
            font-size: 1.2rem;
        }
    }

    &__cat {
        width: fit-content;
        margin-bottom: 1rem;
        padding: 0.1rem .8rem;
        background: #4ea1d5;
        border-radius: 10px;
        font-size: 1.2rem;
        font-family: $fontRob;
        letter-spacing: 0.05em;
        color: #fff;

        @media (max-width: ($sp)) {
            font-size: 1rem;
        }
    }

    &__head {
        margin-bottom: 3rem;
        font-size: 2.6rem;

        @media (max-width: ($sp)) {
            font-size: 2rem;
        }
    }

    &Img {
        max-width: 600px;
        margin: 0 auto 4rem;
    }

    &__txt {
        margin-bottom: 8rem;
        font-size: 1.6rem;
        line-height: 1.7;

        @media (max-width: ($sp)) {
            margin-bottom: 6rem;
            font-size: 1.4rem;
        }
    }

    &Btn {
        max-width: 130px;
        margin: 0 auto;

        &__back {
            padding: 1rem;
        }

        &Next {
            position: absolute;
            right: 40px;
            bottom: 25px;
            padding-right: 15px;
            font-size: 1.4rem;
            color: #000;
            cursor: pointer;
            transition: .3s;

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
                right: 0;
                width: 6px;
                height: 6px;
                border-bottom: 2px solid #000;
                border-right: 2px solid #000;
                transform: translateY(-50%) rotate(-45deg);
            }
        }

        &Prev {
            position: absolute;
            left: 40px;
            bottom: 25px;
            padding-left: 15px;
            font-size: 1.4rem;
            color: #000;
            cursor: pointer;
            transition: .3s;

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
                left: 0;
                width: 6px;
                height: 6px;
                border-bottom: 2px solid #000;
                border-right: 2px solid #000;
                transform: translateY(-50%) rotate(135deg);
            }
        }
    }

    &Sns {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 2rem;
        margin-bottom: 1rem;

        &__x {
            width: 20px;
            transition: .3;

            &:hover {
                opacity: .7;

                @media (max-width: ($ipro)) {
                    opacity: 1;
                }
            }
        }

        &__facebook {
            width: 25px;
            transition: .3s;

            &:hover {
                opacity: .7;

                @media (max-width: ($ipro)) {
                    opacity: 1;
                }
            }
        }
    }

    &List {
        width: 100%;
        max-width: 250px;
        min-width: 250px;

        @media (max-width: ($ipro)) {
            max-width: 600px;
            margin: 0 auto;
        }

        &Wrap {
            display: flex;
            flex-direction: column;
            gap: 3.5rem;
            margin: 0 auto;
        }

        &__title {
            margin-bottom: 1.5rem;
            font-size: 2rem;
        }

        &Item {
            padding-bottom: 2rem;
            border-bottom: 1px solid $colorGray;

            &:not(:last-of-type) {
                margin-bottom: 2rem;
            }

            &__link {
                display: flex;
                gap: 1rem;
                color: #000;
                transition: .3s;

                &:hover {
                    opacity: .5;

                    @media (max-width: ($ipro)) {
                        opacity: 1;
                    }
                }
            }

            &__title {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                font-size: 1.4rem;
                font-weight: 500;
                overflow: hidden;

                @media (max-width: ($ipro)) {
                    -webkit-line-clamp: 3;
                }
            }

            &__date {
                display: block;
                margin-bottom: .5rem;
                font-size: 1rem;
                font-weight: 400;
                color: $colorGray;
            }

            &__cat {
                display: block;
                width: fit-content;
                margin-bottom: .5rem;
                padding: 0 .5rem;
                font-size: 1rem;
                font-weight: 400;
                background: #4ea1d5;
                border-radius: 10px;
                color: #fff;
            }

            &Img {
                width: 100%;
                max-width: 120px;
                min-width: 120px;

                @media (max-width: ($ipro)) {
                    max-width: 150px;
                    min-width: 150px;
                }

                &__file {
                    aspect-ratio: 5/3;
                    -o-object-fit: cover;
                    object-fit: cover;
                    -o-object-position: center;
                    object-position: center;
                }

                &__placeholder {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: $colorGray;
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: #fff;
                    aspect-ratio: 5/3;
                }
            }
        }
    }
}
</style>