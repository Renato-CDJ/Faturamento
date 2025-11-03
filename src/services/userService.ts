import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const registerUser = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        throw new Error(error.message);
    }
};