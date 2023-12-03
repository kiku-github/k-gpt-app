import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
export const useImage = () => {
    const loading = {
        up: ref(false),
        img: ref(false),
        txt: ref(false)
    }
    const uploadImageToFirebase = async (file: File) => {
        const storage = getStorage();
        const storageReference = storageRef(storage, 'images/' + file.name);
        const uploadTask = uploadBytes(storageReference, file);
        loading.up.value = true;
        try {
            await uploadTask;
            const downloadURL = await getDownloadURL(storageReference);
            loading.up.value = false;
            return downloadURL;
        } catch (error) {
            loading.up.value = false;
            throw error;
        }
    };

    return { loading , uploadImageToFirebase };
}