import { Blog } from '@/types/blog';

export const usePagenate = () => {
    const sortedBlogs = ref<Blog[]>([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(6);
    const totalPages = computed(() => Math.ceil(sortedBlogs.value.length / itemsPerPage.value));

    const limitedPageNumbers = computed(() => {
        const totalPageCount = totalPages.value;
        const currentPageNum = currentPage.value;
        const limit = 3;
        if (totalPageCount <= limit) {
            return Array.from({ length: totalPageCount }, (_, i) => i + 1);
        }
        const halfLimit = Math.floor(limit / 2);
        if (currentPageNum <= halfLimit) {
            return Array.from({ length: limit }, (_, i) => i + 1);
        }
        if (currentPageNum >= totalPageCount - halfLimit) {
            return Array.from({ length: limit }, (_, i) => totalPageCount - limit + i + 1);
        }
        const pagesToShow = [currentPageNum];
        for (let i = 1; i <= halfLimit; i++) {
            if (pagesToShow.length < limit) {
                pagesToShow.unshift(currentPageNum - i);
                pagesToShow.push(currentPageNum + i);
            } else {
                break;
            }
        }
        return pagesToShow;
    });

    const displayedBlogs = computed(() => {
        const startIndex = (currentPage.value - 1) * itemsPerPage.value;
        const endIndex = startIndex + itemsPerPage.value;
        return sortedBlogs.value.slice(startIndex, endIndex);
    });

    const displayedPublishedBlogs = computed(() => {
        const startIndex = (currentPage.value - 1) * itemsPerPage.value;
        const endIndex = startIndex + itemsPerPage.value;
        const visibleBlogs = sortedBlogs.value.filter(blog => blog.published);
        return visibleBlogs.slice(startIndex, endIndex);
    });

    const route = useRoute();
    const router = useRouter();

    const changePage = (page: number) => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page;
            router.push({ path: route.path, query: { page: page } });
        }
    };

    return { limitedPageNumbers , currentPage , sortedBlogs , itemsPerPage , totalPages , displayedBlogs , displayedPublishedBlogs , changePage };
}