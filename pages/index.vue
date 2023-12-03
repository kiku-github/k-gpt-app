<script setup lang="ts">
import { Blog, Category } from '@/types/blog';
definePageMeta({
    layout: false,
    middleware: 'login',
});
useHead({
    meta: [
        { name: 'description', content: '「GPT-APP」は簡単なキーワード入力で、ブログ記事が生成されます。ブログ執筆が簡単で効率的です。' },
        { property: 'og:title', content: 'GPT-APP' },
        { property: 'og:description', content: '「GPT-APP」は簡単なキーワード入力で、ブログ記事が生成されます。ブログ執筆が簡単で効率的です。' },
        { property: 'og:type', content: 'website' },
    ],
});

const { data: blogs, refresh } = useFetch<Blog[]>('/api/blog');
const { data: categories } = useFetch<Category[]>('/api/category');
const route = useRoute();
const { limitedPageNumbers, currentPage, sortedBlogs, totalPages, displayedPublishedBlogs, changePage } = usePagenate();
const searchData = {
    searchTerm: ref(''),
    status: ref(''),
};

onBeforeMount(() => {
    if (route.query.page) {
        currentPage.value = parseInt(route.query.page as string, 10);
    }
});

onMounted(async () => {
    await refresh();
    const fetchedBlogs = blogs.value || [];
    sortedBlogs.value = (fetchedBlogs as Blog[])
        .filter(blog => blog.published)
        .slice()
        .sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
});

const search = () => {
    filterByCategory();
    let filteredBlogs = (blogs.value ?? []).slice();
    if (sortedBlogs.value.length > 0) {
        filteredBlogs = sortedBlogs.value;
    }

    sortedBlogs.value = filteredBlogs.filter(blog => {
        const searchTermMatch = blog.title.includes(searchData.searchTerm.value) || blog.generateText.includes(searchData.searchTerm.value);
        const statusMatch = searchData.status.value === '' || (blog.published && searchData.status.value === '公開') || (!blog.published && searchData.status.value === '非公開');
        return searchTermMatch && statusMatch;
    });

    sortedBlogs.value.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    currentPage.value = 1;
};

const getCategoryNameById = (categoryId: number): string => {
    const category = categories.value?.find((category) => category.id === categoryId);
    return category?.name || '';
};

const selectedCategory = ref('');
const selectCategory = (category: string) => {
    searchData.searchTerm.value = '';
    selectedCategory.value = category;
    filterByCategory();
};

const filterByCategory = () => {
    if (selectedCategory.value) {
        const categoryName = selectedCategory.value;
        const selectedCategoryId = categories.value?.find(category => category.name === categoryName)?.id;

        if (selectedCategoryId !== undefined) {
            sortedBlogs.value = (blogs.value || []).filter(blog => blog.categoryId === selectedCategoryId);
            sortedBlogs.value.sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
        }
        currentPage.value = 1;
    } else {
        sortedBlogs.value = (blogs.value || []).slice().sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        currentPage.value = 1;
    }
};

const clearFilters = () => {
    searchData.searchTerm.value = '';
    searchData.status.value = searchData.status.value ?? '';
    selectedCategory.value = '';

    const filteredBlogs = (blogs.value || []).filter(blog => blog.published);

    sortedBlogs.value = filteredBlogs.slice().sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    currentPage.value = 1;
};
</script>

