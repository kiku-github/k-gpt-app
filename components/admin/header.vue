<script setup lang="ts">
const { userEmail, handleSignOut, isHeaderUserActive, toggleHeaderUser, handleDocumentClick } = useHeader();

onMounted(() => {
    document.addEventListener('click', handleDocumentClick);
});
const isMenuOpen = ref(false);
const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
    <header class="l-header">
        <div class="l-header__left">
            <div class="l-headerHam" @click="toggleMenu" :class="{ active: isMenuOpen }">
                <span class="l-headerHam__line"></span>
                <span class="l-headerHam__line"></span>
                <span class="l-headerHam__line"></span>
            </div>
            <h1 class="l-headerLogo">
                <NuxtLink to="/" class="l-headerLogo__link">GPT-APP</NuxtLink>
            </h1>

        </div>
        <div class="l-header__right">
            <h2 class="l-headerUser" :class="{ 'active': isHeaderUserActive }" @click="toggleHeaderUser">
                <img src="~/assets/image/common/icon.png" class="l-headerUser__img" />
                <div class="l-headerUserTxt">
                    <p class="l-headerUserTxt__mail">{{ userEmail }}</p>
                    <NuxtLink to="/" class="l-headerUserTxt__link">トップページ</NuxtLink>
                    <button class="l-headerUserTxt__logout" @click="handleSignOut">ログアウト</button>
                </div>
            </h2>
        </div>
        <nav class="l-headerHamContent" :class="{ active: isMenuOpen }">
            <ul class="l-headerHamContentList">
                <li class="l-headerHamContentListItem">
                    <NuxtLink to="/admin" class="l-headerHamContentListItemLink">
                        <img src="~/assets/image/common/article.png" class="l-headerHamContentListItemLink__img"
                            alt="ブログ一覧アイコン" />
                        <h2>ブログ一覧</h2>
                    </NuxtLink>
                </li>
                <li class="l-headerHamContentListItem">
                    <NuxtLink to="/admin/edit" class="l-headerHamContentListItemLink">
                        <img src="~/assets/image/common/blog.png" class="l-headerHamContentListItemLink__img"
                            alt="ブログ作成アイコン" />
                        <h2>ブログ作成</h2>
                    </NuxtLink>
                </li>
                <li class="l-headerHamContentListItem">
                    <NuxtLink to="/admin/category" class="l-headerHamContentListItemLink">
                        <img src="~/assets/image/common/category.png" class="l-headerHamContentListItemLink__img"
                            alt="カテゴリーアイコン" />
                        <h2>カテゴリー</h2>
                    </NuxtLink>
                </li>
                <li class="l-headerHamContentListItem">
                    <NuxtLink to="/admin/account" class="l-headerHamContentListItemLink">
                        <img src="~/assets/image/common/account.png" class="l-headerHamContentListItemLink__img"
                            alt="アカウント追加アイコン" />
                        <h2>アカウント追加</h2>
                    </NuxtLink>
                </li>
            </ul>

        </nav>
    </header>
    <div class="l-headerMg"></div>
</template>
<style scoped lang="scss">
.l-header {
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 1rem 3rem;
    background: $colorSub;
    box-sizing: border-box;
    z-index: 999;

    &__left {
        @media (max-width: ($ipro)) {
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }
    }

    &Logo {
        &__link {
            position: absolute;
            top: 50%;
            left: 50%;
            font-size: 2.6rem;
            font-family: $fontMon;
            color: #fff;
            letter-spacing: .1em;
            transform: translate(-50%, -50%);
            transition: .3s;

            @media (max-width: ($sp)) {
                font-size: 2.2rem;
            }

            &:hover {
                opacity: .7;

                @media (max-width: ($ipro)) {
                    opacity: 1;
                }
            }
        }
    }

    &Ham {
        display: none;

        @media (max-width: ($ipro)) {
            display: block;
            position: relative;
            width: 35px;
            height: 35px;
            background-color: #fff;
            cursor: pointer;
        }

        &__line {
            display: block;
            position: absolute;
            top: 50%;
            right: 50%;
            width: 20px;
            height: 1px;
            background: $colorSub;
            border-radius: 2px;
            transform: translate(50%, -50%);
            transition: .3s;

            &:first-of-type {
                top: 30%;
            }

            &:last-of-type {
                top: 70%;
            }
        }

        &.active {
            & .l-headerHam__line {
                &:first-of-type {
                    top: 50%;
                    transform: translate(50%, 50%) rotate(45deg);
                }

                &:nth-of-type(2) {
                    opacity: 0;
                }

                &:last-of-type {
                    top: 50%;
                    transform: translate(50%, 50%) rotate(-45deg);
                }
            }
        }

        &Content {
            display: none;
            position: absolute;
            top: 55px;
            left: -200px;
            width: 200px;
            min-width: 170px;
            min-height: 100vh;
            padding: 2rem 0rem;
            background: $colorMain;
            box-sizing: border-box;
            transition: .3s;
            z-index: 50;

            @media (max-width: ($ipro)) {
                display: block;
            }

            @media (max-width: ($sp)) {
                top: 54px;
            }

            &.active {
                left: 0;
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
    }

    &User {
        padding: relative;
        padding-left: 3rem;
        color: #fff;

        &:hover {
            & .l-headerUserTxt {
                opacity: 1;
                visibility: visible;

                @media (max-width: ($ipro)) {
                    opacity: 0;
                    visibility: hidden;
                }
            }
        }

        &.active {
            & .l-headerUserTxt {
                opacity: 1;
                visibility: visible;
            }
        }

        &Txt {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            position: absolute;
            bottom: -85px;
            right: 20px;
            padding: 1rem 2rem;
            background: #fff;
            border: 1px solid $colorSub;
            border-radius: 2px;
            font-size: 1.2rem;
            color: #292929;
            opacity: 0;
            visibility: hidden;
            transition: .3s;

            &__link {
                font-size: 1.2rem;
                color: #292929;
                text-decoration: underline;
                transition: .3s;

                &:hover {
                    opacity: .5;

                    @media (max-width: ($ipro)) {
                        opacity: 1;
                    }
                }
            }

            &__logout {
                display: inline-block;
                width: 60px;
                font-size: 1.2rem;
                font-weight: 600;
                color: #292929;
                text-align: left;
                text-decoration: underline;
                cursor: pointer;
                transition: .3s;

                &:hover {
                    opacity: .5;

                    @media (max-width: ($ipro)) {
                        opacity: 1;
                    }
                }
            }
        }

        &__img {
            width: 30px;
            height: 30px;
            cursor: pointer;
        }
    }

    &Mg {
        height: 50px;
    }
}
</style>