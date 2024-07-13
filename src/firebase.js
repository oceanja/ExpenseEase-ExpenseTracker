import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4oFoRNK9jVFR8Tvwh8zRA8Xe4pHB0vqc",
  authDomain: "expenseease-45aad.firebaseapp.com",
  projectId: "expenseease-45aad",
  storageBucket: "expenseease-45aad.appspot.com",
  messagingSenderId: "591891132568",
  appId: "1:591891132568:web:ad9e523dbad3d373a6e0ed",
  measurementId: "G-GV8KZQ98HZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, doc, setDoc };