<template>
    <NuxtLayout name="default">
        <section class="p-blog">
            <div class="l-inner --center">
                <ul class="p-blogCategory">
                    <li v-for="category in categories" :key="category.id" class="p-blogCategoryList">
                        <button @click="selectCategory(category.name)"
                            :class="{ active: category.name === selectedCategory }" class="p-blogCategoryList__item">
                            {{ category.name }}
                        </button>
                    </li>
                </ul>
                <form class="p-blogSearch" @submit.prevent="search">
                    <div class="p-blogSearch__inner">
                        <img src="~/assets/image/common/search.png" class="p-blogSearch__btn" @click="search" />
                        <input type="text" id="search" class="p-blogSearch__input" placeholder="キーワードで検索"
                            v-model="searchData.searchTerm.value">
                    </div>
                    <button type="button" class="p-blogSearch__cancel" @click="clearFilters">絞り込み解除</button>
                </form>
                <ul class="p-blogList">
                    <li class="p-blogListItem" v-for="blog in displayedPublishedBlogs" :key="blog.id">
                        <NuxtLink :to="frontLink(blog.id)" class="p-blogListItemLink">
                            <div class="p-blogListItemLinkImg">
                                <div v-if="blog.img">
                                    <img v-bind:src="blog.img" class="p-blogListItemLinkImg__file">
                                </div>
                                <div v-else class="p-blogListItemLinkImg__placeholder">
                                    no image
                                </div>
                            </div>
                            <div class="p-blogListItemLink__inner">
                                <h2 class="p-blogListItemLink__head">
                                    {{ blog.title }}
                                </h2>
                                <p class="p-blogListItemLink__txt">
                                    {{ blog.generateText }}
                                </p>
                                <p class="p-blogListItemLink__date">
                                    {{ formatDateShort(blog.createdAt.toString()) }}
                                </p>
                                <p class="p-blogListItemLink__cat"
                                    v-if="blog.categoryId !== null && blog.categoryId !== undefined">
                                    {{ getCategoryNameById(blog.categoryId) }}
                                </p>
                            </div>
                        </NuxtLink>
                    </li>
                </ul>
                <div class="c-adminPager p-blogPager" v-if="sortedBlogs.length > 1">
                    <ul class="c-adminPagerList">
                        <li class="c-adminPagerListItem">
                            <a class="c-adminPagerListItem__link p-blogPager__link" @click="changePage(1)"
                                :class="{ disabled: currentPage <= 2 || totalPages === 3 }">1</a>
                        </li>
                        <li class="c-adminPagerListItem">
                            <p class="c-adminPagerListItem__link p-blogPager__link --noLink"
                                :class="{ disabled: currentPage <= 2 || totalPages === 3 || totalPages === 4 }">...</p>
                        </li>
                        <li class="c-adminPagerListItem" v-for="page in limitedPageNumbers" :key="page">
                            <a class="c-adminPagerListItem__link p-blogPager__link" @click="changePage(page)"
                                :class="{ active: page === currentPage }">{{
                                    page }}</a>
                        </li>
                        <li class="c-adminPagerListItem">
                            <p class="c-adminPagerListItem__link p-blogPager__link --noLink"
                                :class="{ disabled: currentPage === totalPages || currentPage === totalPages - 1 || currentPage === totalPages - 2 || totalPages === 4 }">
                                ...</p>
                        </li>
                        <li class="c-adminPagerListItem">
                            <a class="c-adminPagerListItem__link p-blogPager__link" @click="changePage(totalPages)"
                                :class="{ disabled: currentPage === totalPages || currentPage === totalPages - 1 || totalPages === 3 }">{{
                                    totalPages }}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    </NuxtLayout>
</template>

