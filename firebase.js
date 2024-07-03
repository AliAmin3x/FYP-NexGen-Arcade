import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyDBE910dAH-5mTnWq6thrYd4EEoDWAku_s",
    authDomain: "nex-gen-bce19.firebaseapp.com",
    projectId: "nex-gen-bce19",
    storageBucket: "nex-gen-bce19.appspot.com",
    messagingSenderId: "115582793267",
    appId: "1:115582793267:web:859a537bafb00497661546"
};

export const getCurrentUserEmail = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    return user ? user.email : null;
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const firestore = getFirestore(app); // Initialize Firestore instance


export {auth, db, firestore, app};