import { getAuth } from 'firebase/auth';

export const useHeader = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const userEmail = ref('');
    onMounted(() => {
        if (user !== null) {
            userEmail.value = user.email || '';
        }
    });
    const { signOut } = useAuth();
    const handleSignOut = async () => {
        await signOut();
        location.reload();
    };

    const isHeaderUserActive = ref(false);

    const toggleHeaderUser = () => {
    isHeaderUserActive.value = !isHeaderUserActive.value;
    };

    const handleDocumentClick = (event : any) => {
        const headerUserElement = document.querySelector('.l-headerUser');
        if (headerUserElement && !headerUserElement.contains(event.target)) {
            isHeaderUserActive.value = false;
        }
    };

    return { user, userEmail, handleSignOut , isHeaderUserActive , toggleHeaderUser , handleDocumentClick };
}