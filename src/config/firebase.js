// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

let auth = null;
let googleProvider = null;

if (firebaseConfig.apiKey) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } catch (err) {
    console.warn('[firebase] init failed:', err.message);
  }
} else {
  console.warn('[firebase] VITE_FIREBASE_API_KEY not set; Firebase auth disabled.');
}

export { auth, googleProvider };
