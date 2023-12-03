<script setup lang="ts">
import { Category } from '@/types/blog';
definePageMeta({
    layout: false,
    middleware: 'auth',
});
useHead({
    title: 'カテゴリー',
});
const { data: categories, refresh } = useFetch<Category[]>('/api/category');
const category = ref('');
const operationMessage = ref('');

const addCategory = async () => {
    try {
        const { data } = await useFetch('/api/category', {
            method: 'post',
            body: {
                name: category.value,
            },
        });
        await refresh();
        category.value = '';
    } catch (error) {
    }
};

const editCategory = async (categoryId: number, newName: string) => {
    try {
        const { data } = await useFetch(`/api/category/`, {
            method: 'put',
            body: {
                id: categoryId,
                name: newName,
            },
        });
        await refresh();
        operationMessage.value = 'カテゴリー名が変更されました。';
        clearMessageAfterDelay();
    } catch (error) {
    }
};

const deleteCategory = async (categoryId: number) => {
    try {
        const { data } = await useFetch('/api/category', {
            method: 'delete',
            body: {
                id: categoryId,
            },
        });
        await refresh();
    } catch (error) {
    }
};

const clearMessageAfterDelay = () => {
    setTimeout(() => {
        operationMessage.value = '';
    }, 1000);
}
</script>

<template>
    <NuxtLayout name="admin">
        <section class="p-category">
            <div class="c-adminTtl">
                <h1 class="c-adminTtl__txt">カテゴリー</h1>
            </div>
            <div class="l-inner">
                <div class="p-categoryAdd">
                    <input v-model="category" placeholder="新しいカテゴリー名" class="p-categoryInput c-adminInput__txt">
                    <button @click="addCategory" class="p-categoryAdd__btn c-adminBtnAdd">追加</button>
                </div>
                <transition name="fade">
                    <p v-if="operationMessage" class="p-categoryMessage">{{ operationMessage }}</p>
                </transition>
                <ul class="p-categoryList">
                    <li v-for="category in categories" :key="category.id" class="p-categoryListItem">
                        <input v-model="category.name" class="p-categoryInput c-adminInput__txt">
                        <button @click="editCategory(category.id, category.name)"
                            class="p-categoryListItem__btn c-adminBtnBack">変更</button>
                        <button @click="deleteCategory(category.id)"
                            class="p-categoryListItem__btn c-adminBtnDelete">削除</button>
                    </li>
                </ul>
            </div>
        </section>
    </NuxtLayout>
</template>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.p-category {
    &Message {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100vw;
        padding: 2rem 0;
        background: $colorSub;
        font-size: 1.6rem;
        letter-spacing: .05em;
        color: #fff;
        text-align: center;
        transform: translateY(-50%);
        z-index: 9999;
    }

    &Add {
        display: flex;
        gap: 2rem;
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid $colorGray;

        @media (max-width: ($sp)) {
            gap: 1rem;
        }

        &__btn {
            @media (max-width: ($sp)) {
                padding: .5rem 4rem;
            }
        }
    }

    &Input {
        max-width: 200px;
        letter-spacing: .05em;
    }

    &List {
        display: flex;
        flex-direction: column;
        gap: 2rem;

        &Item {
            display: flex;
            gap: 2rem;

            @media (max-width: ($sp)) {
                gap: 1rem;
            }

            &__btn {
                padding: .5rem 1rem;
            }
        }
    }
}
</style>