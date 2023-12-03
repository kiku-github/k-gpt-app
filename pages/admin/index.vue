<script setup lang="ts">
import { Blog , Category } from '@/types/blog';
definePageMeta({
    layout: false,
    middleware: 'auth',
});
useHead({
    title: 'ブログ一覧',
});

const { limitedPageNumbers , currentPage , sortedBlogs , totalPages , itemsPerPage, displayedBlogs , changePage } = usePagenate();
const route = useRoute();
const { data: blogs, refresh } = useFetch<Blog[]>('/api/blog');
const { data: categories } = useFetch<Category[]>('/api/category');
onBeforeMount(() => {
    if (route.query.page) {
        currentPage.value = parseInt(route.query.page as string, 10);
    }
});

onMounted(async () => {
    await refresh();
    const fetchedBlogs = blogs.value || [];
    sortedBlogs.value = (fetchedBlogs as Blog[])
        .slice()
        .sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
});

const searchData = {
    title: ref(''),
    status: ref(''),
    content: ref(''),
    category: ref(''),
};

const search = () => {
    sortedBlogs.value = (blogs.value ?? []).slice().filter(blog => {
        const titleMatch = blog.title.includes(searchData.title.value);
        const contentMatch = blog.generateText.includes(searchData.content.value);
        const statusMatch = searchData.status.value === '' || (blog.published && searchData.status.value === '公開') || (!blog.published && searchData.status.value === '非公開');
        const categoryMatch = searchData.category.value === '' || blog.categoryId === parseInt(searchData.category.value);

        return titleMatch && statusMatch && contentMatch && categoryMatch;
    });
    sortedBlogs.value.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    currentPage.value = 1;
};

const clearFilters = () => {
    searchData.title.value = '';
    searchData.status.value = '';
    searchData.content.value = '';
    searchData.category.value = '';

    sortedBlogs.value = (blogs.value ?? []).slice();
    sortedBlogs.value.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    currentPage.value = 1;
};

const displayPublishedStatus = (published: boolean) => {
    return published ? '公開' : '非公開';
};

const getCategoryNameById = (categoryId: number): string => {
    const category = categories.value?.find((category) => category.id === categoryId);
    return category?.name || '';
};
</script>

<template>
    <NuxtLayout name="admin">
        <section>
            <div class="c-adminTtl">
                <h1 class="c-adminTtl__txt">ブログ一覧</h1>
                <NuxtLink to="/admin/edit" class="c-adminBtn">
                    <img src="~/assets/image/common/add.png" class="c-adminBtn__img" alt="新規追加アイコン">
                    <span>新規追加</span>
                </NuxtLink>
            </div>
            <div class="l-inner --w100">
                <form class="c-adminInputSearch">
                    <div class="c-adminInput__inner">
                        <div class="c-adminInput --select">
                            <label for="status" class="c-adminInput__label">状態</label>
                            <select id="status" class="c-adminInput__txt --select" v-model="searchData.status.value">
                                <option value=""></option>
                                <option value="公開">公開</option>
                                <option value="非公開">非公開</option>
                            </select>
                        </div>
                        <div class="c-adminInput">
                            <label for="title" class="c-adminInput__label">タイトル</label>
                            <input type="text" id="title" class="c-adminInput__txt" v-model="searchData.title.value">
                        </div>
                        <div class="c-adminInput">
                            <label for="content" class="c-adminInput__label">内容</label>
                            <input type="text" id="content" class="c-adminInput__txt" v-model="searchData.content.value">
                        </div>
                        <div class="c-adminInput --select">
                            <label for="content" class="c-adminInput__label">カテゴリー</label>
                            <select v-model="searchData.category.value" id="category" class="c-adminInput__txt --select">
                                <option value="" disabled>選択してください</option>
                                <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="c-adminBtnWrap">
                        <button type="button" class="c-adminBtnAdd" @click="search">検索</button>
                        <button type="button" class="c-adminBtnBack" @click="clearFilters">リセット</button>
                    </div>
                </form>
                <div class="c-adminPager" v-if="sortedBlogs.length > 0">
                    <p class="c-adminPager__txt">
                        全 {{ sortedBlogs.length }} 件中｜
                        {{ (currentPage - 1) * itemsPerPage + 1 }}件～{{ Math.min(currentPage * itemsPerPage,sortedBlogs.length) }} 件を表示
                    </p>
                    <ul class="c-adminPagerList">
                        <li class="c-adminPagerListItem">
                            <a class="c-adminPagerListItem__link" @click="changePage(1)"
                                :class="{ disabled: currentPage <= 2 || totalPages === 3 }">1</a>
                        </li>
                        <li class="c-adminPagerListItem">
                            <p class="c-adminPagerListItem__link --noLink"
                                :class="{ disabled: currentPage <= 2 || totalPages === 3 || totalPages === 4 }">...</p>
                        </li>
                        <li class="c-adminPagerListItem" v-for="page in limitedPageNumbers" :key="page">
                            <a class="c-adminPagerListItem__link" @click="changePage(page)"
                                :class="{ active: page === currentPage }">{{ page }}</a>
                        </li>
                        <li class="c-adminPagerListItem">
                            <p class="c-adminPagerListItem__link --noLink"
                                :class="{ disabled: currentPage === totalPages || currentPage === totalPages - 1 || currentPage === totalPages - 2 || totalPages === 4 }">
                                ...</p>
                        </li>
                        <li class="c-adminPagerListItem">
                            <a class="c-adminPagerListItem__link" @click="changePage(totalPages)"
                                :class="{ disabled: currentPage === totalPages || currentPage === totalPages - 1 || totalPages === 3 }">{{
                                    totalPages }}</a>
                        </li>
                    </ul>
                </div>
                <div class="c-adminListWrap">
                    <ul class="c-adminList">
                        <li class="c-adminList__item --min">ID</li>
                        <li class="c-adminList__item --min">状態</li>
                        <li class="c-adminList__item --min">カテゴリー</li>
                        <li class="c-adminList__item --ttl">タイトル</li>
                        <li class="c-adminList__item --middle">画像</li>
                        <li class="c-adminList__item">内容</li>
                        <li class="c-adminList__item --middle">アカウント</li>
                        <li class="c-adminList__item --middle">作成日</li>
                    </ul>
                    <ul class="c-adminList --content" v-for="blog in displayedBlogs" :key="blog.id">
                        <li class="c-adminList__item --content --min">
                            <NuxtLink :to="adminLink(blog.id)" class="c-adminList__link">
                                {{ blog.id }}
                            </NuxtLink>
                        </li>
                        <li class="c-adminList__item --content --min">
                            <span :class="{ 'release': blog.published, 'private': !blog.published }">
                                {{ displayPublishedStatus(blog.published) }}
                            </span>
                        </li>
                        <li class="c-adminList__item --content --min">
                            {{ getCategoryNameById(blog.categoryId) }}
                        </li>
                        <li class="c-adminList__item --content --txt --ttl">
                            {{ blog.title }}
                        </li>
                        <li class="c-adminList__item --content --middle --img">
                            <div v-if="blog.img">
                                <img v-bind:src="blog.img">
                            </div>
                            <div v-else class="c-adminList__img">
                            </div>
                        </li>
                        <li class="c-adminList__item --content --txt">
                            {{ blog.generateText }}
                        </li>
                        <li class="c-adminList__item --content --middle">
                            {{ blog.userEmail }}
                        </li>
                        <li class="c-adminList__item --content --middle">
                            {{ formatDate(blog.createdAt.toString()) }}
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    </NuxtLayout>
</template>