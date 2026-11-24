import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD1ludJS3RejcUv59PuW1Si4yZ3xpSxZGM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "drishti-7172.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "drishti-7172",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "drishti-7172.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "392067731481",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:392067731481:web:bc8a403aa92cf104ef9a88",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-E1HQK79HR0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Request standard profile & email scopes
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
