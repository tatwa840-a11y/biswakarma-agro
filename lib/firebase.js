import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // 👈 ଏଇ Line ଜରୁରୀ

const firebaseConfig = {
  apiKey: "AIzaSyDho64A2emDjFU1uShy-MCvrC8DGhSWzIA",
  authDomain: "biswakarma-agro-46804.firebaseapp.com",
  projectId: "biswakarma-agro-46804",
  storageBucket: "biswakarma-agro-46804.firebasestorage.app",
  messagingSenderId: "1073520817769",
  appId: "1:1073520817769:web:3d62fd005d34dee63214f8",
  measurementId: "G-3HVYESYXXC"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // 👈 ଏଇ Line Add କର