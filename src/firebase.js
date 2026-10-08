import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCuV0v9iA0Bq9qBrWf1o5htcT6AhBcn5Bk",
  authDomain: "azkary-af90d.firebaseapp.com",
  projectId: "azkary-af90d",
  storageBucket: "azkary-af90d.firebasestorage.app",
  messagingSenderId: "354511541190",
  appId: "1:354511541190:web:d991b5ed72204854dfd8c7",
  measurementId: "G-ES18X7F15R"
};

// تهيئة فايربيز
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider, signInWithPopup, signOut, doc, setDoc, serverTimestamp, analytics };
