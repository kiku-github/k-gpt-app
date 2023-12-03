import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut as firebaseSignOut, } from 'firebase/auth'

export const useAuth = () => {
    const token = useState<string | null>('token', () => null);
    const formData = {
        email: ref(''),
        password: ref(''),
        errorMessage: ref(''),
        successMessage: ref('')
    };

    async function signIn(email: string, password: string) {
        return await new Promise<void>((resolve, reject) => {
            const auth = getAuth()
            return signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    userCredential.user
                        .getIdToken()
                        .then((idToken) => {
                            token.value = idToken
                            resolve()
                        })
                        .catch(reject)
                })
                .catch(reject)
        })
    }
    async function checkAuthState() {
        return await new Promise<void>((resolve, reject) => {
            if (process.server) return resolve()
            const auth = getAuth()
            onAuthStateChanged(
                auth,
                (user) => {
                    if (user) {
                        user
                            .getIdToken()
                            .then((idtoken) => {
                                token.value = idtoken
                                resolve()
                            })
                            .catch(reject)
                    } else {
                        token.value = null
                        resolve()
                    }
                },
                (error) => {
                    reject(error)
                }
            )
        })
    }
    async function signOut() {
        return await new Promise<void>((resolve, reject) => {
            const auth = getAuth()
            firebaseSignOut(auth)
                .then(() => {
                    token.value = null
                    resolve()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    return { signIn, signOut, token, checkAuthState, formData }
}