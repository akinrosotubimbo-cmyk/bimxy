import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA8XlPkwVCLiaQ22zeiyntDeku831ZJyGg",
  authDomain: "bimxy-dd5a7.firebaseapp.com",
  projectId: "bimxy-dd5a7",
  storageBucket: "bimxy-dd5a7.firebasestorage.app",
  messagingSenderId: "830300254798",
  appId: "1:830300254798:web:d0687a15f6db015908491f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;