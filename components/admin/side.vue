<template>
    <nav class="l-side">
        <ul class="l-sideList">
            <li class="l-sideListItem">
                <NuxtLink to="/admin" class="l-sideListItemLink">
                    <img src="~/assets/image/common/article.png" class="l-sideListItemLink__img" alt="ブログ作成アイコン" />
                    <h2>ブログ一覧</h2>
                </NuxtLink>
            </li>
            <li class="l-sideListItem">
                <NuxtLink to="/admin/edit" class="l-sideListItemLink">
                    <img src="~/assets/image/common/blog.png" class="l-sideListItemLink__img" alt="ブログ作成アイコン" />
                    <h2>ブログ作成</h2>
                </NuxtLink>
            </li>
            <li class="l-sideListItem">
                <NuxtLink to="/admin/category" class="l-sideListItemLink">
                    <img src="~/assets/image/common/category.png" class="l-sideListItemLink__img" alt="カテゴリーアイコン" />
                    <h2>カテゴリー</h2>
                </NuxtLink>
            </li>
            <li class="l-sideListItem">
                <NuxtLink to="/admin/account" class="l-sideListItemLink">
                    <img src="~/assets/image/common/account.png" class="l-sideListItemLink__img" alt="アカウント管理アイコン" />
                    <h2>アカウント追加</h2>
                </NuxtLink>
            </li>
        </ul>

    </nav>
</template>
<style scoped lang="scss">
.l-side {
    position: sticky;
    left: 0;
    width: 200px;
    min-width: 170px;
    min-height: 100vh;
    padding: 2rem 0rem;
    background: $colorMain;
    box-sizing: border-box;
    z-index: 50;

    @media (max-width: ($ipro)) {
        display: none;
    }

    &List {
        &Item {
            margin-bottom: .5rem;

            &Link {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1.7rem 2rem;
                font-size: 1.4rem;
                font-weight: bold;
                color: $colorTxt;
                transition: .3s;

                &:hover {
                    background: #fff;
                }

                &.router-link-active {
                    background: #fff;
                }

                &__img {
                    width: 15px;
                }
            }

            &Border {
                position: relative;
                margin-bottom: 1rem;
                padding-bottom: 1rem;

                &::after {
                    position: absolute;
                    content: "";
                    bottom: 0;
                    left: 50%;
                    width: calc(100% - 2rem);
                    height: 1px;
                    background-color: #fff;
                    transform: translateX(-50%);
                }
            }
        }
    }
}
</style>