<style lang="scss" scoped>
.p-blog {
    padding-top: 2rem;

    @media (max-width: ($sp)) {
        padding-top: 0rem;
    }

    &Category {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 2rem;
        max-width: 800px;
        margin: 0 auto 3rem;

        @media (max-width: ($sp)) {
            grid-template-columns: repeat(2, 1fr);
            gap: .5rem;
            max-width: 400px;
            margin: 0 auto 1.5rem;
        }

        &List {
            width: 100%;
            max-width: 200px;

            &__item {
                width: 100%;
                padding: 1rem 0;
                background-color: rgba(189, 189, 189, .17);
                border-radius: 5px;
                font-size: 1.4rem;
                font-family: $fontRob;
                font-weight: 500;
                letter-spacing: .05em;
                color: #000;
                cursor: pointer;
                transition: .3s;

                @media (max-width: ($sp)) {
                    font-size: 1.2rem;
                }

                &:hover {
                    background: #4ea1d5;
                    color: #fff;

                    @media (max-width: ($ipro)) {
                        background-color: rgba(189, 189, 189, .17);
                        color: #000;
                    }
                }

                &.active {
                    background: #81b6d7;
                    color: #fff;
                }
            }
        }
    }

    &Search {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        box-sizing: border-box;

        @media (max-width: ($sp)) {
            max-width: 400px;
        }

        &__btn {
            position: absolute;
            top: 50%;
            right: 15px;
            width: 15px;
            height: 15px;
            transform: translateY(-50%);
            cursor: pointer;
            transition: .3s;

            &:hover {
                opacity: .7;

                @media (max-width: ($ipro)) {
                    opacity: 1;
                }
            }
        }

        &__inner {
            position: relative;
            width: 100%;
            margin-bottom: 1rem;
        }

        &__input {
            width: 100%;
            padding: 1rem 0 1rem 2rem;
            border-bottom: 1px solid #e1e1e1;
            box-sizing: border-box;

            @media (max-width: ($sp)) {
                padding: 1rem 0 1rem 1rem;
            }
        }

        &__cancel {
            font-size: 1.2rem;
            color: #797979;
            cursor: pointer;
            transition: .3s;

            @media (max-width: ($sp)) {
                font-size: 1rem;
            }

            &:hover {
                opacity: .7;

                @media (max-width: ($ipro)) {
                    opacity: 1;
                }
            }
        }
    }

    &List {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8rem 4rem;
        padding-top: 3rem;

        @media (max-width: ($ipro)) {
            grid-template-columns: repeat(2, 1fr);
            gap: 4rem 2rem;
            max-width: 800px;
            margin: 0 auto;
        }

        @media (max-width: ($sp)) {
            gap: 2rem 1rem;
        }

        &Item {
            width: 100%;
            max-width: 400px;
            border-radius: 10px;
            box-shadow: 0px 3px 18px 3px rgba(0, 0, 0, .08);

            &Link {
                position: relative;
                color: #000;
                transition: .3s;

                &:hover {
                    opacity: .6;

                    @media (max-width: ($ipro)) {
                        opacity: 1;
                    }
                }

                &__inner {
                    padding: 2rem;

                    @media (max-width: ($sp)) {
                        padding: 1rem;
                    }
                }

                &Img {
                    &__file {
                        border-radius: 10px 10px 0 0;
                        aspect-ratio: 5 / 3;
                        object-fit: cover;
                        object-position: center;
                    }

                    &__placeholder {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background: $colorGray;
                        border-radius: 10px 10px 0 0;
                        font-size: 2.6rem;
                        font-weight: 500;
                        color: #fff;
                        aspect-ratio: 5 / 3;

                        @media (max-width: ($sp)) {
                            font-size: 1.6rem;
                        }
                    }
                }

                &__head {
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    height: 56px;
                    margin-bottom: 1rem;
                    font-size: 2rem;
                    overflow: hidden;

                    @media (max-width: ($sp)) {
                        height: 42px;
                        font-size: 1.4rem;
                    }
                }

                &__txt {
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                    height: 72px;
                    margin-bottom: 1.5rem;
                    font-size: 1.6rem;
                    overflow: hidden;

                    @media (max-width: ($sp)) {
                        display: none;
                    }
                }

                &__date {
                    font-size: 1.4rem;
                    font-weight: bold;
                    color: $colorGray;
                    text-align: right;

                    @media (max-width: ($sp)) {
                        font-size: 1rem;
                    }
                }

                &__cat {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    padding: 0.1rem .8rem;
                    background: #4ea1d5;
                    border-radius: 10px;
                    font-size: 1.2rem;
                    font-family: $fontRob;
                    letter-spacing: 0.05em;
                    color: #fff;

                    @media (max-width: ($sp)) {
                        top: 5px;
                        left: 5px;
                        font-size: 1rem;
                    }
                }
            }
        }
    }

    &Pager {
        justify-content: center;
        padding-top: 5rem;

        @media (max-width: ($sp)) {
            padding-top: 3rem;
        }

        &__link {
            width: 30px;
            height: 30px;
            margin: 0 1rem;
            font-size: 1.6rem;

            @media (max-width: ($sp)) {
                width: 25px;
                height: 25px;
                font-size: 1.4rem;
            }
        }
    }
}
</style>