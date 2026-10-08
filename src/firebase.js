import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp, collection, getDocs, query, orderBy } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD80n8ZvwJnVW2xLM8eXel9O9QgMCUE8Lw",
  authDomain: "infection-eae90.firebaseapp.com",
  projectId: "infection-eae90",
  storageBucket: "infection-eae90.firebasestorage.app",
  messagingSenderId: "1084633853555",
  appId: "1:1084633853555:web:0f421fdb474c5b84164406"
};

// تهيئة فايربيز
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider, signInWithPopup, signOut, doc, setDoc, serverTimestamp, collection, getDocs, query, orderBy, analytics };
