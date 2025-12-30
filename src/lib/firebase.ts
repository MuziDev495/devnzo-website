import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0MFUHPEzZhwMwqr6zns8a6SwNbFdDokc",
  authDomain: "devnzo.firebaseapp.com",
  projectId: "devnzo",
  storageBucket: "devnzo.firebasestorage.app",
  messagingSenderId: "527854308116",
  appId: "1:527854308116:web:9a4928288527b5d2671001",
  measurementId: "G-VWWD7KG1S4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
