<script setup lang="ts">
const { user, userEmail, handleSignOut, isHeaderUserActive, toggleHeaderUser, handleDocumentClick } = useHeader();

onMounted(() => {
    document.addEventListener('click', handleDocumentClick);
});
</script>

<template>
    <header class="l-header">
        <div class="l-header__left">
            <h1 class="l-headerLogo">
                <NuxtLink to="/" class="l-headerLogo__link">GPT-APP</NuxtLink>
            </h1>
        </div>
        <div class="l-header__right" v-if="user !== null">
            <h2 class="l-headerUser" :class="{ 'active': isHeaderUserActive }" @click="toggleHeaderUser">
                <img src="~/assets/image/common/icon.png" class="l-headerUser__img" />
                <div class="l-headerUserTxt">
                    <p class="l-headerUserTxt__mail">{{ userEmail }}</p>
                    <NuxtLink to="/admin" class="l-headerUserTxt__link">マイページ</NuxtLink>
                    <button class="l-headerUserTxt__logout" @click="handleSignOut">ログアウト</button>
                </div>
            </h2>
        </div>
        <div class="l-header__right" v-else>
            <NuxtLink to="/admin/login" class="l-headerLogin">ログイン</NuxtLink>
        </div>
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
    max-height: 65px;
    min-height: 65px;
    padding: 2rem 3rem;
    background: $colorSub;
    border-radius: 0 0 20px 20px;
    box-sizing: border-box;
    z-index: 999;

    @media (max-width: ($sp)) {
        padding: 1.5rem 1rem;
    }

    &Logo {
        position: absolute;
        top: 50%;
        right: 50%;
        transform: translate(50%, -50%);

        &__link {
            font-size: 3rem;
            font-family: $fontMon;
            color: #fff;
            letter-spacing: .1em;
            transition: .3s;

            @media (max-width: ($sp)) {
                font-size: 2.6rem;
            }

            &:hover {
                opacity: .7;

                @media (max-width: ($ipro)) {
                    opacity: 1;
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
            bottom: -80px;
            right: 20px;
            padding: 1rem 2rem;
            background: #fff;
            border: 1px solid $colorSub;
            border-radius: 5px;
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
        height: 65px;

        @media (max-width: ($ipro)) {
            height: 65px;
        }
    }

    &Login {
        padding: .5rem 1rem;
        border: 1px solid #fff;
        border-radius: 20px;
        font-size: 1.4rem;
        color: #fff;
        transition: .3s;

        &:hover {
            background: #fff;
            color: $colorSub;

            @media (max-width: ($ipro)) {
                background: transparent;
                color: #fff;
            }
        }
    }
}</style>