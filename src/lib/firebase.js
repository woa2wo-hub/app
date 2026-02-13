import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDNOwfbKzPoVKEy85HZmMAmCFrsclZbD9g",
  authDomain: "oneday-app-d00c0.firebaseapp.com",
  projectId: "oneday-app-d00c0",
  storageBucket: "oneday-app-d00c0.firebasestorage.app",
  messagingSenderId: "888900561636",
  appId: "1:888900561636:web:ed4d8ee0ea132d47509af1",
  measurementId: "G-5NQZGTXBP4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
